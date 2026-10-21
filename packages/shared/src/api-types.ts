import type { IssuePriority, IssueStatus } from './issues';
import type { LabelColor } from './labels';

/** Every timestamp in the API is an ISO 8601 string in UTC, for example `2026-11-07T09:00:00.000Z`. */
export type IsoDateString = string;

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Project {
  id: number;
  key: string;
  name: string;
  description: string;
  createdAt: IsoDateString;
}

export interface Label {
  id: number;
  name: string;
  color: LabelColor;
}

export interface Issue {
  id: number;
  identifier: string;
  projectKey: string;
  number: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: User | null;
  creator: User;
  /** Sorted by name. */
  labels: Label[];
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Comment {
  id: number;
  body: string;
  author: User;
  createdAt: IsoDateString;
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: number | null;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: number | null;
}

export interface CreateLabelInput {
  name: string;
  color: LabelColor;
}

export interface SetIssueLabelsInput {
  /** The full set of labels the issue should have. Labels not in the list are removed. */
  labelIds: number[];
}

export interface CreateCommentInput {
  body: string;
}

/** The body of every error response sent by the API. */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
