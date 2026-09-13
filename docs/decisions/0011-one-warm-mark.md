# 0011 — One warm mark

Status: accepted
Date: 2026-09-13
Adjusts: the "no new colour" reading of audit §8.2 by exactly one value
Relates to: ADR 0010 (schemes), `docs/brand/tokens.md`

## Context

With the green as the page (ADR 0010) every word on the homepage is white or
a tint of white. Andrew asked whether the full stop that ends the hero
headline could be a deep yellow, so one thing on the first screen pops.

The colour rule on this project is that the palette is John's and no hue is
invented or changed. The rebuild's palette was extracted from the theme
slots the live site paints. That theme also defines the Wix base slots,
among them `color_5`, a yellow (`rgb(255, 203, 5)`, `#ffcb05`), which the
live site defines but never uses.

So there is one warm colour that is in John's palette and not invented, and
using it is still a change to the look, because nothing warm appears on the
live site today.

## Decision

1. `--palette-yellow: #ffcb05` joins `tokens.css`, traced to `color_5`.
2. It has one role, `--c-mark`, and one use: the terminal full stop of the
   hero `h1`, which `Hero.astro` splits off the content string at render
   time. No other element uses the role until a later decision says so.
3. The role is painted only in the green scheme (5.55:1 on the green). In
   the light scheme it resolves to the green, because yellow on white is
   1.52:1 and must never be text.
4. It must not be used on the `surface` tint either: 4.44:1 misses the text
   bar.
6. Also the same day, once the inner pages gained the hero's opening band:
   every page's `h1` ends in the mark, through `PageHero.astro`. Still one
   mark per page, still the headline's closing punctuation, never a word.
5. Added the same day: the app icon and the social preview image carry the
   mark too — "JC" with the dot, and the hero headline's full stop. They are
   the brand mark and the hero reproduced, not new places on the pages, and
   `scripts/brand-assets.mjs` renders both from the same tokens.

## Consequences

- The site gains one warm value. It is the only token in the file that
  changes the look rather than reproducing the live site's, and this record
  is where that is owned.
- Reverting is one line in `Hero.astro` and one token.
- If John dislikes it, or wants it elsewhere (the closing headline, prices),
  that is a new decision, not a quiet extension of this one.
