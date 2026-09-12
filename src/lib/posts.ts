/**
 * Blog helpers. The five categories are audit §2.5's collapse of the live
 * site's fifteen; the labels live here so the enum stays machine-readable and
 * the display strings stay in one place.
 */
import type { CollectionEntry } from 'astro:content';

export const CATEGORY_LABELS = {
  burnout: 'Burnout',
  resilience: 'Resilience',
  career: 'Career',
  leadership: 'Leadership',
  practices: 'Practices',
} as const satisfies Record<CollectionEntry<'posts'>['data']['category'], string>;

export type Category = keyof typeof CATEGORY_LABELS;

/** Newest first. */
export function sortByDate(posts: CollectionEntry<'posts'>[]): CollectionEntry<'posts'>[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
