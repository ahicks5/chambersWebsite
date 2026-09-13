#!/usr/bin/env node
/**
 * Key the flat studio backdrop out of a headshot, for the hero (audit §5.2).
 *
 *   node scripts/cutout-backdrop.mjs <in.jpg> <out.png>
 *
 * The hero photo is John's studio headshot: a subject on a uniform blue-grey
 * backdrop. With the backdrop removed he sits on the page colour itself,
 * which is what ADR 0010 is about, instead of in a grey rectangle on it.
 *
 * Method — no ML, no service, one pass over the pixels:
 *   1. A pixel is "backdrop" if it is that blue-grey (b ≥ r, g ≥ r, within a
 *      band) and in the backdrop's luminance range. The navy blazer is far
 *      darker and the shirt far lighter, so neither qualifies.
 *   2. Flood-fill from the top edge and the upper side edges through backdrop
 *      pixels only, so a backdrop-coloured pixel inside the subject (a shirt
 *      shadow) is never keyed — it is not connected to the edge.
 *   3. Erode the subject by two pixels to drop the grey fringe, then feather
 *      the edge with a small blur.
 *   4. Write the 4:5 crop as PNG with alpha. Encode to webp with alpha for
 *      src/assets/ (sharp: quality 90, alphaQuality 95).
 *
 * Re-run if John supplies a new headshot on a plain backdrop; adjust the
 * thresholds in `isBackdrop` from a few sampled pixels if the colour differs.
 */
const SRC = process.argv[2], OUT = process.argv[3];
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const isBackdrop = (i) => {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return b >= r - 4 && b - r <= 45 && g >= r - 4 && g - r <= 30 && lum >= 112 && lum <= 205;
};
const mask = new Uint8Array(W * H); // 1 = backdrop
const stack = [];
for (let x = 0; x < W; x++) { for (const y of [0, 1, 2]) { const i = y * W + x; if (isBackdrop(i)) { mask[i] = 1; stack.push(i); } } }
for (let y = 0; y < H * 0.75; y++) { for (const x of [0, W - 1]) { const i = y * W + x; if (isBackdrop(i)) { mask[i] = 1; stack.push(i); } } }
while (stack.length) {
  const i = stack.pop(); const x = i % W, y = (i - x) / W;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const j = ny * W + nx; if (mask[j] || !isBackdrop(j)) continue; mask[j] = 1; stack.push(j);
  }
}
// Erode the subject by 2px (dilate backdrop) to drop the grey fringe.
let cur = mask;
for (let pass = 0; pass < 2; pass++) {
  const next = new Uint8Array(cur);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x; if (cur[i]) continue;
    if (cur[i - 1] || cur[i + 1] || cur[i - W] || cur[i + W]) next[i] = 1;
  }
  cur = next;
}
const alpha = Buffer.alloc(W * H); for (let i = 0; i < W * H; i++) alpha[i] = cur[i] ? 0 : 255;
const feathered = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(1.4).raw().toBuffer();
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) { rgba[i * 4] = data[i * 3]; rgba[i * 4 + 1] = data[i * 3 + 1]; rgba[i * 4 + 2] = data[i * 3 + 2]; rgba[i * 4 + 3] = feathered[i * 3]; }
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .resize({ width: 1600, height: 2000, fit: 'cover', position: 'top' })
  .png({ compressionLevel: 9, palette: false }).toFile(OUT);
const covered = cur.reduce((a, v) => a + v, 0);
console.log('backdrop pixels', covered, 'of', W * H, `(${(100 * covered / (W * H)).toFixed(1)}%)`);
