// apps/api/src/services/milestones.ts
// Then wire it in apps/api/src/services/index.ts:
//   const milestones = createMilestoneService({ milestones: createMilestoneRepository(db), projects: projectRepository });

import type { CreateMilestoneInput, Milestone } from '@tasklane/shared';
import { NotFoundError } from '../errors';
import { nowIso } from '../lib/time';
import type { MilestoneRepository, MilestoneRow } from '../repositories/milestones';
import type { ProjectRepository } from '../repositories/projects';

function toMilestone(row: MilestoneRow, projectKey: string): Milestone {
  return {
    id: row.id,
    projectKey,
    name: row.name,
    dueDate: row.dueDate,
    createdAt: row.createdAt,
  };
}

interface MilestoneServiceDeps {
  milestones: MilestoneRepository;
  projects: ProjectRepository;
}

export function createMilestoneService({ milestones, projects }: MilestoneServiceDeps) {
  async function findProject(projectKey: string) {
    const project = await projects.findByKey(projectKey);
    if (!project) {
      throw new NotFoundError('Project', projectKey);
    }
    return project;
  }

  return {
    async listForProject(projectKey: string): Promise<Milestone[]> {
      const project = await findProject(projectKey);
      const rows = await milestones.listByProject(project.id);
      return rows.map((row) => toMilestone(row, project.key));
    },

    async create(projectKey: string, input: CreateMilestoneInput): Promise<Milestone> {
      const project = await findProject(projectKey);
      const id = await milestones.insert({
        projectId: project.id,
        name: input.name.trim(),
        dueDate: input.dueDate ?? null,
        createdAt: nowIso(),
      });
      const row = await milestones.findById(id);
      if (!row) {
        throw new NotFoundError('Milestone', id);
      }
      return toMilestone(row, project.key);
    },
  };
}

export type MilestoneService = ReturnType<typeof createMilestoneService>;
