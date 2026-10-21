import { spawnSync } from 'node:child_process';
import path from 'node:path';

export const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

/** Reads the JSON that Claude Code sends to every hook on stdin. */
export async function readHookInput() {
  let raw = '';
  for await (const chunk of process.stdin) {
    raw += chunk;
  }
  return raw ? JSON.parse(raw) : {};
}

/** Runs a command from the project root and returns its exit code and combined output. */
export function run(command, args) {
  const result = spawnSync(command, args, { cwd: projectDir, encoding: 'utf8', shell: false });
  return { ok: result.status === 0, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
}

export function bin(name) {
  return path.join(projectDir, 'node_modules', '.bin', name);
}

/** Keeps the end of a long output: that is where the errors and the summary are. */
export function tail(text, lines = 60) {
  return text.split('\n').slice(-lines).join('\n');
}

/**
 * Exit code 2 tells Claude Code to block and to show stderr to the agent.
 * For PostToolUse the edit is already done; the agent reads the message and fixes it.
 * For Stop the agent is not allowed to stop and gets the message as its next instruction.
 */
export function block(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}
