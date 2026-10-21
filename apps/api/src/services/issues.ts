import {
  type CreateIssueInput,
  formatIssueIdentifier,
  type Issue,
  parseIssueIdentifier,
  type UpdateIssueInput,
} from '@tasklane/shared';
import { NotFoundError } from '../errors';
import { nowIso } from '../lib/time';
import type { IssueFilters, IssueRecord, IssueRepository } from '../repositories/issues';
import type { ProjectRepository } from '../repositories/projects';
import type { UserService } from './users';

function toIssue(record: IssueRecord): Issue {
  const { issue } = record;
  return {
    id: issue.id,
    identifier: formatIssueIdentifier(record.projectKey, issue.number),
    projectKey: record.projectKey,
    number: issue.number,
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    assignee: record.assignee,
    creator: record.creator,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  };
}

interface IssueServiceDeps {
  issues: IssueRepository;
  projects: ProjectRepository;
  users: UserService;
}

export function createIssueService({ issues, projects, users }: IssueServiceDeps) {
  async function findProject(projectKey: string) {
    const project = await projects.findByKey(projectKey);
    if (!project) {
      throw new NotFoundError('Project', projectKey);
    }
    return project;
  }

  async function findRecord(identifier: string): Promise<IssueRecord> {
    const parsed = parseIssueIdentifier(identifier);
    const project = parsed ? await projects.findByKey(parsed.projectKey) : null;
    const record = parsed && project ? await issues.findByProjectAndNumber(project.id, parsed.number) : null;
    if (!record) {
      throw new NotFoundError('Issue', identifier);
    }
    return record;
  }

  async function getById(id: number): Promise<Issue> {
    const record = await issues.findById(id);
    if (!record) {
      throw new NotFoundError('Issue', id);
    }
    return toIssue(record);
  }

  return {
    findRecord,

    async listForProject(projectKey: string, filters: IssueFilters = {}): Promise<Issue[]> {
      const project = await findProject(projectKey);
      const records = await issues.listByProject(project.id, filters);
      return records.map(toIssue);
    },

    async getByIdentifier(identifier: string): Promise<Issue> {
      return toIssue(await findRecord(identifier));
    },

    async create(projectKey: string, input: CreateIssueInput, creatorId: number): Promise<Issue> {
      const project = await findProject(projectKey);
      await users.assertExists(creatorId);
      if (input.assigneeId) {
        await users.assertExists(input.assigneeId);
      }

      const now = nowIso();
      const id = await issues.insert({
        projectId: project.id,
        number: await projects.reserveIssueNumber(project.id),
        title: input.title.trim(),
        description: input.description ?? '',
        status: input.status ?? 'backlog',
        priority: input.priority ?? 'none',
        assigneeId: input.assigneeId ?? null,
        creatorId,
        createdAt: now,
        updatedAt: now,
      });
      return getById(id);
    },

    async update(identifier: string, input: UpdateIssueInput): Promise<Issue> {
      const record = await findRecord(identifier);
      if (input.assigneeId) {
        await users.assertExists(input.assigneeId);
      }

      await issues.update(record.issue.id, {
        ...input,
        ...(input.title === undefined ? {} : { title: input.title.trim() }),
        updatedAt: nowIso(),
      });
      return getById(record.issue.id);
    },
  };
}

export type IssueService = ReturnType<typeof createIssueService>;
