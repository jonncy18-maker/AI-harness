# AI Harness

One place to call different LLM providers — Anthropic, OpenAI, Google — from
a single UI, using each provider's own API directly (no router/gateway
service in between). Built for a single user (John), no public access.

Shared project instructions for every coding agent (Claude Code, Codex, Antigravity). Each agent's role and permissions live in its own global file, not here.

- **Repo:** `jonncy18-maker/AI-harness`
- **Live URL(s):** _(fill in after first Vercel deploy)_
- **Stack:** Next.js (App Router) + JavaScript + Vercel
- **Status:** Scaffold stage — one page, one API route, no persistence yet. The
  real feature set (saved prompts, conversation history, side-by-side
  comparison, etc.) is still undecided; run `/grill-me` against this file
  before building past the scaffold.

## 1. Stack

| Layer      | Choice                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| Framework  | Next.js (App Router)                                                                                                     |
| Frontend   | React                                                                                                                    |
| Routing    | Next.js App Router (file-based)                                                                                          |
| Language   | **JavaScript (`.jsx`/`.js`)** — matches the other personal-tool repos                                                    |
| Styling    | Plain CSS in `app/globals.css` for now — revisit once the UI grows                                                       |
| Database   | **None.** Deliberately deferred — see below.                                                                             |
| Auth       | None. Single-user private tool; gate at the Vercel project level if needed                                               |
| Hosting    | Vercel (native Git integration — no CI workflow)                                                                         |
| Formatting | Prettier — single quotes, semicolons, 80-col (`.prettierrc.json`)                                                        |
| AI         | No pinned in-app model — the whole point of this repo is to call whichever provider/model the user picks at request time |

**Why no database yet:** a multi-provider "call any LLM" tool doesn't
inherently need one — the app's job today is proxy + display, and nothing is
persisted across requests. If a later feature needs to persist something
(saved prompts, a run history, favorited comparisons), that's a deliberate,
scoped addition — a new Neon project + `neon/migrations/` following the
Personal-Dashboard pattern — not something to pre-build speculatively.

## 2. API Key / Security Rules

**Rule:** every provider call goes through a server-side route handler
(`app/api/*`); the browser never calls Anthropic, OpenAI, or Google directly
and never sees a provider key. No env var carrying a secret gets a
`NEXT_PUBLIC_` prefix.

**Rule:** provider clients are constructed per-request in `lib/providers.js`
from `process.env`, never hardcoded, never logged.

## 3. Project Structure

```
app/
  page.jsx              # Home — provider/model picker, prompt box, output
  layout.jsx
  globals.css
  api/
    generate/route.js   # Server-side dispatch to the selected provider
lib/
  providers.js           # Provider registry: env var, default model, run()
```

## 4. Environment Variables

```
# Server-side (no public prefix)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_API_KEY=
```

**Gotcha (same trap Personal-Dashboard hit):** set every one of these for
both **Production and Preview** in Vercel explicitly — a var present only in
Production makes Preview deploys fail in a way that looks like a runtime
bug, not a config bug. A provider key you don't have yet is fine to leave
unset; `app/api/generate/route.js` fails soft per-provider (400 naming the
missing var), not a global crash.

## 5. Routes / Pages

| Route | Component | Role                                                               |
| ----- | --------- | ------------------------------------------------------------------ |
| `/`   | Home      | Provider + model picker, prompt textarea, run button, output panel |

Nothing else exists yet. Add rows here the same session a new route ships.

## 6. Hard Boundaries

1. **No auth — don't add it back without discussion.** Single-user private
   tool; gate at the Vercel project level (password protection / trusted IPs)
   if access needs to be restricted, not by reintroducing an auth layer.
2. **No env var carrying a secret gets a `NEXT_PUBLIC_` prefix**, and every
   provider call goes through `app/api/*` — the browser never calls a
   provider API directly.
3. **No fabricated output.** If a provider call fails, surface the real
   error — never synthesize a plausible-looking response.
4. **Don't add a database speculatively.** See §1 — persistence is a
   deliberate future addition tied to a real feature, not a default.

## 7. Coder Profile & Agentic Loop

This repo follows the same development protocol as the other personal-tool
repos, from the [Agentic-Loop repo](https://github.com/jonncy18-maker/Agentic-Loop):

- **Coder Profile** — https://raw.githubusercontent.com/jonncy18-maker/Agentic-Loop/main/CODER_PROFILE.md
  Applies to **every task, no threshold**. Governs how code is written and how
  it gets verified. Read it at the start of every session.
- **Agentic Loop protocol** — https://raw.githubusercontent.com/jonncy18-maker/Agentic-Loop/main/AGENTIC_LOOP.md
  Applies to any change touching 3+ files, or introducing a new component,
  new data domain/table, or user-visible structural change. Governs whether
  the right thing was built — outcome approval, a numbered contract, an
  isolated builder/auditor pair, and a documented verdict.

A change small enough to skip the loop (a typo, a one-line config tweak) is
still governed by the profile.

## 8. Cross-Cutting Rules

**Model IDs in code stay pinned to exact IDs** (e.g. each provider's `defaultModel` in `lib/providers.js` and `app/page.jsx`), deliberately.

## 9. References

- [Agentic-Loop repo](https://github.com/jonncy18-maker/Agentic-Loop) — shared development protocol and coder profile
- [Personal-Dashboard repo](https://github.com/jonncy18-maker/Personal-Dashboard) — sibling repo this AGENTS.md's structure is modeled on; also the reference for the Neon migration pattern if/when this repo adds a database

## 10. Map

No `.claude/skills/` yet — this repo is one page and one route. Add a
domain skill here (and list it below) once a real feature area exists
(e.g. a saved-prompts library, run history, side-by-side comparison) rather
than growing this file past what one page needs.

**Keeping this file short is a maintenance rule, not a one-time cleanup.**
Only genuinely cross-cutting rules belong here; a single feature's detail
belongs in that feature's own skill once one exists. Anything only Claude Code needs goes in `CLAUDE.md`. State each rule once, and never put agent permissions (push, merge, deploy) here.

## Working in an agent copy (Codex / Antigravity)

Applies only when your working directory is under `~/code/_codex/` or `~/code/_antigravity/`. Those copies sync from the local `main` in `~/code/<repo>`, not from GitHub (local `main` is usually ahead, and the copies have no push access).

At the start of each session, with the copy on a clean `main`:

1. `git fetch local && git merge --ff-only local/main`.
2. If the copy is not on a clean `main`, or the fast-forward fails, stop and tell John. Do not reset, rebase or discard anything on your own.
3. Do your work on a local branch and hand it back through the audit inbox; never edit `main` in the copy.
