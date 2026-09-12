#!/usr/bin/env node
/**
 * Content lint — makes the CLAUDE.md hard rules mechanical.
 * docs/02-project-structure.md §8. Runs against src/ and the built dist/.
 *
 *   1. Exactly one <h1> per built page
 *   2. Unique meta description per page, 50–160 chars (audit §2.8 bug 3)
 *   3. No CTA strings or calendly.com outside src/config/cta.ts (audit §4.3)
 *   4. No raw hex outside src/styles/tokens.css (audit §8.2)
 *   5. Banned words from docs/brand/voice.md in our copy — WARN only
 *   6. Every <img> has real alt text, not a filename (audit §7.6)
 *   7. FAQPage JSON-LD answers match the rendered answers exactly (audit §7.5)
 *
 * No dependencies. Regex over HTML is fine here because we control the markup.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const errors = [];
const warnings = [];
const fail = (rule, file, msg) => errors.push(`[${rule}] ${file}: ${msg}`);
const warn = (rule, file, msg) => warnings.push(`[${rule}] ${file}: ${msg}`);

function walk(dir, exts) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === '.astro') continue;
      out.push(...walk(p, exts));
    } else if (exts.includes(extname(name))) out.push(p);
  }
  return out;
}

const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

// ---------- built pages: rules 1, 2, 6, 7 ----------
if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(2);
}

const descriptions = new Map();
for (const file of walk(DIST, ['.html'])) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, 'utf8');

  // 1. one h1
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail('h1', rel, `expected exactly one <h1>, found ${h1s}`);

  // 2. description present, bounded, unique.
  //    Measured decoded: "&amp;" is one character to a search engine and five
  //    in the attribute, and the schema bound is on the real string.
  const decodeEntities = (v) =>
    v
      .replace(/&amp;/g, '&')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ');
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) fail('description', rel, 'missing <meta name="description">');
  else {
    const plainDesc = decodeEntities(desc);
    if (plainDesc.length < 50 || plainDesc.length > 160)
      fail('description', rel, `description is ${plainDesc.length} chars; needs 50–160`);
    const dup = descriptions.get(desc);
    if (dup) fail('description', rel, `description duplicates ${dup} — audit §2.8 bug 3`);
    descriptions.set(desc, rel);
  }

  // 6. alt text that is not a filename
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    const alt = img.match(/\balt="([^"]*)"/)?.[1];
    if (alt === undefined || alt.trim() === '') fail('alt', rel, `<img> without alt: ${img.slice(0, 80)}`);
    else if (/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(alt) || /^[\w-]+_\d+/.test(alt)) fail('alt', rel, `alt looks like a filename: "${alt}"`);
  }

  // 7. FAQPage JSON-LD text === rendered answer text.
  //    A page that renders an FAQ but emits no FAQPage schema fails: the
  //    comparison below would otherwise pass by having nothing to compare.
  // <summary> must be the first element child of <details>, or the browser
  // ignores it and renders its own "Details" label. Valid HTML either way, so
  // nothing else catches this.
  for (const m of html.matchAll(/<details\b[^>]*>\s*<([a-z0-9]+)/gi)) {
    const firstTag = m[1].toLowerCase();
    if (firstTag !== 'summary') {
      fail('faq-markup', rel, `<details> opens with <${firstTag}>; <summary> must be its first child or the question will not render`);
    }
  }

  const renderedFaqCount = (html.match(/<details[\s>]/g) ?? []).length;
  const hasFaqSchema = /"@type"\s*:\s*"FAQPage"/.test(html);
  if (renderedFaqCount > 0 && !hasFaqSchema) {
    fail('faq-schema', rel, `renders ${renderedFaqCount} <details> FAQ item(s) but emits no FAQPage JSON-LD — audit §7.5`);
  }

  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(block[1]); } catch { fail('faq-schema', rel, 'JSON-LD does not parse'); continue; }
    if (data['@type'] !== 'FAQPage') continue;
    for (const q of data.mainEntity ?? []) {
      const question = q.name;
      const schemaAnswer = text(q.acceptedAnswer?.text ?? '');
      // Find the <details> whose <summary> carries this question.
      const details = [...html.matchAll(/<details[\s\S]*?<\/details>/g)].map((m) => m[0]);
      const match = details.find((d) => text(d.match(/<summary[\s\S]*?<\/summary>/)?.[0] ?? '') === text(question));
      if (!match) { fail('faq-schema', rel, `no rendered <details> for question "${question}"`); continue; }
      const rendered = text(match.replace(/<summary[\s\S]*?<\/summary>/, ''));
      if (rendered !== schemaAnswer) fail('faq-schema', rel, `answer text differs between JSON-LD and page for "${question}"`);
    }
  }
}

// ---------- source: rules 3, 4 ----------
const CTA_FILE = join('src', 'config', 'cta.ts');
const TOKENS = join('src', 'styles', 'tokens.css');
for (const file of walk(join(ROOT, 'src'), ['.astro', '.ts', '.tsx', '.css', '.md'])) {
  const rel = relative(ROOT, file);
  const src = readFileSync(file, 'utf8');

  // 3. CTA strings live in cta.ts only. Components/TS only — prose may
  //    legitimately mention "the free intro call".
  if (rel !== CTA_FILE && /\.(astro|ts|tsx)$/.test(rel)) {
    for (const needle of ['calendly.com', '"Book a', '"Schedule', "'Book a", "'Schedule"]) {
      if (src.includes(needle)) fail('cta', rel, `contains ${needle} — CTAs come from src/config/cta.ts`);
    }
  }

  // 4. Colour lives in tokens.css only.
  if (rel !== TOKENS) {
    const hex = src.match(/#[0-9a-fA-F]{3,8}\b/g)?.filter((h) => [4, 5, 7, 9].includes(h.length));
    if (hex?.length) fail('hex', rel, `raw colour ${hex[0]} — colours come from src/styles/tokens.css`);
  }
}

// ---------- copy: rule 5 (warn) ----------
// The cut list governs copy we write for the site. Two collections are exempt:
// testimonials are clients' words, and blog posts are John's already-published
// writing — audit §3.3 holds the blog voice up as the model the homepage should
// imitate, so flagging it would be backwards.
const VOICE_EXEMPT = [join('content', 'testimonials'), join('content', 'posts')];
const voice = readFileSync(join(ROOT, 'docs', 'brand', 'voice.md'), 'utf8');
const cutList = (voice.split(/^## Cut list/m)[1]?.split(/^## /m)[0] ?? '')
  .split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim().toLowerCase());
for (const file of walk(join(ROOT, 'src', 'content'), ['.md'])) {
  const rel = relative(ROOT, file);
  if (VOICE_EXEMPT.some((dir) => rel.includes(dir))) continue;
  const body = readFileSync(file, 'utf8').toLowerCase();
  for (const word of cutList) {
    if (word && body.includes(word)) warn('voice', rel, `uses "${word}" — see docs/brand/voice.md cut list`);
  }
}

// ---------- report ----------
for (const w of warnings) console.warn('warn ', w);
for (const e of errors) console.error('FAIL ', e);
console.log(`\nlint:content — ${errors.length} error(s), ${warnings.length} warning(s) across ${descriptions.size} page(s)`);
process.exit(errors.length ? 1 : 0);
