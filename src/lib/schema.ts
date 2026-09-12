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

export interface OfferSchemaItem {
  name: string;
  price?: number;
  url: string;
}

/**
 * ProfessionalService + Person for the homepage — audit §7.5.
 *
 * Everything here is read from src/config/site.ts and the offers collection, so
 * the structured data cannot drift from the prices and credentials the page
 * actually shows. That drift is exactly what §7.5 warns about.
 */
export function professionalServiceSchema(input: {
  site: {
    name: string;
    url: string;
    person: string;
    locality: string;
    region: string;
    country: string;
    social: Readonly<Record<string, string>>;
  };
  description: string;
  offers: readonly OfferSchemaItem[];
}): string {
  const { site, description, offers } = input;

  // TODO strings in site.social are placeholders, not URLs — omit them rather
  // than emit invalid sameAs entries that a validator will flag.
  const sameAs = Object.values(site.social).filter((value) => value.startsWith('http'));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    url: site.url,
    description,
    areaServed: ['United States'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    founder: {
      '@type': 'Person',
      name: site.person,
      jobTitle: 'Professional Coach, ICF ACC',
      url: `${site.url}/about`,
      ...(sameAs.length > 0 ? { sameAs } : {}),
      alumniOf: 'Cornell University',
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'Associate Certified Coach (ACC)',
        recognizedBy: {
          '@type': 'Organization',
          name: 'International Coaching Federation',
        },
      },
    },
    makesOffer: offers.map((offer) => ({
      '@type': 'Offer',
      name: offer.name,
      ...(offer.price !== undefined
        ? { price: String(offer.price), priceCurrency: 'USD' }
        : {}),
      url: offer.url,
    })),
  });
}
