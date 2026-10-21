import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateLabelInput, Issue, Label, SetIssueLabelsInput } from '@tasklane/shared';
import { apiRequest } from './client';
import { queryKeys } from './query-keys';

export function useLabels(projectKey: string) {
  return useQuery({
    queryKey: queryKeys.labels(projectKey),
    queryFn: () => apiRequest<Label[]>(`/projects/${projectKey}/labels`),
  });
}

export function useCreateLabel(projectKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLabelInput) =>
      apiRequest<Label>(`/projects/${projectKey}/labels`, { method: 'POST', body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.labels(projectKey) }),
  });
}

export function useSetIssueLabels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ identifier, input }: { identifier: string; input: SetIssueLabelsInput }) =>
      apiRequest<Issue>(`/issues/${identifier}/labels`, { method: 'PUT', body: input }),
    onSuccess: (issue) => {
      queryClient.setQueryData(queryKeys.issue(issue.identifier), issue);
      return queryClient.invalidateQueries({ queryKey: queryKeys.projectIssues(issue.projectKey) });
    },
  });
}
