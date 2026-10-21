// apps/web/src/api/milestones.ts
// First add the key to apps/web/src/api/query-keys.ts:
//   milestones: (projectKey: string) => ['projects', projectKey, 'milestones'] as const,

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateMilestoneInput, Milestone } from '@tasklane/shared';
import { apiRequest } from './client';
import { queryKeys } from './query-keys';

export function useMilestones(projectKey: string) {
  return useQuery({
    queryKey: queryKeys.milestones(projectKey),
    queryFn: () => apiRequest<Milestone[]>(`/projects/${projectKey}/milestones`),
  });
}

export function useCreateMilestone(projectKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMilestoneInput) =>
      apiRequest<Milestone>(`/projects/${projectKey}/milestones`, { method: 'POST', body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.milestones(projectKey) }),
  });
}
