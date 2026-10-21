import { beforeEach, describe, expect, it } from 'vitest';
import { createTestServices } from '../test/test-app';

describe('issue service', () => {
  let services: Awaited<ReturnType<typeof createTestServices>>;

  beforeEach(async () => {
    services = await createTestServices();
  });

  it('gives new issues the next number in their project', async () => {
    const second = await services.issues.create('WEB', { title: 'Second' }, 1);
    const third = await services.issues.create('WEB', { title: 'Third' }, 2);
    const firstInApi = await services.issues.create('API', { title: 'Other project' }, 1);

    expect(second.identifier).toBe('WEB-2');
    expect(third.identifier).toBe('WEB-3');
    expect(firstInApi.identifier).toBe('API-1');
  });

  it('fills defaults, trims the title and records the creator', async () => {
    const issue = await services.issues.create('WEB', { title: '  Fix login  ' }, 2);

    expect(issue).toMatchObject({
      title: 'Fix login',
      description: '',
      status: 'backlog',
      priority: 'none',
      assignee: null,
      creator: { id: 2, name: 'Alan Turing' },
      labels: [],
    });
  });

  it('stores timestamps as ISO 8601 strings in UTC', async () => {
    const issue = await services.issues.create('WEB', { title: 'Dates' }, 1);

    expect(issue.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(issue.updatedAt).toBe(issue.createdAt);
  });

  it('updates fields and bumps updatedAt', async () => {
    const updated = await services.issues.update('WEB-1', { status: 'done', assigneeId: 2 });

    expect(updated.status).toBe('done');
    expect(updated.assignee?.name).toBe('Alan Turing');
    expect(updated.updatedAt > updated.createdAt).toBe(true);
  });

  it('can unassign an issue', async () => {
    await services.issues.update('WEB-1', { assigneeId: 2 });
    const updated = await services.issues.update('WEB-1', { assigneeId: null });

    expect(updated.assignee).toBeNull();
  });

  it('rejects an assignee that does not exist', async () => {
    await expect(services.issues.update('WEB-1', { assigneeId: 99 })).rejects.toMatchObject({
      statusCode: 400,
      code: 'BAD_REQUEST',
    });
  });

  it('throws NOT_FOUND for unknown issues and projects', async () => {
    await expect(services.issues.getByIdentifier('WEB-99')).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(services.issues.getByIdentifier('NOPE-1')).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(services.issues.listForProject('NOPE')).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('filters the issues of a project by status', async () => {
    await services.issues.create('WEB', { title: 'In backlog' }, 1);

    const todo = await services.issues.listForProject('WEB', { status: 'todo' });

    expect(todo.map((issue) => issue.identifier)).toEqual(['WEB-1']);
  });
});
