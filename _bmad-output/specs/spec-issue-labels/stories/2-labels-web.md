---
title: 'Labels in the web app'
type: 'feature'
created: '2026-10-21'
status: 'ready-for-dev'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/specs/spec-issue-labels/SPEC.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The API knows about labels, but people cannot see, set or filter by them in the app.

**Approach:** Show labels as colored chips in the list and on the board, add a label picker to the issue panel (with a way to create a new label), and add a single-label filter to the project header that works in both views.

## Boundaries & Constraints

**Always:** Data goes through TanStack Query hooks in `src/api/labels.ts`. The filter lives in the URL (`?label=<id>`) next to `?view=board`, so it survives a reload and can be shared. The picker sends the whole set of label ids. Colors come from `LABEL_COLORS`.

**Never:** No drag and drop. No multi-label filter. No UI to rename, recolor or delete labels. No label management page.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Chips | Issue with labels `bug`, `design` | Two chips, sorted by name, in list row and board card | N/A |
| Toggle a label | Click `bug` in the picker | Issue updates; list and board show the change without a reload | Picker shows the API error message |
| Sixth label | Issue has 5 labels | Unchecked labels are disabled | N/A |
| Create label | Type `security`, pick a color, confirm | Label is created and added to the issue | Duplicate name shows the 409 message |
| Filter | Pick `bug` in the header filter | URL gets `?label=<id>`; both views show only `bug` issues | N/A |
| Clear filter | Pick "All labels" | `label` param removed; all issues back | N/A |

</frozen-after-approval>

## Code Map

- `apps/web/src/api/labels.ts` (new) -- `useLabels`, `useCreateLabel`, `useSetIssueLabels`
- `apps/web/src/api/query-keys.ts` -- `labels(projectKey)`; issue list key takes the label filter
- `apps/web/src/api/issues.ts` -- `useIssues(projectKey, { labelId })`
- `apps/web/src/components/LabelChip.tsx` (new) -- one chip
- `apps/web/src/components/LabelPicker.tsx` (new) -- checkbox list plus "new label" form, used in `IssueDetail.tsx`
- `apps/web/src/components/LabelFilter.tsx` (new) -- select in the project header
- `apps/web/src/components/IssueList.tsx`, `IssueBoard.tsx` -- render chips
- `apps/web/src/pages/ProjectPage.tsx` -- read and write `?label=`
- `apps/web/src/styles.css` -- chip, picker and filter styles

## Tasks & Acceptance

**Execution:**
- [ ] `apps/web/src/api/labels.ts`, `query-keys.ts`, `issues.ts` -- hooks and keys -- invalidate issue lists and the issue after a label change
- [ ] `apps/web/src/components/LabelChip.tsx` -- chip with color dot and name
- [ ] `apps/web/src/components/IssueList.tsx`, `IssueBoard.tsx` -- chips -- CAP-3
- [ ] `apps/web/src/components/LabelPicker.tsx`, `IssueDetail.tsx` -- picker and create form -- CAP-1, CAP-2
- [ ] `apps/web/src/components/LabelFilter.tsx`, `pages/ProjectPage.tsx` -- filter in the URL -- CAP-4
- [ ] `apps/web/src/styles.css` -- styles with the existing CSS variables

**Acceptance Criteria:**
- Given the board filtered by `bug`, when a `bug` label is removed from an issue in the panel, then that card leaves the board without a reload.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Manual checks (if no CLI):**
- With the Playwright MCP: open WEB, filter by `bug`, switch between list and board, open an issue, toggle a label, create a new one.
