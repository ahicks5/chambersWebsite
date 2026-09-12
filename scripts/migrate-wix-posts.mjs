#!/usr/bin/env node
/**
 * Migrate John's blog off Wix — ADR 0007.
 *
 * There are 65 posts, not the three the audit saw, so this is scripted. It
 * preserves structure rather than flattening: subheadings, lists, emphasis,
 * blockquotes and links all survive, because the blog is the largest SEO asset
 * on the site and plain paragraphs would strip it.
 *
 *   node scripts/migrate-wix-posts.mjs            # all posts
 *   node scripts/migrate-wix-posts.mjs --limit 3  # sample first
 *   node scripts/migrate-wix-posts.mjs --slug the-practice-that-saved-my-life
 *
 * Sources, all primary:
 *   - /blog-posts-sitemap.xml  → the full list of slugs
 *   - each post's BlogPosting JSON-LD → headline, dates, description, image
 *   - section[data-hook="post-description"] → the body
 *
 * Category is GUESSED from keywords and every post is written with
 * `draft: true`. Assigning 65 posts across five categories is a judgment call
 * on John's own writing, and a keyword match is not that judgment. Nothing
 * publishes until a human has read it.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://www.coachingwithjc.com';
const OUT = 'src/content/posts';
const CACHE = process.env.WIX_CACHE ?? '/tmp/wix-posts';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const limit = Number(flag('--limit') ?? 0);
const onlySlug = flag('--slug');

/** The five categories from src/content.config.ts. Keep in sync. */
const CATEGORIES = ['burnout', 'resilience', 'career', 'leadership', 'practices'];

/**
 * Keyword guess, deliberately crude. Its job is to give a human something to
 * correct, not to be right.
 */
const CATEGORY_HINTS = {
  burnout: ['burnout', 'burned out', 'exhaust', 'depleted', 'overwhelm', 'rest', 'stop working'],
  resilience: ['resilien', 'grief', 'failure', 'fear', 'cynicism', 'gratitude', 'hard season'],
  career: ['career', 'job', 'work', 'promotion', 'interview', 'resume', 'identity', 'pivot'],
  leadership: ['leader', 'team', 'manager', 'psychological safety', 'culture', 'busyness'],
  practices: ['practice', 'journal', 'habit', 'mindful', 'meditat', 'reflection', 'ritual'],
};

function guessCategory(title, body) {
  const hay = `${title}\n${body.slice(0, 1500)}`.toLowerCase();
  let best = 'practices';
  let bestScore = 0;
  for (const category of CATEGORIES) {
    const score = CATEGORY_HINTS[category].reduce(
      (total, hint) => total + (hay.split(hint).length - 1),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }
  return { category: best, confident: bestScore >= 2 };
}

const yaml = (value) => `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/** Clamp to the 50–160 the posts schema enforces, without cutting mid-word. */
function fitDescription(text, fallback) {
  let d = (text || fallback || '').replace(/\s+/g, ' ').trim();
  if (d.length > 160) {
    d = d.slice(0, 160);
    const cut = d.lastIndexOf(' ');
    if (cut > 60) d = d.slice(0, cut);
    d = `${d.replace(/[,.;:!?—–-]+$/, '')}…`;
  }
  if (d.length < 50) d = `${d} ${fallback ?? ''}`.trim().slice(0, 160);
  return d;
}

async function getSlugs() {
  const res = await fetch(`${SITE}/blog-posts-sitemap.xml`, { headers: { 'user-agent': UA } });
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]*\/post\/[^<]*)<\/loc>/g)].map((m) =>
    m[1].trim().replace(`${SITE}/post/`, '')
  );
}

async function getHtml(slug) {
  const cached = join(CACHE, `${slug}.html`);
  if (existsSync(cached)) return readFile(cached, 'utf8');
  const res = await fetch(`${SITE}/post/${slug}`, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  await writeFile(cached, html);
  return html;
}

/**
 * Walk the rendered body and emit Markdown. Runs inside the page, so it sees
 * the DOM the browser built rather than Wix's serialisation of it.
 */
const DOM_TO_MARKDOWN = () => {
  const root = document.querySelector('section[data-hook="post-description"]');
  if (!root) return null;

  const inline = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, ' ');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const inner = [...node.childNodes].map(inline).join('');
    if (!inner.trim()) return inner;
    switch (node.tagName) {
      case 'STRONG':
      case 'B':
        return `**${inner.trim()}**`;
      case 'EM':
      case 'I':
        return `_${inner.trim()}_`;
      case 'A': {
        const href = node.getAttribute('href');
        return href ? `[${inner.trim()}](${href})` : inner;
      }
      case 'BR':
        return '\n';
      case 'CODE':
        return `\`${inner.trim()}\``;
      default:
        return inner;
    }
  };

  const blocks = [];
  const walk = (el) => {
    for (const node of el.children) {
      const text = inline(node).trim();
      switch (node.tagName) {
        // Heading levels are recorded raw and normalised after the walk: Wix
        // posts often use <h4> for their only subheading, which would leave the
        // rendered page jumping h1 -> h4. See normaliseHeadings below.
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
          if (text) blocks.push(`\u0000${node.tagName[1]}\u0000${text}`);
          break;
        case 'P':
          if (!text) break;
          // John uses a line of asterisks as a visual divider before a closing
          // note. Left as-is it is broken Markdown and renders as literal "**",
          // so it becomes a real thematic break.
          if (/^[*_\-—–\s]+$/.test(text)) {
            blocks.push('---');
            break;
          }
          blocks.push(text);
          break;
        case 'BLOCKQUOTE':
          if (text) blocks.push(text.split('\n').map((l) => `> ${l}`).join('\n'));
          break;
        case 'UL':
        case 'OL': {
          const ordered = node.tagName === 'OL';
          const items = [...node.querySelectorAll(':scope > li')]
            .map((li, i) => {
              const t = inline(li).trim();
              return t ? `${ordered ? `${i + 1}.` : '-'} ${t}` : '';
            })
            .filter(Boolean);
          if (items.length) blocks.push(items.join('\n'));
          break;
        }
        case 'FIGURE':
        case 'IMG': {
          const img = node.tagName === 'IMG' ? node : node.querySelector('img');
          if (img?.src) blocks.push(`![${(img.alt || '').trim()}](${img.src})`);
          break;
        }
        case 'SCRIPT':
        case 'STYLE':
          break;
        default:
          walk(node);
      }
    }
  };
  walk(root);

  /**
   * Shift headings so the shallowest one in the post becomes h2, keeping the
   * relative nesting the author chose. The page title is the h1.
   */
  const levels = blocks
    .filter((b) => b.startsWith('\u0000'))
    .map((b) => Number(b.split('\u0000')[1]));
  const shift = levels.length ? Math.min(...levels) - 2 : 0;
  for (let i = 0; i < blocks.length; i += 1) {
    if (!blocks[i].startsWith('\u0000')) continue;
    const [, level, text] = blocks[i].split('\u0000');
    const depth = Math.min(Math.max(Number(level) - shift, 2), 4);
    blocks[i] = `${'#'.repeat(depth)} ${text}`;
  }

  const ld = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => {
      try {
        return JSON.parse(s.textContent);
      } catch {
        return null;
      }
    })
    .find((d) => d && d['@type'] === 'BlogPosting');

  return {
    markdown: blocks.join('\n\n'),
    meta: ld
      ? {
          headline: ld.headline,
          datePublished: ld.datePublished,
          dateModified: ld.dateModified,
          description: ld.description,
          image: typeof ld.image === 'string' ? ld.image : (ld.image?.url ?? null),
        }
      : null,
    h1: document.querySelector('[data-hook="post-page-root"] h1')?.innerText?.trim() ?? null,
  };
};

async function main() {
  await mkdir(CACHE, { recursive: true });
  await mkdir(OUT, { recursive: true });

  let slugs = await getSlugs();
  if (onlySlug) slugs = slugs.filter((s) => s === onlySlug);
  if (limit) slugs = slugs.slice(0, limit);
  console.log(`${slugs.length} post(s) to migrate`);

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  // Render from the saved HTML only; no network, so nothing re-fetches remotely.
  await page.route('**/*', (r) => (r.request().url().startsWith('file://') ? r.continue() : r.abort()));

  const report = [];
  for (const [i, slug] of slugs.entries()) {
    try {
      await getHtml(slug);
      await page.goto(`file://${join(CACHE, `${slug}.html`)}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);

      const result = await page.evaluate(DOM_TO_MARKDOWN);
      if (!result?.markdown) throw new Error('no body found');

      const meta = result.meta ?? {};
      const title = (meta.headline ?? result.h1 ?? slug).trim();
      const plain = result.markdown.replace(/[#>*_`\[\]()!]/g, ' ').replace(/\s+/g, ' ').trim();
      const description = fitDescription(meta.description, plain);
      const { category, confident } = guessCategory(title, plain);

      const front = [
        '---',
        `title: ${yaml(title.slice(0, 70))}`,
        `description: ${yaml(description)}`,
        `pubDate: ${yaml((meta.datePublished ?? '').slice(0, 10))}`,
        meta.dateModified && meta.dateModified.slice(0, 10) !== (meta.datePublished ?? '').slice(0, 10)
          ? `updatedDate: ${yaml(meta.dateModified.slice(0, 10))}`
          : null,
        `category: ${category}`,
        'keywords: []',
        // Nothing publishes until a human has read it — see ADR 0007.
        'draft: true',
        '---',
        '',
        result.markdown,
        '',
      ]
        .filter((line) => line !== null)
        .join('\n');

      await writeFile(join(OUT, `${slug}.md`), front);
      report.push({ slug, title, category, confident, words: plain.split(' ').length });
      process.stdout.write(`  ${String(i + 1).padStart(2)}/${slugs.length} ${slug}\n`);
    } catch (error) {
      report.push({ slug, error: String(error.message ?? error) });
      process.stdout.write(`  ${String(i + 1).padStart(2)}/${slugs.length} ${slug} — FAILED: ${error.message}\n`);
    }
  }

  await browser.close();

  const ok = report.filter((r) => !r.error);
  const failed = report.filter((r) => r.error);
  const unsure = ok.filter((r) => !r.confident);

  console.log(`\nmigrated ${ok.length}, failed ${failed.length}`);
  console.log(`category guessed with low confidence on ${unsure.length} post(s)`);
  for (const f of failed) console.log(`  FAILED ${f.slug}: ${f.error}`);

  const counts = {};
  for (const r of ok) counts[r.category] = (counts[r.category] ?? 0) + 1;
  console.log('category spread:', JSON.stringify(counts));
}

await main();
