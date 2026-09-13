# 0008 — Type set against Bitter, not against the fallback

Status: accepted
Date: 2026-09-12
Adjusts: audit §8.2 (type scale values), §8.3 (button and heading weights)
Relates to: `docs/brand/tokens.md` (Type)

## Context

The type scale in `src/styles/tokens.css` was filled in from audit §8.2 before
Bitter was delivered to the browser. Every page rendered in Georgia, so every
sizing judgment since the scaffold was made against the wrong face. A 900
Bitter heading and a Georgia bold heading are not the same design: Bitter Black
is a heavy slab with a large x-height, and at the audit's H1 ceiling of 3.25rem
it reads short and dense rather than large.

Two more things only became visible once the real face was on screen:

- The audit's CSS asks for `font-weight: 600` on buttons and `700` on prices
  and step numbers. Only 400 and 900 exist (tokens.md: one family, two
  weights). Browsers resolve a request for 600 to 900 when that is the nearest
  heavier weight, so those rules were already rendering at 900 — but only by
  accident of the matching algorithm, and a third weight added later would
  silently change every button.
- The live site sets its headings in the deep green. tokens.md traced the
  accent slot to "button fill and heading text on 12 elements". The rebuild
  used it on buttons only, which is why the green felt confined to CTAs.

## Decision

1. **Scale re-set against Bitter.** H1 `clamp(2.25rem, 1.3rem + 3.6vw, 3.9rem)`
   with line-height 1.05 and -0.015em tracking; H2
   `clamp(1.6rem, 1.15rem + 1.8vw, 2.4rem)`; H3
   `clamp(1.15rem, 1.05rem + 0.5vw, 1.35rem)`. Body stays 18px / 1.6 as the
   audit specifies. Three named sizes are added for the secondary roles that
   were being typed as magic numbers: `--fs-lede` (1.25rem), `--fs-small`
   (0.95rem), `--fs-eyebrow` (0.8rem).
2. **Two weights, named.** Every `font-weight: 600` and `700` in a component
   becomes `var(--fw-heading)`. `strong` and `b` are set to it explicitly.
   Nothing on the site asks for a weight that does not ship.
3. **H1 and H2 in the accent**, as on the live site. It clears 4.5:1 on both
   backgrounds at body size (8.45:1 and 7.48:1), so there is no size at which
   this fails. H3 stays in ink so card titles sit below section titles.
4. **Links underlined site-wide** by a base rule, with the nav, buttons and
   the brand opting out. The previous fix was per-component and had already
   missed several standalone links. Arrow links ("Read more →") take a `.more`
   class: heading weight, 2px underline.
5. **An `.eyebrow` label style**: Bitter Black at 0.8rem, uppercase, 0.1em
   tracked, accent. For kickers, badges and group labels — never for body text.

## Consequences

- The audit's clamp() values in §8.2 are superseded by the tokens file. The
  audit's intent (fluid, mobile-first, one H1 scale site-wide) is unchanged.
- No colour value changes. The accent is used in one more place it was already
  used on the live site.
- The header brand wraps to two lines on phones rather than pushing the CTA to
  a third row; the phone header drops from three rows to two.
- A third weight is a deliberate decision now, not a side effect: add the file,
  add the token, and choose where it goes.
