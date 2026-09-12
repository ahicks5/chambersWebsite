# Brand tokens

**Status: EXTRACTED** from the live Wix site (www.coachingwithjc.com) on
2026-09-12. `src/styles/tokens.css` holds John's real palette and typeface.

Two values carry documented deviations. Both are recorded below; neither changes
a hue.

## How these were extracted

Audit §6 asks for DevTools inspection of computed styles. The agent proxy in this
environment drops browser tunnels to the live host, so the page was fetched with
`curl` and rendered offline in headless Chromium from the saved HTML, with all
network requests blocked. Wix inlines its theme CSS, so `getComputedStyle` on
`:root` resolved the full site palette (`--color_0` … `--color_45`) directly.

Each token below is traced to the Wix palette slot it came from, and to the CSS
role that slot actually plays on the live site — not to a guess about which slot
looks like a brand colour.

To re-verify, or after John changes anything in **Site Design → Colors**, repeat
the check and update this table.

## Palette

| Token | Role | Value | Wix slot | Evidence on the live site |
|---|---|---|---|---|
| `--c-bg` | page background | `#ffffff` | `color_11` | Page background; the only painted light background in the offline render. |
| `--c-surface` | cards, alternate sections | `#f1f1f1` | `color_44` | The theme's light-grey surface slot (`color_35` is the same value). |
| `--c-text` | body copy | `#121212` | `color_45` | `color:rgb(var(--color_45))` on 8 text elements; `color_15`/`37`/`41` are the same value. |
| `--c-muted` | captions, meta | `#6e6e6e` | `color_40`, **darkened** | Live value is `#757575`, applied to 4 secondary text elements. See deviation 1. |
| `--c-accent` | the one CTA colour | `#365347` | `color_43` | Button fill (`--bg`, `--bgctr`, `--bgDrop`) and heading text on 12 elements. Most-used custom slot, 16 references. Deep green. |
| `--c-accent-ink` | text on accent | `#ffffff` | `color_36` | Button label colour (`--txt:var(--color_36)`). |
| `--c-line` | borders, dividers | `#b8b8b8` | `color_39` | Neutral grey from the theme. See deviation 2. |

## Contrast

Computed with the WCAG 2.x relative-luminance formula. Text pairs are held to
4.5:1.

| Pair | Ratio | Result |
|---|---|---|
| body text on background | 18.73:1 | pass |
| body text on surface | 16.59:1 | pass |
| muted on background | 5.10:1 | pass |
| muted on surface | 4.51:1 | pass |
| button label on accent | 8.45:1 | pass |
| accent as heading text on background | 8.45:1 | pass |
| accent as heading text on surface | 7.48:1 | pass |

The accent is a strong performer — the deep green clears 4.5:1 as body-sized text
on both backgrounds, so it can be used for headings and links, not only buttons.

### Deviation 1 — `--c-muted` darkened from `#757575` to `#6e6e6e`

The live value passes on white (4.61:1) and fails on the alternate surface band
(4.08:1). Since audit §8.4 calls for alternating section backgrounds, muted text
will land on `#f1f1f1` routinely.

`#6e6e6e` is the lightest neutral grey that clears 4.5:1 against **both**
backgrounds (5.10:1 and 4.51:1). The value is a pure grey, so lightness moved and
hue did not — it cannot, there is no hue to shift. The change is roughly 6%,
inside the 5–10% the audit permits.

### Deviation 2 — `--c-line` is decorative only

`#b8b8b8` on white is 1.98:1, which does not meet the 3:1 non-text contrast bar in
WCAG 1.4.11.

That bar applies to UI components and meaningful graphics, not to decorative
dividers, and every current use qualifies as decorative: card borders sit on a
filled `--c-surface` card that is already distinguishable without its border.
Darkening it enough to pass would put heavy grey rules across the whole site and
change the look materially, which the audit forbids.

**So this token must not be the sole visual boundary of a UI component.** Form
inputs on the Contact page (audit §5.6) need a darker border to be perceivable —
add a separate token for interactive borders at that point rather than darkening
this one.

## Type

The live site uses **Bitter** — a slab serif — throughout, at regular (400) with
Bitter Black (900) for headings. One family, two weights, well inside the audit
§10 budget of two families and four weights.

Worth noting: the Wix theme slots (`--font_0` … `--font_10`) still name
Avenir LT, Proxima Nova and DIN Next. Those are leftover template defaults,
overridden per element — Avenir and Proxima appear twice each in the page, Bitter
appears 144 times. The theme slots are not the site's typography.

| Role | Family | Weight | Token |
|---|---|---|---|
| Headings | Bitter | 900 | `--font-heading`, `--fw-heading` |
| Body | Bitter | 400 | `--font-body`, `--fw-body` |

Body copy runs 18px on the live site, which matches `--fs-body`. Line height runs
1.4 there; the tokens use 1.6 because audit §8.2 specifies it and the audit is the
spec.

Bitter is self-hosted from `public/fonts/` as two Latin-subset woff2 files, one
per weight, about 23 KB each — instanced from the variable `Bitter[wght].ttf`
in google/fonts and subset to the same unicode-range Google Fonts serves as
"latin". `src/styles/fonts.css` declares them with `font-display: swap`;
`Base.astro` preloads the 900 file, which is the H1 weight (audit §10). Two
static instances rather than the one variable file, because the H1 preload then
costs a single 23 KB request instead of pulling the whole axis before first
paint. The OFL licence ships beside the files.
