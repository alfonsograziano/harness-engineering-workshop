import { beforeEach, describe, expect, it } from 'vitest';
import { createTestServices } from '../test/test-app';

describe('label service', () => {
  let services: Awaited<ReturnType<typeof createTestServices>>;

  beforeEach(async () => {
    services = await createTestServices();
  });

  it('creates a label with a trimmed name', async () => {
    const label = await services.labels.create('WEB', { name: '  bug ', color: '#eb5757' });

    expect(label).toMatchObject({ name: 'bug', color: '#eb5757' });
    expect(await services.labels.listForProject('WEB')).toEqual([label]);
    expect(await services.labels.listForProject('API')).toEqual([]);
  });

  it('refuses a duplicate name in the same project, ignoring case', async () => {
    await services.labels.create('WEB', { name: 'bug', color: '#eb5757' });

    await expect(services.labels.create('WEB', { name: 'Bug', color: '#5e6ad2' })).rejects.toMatchObject({
      statusCode: 409,
      code: 'CONFLICT',
    });
  });

  it('allows the same name in another project', async () => {
    await services.labels.create('WEB', { name: 'bug', color: '#eb5757' });

    await expect(services.labels.create('API', { name: 'bug', color: '#eb5757' })).resolves.toMatchObject({
      name: 'bug',
    });
  });

  it('refuses a name that is only spaces', async () => {
    await expect(services.labels.create('WEB', { name: '   ', color: '#eb5757' })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    });
  });

  it('sorts labels by name, ignoring case', async () => {
    await services.labels.create('WEB', { name: 'feature', color: '#5e6ad2' });
    await services.labels.create('WEB', { name: 'Bug', color: '#eb5757' });
    await services.labels.create('WEB', { name: 'design', color: '#bb87fc' });

    const names = (await services.labels.listForProject('WEB')).map((label) => label.name);

    expect(names).toEqual(['Bug', 'design', 'feature']);
  });

  describe('setIssueLabels', () => {
    it('replaces the labels of an issue and returns them sorted by name', async () => {
      const feature = await services.labels.create('WEB', { name: 'feature', color: '#5e6ad2' });
      const bug = await services.labels.create('WEB', { name: 'bug', color: '#eb5757' });

      const issue = await services.labels.setIssueLabels('WEB-1', { labelIds: [feature.id, bug.id] });
      expect(issue.labels.map((label) => label.name)).toEqual(['bug', 'feature']);

      const cleared = await services.labels.setIssueLabels('WEB-1', { labelIds: [bug.id] });
      expect(cleared.labels.map((label) => label.name)).toEqual(['bug']);
    });

    it('ignores duplicate ids', async () => {
      const bug = await services.labels.create('WEB', { name: 'bug', color: '#eb5757' });

      const issue = await services.labels.setIssueLabels('WEB-1', { labelIds: [bug.id, bug.id] });

      expect(issue.labels).toHaveLength(1);
    });

    it('refuses a label from another project and leaves the issue unchanged', async () => {
      const webLabel = await services.labels.create('WEB', { name: 'bug', color: '#eb5757' });
      const apiLabel = await services.labels.create('API', { name: 'bug', color: '#eb5757' });
      await services.labels.setIssueLabels('WEB-1', { labelIds: [webLabel.id] });

      await expect(services.labels.setIssueLabels('WEB-1', { labelIds: [apiLabel.id] })).rejects.toMatchObject({
        code: 'BAD_REQUEST',
      });
      const issue = await services.issues.getByIdentifier('WEB-1');
      expect(issue.labels.map((label) => label.id)).toEqual([webLabel.id]);
    });

    it('refuses a label that does not exist', async () => {
      await expect(services.labels.setIssueLabels('WEB-1', { labelIds: [999] })).rejects.toMatchObject({
        code: 'BAD_REQUEST',
      });
    });

    it('lets the issue list filter by label', async () => {
      const bug = await services.labels.create('WEB', { name: 'bug', color: '#eb5757' });
      await services.issues.create('WEB', { title: 'No labels' }, 1);
      await services.labels.setIssueLabels('WEB-1', { labelIds: [bug.id] });

      const filtered = await services.issues.listForProject('WEB', { labelId: bug.id });

      expect(filtered.map((issue) => issue.identifier)).toEqual(['WEB-1']);
    });
  });
});
