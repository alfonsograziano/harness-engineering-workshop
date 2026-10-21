import type { Project } from '@tasklane/shared';
import { NotFoundError } from '../errors';
import type { ProjectRepository } from '../repositories/projects';

type ProjectRow = NonNullable<Awaited<ReturnType<ProjectRepository['findByKey']>>>;

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    description: row.description,
    createdAt: row.createdAt,
  };
}

export function createProjectService(projects: ProjectRepository) {
  return {
    async list(): Promise<Project[]> {
      const rows = await projects.list();
      return rows.map(toProject);
    },

    async getByKey(key: string): Promise<Project> {
      const row = await projects.findByKey(key);
      if (!row) {
        throw new NotFoundError('Project', key);
      }
      return toProject(row);
    },
  };
}

export type ProjectService = ReturnType<typeof createProjectService>;
