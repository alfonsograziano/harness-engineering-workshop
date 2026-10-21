---
id: SPEC-issue-labels
companions: []
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Labels on issues

## Why

A pain to solve. Teams on Tasklane can sort issues by status and priority, but not by kind or area: a bug and a feature in "Todo" look the same, and there is no way to see every performance issue at once. People work around it with prefixes in titles ("[bug] ..."), which nobody can filter. Labels give each project a small, shared vocabulary for tagging issues and finding them again.

## Capabilities

- **CAP-1**
  - **intent:** A person can create a label in a project, with a name and a color from a fixed palette.
  - **success:** After creating "bug" in WEB, it is listed for WEB and not for API; creating "Bug" in WEB again is rejected.
- **CAP-2**
  - **intent:** A person can add labels to an issue and remove them, from the issue panel.
  - **success:** Setting labels on WEB-3 and reloading the page shows the same labels; removing one makes it disappear everywhere.
- **CAP-3**
  - **intent:** Labels are visible on every issue in the list view and on the board cards.
  - **success:** An issue with two labels shows two colored chips with their names in both views.
- **CAP-4**
  - **intent:** A person can filter a project's issues by one label, in both views.
  - **success:** With the "bug" filter on, the list and the board show exactly the issues that carry "bug", and the filter survives a page reload.

## Constraints

- Labels belong to one project. A label from another project can never be put on an issue (the API answers 400).
- Label names are 1-30 characters and unique per project, ignoring case.
- Colors come from a fixed palette of 8, defined once in `@tasklane/shared`.
- An issue carries at most 5 labels. A 6th is rejected with a 400.
- Setting the labels of an issue replaces the whole set in one request.
- Every issue response includes its labels, sorted by name, so the web app never makes a second request per issue.
- The existing conventions in AGENTS.md apply: layers, the shared error format, UTC ISO dates, shared types.

## Non-goals

- Renaming, recoloring or deleting labels.
- Labels shared across projects, label groups, label descriptions.
- Filtering by more than one label at a time.

## Success signal

- On the seeded WEB project: create a "bug" label, put it on two issues, switch the board filter to "bug", and see exactly those two issues, with the chip on each card.
