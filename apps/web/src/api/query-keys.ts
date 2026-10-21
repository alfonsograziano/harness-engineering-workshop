/** Every TanStack Query key in the app. Keep them here so invalidation stays consistent. */
export const queryKeys = {
  users: ['users'] as const,
  projects: ['projects'] as const,
  project: (projectKey: string) => ['projects', projectKey] as const,
  projectIssues: (projectKey: string) => ['projects', projectKey, 'issues'] as const,
  issue: (identifier: string) => ['issues', identifier] as const,
  comments: (identifier: string) => ['issues', identifier, 'comments'] as const,
};
