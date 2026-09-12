# 0006 — Testimonial attribution: role and industry are optional

Status: accepted
Date: 2026-09-12
Relates to: audit §2.4, appendix C, `docs/02-project-structure.md` §11 question 3

## Context

The scaffold's `testimonials` schema required `role` and `industry`, following
audit appendix C, which sets the minimum attribution at
`Role · Industry (Engagement)` and notes that role and industry "still beat
'Individual client'".

All nine live testimonials were then migrated from the real site. None of them
has a name. None has a role. None has an industry. Every one carries only an
engagement length or a training name:

- `5-Month Engagement`, `3-Month Engagement` ×2, `4-Month Engagement`,
  `Individual Client | 6-Month Engagement`
- `Resilience Team Training` ×2, `Resilient Leadership Training` ×2

So the schema as written could not accept John's actual content. The options were
to invent roles and industries, to leave the nine quotes out of the build, or to
let the schema describe reality.

Inventing them is out — these are real clients' words and a fabricated
attribution is a lie about a real person, not a placeholder.

## Decision

`role` and `industry` become optional. `engagement` stays required, because every
testimonial has one.

`Quote.astro` renders the most specific attribution the data supports:

| Data present | Renders |
|---|---|
| `firstName` + `role` + `industry`, `consent: named` | `— Priya, Engineering Manager · SaaS (3-month partnership)` |
| `role` + `industry` | `— Engineering Manager · SaaS (3-month partnership)` |
| neither | `— 3-month partnership` |

`firstName` is still gated on `consent === 'named'` — that rule is unchanged and
is a promise to real clients, not a style preference.

## Consequences

- The homepage band currently renders engagement-only attribution. This is the
  weakest form the audit describes, and it is what the real data supports today.
- Audit §2.4's recommendation is now a content task, not a code task: John emails
  nine clients for permission to use first name, role and industry. It is on
  `docs/parity-checklist.md` as a launch item.
- The `firstName` rendering path exists and is tested by the schema, so adding a
  name later is a frontmatter edit with no code change.
- Answering `docs/02-project-structure.md` §11 question 3 ("how many will John
  actually get named?") does not change any of this — the component already
  handles all three cases.
