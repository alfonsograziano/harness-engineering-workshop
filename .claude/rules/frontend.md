---
paths:
  - "apps/web/**"
---

# Frontend rules (apps/web)

These rules load only when you work on files in `apps/web/`.

## Data fetching: TanStack Query only

- Components never call `fetch` or `apiRequest` directly, and never keep server data in `useState` + `useEffect`.
- Every request goes through a hook in `src/api/<resource>.ts`: `use<Resource>()` / `use<Resources>()` for queries, `useCreate<Resource>()` / `useUpdate<Resource>()` for mutations.
- Hooks call `apiRequest<T>()` from `src/api/client.ts`. It adds `/api`, sends JSON and throws `ApiError` with the server's `code` and `message`.
- Query keys come from `queryKeys` in `src/api/query-keys.ts`. Never write a key array inline.
- After a mutation, update or invalidate the affected keys in `onSuccess`. Look at `useUpdateIssue()` for the pattern.
- Mutations that create something pass `userId: currentUser?.id` so the API gets the `x-user-id` header.
- Request and response types come from `@tasklane/shared`. Do not redeclare `Issue`, `User` or the others.

```ts
export function useComments(identifier: string) {
  return useQuery({
    queryKey: queryKeys.comments(identifier),
    queryFn: () => apiRequest<Comment[]>(`/issues/${identifier}/comments`),
  });
}
```

## Where files go and how they are named

| Folder | What goes there | File name |
| --- | --- | --- |
| `src/pages/` | Components rendered by a route in `src/router.tsx` | `<Name>Page.tsx` |
| `src/components/` | Reusable components, one per file | `PascalCase.tsx`, same name as the component |
| `src/api/` | The API client and query hooks, one file per resource | `kebab-case.ts` |
| `src/lib/` | Small helpers and React context that are not components | `kebab-case.ts(x)` |

- Use named exports (`export function IssueList`), not default exports.
- Props get an inline type or a `<Component>Props` interface in the same file.

## UI conventions

- Status changes go through `StatusSelect` (or `IssueStatusControl` when it should save right away). There is no drag and drop.
- Show the human labels from `src/lib/labels.ts`, never the raw enum value (`in_progress`).
- Dates from the API are UTC ISO strings. Format them with `formatRelative()` or `formatDate()` from `src/lib/dates.ts`, which show them in the viewer's time zone.
- Show errors with `<ErrorMessage error={...} />`. Show loading with the `muted` class.
- Styles live in `src/styles.css` with BEM-like class names (`issue-row__title`, `button--primary`). Use the CSS variables in `:root` for colors.
- Interactive elements need an accessible name (`aria-label` on selects and icon buttons).

## Tests

- Component tests sit next to the component: `Component.test.tsx`. Render with `renderWithProviders()` from `src/test/render.tsx`, which adds a QueryClient and a router.
- Mock the API with `mockApi({ 'GET /api/...': () => data })`. Do not mock the hooks: going through them is the point.
- Query by role and accessible name (`getByRole('checkbox', { name: /bug/ })`), not by class name.
- Build test data with `makeIssue()` so a new field on `Issue` is added in one place.
