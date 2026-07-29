<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Testing & linting gotchas

- `pnpm test` runs Vitest, scoped to `app/**` and `lib/**` only (`vitest.config.ts` `include`). Don't widen it to catch `.claude/**` — that dir holds the agent kit's own `.cjs`/`.mjs` tests written for the plain `node` runner, and they fail under Vitest.
- `pnpm lint` fails repo-wide (~660 pre-existing errors) because bare `eslint` also lints `.claude/**`, which uses `require()`-style imports the flat config rejects. Not caused by app code. For a real signal on the app, run `npx eslint app lib` (clean).
<!-- END:nextjs-agent-rules -->
