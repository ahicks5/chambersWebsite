# 0009 — Section rhythm: sizes and tones, not one padding and a toggle

Status: accepted
Date: 2026-09-12
Adjusts: audit §8.3 (`.section` / `.section--alt`), §8.4 ("Rhythm")

## Context

Audit §8.3 gives one `.section` padding and one `.section--alt` background, and
§8.4 says to alternate the two so "the eye knows where one idea ends". Built
literally, every band on the homepage is the same height and the background
merely toggles white / grey / white / grey. The rendered page reads as flat:
nothing is bigger, nothing is quieter, and the alternation itself becomes the
pattern the eye sees.

The audit's own blueprint (§5.2) disagrees with its CSS. It gives every section
a different height target — hero "1 screen", proof strip "¼ screen", coaching
options "1.5 screens", org band "½ screen" — which one padding value cannot
produce.

## Decision

`Section.astro` gains two props. `alt` stays as a shorthand.

| Prop | Values | Use |
|---|---|---|
| `size` | `compact` · `default` · `roomy` | `compact` for strips (proof, org band); `roomy` for the hero |
| `tone` | `bg` · `surface` · `accent` | `accent` is the deep green with ink-coloured text — **at most once per page**, for the closing CTA |

Rhythm on a page comes from varying both, not from alternating one. Two
adjacent sections may share a tone if their sizes differ.

The `accent` tone inverts headings and links to `--c-accent-ink` inside the
band. A primary button inside it would be accent-on-accent, so `Button.astro`
gains an `inverse` style: accent-ink fill, accent label. It is still the one
primary CTA (audit §4.3): same label, same URL, same weight — only the fill is
swapped to stay visible.

## Consequences

- No new colour. The accent band uses the two tokens the buttons already pair.
  Contrast is 8.45:1 either way round.
- The hero and the closing CTA now bracket the page: the largest quiet section
  at the top, the one saturated band at the bottom.
- The audit's `.section` / `.section--alt` pair is superseded by
  `Section.astro`'s props. Its intent — margins, not spacer boxes — is kept.
- A page must never render two `accent` sections. There is no lint for it yet;
  it is a review item.
