// PostToolUse hook: runs after every Edit or Write.
// Formats the file, lints it, and type checks the workspace it belongs to, in a couple of seconds.
// Problems go straight back to the agent, while the change is still fresh.
import fs from 'node:fs';
import path from 'node:path';
import { bin, block, projectDir, readHookInput, run, tail } from './lib.mjs';

const BIOME_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.css']);
const TS_EXTENSIONS = new Set(['.ts', '.tsx']);
const WORKSPACES = ['apps/api', 'apps/web', 'packages/shared'];

const input = await readHookInput();
const filePath = input.tool_input?.file_path;
if (!filePath || !fs.existsSync(filePath)) {
  process.exit(0);
}

const relative = path.relative(projectDir, filePath);
const extension = path.extname(filePath);
if (relative.startsWith('..') || !BIOME_EXTENSIONS.has(extension)) {
  process.exit(0);
}

const problems = [];

// Format and apply safe fixes first, so the agent only hears about what needs a human decision.
run(bin('biome'), ['check', '--write', '--no-errors-on-unmatched', relative]);
const lint = run(bin('biome'), ['check', '--no-errors-on-unmatched', relative]);
if (!lint.ok) {
  problems.push(`Biome found problems in ${relative}:\n${tail(lint.output)}`);
}

const workspace = WORKSPACES.find((dir) => relative.startsWith(`${dir}/`));
if (workspace && TS_EXTENSIONS.has(extension)) {
  const types = run(bin('tsc'), ['--noEmit', '-p', workspace]);
  if (!types.ok) {
    problems.push(`TypeScript errors in ${workspace}:\n${tail(types.output)}`);
  }
}

if (problems.length > 0) {
  block(`${problems.join('\n\n')}\n\nFix these before you move on.`);
}
