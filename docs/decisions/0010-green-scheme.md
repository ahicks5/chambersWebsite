# 0010 — The deep green is the page

Status: accepted
Date: 2026-09-12
Adjusts: audit §8.2 (`--c-bg` as "page background"), the "no change to the
colour vibe" constraint as applied to *which* palette colour is the ground
Relates to: ADR 0009 (tones), `docs/brand/tokens.md`

## Context

Andrew asked for the green as the base rather than white. The constraint that
governs colour on this project is that the palette is John's and no hue
changes. It says nothing about which palette colour is the ground and which
is the figure — and the rebuild had inherited "white page, green buttons" from
the Wix template defaults, not from a decision.

Flipping ground and figure keeps every hue. It changes the feel of the site a
great deal, which is the point.

## Decision

Colour roles are set per **scheme**. `src/styles/tokens.css` holds the palette
once and the `--c-*` roles twice:

| Role | light scheme | green scheme |
|---|---|---|
| `--c-bg` | white | green |
| `--c-text` | ink | white |
| `--c-accent` | green | white |
| `--c-accent-ink` | white | green |
| `--c-surface` | grey | white at 8% over green |
| `--c-muted` | `#6e6e6e` | white at 78% |
| `--c-line` / `--c-line-strong` | greys | white at 22% / 55% |

`<body>` carries `.scheme-green`. A `Section` with `tone="light"` carries
`.scheme-light`, so a white band inside the green page restores every role for
its descendants. Because components already read the roles and never the
palette, no component needed a colour change; the accent and its ink simply
swap, so the one filled button becomes white with a green label, headings
become white, and the accent closing band becomes a white band.

Two new roles, `--c-field-bg` and `--c-field-text`, keep form inputs white with
dark text in both schemes.

The tints are not new colours: each is white at a stated opacity over the
green and resolves to a tint of it. Contrast, by the WCAG formula:

| Pair | Ratio |
|---|---|
| white on green | 8.45:1 |
| white on the 8% band | 6.76:1 |
| muted (78%) on green | 5.91:1 |
| muted (78%) on the 8% band | 4.87:1 |
| line-strong (55%) on green, non-text | 3.85:1 |

## Where the light band is used

- The offer cards, on every page that has them — the pricing decision sits on
  the audit's white, where the cards are white with grey lines and the
  featured one has a green border, exactly as designed in ADR 0009 and the
  cards commit.
- The closing CTA, via `tone="accent"`, which in the green scheme resolves to
  a white band with green text and a green button. Hero and close still
  bracket the page, now dark to light.

## Consequences

- `docs/brand/tokens.md` gains the scheme table and the tint ratios. Its
  palette table and the two original deviations are unchanged.
- The audit's white-page CSS in §8.3 is now the light scheme, used for bands.
- Reverting is one class on `<body>`.
