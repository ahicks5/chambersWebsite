# Voice

Expanded from audit §3.4. This file is the reference for every piece of copy in
`src/content/`.

## The shape of it

Warm, second person, plain. Short sentences. Sixth-to-eighth grade reading level —
the audit cites landing-page studies where copy at this level converted at roughly
twice the rate of college-level copy.

The blog titles are the target voice: "The Definition of Burnout Is Broken — And
It Is Failing a Generation." "Burnout Is a Liar." Specific, a little contrarian,
no hedging. The homepage should sound like that. Today it sounds like a letter.

## Keep

- Naming the hard thing directly — "burned out," "shame," "the success you have
  to recover from."
- Second person. You, not "clients" or "individuals."
- Saying when coaching is the wrong tool, and referring out.
- Concrete detail over abstraction: "text me between sessions" beats "ongoing
  support."

## Cut list

These are the generic-coach vocabulary the blog successfully avoids. They
currently appear in meta descriptions and CTA labels.

- journey
- walk alongside
- transformation
- unlock
- step into the life you deserve
- holistic
- empower
- level up

`scripts/lint-content.mjs` warns (does not fail) on these. Warnings are still
findings — clear them.

## Sentence-level rules

- No em-dash asides where a full stop works.
- No "not X, but Y" constructions.
- No question-mark headlines that the section does not answer.
- One idea per paragraph. If a paragraph needs a comma-spliced second clause to
  hold together, it is two paragraphs.
- Prices, session counts and timeframes are always concrete. Never "investment,"
  never "a few sessions."
