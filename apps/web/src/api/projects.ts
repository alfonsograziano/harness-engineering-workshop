import { useQuery } from '@tanstack/react-query';
import type { Project } from '@tasklane/shared';
import { apiRequest } from './client';
import { queryKeys } from './query-keys';

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => apiRequest<Project[]>('/projects'),
  });
}

export function useProject(projectKey: string) {
  return useQuery({
    queryKey: queryKeys.project(projectKey),
    queryFn: () => apiRequest<Project>(`/projects/${projectKey}`),
  });
}
