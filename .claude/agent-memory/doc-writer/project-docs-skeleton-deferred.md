---
name: project-docs-skeleton-deferred
description: this repo has no docs/ dir; documentation-management.md names 4 docs that don't exist; repo-wide gotchas go in AGENTS.md instead
metadata:
  type: project
---

`documentation-management.md` names `docs/development-roadmap.md`, `docs/project-changelog.md`,
`docs/system-architecture.md`, `docs/code-standards.md` as the docs to maintain — but `docs/` does
not exist in this repo (my-saa-demo) as of 2026-07-29, and five features have shipped without it
(login, homepage, awards, kudos board, kudos compose modal).

**Why:** standing up the full four-doc skeleton for one feature's worth of content produces an
unmaintained tree — nobody keeps a roadmap/changelog current for a repo this size unless the docs
already existed before the feature landed. Feature-level architecture detail already lives in
`plans/{feature}/plan.md` (the plan itself has a "Review Outcomes" / "Decisions taken" section that
serves this purpose).

**How to apply:** when assessing docs impact after a feature ships, default to NOT creating `docs/`
unless the user explicitly asks for the roadmap/changelog system to start. Repo-wide gotchas that
future devs/agents need (test runner scoping, lint traps, build quirks) belong in `AGENTS.md`
(imported by `CLAUDE.md` via `@AGENTS.md`, so every agent session loads it) — not in a new
single-purpose docs file. Re-verify `docs/` still doesn't exist before reusing this memory; if the
user has since bootstrapped it, follow the existing convention instead.
