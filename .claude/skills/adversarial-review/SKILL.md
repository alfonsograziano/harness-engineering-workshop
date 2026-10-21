---
name: adversarial-review
description: Runs the reviewer subagent on the current change, in a fresh context, then sorts its findings into fix now, discuss, and reject. Use before opening a pull request.
argument-hint: "[base branch, default main]"
disable-model-invocation: true
allowed-tools: Bash(git diff *) Bash(git log *) Bash(git status *)
---

# Adversarial review

The agent that wrote a change is the worst reviewer of it: it shares every assumption that produced the bug. This command hands the change to the `reviewer` subagent, which starts from a fresh context, sees only the diff and AGENTS.md, and is told to assume there is a bug.

1. Run `npm run check`. If it is red, stop and fix that first: there is no point reviewing code that does not pass the checks.
2. Collect the change against the base branch (`$ARGUMENTS`, or `main` if empty):
   - `git log --oneline <base>..HEAD`
   - `git diff <base>...HEAD`
   - `git diff` and `git diff --staged` for anything not committed yet
3. Start the `reviewer` subagent. Give it the full diff and the commit list, and nothing else: no summary of what the change is supposed to do, no explanation of your choices. Its value comes from not sharing your context.
4. When it answers, check every finding yourself against the code. Put each one in one of three groups:
   - **Fix now**: a real defect. Fix it, add a test that fails without the fix, and run `npm run check`.
   - **Discuss**: a real trade-off or a question about intent. List it for the human, with the reviewer's failure scenario.
   - **Rejected**: not a real problem. Say in one line why, with the evidence.
5. Report the three groups to the human. Do not open a pull request while anything is left in "Fix now".
