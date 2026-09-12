/**
 * JSON-LD builders — audit §7.5.
 *
 * Schema is built from the same content entries the page renders, so it cannot
 * drift from the visible text. `scripts/lint-content.mjs` rule 7 enforces that
 * for FAQs by comparing the emitted JSON-LD against the rendered answers.
 */

export interface FaqSchemaItem {
  question: string;
  /** The rendered answer, as plain text. Must match what the page shows. */
  answer: string;
}

export function faqPageSchema(items: readonly FaqSchemaItem[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  });
}

/**
 * Markdown body → the plain text a browser would show, so the schema string and
 * the rendered DOM agree. Handles what our FAQ answers actually use: paragraphs,
 * emphasis, inline links. Deliberately not a general Markdown parser.
 */
export function markdownToPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → their text
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // emphasis
    .replace(/`([^`]+)`/g, '$1')
    .split(/\n{2,}/) // paragraphs
    .map((para) => para.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' ');
}
