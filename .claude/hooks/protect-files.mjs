// PreToolUse hook: runs before every Edit or Write and blocks changes to files the agent must not touch by hand.
// A guardrail does not ask. It blocks, and says what to do instead.
import path from 'node:path';
import { block, projectDir, readHookInput, run } from './lib.mjs';

const input = await readHookInput();
const filePath = input.tool_input?.file_path;
if (!filePath) {
  process.exit(0);
}
const relative = path.relative(projectDir, path.resolve(projectDir, filePath));

const isCommitted = (file) => run('git', ['ls-files', '--error-unmatch', file]).ok;

const RULES = [
  {
    matches: (file) => /^apps\/api\/drizzle\/.+\.sql$/.test(file) && isCommitted(file),
    reason:
      "This migration is committed, so it may already have run on someone's database. Never edit it. " +
      'Change apps/api/src/db/schema.ts and run `npm run db:generate` to create a new migration.',
  },
  {
    matches: (file) => file.startsWith('apps/api/drizzle/meta/'),
    reason: 'Drizzle generates these files. Change apps/api/src/db/schema.ts and run `npm run db:generate`.',
  },
  {
    matches: (file) => path.basename(file) === 'package-lock.json',
    reason:
      'Do not edit the lockfile by hand. Use `npm install <pkg> -w <workspace>` or `npm uninstall`, ' +
      'and npm will update it.',
  },
  {
    matches: (file) => /^\.env(\..*)?$/.test(path.basename(file)) && path.basename(file) !== '.env.example',
    reason: 'Environment files hold secrets. Do not read or write them. Ask the human to change them.',
  },
  {
    matches: (file) =>
      ['biome.json', 'knip.json', '.dependency-cruiser.cjs', '.claude/settings.json'].includes(file) ||
      file.startsWith('.claude/hooks/'),
    reason:
      'This file is part of the harness that checks your work. Do not change it to make a check pass. ' +
      'If you think a rule is wrong, stop and explain why to the human.',
  },
];

const rule = RULES.find((candidate) => candidate.matches(relative));
if (rule) {
  block(`Blocked: ${relative}\n${rule.reason}`);
}
