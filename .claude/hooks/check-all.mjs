// Stop hook: runs when the agent says it has finished.
// If the working tree changed, it runs `npm run check`. When the check is red the agent is not
// allowed to stop: the failure becomes its next instruction. After 3 failed attempts in a row it
// lets the agent stop, so a problem the agent cannot fix goes to a human instead of looping forever.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { block, readHookInput, run, tail } from './lib.mjs';

const MAX_ATTEMPTS = 3;

const input = await readHookInput();

const status = run('git', ['status', '--porcelain']);
if (status.ok && status.output === '') {
  process.exit(0); // Nothing changed in this session: nothing to check.
}

const counterFile = path.join(os.tmpdir(), `tasklane-stop-hook-${input.session_id ?? 'unknown'}`);
const attempts =
  input.stop_hook_active && fs.existsSync(counterFile) ? Number(fs.readFileSync(counterFile, 'utf8')) : 0;

const check = run('npm', ['run', 'check']);
if (check.ok) {
  fs.rmSync(counterFile, { force: true });
  process.exit(0);
}

if (attempts + 1 >= MAX_ATTEMPTS) {
  fs.rmSync(counterFile, { force: true });
  // Let the agent stop, but make sure the human sees that the check is still red.
  process.stdout.write(
    JSON.stringify({
      systemMessage: `npm run check is still failing after ${MAX_ATTEMPTS} attempts. Review it by hand.`,
    }),
  );
  process.exit(0);
}

fs.writeFileSync(counterFile, String(attempts + 1));
block(
  `npm run check failed, so the task is not done yet (attempt ${attempts + 1} of ${MAX_ATTEMPTS}).\n\n` +
    `${tail(check.output, 80)}\n\n` +
    'Fix the cause and run `npm run check` again. Follow AGENTS.md: do not weaken a test, a rule or a type to make it pass. ' +
    'If you cannot fix it, stop and explain what is failing and why.',
);
