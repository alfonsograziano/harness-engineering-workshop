/** Every TanStack Query key in the app. Keep them here so invalidation stays consistent. */
export const queryKeys = {
  users: ['users'] as const,
  projects: ['projects'] as const,
  project: (projectKey: string) => ['projects', projectKey] as const,
  /** All issue lists of a project, whatever the filter. Use it to invalidate. */
  projectIssues: (projectKey: string) => ['projects', projectKey, 'issues'] as const,
  filteredProjectIssues: (projectKey: string, filters: { labelId?: number }) =>
    ['projects', projectKey, 'issues', filters] as const,
  labels: (projectKey: string) => ['projects', projectKey, 'labels'] as const,
  issue: (identifier: string) => ['issues', identifier] as const,
  comments: (identifier: string) => ['issues', identifier, 'comments'] as const,
};
