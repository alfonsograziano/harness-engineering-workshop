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
import type { LabelRepository, LabelRow } from '../repositories/labels';
import type { ProjectRepository } from '../repositories/projects';
import { toLabel } from './labels';
import type { UserService } from './users';

function toIssue(record: IssueRecord, labels: LabelRow[]): Issue {
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
    labels: labels.map(toLabel),
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  };
}

interface IssueServiceDeps {
  issues: IssueRepository;
  labels: LabelRepository;
  projects: ProjectRepository;
  users: UserService;
}

export function createIssueService({ issues, labels, projects, users }: IssueServiceDeps) {
  /** Loads the labels of all the records in one query and builds the API objects. */
  async function withLabels(records: IssueRecord[]): Promise<Issue[]> {
    const rows = await labels.listForIssues(records.map((record) => record.issue.id));
    return records.map((record) =>
      toIssue(
        record,
        rows.filter((row) => row.issueId === record.issue.id).map((row) => row.label),
      ),
    );
  }

  async function withLabel(record: IssueRecord): Promise<Issue> {
    const rows = await labels.listForIssues([record.issue.id]);
    return toIssue(
      record,
      rows.map((row) => row.label),
    );
  }

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
    return withLabel(record);
  }

  return {
    findRecord,

    async listForProject(projectKey: string, filters: IssueFilters = {}): Promise<Issue[]> {
      const project = await findProject(projectKey);
      return withLabels(await issues.listByProject(project.id, filters));
    },

    async getByIdentifier(identifier: string): Promise<Issue> {
      return withLabel(await findRecord(identifier));
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
