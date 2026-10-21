import type { Database } from '../db/client';
import { createCommentRepository } from '../repositories/comments';
import { createIssueRepository } from '../repositories/issues';
import { createProjectRepository } from '../repositories/projects';
import { createUserRepository } from '../repositories/users';
import { createCommentService } from './comments';
import { createIssueService } from './issues';
import { createProjectService } from './projects';
import { createUserService } from './users';

/** Wires repositories into services. This is the only place that hands the database to the repositories. */
export function createServices(db: Database) {
  const projectRepository = createProjectRepository(db);

  const users = createUserService(createUserRepository(db));
  const projects = createProjectService(projectRepository);
  const issues = createIssueService({ issues: createIssueRepository(db), projects: projectRepository, users });
  const comments = createCommentService({ comments: createCommentRepository(db), issues, users });

  return { users, projects, issues, comments };
}

export type Services = ReturnType<typeof createServices>;
