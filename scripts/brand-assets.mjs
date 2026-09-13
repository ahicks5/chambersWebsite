#!/usr/bin/env node
/**
 * Brand assets: favicon, app icons and the social preview image.
 *
 *   npm run build && node scripts/brand-assets.mjs
 *
 * Renders them from HTML in headless Chromium, so they use the site's own
 * face (Bitter, from public/fonts), colours (read from tokens.css) and the
 * hero's own pieces (the keyed-out portrait, the landscape). Nothing is drawn
 * twice. Output goes to public/, and the files are committed — this runs on
 * demand, not on every build.
 *
 *   public/favicon.ico            16, 32 and 48px, PNG-in-ICO — browser tabs
 *   public/apple-touch-icon.png   180px — iOS "Add to Home Screen"
 *   public/icons/icon-192.png     Android home screen, via site.webmanifest
 *   public/icons/icon-512.png     same, larger; also the maskable icon
 *   public/og/default.jpg         1200×630 — iMessage, Slack, LinkedIn, X
 *
 * The icon is "JC" with the site's one warm mark after it (ADR 0011). The
 * preview image is the hero: headline, positioning line, portrait, landscape.
 */
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const PORT = 4390;
const tokens = readFileSync('src/styles/tokens.css', 'utf8');
const colour = (name) => tokens.match(new RegExp(`--palette-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
const green = colour('green');
const yellow = colour('yellow');
const white = colour('white');
if (!green || !yellow || !white) throw new Error('could not read the palette from tokens.css');

const home = readFileSync('src/content/pages/home.md', 'utf8');
const h1 = home.match(/^h1:\s*(.+)$/m)?.[1] ?? '';
const subhead = home.match(/^subhead:\s*(.+)$/m)?.[1] ?? '';
const siteName = readFileSync('src/config/site.ts', 'utf8').match(/name:\s*'([^']+)'/)?.[1] ?? '';
const [, hook, mark = ''] = h1.match(/^(.*?)([.!?]?)$/) ?? [h1, h1, ''];

const portrait =
  'data:image/webp;base64,' + readFileSync('src/assets/john-chambers-cutout.webp').toString('base64');

const fonts = `
  @font-face { font-family: Bitter; font-weight: 900; src: url(/fonts/bitter-black-latin.woff2) format('woff2'); }
  @font-face { font-family: Bitter; font-weight: 400; src: url(/fonts/bitter-regular-latin.woff2) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body { font-family: Bitter, Georgia, serif; background: ${green}; color: ${white}; }
`;

// The mark: JC and the dot, centred in the safe zone (the middle 80%) so it
// survives every platform's mask.
const iconHtml = (size, radius) => `<!doctype html><style>${fonts}
  .icon { width: ${size}px; height: ${size}px; border-radius: ${radius}px; background: ${green};
          display: grid; place-items: center; font-weight: 900; font-size: ${size * 0.5}px;
          letter-spacing: -0.04em; line-height: 1; padding-bottom: ${size * 0.04}px; }
  .dot { color: ${yellow}; }
</style><div class="icon"><span>JC<span class="dot">.</span></span></div>`;

const ogHtml = `<!doctype html><style>${fonts}
  .card { position: relative; width: 1200px; height: 630px; overflow: hidden; background: ${green}; isolation: isolate; }
  .card::before { content: ''; position: absolute; inset: 0; z-index: -1;
    background: url(/images/hero-bg-1800.webp) center 40% / cover no-repeat;
    mix-blend-mode: luminosity; opacity: 0.26;
    mask-image: linear-gradient(to bottom, black 45%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 45%, transparent 100%); }
  .text { position: absolute; left: 72px; top: 64px; width: 660px; }
  .brand { font-weight: 900; font-size: 22px; letter-spacing: -0.01em; }
  h1 { margin-top: 44px; font-weight: 900; font-size: 66px; line-height: 1.05; letter-spacing: -0.015em; max-width: 14ch; }
  .dot { color: ${yellow}; }
  p { margin-top: 26px; font-size: 26px; line-height: 1.45; max-width: 30ch; opacity: 0.9; }
  .portrait { position: absolute; right: 40px; bottom: -40px; height: 640px; width: auto;
    mask-image: linear-gradient(to top, transparent, black 20%);
    -webkit-mask-image: linear-gradient(to top, transparent, black 20%); }
</style>
<div class="card">
  <div class="text">
    <div class="brand">${siteName}</div>
    <h1>${hook}<span class="dot">${mark}</span></h1>
    <p>${subhead}</p>
  </div>
  <img class="portrait" src="${portrait}" alt="">
</div>`;

/** ICO container with PNG entries — every modern browser reads these. */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length;
  const dirs = [];
  for (const { size, png } of entries) {
    const d = Buffer.alloc(16);
    d.writeUInt8(size >= 256 ? 0 : size, 0);
    d.writeUInt8(size >= 256 ? 0 : size, 1);
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(png.length, 8);
    d.writeUInt32LE(offset, 12);
    dirs.push(d);
    offset += png.length;
  }
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.png)]);
}

const server = spawn('node', ['scripts/serve-dist.mjs'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${PORT}/`);

  const shot = async (html, width, height) => {
    await page.setViewportSize({ width, height });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    return page.screenshot({ clip: { x: 0, y: 0, width, height }, omitBackground: true });
  };

  mkdirSync('public/icons', { recursive: true });
  mkdirSync('public/og', { recursive: true });

  // Square, full-bleed: Apple and Android apply their own masks.
  const square = await shot(iconHtml(512, 0), 512, 512);
  writeFileSync('public/icons/icon-512.png', await sharp(square).png().toBuffer());
  writeFileSync('public/icons/icon-192.png', await sharp(square).resize(192).png().toBuffer());
  writeFileSync('public/apple-touch-icon.png', await sharp(square).resize(180).png().toBuffer());

  // Rounded for the tab, where nothing masks it.
  const rounded = await shot(iconHtml(256, 52), 256, 256);
  const entries = [];
  for (const size of [16, 32, 48]) {
    entries.push({ size, png: await sharp(rounded).resize(size).png().toBuffer() });
  }
  writeFileSync('public/favicon.ico', ico(entries));

  const og = await shot(ogHtml, 1200, 630);
  writeFileSync('public/og/default.jpg', await sharp(og).flatten({ background: green }).jpeg({ quality: 86, mozjpeg: true }).toBuffer());

  for (const f of ['public/favicon.ico', 'public/apple-touch-icon.png', 'public/icons/icon-192.png', 'public/icons/icon-512.png', 'public/og/default.jpg']) {
    console.log(f, readFileSync(f).length, 'bytes');
  }
} finally {
  await browser.close();
  server.kill();
}
