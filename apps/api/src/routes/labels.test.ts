import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp } from '../test/test-app';

// Mirrors the I/O matrix in _bmad-output/specs/spec-issue-labels/stories/1-labels-api.md
describe('label routes', () => {
  let app: FastifyInstance;

  async function createLabel(projectKey: string, name: string, color = '#eb5757') {
    return app.inject({ method: 'POST', url: `/api/projects/${projectKey}/labels`, payload: { name, color } });
  }

  async function setLabels(identifier: string, labelIds: number[]) {
    return app.inject({ method: 'PUT', url: `/api/issues/${identifier}/labels`, payload: { labelIds } });
  }

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates and lists labels', async () => {
    const created = await createLabel('WEB', ' bug ');
    expect(created.statusCode).toBe(201);
    expect(created.json()).toMatchObject({ name: 'bug', color: '#eb5757' });

    const list = await app.inject({ method: 'GET', url: '/api/projects/WEB/labels' });
    expect(list.json()).toEqual([created.json()]);
  });

  it('answers 404 for an unknown project', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/projects/NOPE/labels' });

    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
  });

  it('answers 409 CONFLICT for a duplicate name', async () => {
    await createLabel('WEB', 'bug');

    const response = await createLabel('WEB', 'Bug');

    expect(response.statusCode).toBe(409);
    expect(response.json().error.code).toBe('CONFLICT');
  });

  it('answers 400 for a color outside the palette', async () => {
    const response = await createLabel('WEB', 'bug', '#123456');

    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('VALIDATION_ERROR');
  });

  it('replaces the labels of an issue', async () => {
    const bug = (await createLabel('WEB', 'bug')).json();
    const feature = (await createLabel('WEB', 'feature', '#5e6ad2')).json();

    const response = await setLabels('WEB-1', [feature.id, bug.id]);

    expect(response.statusCode).toBe(200);
    expect(response.json().labels.map((label: { name: string }) => label.name)).toEqual(['bug', 'feature']);
    expect((await setLabels('WEB-1', [])).json().labels).toEqual([]);
  });

  it('answers 400 for a label from another project', async () => {
    const apiLabel = (await createLabel('API', 'bug')).json();

    const response = await setLabels('WEB-1', [apiLabel.id]);

    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('BAD_REQUEST');
  });

  it('answers 400 for more than five labels', async () => {
    const response = await setLabels('WEB-1', [1, 2, 3, 4, 5, 6]);

    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('VALIDATION_ERROR');
  });

  it('filters the issue list by label', async () => {
    const bug = (await createLabel('WEB', 'bug')).json();
    await app.inject({
      method: 'POST',
      url: '/api/projects/WEB/issues',
      headers: { 'x-user-id': '1' },
      payload: { title: 'Without labels' },
    });
    await setLabels('WEB-1', [bug.id]);

    const response = await app.inject({ method: 'GET', url: `/api/projects/WEB/issues?labelId=${bug.id}` });

    expect(response.json().map((issue: { identifier: string }) => issue.identifier)).toEqual(['WEB-1']);
  });
});
