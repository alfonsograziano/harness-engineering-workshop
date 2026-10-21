---
name: add-api-endpoint
description: Adds a new HTTP endpoint to the Tasklane API end to end - shared type, database table if needed, repository, service, TypeBox schema, Fastify route, and the TanStack Query hook in the web app. Use when asked to add, expose or create an API endpoint, route or resource, or when a frontend feature needs data the API does not serve yet.
---

# Add an API endpoint

Work through the steps in order. Each step names the file to change and an example to copy from `examples/`. The examples use a made-up `milestones` resource; rename everything to your resource.

Before you start, write down in one line: the method and path, who calls it, and what it returns. If a step does not apply (for example the table already exists), say so and skip it.

## 1. Shared type: `packages/shared/src/api-types.ts`

Add the response type and the input type, if there is a body. Both the API and the web app import them from `@tasklane/shared`.

Example: [examples/shared-types.ts](examples/shared-types.ts)

## 2. Table (only for a new resource): `apps/api/src/db/schema.ts`

Add the table, then run `npm run db:generate` from the root and commit the generated SQL with its `meta/` files. Timestamps are `text` columns with ISO strings.

Example: [examples/db-schema.ts](examples/db-schema.ts)

## 3. Repository: `apps/api/src/repositories/<resource>.ts`

The only layer that imports `drizzle-orm` and `db/schema`. Return `rows[0] ?? null` for single lookups.

Example: [examples/repository.ts](examples/repository.ts)

## 4. Service: `apps/api/src/services/<resource>.ts`

Business rules, `NotFoundError` / `BadRequestError`, `nowIso()` for timestamps, and a `to<Resource>()` mapper that returns the shared type. Then wire it in `apps/api/src/services/index.ts`.

Example: [examples/service.ts](examples/service.ts)

## 5. Schema: `apps/api/src/schemas/<resource>.ts`

One exported object per route with `params`, `body` and `response`. Bodies use `additionalProperties: false`. Every error status uses `ErrorResponseSchema`.

Example: [examples/route-schema.ts](examples/route-schema.ts)

## 6. Route: `apps/api/src/routes/<resource>.ts`

Read input, call one service method, return. Register the plugin in `apps/api/src/app.ts` inside the `/api` prefix.

Example: [examples/route.ts](examples/route.ts)

## 7. Web hook: `apps/web/src/api/<resource>.ts`

Add the query key to `apps/web/src/api/query-keys.ts`, then a `useQuery` or `useMutation` hook that calls `apiRequest`. Mutations invalidate the keys they change.

Example: [examples/web-hook.ts](examples/web-hook.ts)

## 8. Tests

Add service tests with `createTestServices()` and route tests with `createTestApp()` and `app.inject()` (see `apps/api/src/routes/labels.test.ts`). Cover the happy path, a 404 for an unknown parent, and a 400 for a bad body. Run `npm test`.

## 9. Docs

Add the endpoint to the "API at a glance" table in `README.md`.

## 10. Check it

Start the API (`npm run dev`) and call the endpoint with curl. Check the happy path, a 404 and a 400:

```bash
curl -s localhost:3001/api/projects/WEB/milestones
curl -s localhost:3001/api/projects/NOPE/milestones   # {"error":{"code":"NOT_FOUND",...}}
curl -s -X POST -H 'content-type: application/json' -H 'x-user-id: 1' \
  localhost:3001/api/projects/WEB/milestones -d '{}'  # {"error":{"code":"VALIDATION_ERROR",...}}
```
