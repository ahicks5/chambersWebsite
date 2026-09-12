/**
 * Every route the site publishes, read from the build output rather than
 * hardcoded — so a new page is covered by the smoke suite the moment it exists,
 * and a route that disappears fails loudly instead of silently going untested.
 */
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

export function builtRoutes(): string[] {
  if (!existsSync(DIST)) throw new Error('dist/ not found — run `npm run build` first.');
  return walk(DIST)
    .filter((f) => f.endsWith('index.html'))
    .map((f) => `/${relative(DIST, f).split(sep).slice(0, -1).join('/')}`)
    .map((r) => (r === '/' ? '/' : `${r}/`))
    .sort();
}

/**
 * The pages a visitor is meant to land on, excluding migrated blog posts.
 * Those are drafts under review and are checked separately and in bulk.
 */
export function primaryRoutes(): string[] {
  return builtRoutes().filter((r) => !r.startsWith('/blog/') || r.startsWith('/blog/category/'));
}

/**
 * Migrated blog posts only. Note `/blog/` itself starts with `/blog/`, so the
 * index has to be excluded explicitly — it is not a post.
 */
export function postRoutes(): string[] {
  return builtRoutes().filter(
    (r) => r.startsWith('/blog/') && r !== '/blog/' && !r.startsWith('/blog/category/')
  );
}
