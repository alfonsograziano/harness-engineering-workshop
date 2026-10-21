---
title: 'Labels in the data model and the API'
type: 'feature'
created: '2026-10-21'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/specs/spec-issue-labels/SPEC.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Issues have no way to say what kind of work they are or which area they touch, so nobody can group or filter them beyond status and priority.

**Approach:** Add project-scoped labels and a many-to-many link to issues. Expose endpoints to list and create a project's labels, to replace an issue's labels, and to filter a project's issues by label. Include labels in every issue response.

## Boundaries & Constraints

**Always:** Labels belong to one project. Names are 1-30 characters after trimming, unique per project ignoring case. Colors are one of `LABEL_COLORS` from `@tasklane/shared`. At most `MAX_LABELS_PER_ISSUE` (5) labels per issue. Setting labels replaces the whole set. Issue responses carry `labels` sorted by name. Errors use the shared format through `AppError` subclasses.

**Never:** No endpoints to rename, recolor or delete labels. No labels shared across projects. No multi-label filter. Do not edit the existing migration; generate a new one.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| List labels | `GET /api/projects/WEB/labels` | 200, WEB labels sorted by name | 404 `NOT_FOUND` for an unknown project |
| Create label | `POST /api/projects/WEB/labels` `{ name: " bug ", color: "#eb5757" }` | 201, label with name `bug` | N/A |
| Duplicate name | `{ name: "Bug" }` when `bug` exists in WEB | No new label | 409 `CONFLICT` |
| Same name, other project | `{ name: "bug" }` in API when `bug` exists in WEB | 201 | N/A |
| Color outside palette | `{ color: "#123456" }` | No new label | 400 `VALIDATION_ERROR` |
| Set labels | `PUT /api/issues/WEB-3/labels` `{ labelIds: [2, 1] }` | 200, issue with both labels sorted by name | N/A |
| Clear labels | `{ labelIds: [] }` | 200, issue with `labels: []` | N/A |
| Label from another project | `{ labelIds: [<API label id>] }` on WEB-3 | Labels unchanged | 400 `BAD_REQUEST` |
| Too many labels | 6 label ids | Labels unchanged | 400 `VALIDATION_ERROR` |
| Duplicate ids | `{ labelIds: [1, 1] }` | 200, label 1 once | N/A |
| Filter issues | `GET /api/projects/WEB/issues?labelId=1` | 200, only issues that carry label 1 | N/A |

</frozen-after-approval>

## Code Map

- `packages/shared/src/api-types.ts` -- add `Label`, `CreateLabelInput`, `SetIssueLabelsInput`; add `labels: Label[]` to `Issue`
- `packages/shared/src/labels.ts` (new) -- `LABEL_COLORS` palette and `MAX_LABELS_PER_ISSUE`; export from `index.ts`
- `apps/api/src/db/schema.ts` -- `labels` and `issue_labels` tables; then `npm run db:generate`
- `apps/api/src/errors.ts` -- add `ConflictError` (409, `CONFLICT`)
- `apps/api/src/repositories/labels.ts` (new) -- list, find by name (case-insensitive), insert, labels for many issues, replace an issue's labels
- `apps/api/src/repositories/issues.ts` -- `labelId` filter on `listByProject`
- `apps/api/src/services/labels.ts` (new) -- project lookup, name and conflict rules, set issue labels
- `apps/api/src/services/issues.ts` -- attach labels to every issue it returns
- `apps/api/src/schemas/labels.ts` (new), `apps/api/src/schemas/issues.ts` -- label schemas, `labels` in `IssueSchema`, `labelId` in the list querystring
- `apps/api/src/routes/labels.ts` (new) -- the three label routes; register in `app.ts`
- `apps/api/src/db/seed.ts` -- a few labels per project, some issues labelled
- `README.md` -- API table

## Tasks & Acceptance

**Execution:**
- [ ] `packages/shared/src/labels.ts`, `api-types.ts` -- shared types and constants -- one source for both sides
- [ ] `apps/api/src/db/schema.ts` + generated migration -- tables with a unique index on `(project_id, lower(name))` and cascade deletes on the link table -- the database also guards the uniqueness rule
- [ ] `apps/api/src/errors.ts` -- `ConflictError` -- duplicate names are a 409, not a 400
- [ ] `apps/api/src/repositories/labels.ts` -- data access -- only layer touching Drizzle
- [ ] `apps/api/src/services/labels.ts`, `services/index.ts` -- rules from the matrix -- business logic stays out of routes
- [ ] `apps/api/src/services/issues.ts`, `repositories/issues.ts` -- labels on every issue, `labelId` filter -- CAP-3, CAP-4
- [ ] `apps/api/src/schemas/labels.ts`, `routes/labels.ts`, `app.ts` -- the endpoints -- CAP-1, CAP-2
- [ ] `apps/api/src/db/seed.ts` -- sample labels -- the UI story needs data
- [ ] `README.md` -- document the endpoints

**Acceptance Criteria:**
- Given a fresh `npm run db:seed`, when the server starts, then the new migration applies and every seeded issue response has a `labels` array.
- Given the seeded data, when `GET /api/projects/WEB/issues?labelId=<bug id>` is called, then every returned issue carries that label and no other issue does.

## Implementation Notes

- 2026-10-21: Implemented. New migration `0001_labels.sql`; the unique index is on `(project_id, lower(name))`.
- 2026-10-21: Deviation from the code map: `PUT /issues/:identifier/labels` and its schema live in `routes/issues.ts` and `schemas/issues.ts`, not in the label files. `IssueSchema` needs `LabelSchema`, so putting the PUT schema in `schemas/labels.ts` would create a circular import between the two schema files.
- 2026-10-21: Every row of the I/O matrix checked with curl against a freshly seeded database. There are no automated tests in the repo yet.

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npm run db:seed` -- expected: seeds labels without errors
- `curl -s localhost:3001/api/projects/WEB/labels` -- expected: a JSON array of labels sorted by name
