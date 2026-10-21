// packages/shared/src/api-types.ts — add next to the other API types.

export interface Milestone {
  id: number;
  projectKey: string;
  name: string;
  dueDate: IsoDateString | null;
  createdAt: IsoDateString;
}

export interface CreateMilestoneInput {
  name: string;
  dueDate?: IsoDateString | null;
}
