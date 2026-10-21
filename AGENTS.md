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

- **Layers.** `routes/ → services/ → repositories/`. A route never imports a repository, `drizzle-orm` or `db/`. A service never touches `request` or `reply`.
- **Errors.** Every error response is `{ "error": { "code", "message", "details?" } }`. Throw `NotFoundError` or `BadRequestError` (or a new `AppError` subclass) from a service and let the handler in `errors.ts` format it. Never call `reply.status(4xx).send(...)` by hand.
- **Dates.** Always UTC, always ISO 8601 strings. Get "now" from `nowIso()` in `apps/api/src/lib/time.ts`. Never store local time or epoch numbers.
- **Shared types.** A type that crosses the API boundary lives in `packages/shared` and is imported from `@tasklane/shared` on both sides. Do not redeclare it.
- **Schema changes.** Edit `apps/api/src/db/schema.ts`, then run `npm run db:generate`. Migrations run when the server starts.
- **Current user.** There is no login. Endpoints that create something read the user from the `x-user-id` header with `getCurrentUserId()`.
- **Frontend data.** Components never call `fetch`. They use the hooks in `apps/web/src/api/`.

## Before you say you are done

- The app still starts with `npm run dev`.
- New API types are in `packages/shared`, and the web app uses them.
- `README.md` is updated if you changed a command or an endpoint.

## More docs

- [README.md](README.md): what the app does, setup, the API at a glance
