import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateIssueInput, Issue, UpdateIssueInput } from '@tasklane/shared';
import { useCurrentUser } from '../lib/current-user';
import { apiRequest } from './client';
import { queryKeys } from './query-keys';

export function useIssues(projectKey: string, filters: { labelId?: number } = {}) {
  const search = filters.labelId ? `?labelId=${filters.labelId}` : '';
  return useQuery({
    queryKey: queryKeys.filteredProjectIssues(projectKey, filters),
    queryFn: () => apiRequest<Issue[]>(`/projects/${projectKey}/issues${search}`),
  });
}

export function useIssue(identifier: string) {
  return useQuery({
    queryKey: queryKeys.issue(identifier),
    queryFn: () => apiRequest<Issue>(`/issues/${identifier}`),
  });
}

export function useCreateIssue(projectKey: string) {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: (input: CreateIssueInput) =>
      apiRequest<Issue>(`/projects/${projectKey}/issues`, {
        method: 'POST',
        body: input,
        userId: currentUser?.id,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projectIssues(projectKey) }),
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ identifier, input }: { identifier: string; input: UpdateIssueInput }) =>
      apiRequest<Issue>(`/issues/${identifier}`, { method: 'PATCH', body: input }),
    onSuccess: (issue) => {
      queryClient.setQueryData(queryKeys.issue(issue.identifier), issue);
      return queryClient.invalidateQueries({ queryKey: queryKeys.projectIssues(issue.projectKey) });
    },
  });
}
