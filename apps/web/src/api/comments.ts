import type { Comment, CreateCommentInput } from '@tasklane/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '../lib/current-user';
import { apiRequest } from './client';
import { queryKeys } from './query-keys';

export function useComments(identifier: string) {
  return useQuery({
    queryKey: queryKeys.comments(identifier),
    queryFn: () => apiRequest<Comment[]>(`/issues/${identifier}/comments`),
  });
}

export function useCreateComment(identifier: string) {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      apiRequest<Comment>(`/issues/${identifier}/comments`, {
        method: 'POST',
        body: input,
        userId: currentUser?.id,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.comments(identifier) }),
  });
}
