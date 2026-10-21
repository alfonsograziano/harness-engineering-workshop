# Tasklane

A small Linear-style issue tracker. It is the starting point of a workshop on harness engineering: the app on `main` is a normal, well written project with no harness at all.

> The `harness` branch adds the harness one commit at a time: agent instructions, scoped rules, a skill, MCP, a spec, then tests, type checks, linting, dead code detection, structural tests, hooks, guardrails, a pre-commit hook, CI and an adversarial reviewer. Each commit has a `step-NN-*` tag.

## What it does

- Fake users from the seed. There is no login: pick the current user from the menu in the sidebar.
- Projects with a short key, for example `WEB`.
- Issues with a readable identifier (`WEB-12`), a title, a description, a status (backlog, todo, in progress, done, canceled), a priority (none, low, medium, high, urgent) and an assignee.
- A list view and a board view (kanban by status). Status changes go through a menu, not drag and drop.
- An issue detail panel with comments.
- Labels per project, shown as chips, set from the issue panel, with a label filter for both views.

## Getting started

You need Node.js 24 (see `.nvmrc`).

```bash
npm install
npm run db:seed
npm run dev
```

- Web app: http://localhost:5173
- API: http://localhost:3001 (the web app proxies `/api` to it)

`npm run db:seed` deletes the local database and creates a fresh one with realistic data. The database is a SQLite file in `apps/api/data/`, opened with the built-in `node:sqlite` module, so there is nothing else to install or run.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the API and the web app in watch mode |
| `npm run build` | Builds the web app |
| `npm run db:seed` | Resets the local database and fills it with sample data |
| `npm run db:generate` | Generates a new SQL migration after a change to `apps/api/src/db/schema.ts` |
| `npm test` | Runs all the tests with Vitest |

## Project structure

```
apps/
  api/                 Fastify 5 + TypeBox + Drizzle ORM on SQLite
    drizzle/           SQL migrations, applied when the server starts
    src/
      routes/          HTTP routes, one file per resource
      schemas/         TypeBox schemas for the routes, one file per resource
      services/        Business logic
      repositories/    Database access with Drizzle
      db/              Database client, schema, migrations runner, seed
      errors.ts        Error classes and the central error handler
  web/                 React 19 + Vite + React Router + TanStack Query
    src/
      api/             API client and TanStack Query hooks
      components/      Reusable components
      pages/           Route components
      lib/             Small helpers
packages/
  shared/              Types and constants shared by the API and the web app
```

## API at a glance

| Method | Path | |
| --- | --- | --- |
| GET | `/api/users` | List users |
| GET | `/api/projects` | List projects |
| GET | `/api/projects/:key` | Get a project |
| GET | `/api/projects/:key/issues` | List the issues of a project (`?status=`, `?assigneeId=`, `?labelId=`) |
| POST | `/api/projects/:key/issues` | Create an issue (needs `x-user-id`) |
| GET | `/api/issues/:identifier` | Get an issue, for example `WEB-12` |
| PATCH | `/api/issues/:identifier` | Update an issue |
| PUT | `/api/issues/:identifier/labels` | Replace the labels of an issue (`{ labelIds }`, at most 5) |
| GET | `/api/projects/:key/labels` | List the labels of a project |
| POST | `/api/projects/:key/labels` | Create a label (`{ name, color }`, color from the shared palette) |
| GET | `/api/issues/:identifier/comments` | List comments |
| POST | `/api/issues/:identifier/comments` | Add a comment (needs `x-user-id`) |

Errors always look like `{ "error": { "code": "NOT_FOUND", "message": "..." } }`. Timestamps are ISO 8601 strings in UTC.

## The harness, step by step

This branch adds the harness one layer per commit. Every commit has a tag, so you can jump to any step with `git checkout step-NN-name`, and every commit message explains why the layer exists.

| Step | Tag | What it adds | The agent mistake it prevents | Workshop idea |
| --- | --- | --- | --- | --- |
| 0 | `step-00-start` | The app, with no harness | | |
| 1 | `step-01-agents-md` | `AGENTS.md` with commands, a map and the conventions; `CLAUDE.md` imports it | Guessing commands, putting code in the wrong layer, inventing a new error format | Context engineering → AGENTS.md |
| 2 | `step-02-backend-rules` | `.claude/rules/backend.md`, loaded only when the agent works in `apps/api/` | A route with business logic, a service that queries the database, a schema that redeclares an enum | Context engineering → scoped rules |
| 3 | `step-03-frontend-rules` | `.claude/rules/frontend.md`, loaded only for `apps/web/` | `fetch` inside a component, inline query keys, files in the wrong folder, raw enum values in the UI | Context engineering → scoped rules |
| 4 | `step-04-skill` | `.claude/skills/add-api-endpoint/` with the steps and example files to copy | An endpoint that is half done: no shared type, no schema for errors, no hook in the web app, no docs | Context engineering → skills |
| 5 | `step-05-mcp` | `.mcp.json` with the Playwright MCP server, so the agent can open the app and look at the UI | Saying a UI change works without ever seeing it; asking a human for a screenshot | Context engineering → MCP |
| 6 | `step-06-bmad` | BMAD Method v6.12.4, installed by its own installer: `_bmad/` and the `bmad-*` skills | Jumping from a one-line request straight to code, with every open decision guessed | Spec-driven development → frameworks (BMAD) |
| 7 | `step-07-first-spec` | The first spec, made with BMAD: labels on issues. `SPEC.md`, the decision log, `stories.yaml` and two story specs. No code | Building a feature on guesses: shared or per-project labels? how many per issue? what happens on a duplicate name? | Spec-driven development → spec, plan, stories |
| 8 | `step-08-labels-feature` | The labels feature, built from the two stories: tables and migration, API, seed data, chips, picker and filter | Code that drifts from what was agreed: every case in the story's I/O matrix was checked against the running API | Spec-driven development → the spec becomes code |
| 9 | `step-09-unit-tests` | Vitest in every workspace: service tests on an in-memory database, route tests with `fastify.inject`, component tests with Testing Library. `npm test` | Saying "done" with nothing that proves it; breaking an old feature while building a new one | Verification → unit tests |
