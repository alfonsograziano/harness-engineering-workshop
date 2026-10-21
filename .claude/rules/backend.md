---
paths:
  - "apps/api/**"
---

# Backend rules (apps/api)

These rules load only when you work on files in `apps/api/`. Follow the existing files for `issues` as the reference.

## Route schemas: `src/schemas/<resource>.ts`

- One file per resource. Export one object per route, named `<verb><Resource>Schema`, with `params`, `querystring`, `body` and `response` as needed.
- Build schemas with `Type` from `typebox`. Reuse `IssueStatusSchema`, `IssuePrioritySchema`, `IsoDateSchema` and `ErrorResponseSchema` from `schemas/common.ts`.
- Enums come from the constants in `@tasklane/shared` (`Type.Enum(ISSUE_STATUSES)`), never from a second hand written list.
- Request bodies set `{ additionalProperties: false }`. List every error status the route can return in `response`, with `ErrorResponseSchema`.

## Routes: `src/routes/<resource>.ts`

- Export a `FastifyPluginAsyncTypebox` named `<resource>Routes` and register it in `src/app.ts` inside the `/api` prefix.
- A handler does three things: read the typed input, call one service method through `app.services`, return the result. Use `reply.status(201).send(...)` for creates.
- No business logic, no database access, no `try/catch`. Errors bubble up to the central handler.
- Get the current user with `getCurrentUserId(request)` from `src/lib/current-user.ts`.

```ts
app.get('/issues/:identifier', { schema: getIssueSchema }, async (request) => {
  return app.services.issues.getByIdentifier(request.params.identifier);
});
```

## Services: `src/services/<resource>.ts`

- Export `create<Resource>Service(deps)` that returns an object of async methods, and wire it in `src/services/index.ts`. Export `type <Resource>Service = ReturnType<...>` only when another service takes it as a dependency; `npm run knip` flags an export nobody uses.
- Services take repositories and other services as arguments. They never import `db/` or `drizzle-orm`, and never see `request` or `reply`.
- Services return the shared API types from `@tasklane/shared`, never raw database rows. Map rows with a small `to<Resource>()` function.
- Throw `NotFoundError(resource, id)` or `BadRequestError(message)` from `src/errors.ts`. For a new kind of error, add an `AppError` subclass with its own `code`.
- Timestamps come from `nowIso()` in `src/lib/time.ts`.

## Repositories: `src/repositories/<resource>.ts`

- Export `create<Resource>Repository(db: Database)` and its `ReturnType` (services take it as a dependency). This is the only layer that imports `drizzle-orm` and `db/schema`.
- Return `rows[0] ?? null` for single lookups. Do not throw "not found" here; that is the service's job.
- Keep queries in one statement when two requests could race, like `reserveIssueNumber()`.

## Errors

Every error response has this shape, and only `src/errors.ts` builds it:

```json
{ "error": { "code": "NOT_FOUND", "message": "Issue WEB-99 was not found" } }
```

Codes are UPPER_SNAKE_CASE. Validation errors from schemas become `VALIDATION_ERROR` with the Ajv errors in `details`. Unknown errors become `INTERNAL_ERROR` and are logged.

## Database

- Change `src/db/schema.ts`, then run `npm run db:generate` from the root. Commit the generated SQL and the `meta/` files together.
- Never edit a migration that is already committed. Write a new one.
- Columns use `snake_case` in SQL and `camelCase` in TypeScript. Timestamps are `text` columns with ISO strings.
- If you add sample data, add it to `src/db/seed.ts` too.

## Tests

- Services: `src/services/<resource>.test.ts`, with `createTestServices()` from `src/test/test-app.ts`. It gives you a fresh in-memory database with the real migrations and a small fixture (users 1 and 2, projects WEB and API, issue WEB-1).
- Routes: `src/routes/<resource>.test.ts`, with `createTestApp()` and `app.inject()`. Assert the status code and the full error body, not just "it failed".
- When a story has an I/O matrix, every row becomes a test.
