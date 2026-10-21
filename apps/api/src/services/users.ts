import type { User } from '@tasklane/shared';
import { BadRequestError } from '../errors';
import type { UserRepository } from '../repositories/users';

export function createUserService(users: UserRepository) {
  return {
    async list(): Promise<User[]> {
      return users.list();
    },

    /** Throws a 400 when the id does not belong to a user. Used for the current user and for assignees. */
    async assertExists(userId: number): Promise<void> {
      const user = await users.findById(userId);
      if (!user) {
        throw new BadRequestError(`User ${userId} does not exist`);
      }
    },
  };
}

export type UserService = ReturnType<typeof createUserService>;
