import type { CreateLabelInput, Issue, Label, SetIssueLabelsInput } from '@tasklane/shared';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { nowIso } from '../lib/time';
import type { LabelRepository, LabelRow } from '../repositories/labels';
import type { ProjectRepository } from '../repositories/projects';
import type { IssueService } from './issues';

export function toLabel(row: LabelRow): Label {
  return { id: row.id, name: row.name, color: row.color };
}

interface LabelServiceDeps {
  labels: LabelRepository;
  projects: ProjectRepository;
  issues: IssueService;
}

export function createLabelService({ labels, projects, issues }: LabelServiceDeps) {
  async function findProject(projectKey: string) {
    const project = await projects.findByKey(projectKey);
    if (!project) {
      throw new NotFoundError('Project', projectKey);
    }
    return project;
  }

  return {
    async listForProject(projectKey: string): Promise<Label[]> {
      const project = await findProject(projectKey);
      const rows = await labels.listByProject(project.id);
      return rows.map(toLabel);
    },

    async create(projectKey: string, input: CreateLabelInput): Promise<Label> {
      const project = await findProject(projectKey);
      const name = input.name.trim();
      if (name.length === 0) {
        throw new BadRequestError('Label name cannot be empty');
      }
      if (await labels.findByProjectAndName(project.id, name)) {
        throw new ConflictError(`Project ${project.key} already has a label named "${name}"`);
      }

      const id = await labels.insert({ projectId: project.id, name, color: input.color, createdAt: nowIso() });
      const row = await labels.findById(id);
      if (!row) {
        throw new NotFoundError('Label', id);
      }
      return toLabel(row);
    },

    /** Replaces every label on the issue. Labels must belong to the issue's project. */
    async setIssueLabels(identifier: string, input: SetIssueLabelsInput): Promise<Issue> {
      const { issue, projectKey } = await issues.findRecord(identifier);
      const labelIds = [...new Set(input.labelIds)];

      const found = await labels.findByIds(labelIds);
      for (const labelId of labelIds) {
        const label = found.find((row) => row.id === labelId);
        if (!label || label.projectId !== issue.projectId) {
          throw new BadRequestError(`Label ${labelId} does not belong to project ${projectKey}`);
        }
      }

      await labels.replaceIssueLabels(issue.id, labelIds);
      return issues.getByIdentifier(identifier);
    },
  };
}

export type LabelService = ReturnType<typeof createLabelService>;
