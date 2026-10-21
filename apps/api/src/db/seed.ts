import fs from 'node:fs';
import type { IssuePriority, IssueStatus } from '@tasklane/shared';
import { config } from '../config';
import { toIso } from '../lib/time';
import { createDatabase } from './client';
import { runMigrations } from './migrate';
import { comments, issues, projects, users } from './schema';

// Resets the local database and fills it with realistic data, so the app looks alive on first run.

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const daysAgo = (days: number, hours = 0) => toIso(now - days * DAY - hours * 60 * 60 * 1000);

const seedUsers = [
  { name: 'Giulia Romano', email: 'giulia@tasklane.dev' },
  { name: 'Marco Esposito', email: 'marco@tasklane.dev' },
  { name: 'Sara Conti', email: 'sara@tasklane.dev' },
  { name: 'Luca Ferrari', email: 'luca@tasklane.dev' },
  { name: 'Elena Ricci', email: 'elena@tasklane.dev' },
];

const seedProjects = [
  { key: 'WEB', name: 'Web App', description: 'The customer facing web application.' },
  { key: 'API', name: 'Platform API', description: 'Public and internal HTTP APIs.' },
  { key: 'MOB', name: 'Mobile', description: 'iOS and Android apps.' },
];

interface SeedIssue {
  project: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: number;
  creator: number;
  age: number;
  comments?: { author: number; body: string }[];
}

const seedIssues: SeedIssue[] = [
  {
    project: 'WEB',
    title: 'Checkout button does nothing on Safari 17',
    description:
      'Clicking "Pay now" on Safari 17 does not submit the form. No errors in the console. Works in Chrome and Firefox.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: 1,
    creator: 3,
    age: 2,
    comments: [
      { author: 3, body: 'Reproduced on two different Macs. Support has 14 tickets about this since Monday.' },
      { author: 1, body: 'Looks like the form uses `requestSubmit`, which our polyfill breaks. Working on it.' },
    ],
  },
  {
    project: 'WEB',
    title: 'Add dark mode',
    description: 'Follow the system preference by default and let people override it from the settings page.',
    status: 'todo',
    priority: 'medium',
    assignee: 2,
    creator: 5,
    age: 12,
    comments: [{ author: 5, body: 'Design tokens for the dark palette are ready in Figma.' }],
  },
  {
    project: 'WEB',
    title: 'Search results page is slow with more than 500 results',
    description: 'Rendering takes 3-4 seconds. We should paginate or virtualise the list.',
    status: 'backlog',
    priority: 'high',
    creator: 4,
    age: 20,
  },
  {
    project: 'WEB',
    title: 'Update the onboarding copy',
    status: 'done',
    priority: 'low',
    assignee: 5,
    creator: 5,
    age: 25,
  },
  {
    project: 'WEB',
    title: 'Broken link in the footer',
    description: 'The "Careers" link points to the old domain.',
    status: 'done',
    priority: 'low',
    assignee: 2,
    creator: 1,
    age: 18,
  },
  {
    project: 'WEB',
    title: 'Show a toast when settings are saved',
    status: 'todo',
    priority: 'low',
    assignee: 5,
    creator: 2,
    age: 6,
  },
  {
    project: 'WEB',
    title: 'Keyboard shortcuts for the issue list',
    description: '`j` and `k` to move, `enter` to open, `c` to create.',
    status: 'backlog',
    priority: 'none',
    creator: 1,
    age: 30,
  },
  {
    project: 'WEB',
    title: 'Avatar upload fails for PNG files over 2 MB',
    status: 'in_progress',
    priority: 'high',
    assignee: 4,
    creator: 3,
    age: 4,
    comments: [{ author: 4, body: 'The limit is enforced twice, once in nginx with a smaller value.' }],
  },
  {
    project: 'WEB',
    title: 'Migrate the date picker to the new design system',
    status: 'canceled',
    priority: 'medium',
    creator: 5,
    age: 28,
    comments: [{ author: 5, body: 'Canceled: the design system ships its own date picker next month.' }],
  },
  {
    project: 'WEB',
    title: 'Empty state for projects with no issues',
    status: 'todo',
    priority: 'medium',
    assignee: 1,
    creator: 5,
    age: 9,
  },
  {
    project: 'API',
    title: 'Rate limit the public search endpoint',
    description: 'Limit per API key, not per IP. Return 429 with a Retry-After header.',
    status: 'in_progress',
    priority: 'high',
    assignee: 3,
    creator: 2,
    age: 5,
    comments: [
      { author: 2, body: 'Per key please. Several customers share one office IP.' },
      { author: 3, body: 'Agreed. Using a sliding window, 100 requests per minute to start.' },
    ],
  },
  {
    project: 'API',
    title: 'Webhook retries never stop after the endpoint is deleted',
    status: 'todo',
    priority: 'urgent',
    assignee: 4,
    creator: 3,
    age: 1,
  },
  {
    project: 'API',
    title: 'Document the pagination format',
    status: 'backlog',
    priority: 'low',
    creator: 2,
    age: 22,
  },
  {
    project: 'API',
    title: 'Return 404 instead of 500 for unknown project keys',
    status: 'done',
    priority: 'medium',
    assignee: 3,
    creator: 1,
    age: 15,
  },
  {
    project: 'API',
    title: 'Add an OpenAPI description',
    description: 'Generate it from the route schemas so it never drifts.',
    status: 'backlog',
    priority: 'medium',
    creator: 4,
    age: 26,
  },
  {
    project: 'API',
    title: 'Slow query on the activity feed',
    description: 'p95 is 1.8s. Missing index on (project_id, created_at).',
    status: 'todo',
    priority: 'high',
    assignee: 2,
    creator: 4,
    age: 3,
  },
  {
    project: 'API',
    title: 'Remove the v1 export endpoint',
    status: 'canceled',
    priority: 'low',
    creator: 2,
    age: 29,
  },
  {
    project: 'API',
    title: 'Timestamps in the audit log are in local time',
    description: 'They should be UTC like everything else.',
    status: 'done',
    priority: 'medium',
    assignee: 4,
    creator: 3,
    age: 11,
  },
  {
    project: 'MOB',
    title: 'Push notifications arrive twice on Android 14',
    status: 'in_progress',
    priority: 'high',
    assignee: 5,
    creator: 1,
    age: 3,
  },
  {
    project: 'MOB',
    title: 'Offline mode for the issue list',
    description: 'Cache the last opened project and show it when there is no connection.',
    status: 'backlog',
    priority: 'medium',
    creator: 5,
    age: 27,
  },
  {
    project: 'MOB',
    title: 'App crashes when opening an issue from a notification',
    status: 'todo',
    priority: 'urgent',
    assignee: 1,
    creator: 5,
    age: 1,
    comments: [{ author: 5, body: 'Only happens when the app was killed in the background.' }],
  },
  {
    project: 'MOB',
    title: 'Support dynamic type sizes on iOS',
    status: 'backlog',
    priority: 'low',
    creator: 3,
    age: 19,
  },
  {
    project: 'MOB',
    title: 'Release 3.2 to the app stores',
    status: 'done',
    priority: 'medium',
    assignee: 5,
    creator: 5,
    age: 8,
  },
];

for (const suffix of ['', '-wal', '-shm']) {
  fs.rmSync(`${config.databasePath}${suffix}`, { force: true });
}

const { db, sqlite } = createDatabase(config.databasePath);
await runMigrations(db, sqlite, config.migrationsFolder);

const userIds = await db
  .insert(users)
  .values(seedUsers)
  .returning({ id: users.id })
  .then((rows) => rows.map((row) => row.id));

const projectIdsByKey = new Map<string, number>();
for (const project of seedProjects) {
  const issueCount = seedIssues.filter((issue) => issue.project === project.key).length;
  const [row] = await db
    .insert(projects)
    .values({ ...project, issueCounter: issueCount, createdAt: daysAgo(40) })
    .returning({ id: projects.id });
  projectIdsByKey.set(project.key, row.id);
}

const nextNumber = new Map<string, number>();
// Oldest first, so lower numbers belong to older issues.
const issuesByAge = [...seedIssues].sort((a, b) => b.age - a.age);
let commentCount = 0;

for (const issue of issuesByAge) {
  const number = (nextNumber.get(issue.project) ?? 0) + 1;
  nextNumber.set(issue.project, number);

  const createdAt = daysAgo(issue.age, 3);
  const [row] = await db
    .insert(issues)
    .values({
      projectId: projectIdsByKey.get(issue.project)!,
      number,
      title: issue.title,
      description: issue.description ?? '',
      status: issue.status,
      priority: issue.priority,
      assigneeId: issue.assignee ? userIds[issue.assignee - 1] : null,
      creatorId: userIds[issue.creator - 1],
      createdAt,
      updatedAt: daysAgo(Math.max(issue.age - 1, 0)),
    })
    .returning({ id: issues.id });

  for (const [index, comment] of (issue.comments ?? []).entries()) {
    await db.insert(comments).values({
      issueId: row.id,
      authorId: userIds[comment.author - 1],
      body: comment.body,
      createdAt: daysAgo(issue.age, 2 - index),
    });
    commentCount++;
  }
}

sqlite.close();

console.log(
  `Seeded ${seedUsers.length} users, ${seedProjects.length} projects, ${seedIssues.length} issues and ${commentCount} comments into ${config.databasePath}`,
);
