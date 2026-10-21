import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp } from '../test/test-app';

describe('comment routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('adds a comment as the current user and lists it', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/issues/WEB-1/comments',
      headers: { 'x-user-id': '1' },
      payload: { body: '  Looks good  ' },
    });

    expect(created.statusCode).toBe(201);
    expect(created.json()).toMatchObject({ body: 'Looks good', author: { name: 'Ada Lovelace' } });

    const list = await app.inject({ method: 'GET', url: '/api/issues/WEB-1/comments' });
    expect(list.json()).toEqual([created.json()]);
  });

  it('refuses a comment from a user that does not exist', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/issues/WEB-1/comments',
      headers: { 'x-user-id': '42' },
      payload: { body: 'Hello' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('answers 404 for comments on an unknown issue', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/issues/WEB-99/comments' });

    expect(response.statusCode).toBe(404);
  });
});
