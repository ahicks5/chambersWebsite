# 0003 — Tailwind 4, CSS-first configuration

Status: accepted
Date: 2026-09-12
Supersedes: `docs/02-project-structure.md` §6 (the `tailwind.config.mjs` snippet)

## Context

The project-structure doc wires Tailwind to the design tokens through a
`tailwind.config.mjs` `theme.extend.colors` block. That is Tailwind 3 shape.
Tailwind 4 removed the JS config as the primary surface in favour of CSS-first
`@theme`, and 4.x is the current major.

## Decision

Tailwind 4 with `@tailwindcss/vite`. Tokens are mapped to utilities through an
`@theme inline` block in `src/styles/global.css`, immediately below the import of
`src/styles/tokens.css`. There is no `tailwind.config.mjs`.

## Consequences

- The mapping lives in the same file tree as the tokens themselves, which serves
  audit §8.2 better than the original plan did: token names appear in exactly two
  places (their definition and their one-line alias), not three.
- `@astrojs/tailwind` is not used — Tailwind 4 ships its own Vite plugin.
- Anyone following `docs/02-project-structure.md` §6 verbatim will look for a
  config file that does not exist. That snippet is superseded by this ADR.
- Utility names generated: `bg-bg`, `bg-surface`, `text-ink`, `text-muted`,
  `bg-accent`, `text-accent-ink`, `border-line`, `rounded-card`, `shadow-card`,
  `max-w-measure`.
