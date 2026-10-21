import type { User } from '@tasklane/shared';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from './client';
import { queryKeys } from './query-keys';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiRequest<User[]>('/users'),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
