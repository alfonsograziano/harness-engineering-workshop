import type { FastifyRequest } from 'fastify';
import { BadRequestError } from '../errors';

/**
 * There is no login in Tasklane. The web app sends the id of the user picked in the user menu
 * in the `x-user-id` header, and the API trusts it.
 */
export function getCurrentUserId(request: FastifyRequest): number {
  const header = request.headers['x-user-id'];
  const userId = Number(Array.isArray(header) ? header[0] : header);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new BadRequestError('Send the current user id in the x-user-id header');
  }
  return userId;
}
