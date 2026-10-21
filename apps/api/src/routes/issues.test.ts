import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp } from '../test/test-app';

describe('issue routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('lists the issues of a project', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/projects/WEB/issues' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([expect.objectContaining({ identifier: 'WEB-1', labels: [] })]);
  });

  it('creates an issue for the user in the x-user-id header', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/projects/WEB/issues',
      headers: { 'x-user-id': '2' },
      payload: { title: 'New issue', priority: 'high' },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      identifier: 'WEB-2',
      priority: 'high',
      creator: { name: 'Alan Turing' },
    });
  });

  it('answers 400 in the shared error format when x-user-id is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/projects/WEB/issues',
      payload: { title: 'New issue' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: { code: 'BAD_REQUEST', message: 'Send the current user id in the x-user-id header' },
    });
  });

  it('answers 400 VALIDATION_ERROR for a body that breaks the schema', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/issues/WEB-1',
      payload: { status: 'almost-done' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('VALIDATION_ERROR');
    expect(response.json().error.details).toBeInstanceOf(Array);
  });

  it('drops fields that are not in the schema, so a client cannot change the creator', async () => {
    // additionalProperties: false + Fastify's default Ajv option removeAdditional: the field is removed, not rejected.
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/issues/WEB-1',
      payload: { title: 'Renamed', creatorId: 2 },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ title: 'Renamed', creator: { id: 1 } });
  });

  it('answers 404 NOT_FOUND for an unknown issue', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/issues/WEB-99' });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: { code: 'NOT_FOUND', message: 'Issue WEB-99 was not found' } });
  });

  it('answers 404 ROUTE_NOT_FOUND for an unknown route', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/nope' });

    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('ROUTE_NOT_FOUND');
  });

  it('updates an issue', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/issues/WEB-1',
      payload: { status: 'in_progress' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().status).toBe('in_progress');
  });
});
