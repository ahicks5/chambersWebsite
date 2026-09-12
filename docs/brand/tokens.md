# Brand tokens

**Status: NOT YET EXTRACTED.** `src/styles/tokens.css` currently holds neutral
greyscale placeholders so the project builds and renders. None of them is John's
palette. Replace them before any visual work — every colour in the site resolves
through these seven variables.

## How to fill them in (audit §8.2, project-structure §6)

1. Open the live Wix site. DevTools → inspect the header, hero text, body text,
   the primary button, and an alternate-background section.
2. Record the computed `color` / `background-color` hex for each. Grab the
   `font-family` stacks too.
3. Fill the table below, with a screenshot of each colour in context.
4. Copy the hexes into `src/styles/tokens.css`. Nothing else in the repo may
   contain a hex.
5. Check contrast on WebAIM: body-on-background and button-label-on-accent must
   both clear 4.5:1. If one fails, darken **only that value** — same hue, adjusted
   lightness — and note the deviation in the table. The audit's constraint is "no
   change to the colour vibe."

## Palette

| Token | Role | Hex | Source element | Contrast check | Notes |
|---|---|---|---|---|---|
| `--c-bg` | page background | TODO | | — | |
| `--c-surface` | cards, alternate sections | TODO | | — | |
| `--c-text` | body copy | TODO | | vs `--c-bg`: TODO | must clear 4.5:1 |
| `--c-muted` | captions, meta | TODO | | vs `--c-bg`: TODO | |
| `--c-accent` | the one CTA colour | TODO | | — | |
| `--c-accent-ink` | text on accent | TODO | | vs `--c-accent`: TODO | must clear 4.5:1 |
| `--c-line` | borders, dividers | TODO | | — | |

## Type

Two families, four weights maximum (audit §10). Self-host as subset woff2 in
`public/fonts/` with `font-display: swap`, and preload the face used in the H1.

| Role | Family | Weights | Notes |
|---|---|---|---|
| Headings | TODO | TODO | |
| Body | TODO | TODO | |
