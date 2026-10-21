# AI-Native Readiness Report

**Repo:** `alfonsograziano/harness-engineering-workshop` (Tasklane, a small Linear-style issue tracker), branch `main`, one commit (`946961c`, 2026-10-21)
**Date:** 2026-10-21
**Stack:** TypeScript monorepo with npm workspaces (`apps/api`, `apps/web`, `packages/shared`), Node.js 24 (`.nvmrc`). API: Fastify 5, TypeBox, Drizzle ORM on SQLite through the built-in `node:sqlite` module, run with `tsx`. Web: React 19, Vite 8, React Router, TanStack Query. One root `package-lock.json`. No test runner, linter, formatter, CI or agent files were found.

**Result:** 7 passed, 34 failed, 5 not applicable (46 questions)

---

**How to read this.** Every item is a numbered question about this repo, answered from evidence in this repo. `Proof` is what was actually found — a path, a file, a command and its output. An item with no proof is not an answer. The italic line under each question says how to check it; it stays in the report so the next run checks the same way.

**FAIL vs N/A.** `FAIL` means the practice would help here and it is missing — including when a whole artifact is missing, so several questions about it fail together with a one-line proof pointing at the item that found it missing. `N/A` means the question could never apply to a project of this kind, and the proof says why. "It does not exist" is a FAIL, never an N/A.

`Priority` is fixed by the template, not by the person filling it in. **High** means an agent working here will hit this on day one, or the risk is real. **Low** means it makes things better but nothing breaks without it.

---

## 1. Context

- [ ] 1. Does an agent instruction file exist (AGENTS.md, CLAUDE.md, .cursorrules, .github/copilot-instructions.md, or this ecosystem's equivalent), and what does it point at?
  *Look for a file whose purpose is to be loaded into a coding agent's context at the start of every session. That file is the **entry point**. Then follow its pointers: instructions are commonly spread across several files, with the entry point routing to them — "commands are in docs/development.md", "conventions in .claude/rules/". The entry point plus every file it points at is the **instruction set**, and every other agent-instruction question is answered against that whole set, so list it here in the proof. Follow pointers as deep as they go, but a pointer only counts when it names a target and says what is in it: "test commands are in CONTRIBUTING.md" counts, a bare "see the docs" does not, and a file nothing points at is outside the set however good it is. A README is not an entry point, however good — it gets its credit at the README item and the specs-and-architecture item — but a README the entry point explicitly routes to is inside the set. Vendored skill libraries are not instructions either.*
  - Status: FAIL
  - Proof: No entry point exists, so the instruction set is empty. `ls -a` at the root shows only `.git`, `.gitignore`, `.nvmrc`, `README.md`, `apps`, `node_modules`, `package-lock.json`, `package.json`, `packages`, `tsconfig.base.json`. `git ls-files` (78 files) has no `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.cursor/`, `.claude/`, `.github/copilot-instructions.md` or any other agent file, at the root or inside `apps/*` or `packages/*`.
  - Recommendation: Add a short `AGENTS.md` at the root (and a one-line `CLAUDE.md` that points to it) that names the stack, the workspaces, the commands (`npm run dev`, `npm run db:seed`, `npm run db:generate`, `npx tsc -p <workspace>/tsconfig.json`) and the layering rule `routes → services → repositories` in `apps/api/src`.
  - Priority: High

- [ ] 2. Do the agent instructions name the commands to build, test and check this project?
  *Answer this against the instruction set mapped at the entry-point item and nothing outside it. If no entry point exists, FAIL with a one-line proof pointing at that item. The commands may sit in a file the entry point routes to rather than in the entry point itself — that is progressive disclosure working as intended, and it passes. What fails is a command an agent would have to guess its way to: if the commands live only in the README or the manifest and nothing in the set points at them, that is a FAIL, because the question measures what an agent can reach without being told where to look. Name the file each command was found in.*
  - Status: FAIL
  - Proof: No agent instruction file exists (see the entry-point item). The run and build commands live only in `README.md` and `package.json`.
  - Recommendation: Blocked by the missing agent instruction file.
  - Priority: High

- [ ] 3. Does everything the agent instructions name still exist — the commands, the paths, the libraries, and the files they point at?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. Verify, do not trust: check every named command against the manifest or build file, spot-check the paths, run the cheap read-only ones. Then resolve every pointer in every file of the set — a link to a moved or deleted file is the most common rot in a multi-file instruction set, and it fails silently: the agent reads the entry point, follows nothing, and carries on without the rules.*
  - Status: FAIL
  - Proof: No agent instruction file exists (see the entry-point item).
  - Recommendation: Blocked by the missing agent instruction file.
  - Priority: High

- [ ] 4. Are the agent instructions specific to this repo, rather than advice that would read the same in any codebase?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. The test: could this be pasted into another project unchanged? "Write clean code" and "add tests for new features" would fit anywhere and count for nothing. Judge the whole set, but weigh the files differently: an entry point that is mostly a routing table is fine, even good, when what it routes to is specific — while generic filler in the entry point costs more than generic filler three hops down, because it is loaded into every session whether it is needed or not. Say which files carried the specifics.*
  - Status: FAIL
  - Proof: No agent instruction file exists (see the entry-point item).
  - Recommendation: Blocked by the missing agent instruction file.
  - Priority: High

- [ ] 5. Do the agent instructions explain where things live and how this project is laid out?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. The map may live in a routed-to file. Judge coverage against the real tree, not against what the files mention: if the set maps one package well but is silent about sibling packages or directories an agent would land in, that is a FAIL with the omission named. In a multi-file set, check the routing too — a layout document nothing points at is a document the agent never opens.*
  - Status: FAIL
  - Proof: No agent instruction file exists (see the entry-point item). A good layout map exists in the "Project structure" section of `README.md`, but nothing routes an agent to it.
  - Recommendation: Blocked by the missing agent instruction file.
  - Priority: High

- [ ] 6. Do the agent instructions state the rules that are not obvious from the code — the things never to do here?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. These are the tribal-knowledge traps: the flag that must be exactly this string, the import that breaks the build, the directory that is generated and must not be edited. Rules in a routed-to file count. Two extra checks in a multi-file set: that the entry point signposts the rules clearly enough for an agent to open them *before* it needs them, since a trap found afterwards has already been sprung; and that the files do not contradict each other, because nothing tells the agent which one wins.*
  - Status: FAIL
  - Proof: No agent instruction file exists (see the entry-point item). Traps an agent would hit and that are written nowhere as rules: files in `apps/api/drizzle/` are generated by `npm run db:generate` and must not be hand-edited; migrations run on every server start (`apps/api/src/server.ts`); `npm run db:seed` deletes the local database (`fs.rmSync` in `apps/api/src/db/seed.ts`); `packages/shared` exports raw `.ts` through `exports: { ".": "./src/index.ts" }`, so it has no build step.
  - Recommendation: Blocked by the missing agent instruction file.
  - Priority: Low

- [ ] 7. Has the agent instruction file been updated recently enough to still be true, given how active the repo is?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at the entry-point item. Compare the last commit touching the file against the repo's tempo, then spot-check two or three of its claims against the code — a recently touched file can still lie.*
  - Status: FAIL
  - Proof: No agent instruction file exists (see the entry-point item).
  - Recommendation: Blocked by the missing agent instruction file.
  - Priority: Low

- [ ] 8. Is the agent instruction file small enough to load into every session without crowding out the actual task?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at the entry-point item. Measure it: `wc -c`, and bytes divided by four is a fair token estimate. Under ~5k tokens is comfortable; past ~10k it is eating the context window.*
  - Status: FAIL
  - Proof: No agent instruction file exists (see the entry-point item).
  - Recommendation: Blocked by the missing agent instruction file.
  - Priority: Low

- [ ] 9. Can a fresh session pick up a half-finished task — is there a file or convention where progress, decisions and what is left get written down?
  *This is not about the agent instruction file. Any durable place in-flight state gets written counts: a TODO.md, a plans or notes directory, task files, linked issues, a specs folder whose entries carry progress and open questions, an agent memory file or directory, a scratchpad or working-notes convention. The test is whether a fresh session could read it and know what was decided and what is left — not what the place is called. Git history alone does not count: it records what happened, not what was decided or what remains.*
  - Status: FAIL
  - Proof: `git ls-files` shows no `TODO.md`, no `plans/`, `notes/`, `docs/` or `specs/` directory, no task files and no agent memory file. `git grep -niE 'todo|fixme'` in `apps/*/src` and `packages` finds only the status value `'todo'` in `packages/shared/src/issues.ts`. The only history is one commit (`946961c`).
  - Recommendation: Add a `plans/` directory (or put progress notes inside the specs directory once it exists), and say in the agent instruction file that work in progress, decisions and open items get written there before a session ends.
  - Priority: Low

- [ ] 10. Is there a README that says what this project is and how to run it?
  *This is where a good README earns its credit. It needs three things: what the project is, how to run it, and how to check a change. Judge what is on the page, not the file's existence.*
  - Status: FAIL
  - Proof: `README.md` covers two of the three. What it is: yes ("A small Linear-style issue tracker", plus a feature list and an API table). How to run it: yes ("Getting started" with `npm install`, `npm run db:seed`, `npm run dev`, and the ports 5173 and 3001; I ran the seed and the API against a scratch `DATABASE_PATH` and both worked). How to check a change: no. The "Scripts" table lists only `dev`, `build`, `db:seed` and `db:generate`; there is no test, lint or typecheck command, because none exists in the repo.
  - Recommendation: Add a "Check your change" section to `README.md` that names the check commands, once they exist (see the one-command check item).
  - Priority: High

## 2. Specs

- [ ] 11. Is the thinking behind this system written down somewhere durable — a specs, RFC, proposals, design-doc or ADR directory, or architecture notes that record not just what but why?
  *Look for the place and for the convention: `specs/`, `docs/adr/`, `rfcs/`, `proposals/`, `.specify/`, a docs or design folder, architecture notes anywhere in the tree, or this ecosystem's equivalent. Judge substance, not location: "we use X because Y" is a decision, a list of technologies is not, an essay about specs is not a spec, and a docs folder of usage guides with no reasoning is a FAIL whose proof says what was in there instead. Other items are answered against whatever this item finds, so name it precisely — and where forward-looking specs and after-the-fact architecture records live in different places, name both, since a decision log cannot answer a question about acceptance criteria.*
  - Status: FAIL
  - Proof: `git ls-files` shows no `specs/`, `docs/`, `adr/`, `rfcs/`, `proposals/`, `.specify/` or design folder anywhere in the tree. The closest thing is `README.md`, which lists the layers ("Project structure") and the API, but gives almost no reasons. The one "why" in the whole repo is that SQLite is opened with `node:sqlite` "so there is nothing else to install or run". Short code comments explain local choices (for example `apps/api/src/lib/current-user.ts` says the API trusts `x-user-id` because there is no login), but these are not a decision record.
  - Recommendation: Create `docs/adr/` with three short records for the choices an agent would otherwise question: SQLite through `node:sqlite` with Drizzle, migrations applied on server start, and no auth (the API trusts `x-user-id`). Then add a `specs/` directory for new features.
  - Priority: High

- [ ] 12. Does the specs directory hold recent entries, or is it an archive nobody has touched?
  *If no specs directory exists, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise compare the newest entry's date against the repo's recent activity.*
  - Status: FAIL
  - Proof: No specs directory exists (see the specs-and-architecture item).
  - Recommendation: Blocked by the missing specs directory.
  - Priority: Low

- [ ] 13. Is there a spec template, or an SDD framework, so every spec comes out the same shape?
  *Scaffolding can exist even where no specs directory does — look for a TEMPLATE.md, a `.specify/` directory, or framework config. If neither a directory nor any scaffolding exists, FAIL.*
  - Status: FAIL
  - Proof: No specs directory (see the specs-and-architecture item), and no scaffolding: no `TEMPLATE.md`, no `.specify/`, no `.bmad*` or other SDD framework config in `git ls-files`.
  - Recommendation: Add `specs/TEMPLATE.md` with fixed sections: problem, acceptance criteria, error cases, non-goals, rollback.
  - Priority: Low

- [ ] 14. Do the specs state acceptance criteria a machine could check?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise open the two newest specs and quote a criterion: "the endpoint returns 403 for expired tokens" is checkable; "the feature works well" is not.*
  - Status: FAIL
  - Proof: No specs exist (see the specs-and-architecture item).
  - Recommendation: Blocked by the missing specs directory.
  - Priority: High

- [ ] 15. Open the newest spec: do its criteria go past the happy path — what happens when a step fails, and how the change gets undone?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Look for error cases, edge inputs, and a rollback or undo story, not just the success flow.*
  - Status: FAIL
  - Proof: No specs exist (see the specs-and-architecture item).
  - Recommendation: Blocked by the missing specs directory.
  - Priority: Low

- [ ] 16. Do the specs state non-goals, so an agent knows where to stop?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Non-goals written elsewhere (a README's "what this is not" list) are worth naming in the proof, but they do not turn this into a PASS — the question is whether specs carry them.*
  - Status: FAIL
  - Proof: No specs exist (see the specs-and-architecture item). `README.md` hints at two non-goals ("There is no login", "Status changes go through a menu, not drag and drop"), but these are not in a spec.
  - Recommendation: Blocked by the missing specs directory.
  - Priority: Low

- [ ] 17. Can recent shipped work be traced back to a spec?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise take the last few substantial commits or PRs and look for a reference to a spec, an issue, or a design doc in the message or description.*
  - Status: FAIL
  - Proof: No specs exist (see the specs-and-architecture item). The only commit, `946961c` "Tasklane: a small Linear-style issue tracker", names no spec, issue or design doc.
  - Recommendation: Blocked by the missing specs directory.
  - Priority: Low

## 3. Verification

- [ ] 18. Does this project have an automated test suite, in whatever form this ecosystem uses?
  *Work out this ecosystem's convention before concluding anything is missing — check the manifest, the build file, the CI config, the README. A shell script that diffs output files is a test suite. If you find one, run it and record the result.*
  - Status: FAIL
  - Proof: No `test` script in the root `package.json` or in `apps/api`, `apps/web` or `packages/shared` (`npm test` prints `Missing script: "test"`). No test runner in any devDependencies (no vitest, jest, mocha, playwright; Node's built-in `node --test` is not used). `git ls-files` has no `*.test.*`, `*.spec.*`, `test/` or `__tests__/` path. No CI config and no Makefile. The code is testable: `buildApp({ db })` in `apps/api/src/app.ts` and `createDatabase(':memory:')` in `apps/api/src/db/client.ts` are built for it, but nothing uses them.
  - Recommendation: Add API tests with the built-in `node:test` runner (or Vitest) that call `buildApp({ db: createDatabase(':memory:').db })` and use `app.inject()` against the routes in `apps/api/src/routes/`, and wire them to `npm test` at the root.
  - Priority: High

- [ ] 19. Can the test command be discovered without guessing — is it written down where an agent reads?
  *If no test suite exists, FAIL with a one-line proof pointing at the test-suite item. Otherwise check the places an agent looks: the agent instruction file, the README, the manifest's scripts or targets.*
  - Status: FAIL
  - Proof: No test suite exists (see the test-suite item).
  - Recommendation: Blocked by the missing test suite.
  - Priority: High

- [ ] 20. Do the tests assert real behaviour, rather than asserting that a mock was called?
  *If no test suite exists, FAIL with a one-line proof pointing at the test-suite item. Otherwise open the largest test files and read the assertions: calling real code on real inputs passes; `expect(mock).toHaveBeenCalled()` as the main dish fails.*
  - Status: FAIL
  - Proof: No test suite exists (see the test-suite item).
  - Recommendation: Blocked by the missing test suite.
  - Priority: High

- [ ] 21. Is there a linter or static analysis configured for this language, and does it pass on a clean checkout?
  *Configured is not enough — run it. A linter that exits non-zero on an untouched checkout is a FAIL with the error count in the proof, because an agent cannot tell its own damage from the baseline noise.*
  - Status: FAIL
  - Proof: No linter config in `git ls-files` (no `eslint.config.*`, `.eslintrc*`, `biome.json`, `oxlint` config), no linter in any `package.json`, and no `lint` script. Nothing to run.
  - Recommendation: Add ESLint with `typescript-eslint` (or Biome) at the root, add a `lint` script to the root `package.json`, and make sure it exits 0 on the current code before anyone builds on it.
  - Priority: High

- [ ] 22. Is there a formatter, so an agent's diffs do not churn on style?
  *Look for the config file and the dependency in this ecosystem's form — .prettierrc, rustfmt, gofmt, black, an .editorconfig doing real work. If the language ships one formatting standard with the toolchain, that is a PASS and the proof says so.*
  - Status: FAIL
  - Proof: No `.prettierrc*`, `prettier.config.*`, `biome.json` or `.editorconfig` in `git ls-files`, and no formatter in any `package.json`. The code looks consistent by hand (single quotes, trailing commas, 2 spaces), but nothing enforces it. TypeScript ships no standard formatter.
  - Recommendation: Add Prettier with a `.prettierrc` that matches the current style (single quotes, trailing commas, print width about 100) and a `format` script, then run it once so the baseline is clean.
  - Priority: Low

- [ ] 23. Is there a compile-time or type-level gate, if this language offers one?
  *N/A only when the language genuinely has no such gate. If the language offers one and the repo does not use it — no strict mode, no typecheck script, no compiler step — that is a FAIL. Run the gate if it exists and record the result.*
  - Status: FAIL
  - Proof: The config is good: `tsconfig.base.json` sets `"strict": true` and `"noEmit": true`, and I ran `npx tsc -p apps/api/tsconfig.json`, `npx tsc -p apps/web/tsconfig.json` and `npx tsc -p packages/shared/tsconfig.json`; all three exit 0. But nothing runs it. There is no `typecheck` script in any `package.json`, the API runs through `tsx` (which strips types without checking), and `npm run build` is `vite build`, which also does not type-check. A type error would ship unnoticed.
  - Recommendation: Add `"typecheck": "tsc -p apps/api && tsc -p apps/web && tsc -p packages/shared"` to the root `package.json` (or a `tsconfig.json` with project references and `tsc -b`).
  - Priority: Low

- [ ] 24. Can an agent prove its own work before it pushes — one command, task-runner target or commit hook that runs every check this project has?
  *One command, not a list to remember: a `check` or `verify` target, a `precommit` script, a Makefile target that chains them. Separate commands documented side by side are close but FAIL — the question is whether the agent can run the whole gauntlet without knowing its parts.*
  - Status: FAIL
  - Proof: The root `package.json` scripts are only `dev`, `build`, `db:seed`, `db:generate`. No `check`, `verify` or `precommit` script, no Makefile, and no committed hook (no `.husky/`, no `.githooks/`, `git config core.hooksPath` is unset).
  - Recommendation: Add a root `"check": "npm run typecheck && npm run lint && npm test && npm run build"` script once those parts exist, and name it in the agent instruction file as the one command to run before finishing.
  - Priority: High

- [ ] 25. Is there continuous integration, and does it run before a change lands rather than after?
  *A deploy pipeline that runs on push to the default branch runs after the change has landed — that is a FAIL with the trigger quoted, not a PASS with a caveat. Look for a pre-merge trigger: pull_request events, merge trains, or this forge's equivalent.*
  - Status: FAIL
  - Proof: No `.github/workflows/`, `.gitlab-ci.yml`, `.circleci/`, `Jenkinsfile`, `azure-pipelines.yml` or other CI config in `git ls-files`. The remote is GitHub (`origin` → `github.com/alfonsograziano/harness-engineering-workshop`), so GitHub Actions would be the natural fit.
  - Recommendation: Add `.github/workflows/ci.yml` triggered on `pull_request` (and on push to `main`) that runs `npm ci` and the root `check` script on Node 24.
  - Priority: High

- [ ] 26. Does CI actually run the tests and the checks that exist in this repo?
  *If no pipeline of any kind exists, FAIL with a one-line proof pointing at the CI item. Otherwise list what the pipeline runs and diff it against every check found in the Verification section — name each check that exists in the repo but is missing from the pipeline.*
  - Status: FAIL
  - Proof: No pipeline of any kind exists (see the CI item).
  - Recommendation: Blocked by the missing CI pipeline.
  - Priority: High

- [ ] 27. Does anything here get an LLM to read a change and go looking for problems — a review skill, a saved review prompt, or an AI reviewer on the pull requests?
  *Look for a committed review skill or slash command, a CI step calling an AI reviewer, or bot config. Human review rules are a Safety item; this one is specifically about machine review.*
  - Status: FAIL
  - Proof: No `.claude/commands/`, `.claude/skills/`, `.agents/`, prompts directory, review bot config (for example `.coderabbit.yaml`) or CI step that calls an AI reviewer in `git ls-files`.
  - Recommendation: Add a committed review command (for example `.claude/commands/review.md`) that checks a diff against this repo's rules: the layering in `apps/api/src`, the shared error shape in `apps/api/src/errors.ts`, and a migration for every change to `apps/api/src/db/schema.ts`.
  - Priority: Low

## 4. Tooling

- [x] 28. Can an agent reach the outside systems this project depends on, with that access committed to the repo rather than set up per laptop?
  *MCP servers are one form: look for a committed `.mcp.json` or this ecosystem's equivalent. A CLI is another and often the better one — `aws`, `gh`, `psql`, `kubectl`, `stripe`, a vendor's own tool — and it counts when the repo names which tools the work needs and how to authenticate, so an agent is not guessing at a tool it cannot see. Judge the axis, not the mechanism: access that exists only in someone's shell history or laptop config is a FAIL, and so is a committed config that turns out to be gitignored, with the distinction in the proof. Project task scripts have their own item; this one is about reaching past the repo's edge. If this project genuinely talks to nothing outside itself, N/A with that as the reason.*
  - Status: N/A
  - Proof: The project talks to nothing outside itself. The database is a local SQLite file opened with the built-in `node:sqlite` module (`apps/api/src/db/client.ts`, path from `apps/api/src/config.ts`). `git grep` finds no HTTP client calls to outside services, no cloud SDK and no third-party API key. The only env vars read are `PORT`, `HOST`, `DATABASE_PATH` and `LOG_LEVEL`, all optional with local defaults. No `.mcp.json` exists, and none is needed for the app to work.
  - Recommendation: —
  - Priority: Low

- [ ] 29. Is there a skills, commands or reusable-prompt library in the repo?
  *Look for .claude/skills, .agents/skills, .claude/commands, or a prompts directory. Committed and pinned beats committed; note whether anything ties the copies to a source.*
  - Status: FAIL
  - Proof: No `.claude/skills/`, `.agents/skills/`, `.claude/commands/` or `prompts/` directory in `git ls-files` or on disk at the root (`ls -a`).
  - Recommendation: Add `.claude/skills/` with one skill for the most repeated job here, adding a new API resource end to end (see the repeated-work item).
  - Priority: Low

- [ ] 30. Do the skills, servers and tools that exist cover the work this team plainly repeats?
  *First identify the repeated work from the README and the commit history. If skills, servers or documented tooling exist but miss it, FAIL naming the gap. If none exist at all and the repo plainly repeats work, FAIL pointing at the outside-systems item and the skills-library item. If the project is too small to repeat anything, N/A.*
  - Status: FAIL
  - Proof: The history is one commit, but the layout makes the repeated work plain. Every resource is spread across the same files: `apps/api/src/routes/<x>.ts`, `schemas/<x>.ts`, `services/<x>.ts`, `repositories/<x>.ts`, `packages/shared/src/api-types.ts`, and `apps/web/src/api/<x>.ts` plus `query-keys.ts` (four resources follow this today). A schema change also repeats a fixed path: edit `apps/api/src/db/schema.ts`, run `npm run db:generate`, restart so migrations apply. No skills library exists (see the skills-library item), and no outside tools are needed (see the outside-systems item, N/A), so nothing covers this work.
  - Recommendation: Write a skill `add-resource` that walks the route, schema, service, repository, shared type and web hook files in order, and a skill `change-db-schema` that covers `schema.ts`, `npm run db:generate` and the restart.
  - Priority: Low

- [x] 31. Are there project CLI scripts or task-runner targets for the common jobs?
  *Check the manifest's scripts, the Makefile, the justfile, or this ecosystem's equivalent. The test: does routine work need a raw multi-flag command that someone has to remember?*
  - Status: PASS
  - Proof: The root `package.json` has `dev` (runs API and web together through `concurrently`), `build`, `db:seed` and `db:generate`, and they hide the raw commands well (for example `tsx watch --disable-warning=ExperimentalWarning src/server.ts` sits behind `npm run dev`). The one routine gap is type-checking, which today needs three raw `npx tsc -p <workspace>/tsconfig.json` commands; that is counted at the type-gate item.
  - Recommendation: —
  - Priority: High

- [x] 32. Are those scripts named somewhere the agent will actually read them?
  *If no scripts exist, FAIL with a one-line proof pointing at the task-scripts item. Otherwise check the agent instruction file, the README, and whether the manifest itself is self-explanatory.*
  - Status: PASS
  - Proof: The "Scripts" table in `README.md` names all four root scripts and says what each does, and the root `package.json` script names are plain. There is no agent instruction file to repeat them (see the entry-point item), so an agent has to open the README to find them.
  - Recommendation: —
  - Priority: High

- [x] 33. Can an agent get this project running — is there a reproducible environment or a documented setup path?
  *Look for a pinned runtime (.nvmrc, .tool-versions, rust-toolchain), a lockfile, a container or nix file, and written setup steps. Try the first step if it is cheap and safe. This one bites hardest the moment work happens in a fresh git worktree or a new clone — the normal way to run agents in parallel. A new worktree has no installed dependencies, no `.env`, no build cache, so anything that works today only because of untracked state sitting on someone's machine simply does not run there. The test: would a bare checkout plus the written steps get this project up? Name any prerequisite nothing creates — an env file someone hand-made, a seeded database, a manual login — because each one is a wall a worktree hits on its first command.*
  - Status: PASS
  - Proof: `.nvmrc` says `24` and `engines.node` is `>=24.0.0`; the root `package-lock.json` covers all workspaces; `README.md` "Getting started" gives install, seed and dev. No hand-made prerequisite exists: no `.env` is read, every env var has a default in `apps/api/src/config.ts`, `createDatabase` creates the data folder, and migrations run on server start. I tested it from this bare worktree (Node v24.14.0) with `DATABASE_PATH` pointed at a scratch folder: `npm run db:seed` printed "Seeded 5 users, 3 projects, 23 issues and 8 comments", and `npm start -w @tasklane/api` served `GET /api/projects`. `git status` stayed clean.
  - Recommendation: —
  - Priority: High

- [x] 34. Can an agent see the results of a failed run — do the tools here produce output it can read and act on?
  *Judge from the runs you already did in Verification: does a failure print a path, a line, a name — something actionable — or a wall of noise? If nothing could be run, FAIL saying why.*
  - Status: PASS
  - Proof: What could be run gives clear output. `npx tsc -p <workspace>` reports errors as `file(line,col): error TSxxxx`, and was silent with exit 0 here. `vite build` (run to a scratch `--outDir`) listed each output file and finished with `built in 352ms`. `npm test` failed with one clear line, `Missing script: "test"`. The API returns structured errors I could act on: `GET /api/issues/WEB-9999` gave `{"error":{"code":"NOT_FOUND","message":"Issue WEB-9999 was not found"}}`, and a bad `POST` gave `VALIDATION_ERROR` with the missing property named. Server logs are one JSON line per event (Fastify logger, `LOG_LEVEL`).
  - Recommendation: —
  - Priority: Low

## 5. Safety

- [x] 35. Are credentials kept out of the repo — nothing secret committed, ignore rules in place, an example env file for the shape?
  *Three checks: grep tracked files for key-shaped strings, read the ignore rules for env and key patterns, and look for an example env file. Report each of the three separately.*
  - Status: PASS
  - Proof: (1) Key-shaped strings: `git grep` for `api_key`, `secret`, `token`, `password`, `BEGIN ... PRIVATE`, `sk-`, `AKIA` and `ghp_` over tracked files (lockfile excluded) finds one hit, the seed comment "Design tokens for the dark palette are ready in Figma" in `apps/api/src/db/seed.ts`, which is not a secret. (2) Ignore rules: `.gitignore` has `.env`, `.env.*` and `!.env.example`, plus `apps/api/data/` for the local database. (3) Example env file: none exists, but none is needed today. The app reads no `.env` file and needs no secret; its four env vars (`PORT`, `HOST`, `DATABASE_PATH`, `LOG_LEVEL`) are optional with defaults in `apps/api/src/config.ts` and `apps/api/src/server.ts`.
  - Recommendation: —
  - Priority: High

- [ ] 36. Does anything scan for secrets automatically?
  *Look for gitleaks, trufflehog, detect-secrets or this ecosystem's equivalent, wherever it is wired in — a CI step, a pre-commit hook, or forge-level push protection visible from the repo. CI is where this normally lives, and that is a PASS; a local hook on top is better, because it catches the key before it is pushed rather than after, but its absence is a line in the proof, not a FAIL. Say where the scan runs. "Nothing secret exists today" does not make this N/A — the scan is for the day that changes.*
  - Status: FAIL
  - Proof: No CI exists (see the CI item), no committed hook (no `.husky/`, `.githooks/` or `.pre-commit-config.yaml`; `core.hooksPath` unset), and no `.gitleaks.toml` or other scanner config in `git ls-files`. GitHub push protection may be on for the remote, but nothing in the repo shows it.
  - Recommendation: Add a gitleaks step (`gitleaks/gitleaks-action`) to the CI workflow once it exists, and a committed pre-commit hook that runs `gitleaks protect --staged`.
  - Priority: High

- [ ] 37. Are dependencies pinned, so a build is reproducible?
  *Look for lockfiles in every package of the repo, exact versions for load-bearing dependencies, a pinned runtime, and an install command that respects the lock (npm ci, not npm install).*
  - Status: FAIL
  - Proof: Partly. Good: one root `package-lock.json` covers all three npm workspaces, so every package is locked, and `npm ls --depth=0` matches it. Weak: every dependency uses a `^` range (only `typescript` uses `~5.9.3`), so the lock is the only pin; `.nvmrc` pins only the major version (`24`) and `engines.node` is `>=24.0.0`. Failing: the documented install command in `README.md` "Getting started" is `npm install`, not `npm ci`, so a fresh setup can quietly move versions and rewrite the lock.
  - Recommendation: Change `npm install` to `npm ci` in the `README.md` setup steps (and in CI when it exists), and pin `.nvmrc` to an exact version such as `24.14.0`.
  - Priority: High

- [ ] 38. Is anything watching those dependencies for known vulnerabilities?
  *Look for dependabot or renovate config, an audit step in CI, or this ecosystem's equivalent. Check every lockfile in the repo is covered, not just the root one.*
  - Status: FAIL
  - Proof: No `.github/dependabot.yml`, no `renovate.json`, no CI audit step (no CI at all, see the CI item). A manual `npm audit --omit=dev` today reports "found 0 vulnerabilities", but nothing runs it on its own.
  - Recommendation: Add `.github/dependabot.yml` with the `npm` ecosystem at `/` (the root lock covers all workspaces), and an `npm audit --omit=dev --audit-level=high` step in CI.
  - Priority: Low

- [ ] 39. Are the review rules written down — who reads a change, and what they check?
  *Look for CONTRIBUTING, a PR template, or a review checklist in the agent instruction set. On a solo repo the "who" is N/A-shaped but the "what gets checked before it lands" still matters — judge that half.*
  - Status: FAIL
  - Proof: No `CONTRIBUTING.md`, no `.github/pull_request_template.md`, no `CODEOWNERS`, and no agent instruction set to hold a checklist (see the entry-point item). `README.md` says nothing about what must be checked before a change lands.
  - Recommendation: Add `.github/pull_request_template.md` with a short checklist: `npm run check` passes, a migration is included for every change to `apps/api/src/db/schema.ts`, errors use the shared shape from `apps/api/src/errors.ts`.
  - Priority: Low

- [ ] 40. Are the operations that need a human named somewhere an agent will read them?
  *Look for a "never without asking" list in the agent instruction file or the README. Docs that hand out production commands with no fence around them count against, and the proof should quote one.*
  - Status: FAIL
  - Proof: No agent instruction file (see the entry-point item), and `README.md` has no "ask first" list. There are no production commands to hand out, but there are actions a human should own: `README.md` says `npm run db:seed` "deletes the local database and creates a fresh one", with no fence around it; editing or deleting files in `apps/api/drizzle/` that have already run would break every existing database; `git push` to `origin` has no rule at all.
  - Recommendation: Add a "Never without asking" list to the agent instruction file: running `npm run db:seed` on a database someone is using, editing or deleting existing files in `apps/api/drizzle/`, pushing, and adding dependencies.
  - Priority: High

- [x] 41. Does every action that spends money, destroys data or changes production have a human in the way?
  *Start from the damage, not from the tooling: list what in reach of this repo could charge a card, drop or overwrite data, or alter what users are running. Then trace the shortest route an agent could take to each one — a push that auto-deploys, a script carrying live credentials, a migration that runs on merge, an infrastructure apply with no plan-and-approve step. PASS when every route meets a human first, whether that is a review, a manual trigger or a protected environment. FAIL when even one route runs start to finish unattended, and quote that route in the proof so the fix is obvious.*
  - Status: PASS
  - Proof: Damage in reach: nothing charges money (no payment code, no cloud SDK, no paid API). Nothing changes production: there is no deploy config, no CI, no Dockerfile and no hosting setup in `git ls-files`, so a push deploys nothing. The only data that can be destroyed is the local SQLite file in `apps/api/data/` (gitignored), which `npm run db:seed` wipes and rebuilds with fake data. That route runs unattended, but it only touches a local, rebuildable dev database. The fence for it is counted at the human-operations item.
  - Recommendation: —
  - Priority: High

- [x] 42. If a prompt injection landed tonight, how far would it reach — are the credentials an agent can get to here scoped to the job, with nothing production-grade in reach?
  *Inventory what an agent in this repo can reach: env files, cloud CLI profiles, tokens named in docs or config, deploy commands that work from a laptop. Scoped-or-absent passes; production-grade reach fails with the item named.*
  - Status: PASS
  - Proof: Credentials in reach are absent. No `.env` file exists in the worktree, no token or key is named in `README.md`, `package.json` or any config, no cloud CLI or deploy command is referenced, and the app needs no secret to run. The widest reach is the developer's own git push rights to `origin`, which come from the machine, not the repo.
  - Recommendation: —
  - Priority: High

- [x] 43. Can a change reach production a slice at a time — a feature flag that defaults to off, a canary, a staged rollout — rather than everyone at once?
  *Look for a flag system and check the default, or canary and staged-rollout config in the deploy pipeline. Flags that need a rebuild to flip are worth naming in the proof — they gate exposure but they are not a kill switch.*
  - Status: N/A
  - Proof: There is no production here. `README.md` describes Tasklane as a workshop starting app that runs on `localhost` with fake seed users and no login (the API trusts the `x-user-id` header, see `apps/api/src/lib/current-user.ts`), and `git ls-files` holds no deploy target, Dockerfile, hosting config or pipeline. No release can be sliced. If the app is ever deployed, this item becomes a FAIL until a flag or staged rollout exists.
  - Recommendation: —
  - Priority: High

- [x] 44. Once a change is live, can anyone see what it is doing — logs, metrics, traces, alerts that fire on their own, and can an agent read them too?
  *Look for logging setup, an error tracker, analytics, alerting config — and then ask the second half: could an agent reach any of it (a CLI, an MCP server, an API named in the docs), or does observability stop at a dashboard behind a login?*
  - Status: N/A
  - Proof: Nothing goes live, for the reason given at the staged-rollout item. Locally, the API logs JSON lines to stdout through the Fastify logger (`apps/api/src/server.ts`, level from `LOG_LEVEL`), and unexpected errors are logged in `apps/api/src/errors.ts`; an agent can read that output from the dev server. No error tracker, metrics or alerting exist, and none could fire without a deployment.
  - Recommendation: —
  - Priority: Low

- [x] 45. Is there a way back — can a bad change be undone without a rebuild and a redeploy, including the ones that touched a database or a queue?
  *Look for a documented rollback path, a revert-and-redeploy story, down-migrations, or a flag that can turn the change off at runtime. Deployment docs that only say how to go forward are worth quoting.*
  - Status: N/A
  - Proof: Nothing is deployed, for the reason given at the staged-rollout item. Worth naming for later: migrations in `apps/api/drizzle/` are forward-only (Drizzle has no down migrations, and `apps/api/src/server.ts` applies them on every start), so locally the only way back from a bad schema change is `git revert` plus `npm run db:seed`, which throws away local data.
  - Recommendation: —
  - Priority: Low

- [x] 46. Does a past failure leave a check behind — is there a test or a rule in here that exists because something broke once?
  *Look for tests, lint rules or comments that name the incident they guard against — "regression", "this broke when", a linked issue. On a very young repo with no failures yet, N/A with the age as the reason.*
  - Status: N/A
  - Proof: The repo is one commit old (`946961c`, 2026-10-21, the same day as this report). `git grep -niE 'regression|broke|bug|fixme|hack|workaround'` over `apps/*/src` and `packages` finds nothing. No failures have happened yet to leave a check behind.
  - Recommendation: —
  - Priority: Low

---

Learn more: **https://ainativesoftware.engineering/**
