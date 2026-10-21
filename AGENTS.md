# AGENTS.md

Tasklane is a small Linear-style issue tracker: projects, issues with identifiers like `WEB-12`, a list and a board view, and comments. It is an npm workspaces monorepo in TypeScript, on Node.js 24.

## Commands

Run every command from the repository root.

| Command | What it does |
| --- | --- |
| `npm install` | Installs every workspace |
| `npm run db:seed` | Deletes the local SQLite database and seeds a fresh one |
| `npm run dev` | Starts the API on :3001 and the web app on :5173 |
| `npm run build` | Builds the web app |
| `npm test` | Runs every test once (Vitest, all workspaces) |
| `npm run test:watch` | Runs the tests in watch mode |
| `npm run typecheck` | Type checks every workspace with `tsc --noEmit` |
| `npm run lint` | Biome: lint rules, formatting and import order, read-only |
| `npm run format` | Biome: formats files and applies the safe lint fixes |
| `npm run knip` | Finds unused files, exports and dependencies |
| `npm run arch` | Checks the architecture rules in `.dependency-cruiser.cjs` |
| `npm run check` | **All of the above**, fastest first: lint, arch, knip, test, typecheck (about 5 s) |
| `npm run db:generate` | Creates a SQL migration from `apps/api/src/db/schema.ts` |

To add a dependency to one workspace: `npm install <pkg> -w @tasklane/api` (or `@tasklane/web`, `@tasklane/shared`).

## Map

```
apps/api/src/
  routes/        HTTP layer. One file per resource. Calls services only.
  schemas/       TypeBox route schemas. One file per resource.
  services/      Business logic. Throws AppError subclasses. Calls repositories.
  repositories/  The only code that imports Drizzle or the db schema.
  db/            schema.ts, client.ts, migrate.ts, seed.ts
  errors.ts      AppError, NotFoundError, BadRequestError, central error handler
apps/api/drizzle/  Generated SQL migrations. Never edit one that is already committed.
apps/web/src/
  api/           apiRequest() and one TanStack Query hooks file per resource
  components/    PascalCase.tsx, one component per file
  pages/         Route components, wired in router.tsx
packages/shared/src/  Types and constants used by both the API and the web app
```

## Conventions

- **Layers.** `routes/ → services/ → repositories/`. A route never imports a repository, `drizzle-orm` or `db/`. A service never touches `request` or `reply`. `npm run arch` enforces this, plus: the web app never imports `apps/api`, and `packages/shared` never imports an app.
- **Errors.** Every error response is `{ "error": { "code", "message", "details?" } }`. Throw `NotFoundError` or `BadRequestError` (or a new `AppError` subclass) from a service and let the handler in `errors.ts` format it. Never call `reply.status(4xx).send(...)` by hand.
- **Dates.** Always UTC, always ISO 8601 strings. Get "now" from `nowIso()` in `apps/api/src/lib/time.ts`. Never store local time or epoch numbers.
- **Shared types.** A type that crosses the API boundary lives in `packages/shared` and is imported from `@tasklane/shared` on both sides. Do not redeclare it.
- **Schema changes.** Edit `apps/api/src/db/schema.ts`, then run `npm run db:generate`. Migrations run when the server starts.
- **Current user.** There is no login. Endpoints that create something read the user from the `x-user-id` header with `getCurrentUserId()`.
- **Frontend data.** Components never call `fetch`. They use the hooks in `apps/web/src/api/`.
- **Tests.** Next to the code, as `<file>.test.ts(x)`. API tests get a fresh in-memory database from `apps/api/src/test/test-app.ts`; web tests render with `apps/web/src/test/render.tsx` and mock `fetch` with `mockApi()`. A bug fix starts with a failing test.

## Skills

- `add-api-endpoint` (`.claude/skills/add-api-endpoint/`): the full checklist for a new endpoint, from shared type to web hook. Use it whenever you add or change an API route.

## Specs

New features start from a spec, not from code. The project uses [BMAD Method](https://docs.bmad-method.org/) v6 (`_bmad/`, skills named `bmad-*`). Each spec is a folder `_bmad-output/specs/spec-<slug>/` with `SPEC.md` (the contract), `stories.yaml` (the order of work) and `stories/<id>-<slug>.md` (one story spec each). If a story exists for the task, read it and its SPEC.md first and follow the I/O matrix and acceptance criteria. Never change the part inside `<frozen-after-approval>`: that is the human's decision. If you are unsure which BMAD skill fits, use `bmad-help`.

## Tools

- **Playwright MCP** (`.mcp.json`). After a change to `apps/web/`, start the app with `npm run dev`, open http://localhost:5173 with the Playwright tools and check the screen you changed. Use it for UI checks only; for the API, curl is faster.

## Hooks

`.claude/settings.json` runs two hooks. After every edit, the file is formatted and linted and its workspace is type checked. When you stop, `npm run check` runs if anything changed. A hook message is an instruction: fix what it reports before you continue.

## Before you say you are done

**`npm run check` must be green.** It runs every check in the repo, fastest first, and stops at the first failure. Read the error, fix the cause, run it again. Do not say you are done, and do not ask for review, while it is red.

When a check fails:

- Lint: run `npm run format`, then fix what is left by hand.
- Arch: follow the rule's message. Do not edit `.dependency-cruiser.cjs` to make it pass.
- Knip: use what you exported, or delete it. Do not leave code "for later".
- Tests: fix the code, not the test, unless the test encodes behavior the task changed on purpose. Say so if it does.
- Typecheck: fix the type. Do not silence it with `any`, `as` or `!`.

Also:

- New behavior has a test.
- The app still starts with `npm run dev`; after a UI change, look at it with the Playwright MCP.
- `README.md` is updated if you changed a command or an endpoint.

## More docs

- [README.md](README.md): what the app does, setup, the API at a glance
- [.claude/rules/backend.md](.claude/rules/backend.md): how to write routes, schemas, services and repositories
- [.claude/rules/frontend.md](.claude/rules/frontend.md): data fetching, file layout and UI conventions in the web app
