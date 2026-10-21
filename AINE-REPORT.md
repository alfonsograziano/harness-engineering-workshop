# AI-Native Readiness Report

**Repo:** `alfonsograziano/harness-engineering-workshop` (Tasklane), branch `harness` at commit `3856463`
**Date:** 2026-10-21
**Stack:** TypeScript on Node.js 24 (`.nvmrc`), npm workspaces monorepo with one root `package-lock.json`. `apps/api`: Fastify 5, TypeBox, Drizzle ORM on SQLite through the built-in `node:sqlite`, run with `tsx`. `apps/web`: React 19, Vite 8, React Router, TanStack Query. `packages/shared`: shared types and constants. Checks: Vitest 5, `tsc --noEmit`, Biome 2.5.15, Knip, dependency-cruiser. Git hooks with lefthook, CI on GitHub Actions, Claude Code hooks in `.claude/settings.json`, specs with BMAD Method v6.12.4.

**Result:** 41 passed, 2 failed, 3 not applicable (46 in total)

---

**How to read this.** Every item is a numbered question about this repo, answered from evidence in this repo. `Proof` is what was actually found — a path, a file, a command and its output. An item with no proof is not an answer. The italic line under each question says how to check it; it stays in the report so the next run checks the same way.

**FAIL vs N/A.** `FAIL` means the practice would help here and it is missing — including when a whole artifact is missing, so several questions about it fail together with a one-line proof pointing at the item that found it missing. `N/A` means the question could never apply to a project of this kind, and the proof says why. "It does not exist" is a FAIL, never an N/A.

`Priority` is fixed by the template, not by the person filling it in. **High** means an agent working here will hit this on day one, or the risk is real. **Low** means it makes things better but nothing breaks without it.

---

## 1. Context

- [x] 1. Does an agent instruction file exist (AGENTS.md, CLAUDE.md, .cursorrules, .github/copilot-instructions.md, or this ecosystem's equivalent), and what does it point at?
  *Look for a file whose purpose is to be loaded into a coding agent's context at the start of every session. That file is the **entry point**. Then follow its pointers: instructions are commonly spread across several files, with the entry point routing to them — "commands are in docs/development.md", "conventions in .claude/rules/". The entry point plus every file it points at is the **instruction set**, and every other agent-instruction question is answered against that whole set, so list it here in the proof. Follow pointers as deep as they go, but a pointer only counts when it names a target and says what is in it: "test commands are in CONTRIBUTING.md" counts, a bare "see the docs" does not, and a file nothing points at is outside the set however good it is. A README is not an entry point, however good — it gets its credit at the README item and the specs-and-architecture item — but a README the entry point explicitly routes to is inside the set. Vendored skill libraries are not instructions either.*
  - Status: PASS
  - Proof: The entry point is `CLAUDE.md`, which holds one line: `@AGENTS.md`. `AGENTS.md` (92 lines) routes by name and topic in its "More docs" section to `README.md` (what the app does, setup, the API), `.claude/rules/backend.md` (routes, schemas, services, repositories) and `.claude/rules/frontend.md` (data fetching, file layout, UI). The two rules files also carry `paths:` frontmatter (`apps/api/**`, `apps/web/**`), so Claude Code loads them on its own when the agent touches those folders. The instruction set is: `CLAUDE.md`, `AGENTS.md`, `README.md`, `.claude/rules/backend.md`, `.claude/rules/frontend.md`. `AGENTS.md` also names supporting files by purpose: `.claude/settings.json`, `.claude/agents/reviewer.md`, `.mcp.json`, `.dependency-cruiser.cjs`, `lefthook.yml`, `.github/workflows/ci.yml` and the spec folders in `_bmad-output/specs/`. The vendored `bmad-*` skills are not counted as instructions.
  - Recommendation: —
  - Priority: High

- [x] 2. Do the agent instructions name the commands to build, test and check this project?
  *Answer this against the instruction set mapped at the entry-point item and nothing outside it. If no entry point exists, FAIL with a one-line proof pointing at that item. The commands may sit in a file the entry point routes to rather than in the entry point itself — that is progressive disclosure working as intended, and it passes. What fails is a command an agent would have to guess its way to: if the commands live only in the README or the manifest and nothing in the set points at them, that is a FAIL, because the question measures what an agent can reach without being told where to look. Name the file each command was found in.*
  - Status: PASS
  - Proof: `AGENTS.md` has a "Commands" table with install, `npm run db:seed`, `npm run dev`, `npm run build`, `npm test`, `npm run test:watch`, `npm run typecheck`, `npm run lint`, `npm run format`, `npm run knip`, `npm run arch`, `npm run check` and `npm run db:generate`, plus how to add a dependency to one workspace (`npm install <pkg> -w @tasklane/api`). Its "Before you say you are done" section says `npm run check` must be green. `README.md` repeats the same scripts in its "Scripts" table.
  - Recommendation: —
  - Priority: High

- [x] 3. Does everything the agent instructions name still exist — the commands, the paths, the libraries, and the files they point at?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. Verify, do not trust: check every named command against the manifest or build file, spot-check the paths, run the cheap read-only ones. Then resolve every pointer in every file of the set — a link to a moved or deleted file is the most common rot in a multi-file instruction set, and it fails silently: the agent reads the entry point, follows nothing, and carries on without the rules.*
  - Status: PASS
  - Proof: Every command in the `AGENTS.md` table is a script in the root `package.json` (checked one by one). I ran `npm run check`: lint, arch, knip, 56 tests and typecheck all passed, in 8.6 s wall time (the file says "about 5 s", close enough). I checked 17 named paths, all present, among them `apps/api/src/lib/time.ts`, `apps/api/src/test/test-app.ts`, `apps/web/src/test/render.tsx`, `apps/web/src/api/query-keys.ts`, `apps/web/src/lib/labels.ts`, `apps/web/src/components/StatusSelect.tsx` and `.claude/skills/bmad-help`. Named symbols all exist in code: `nowIso`, `getCurrentUserId`, `mockApi`, `makeIssue`, `renderWithProviders`, `createTestServices`, `createTestApp`, `reserveIssueNumber`, `useUpdateIssue`, `ErrorResponseSchema`, `LABEL_COLORS` and others. The three links in "More docs" resolve. One small drift outside the set: story `1-labels-api.md` still says "There are no automated tests in the repo yet".
  - Recommendation: —
  - Priority: High

- [x] 4. Are the agent instructions specific to this repo, rather than advice that would read the same in any codebase?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. The test: could this be pasted into another project unchanged? "Write clean code" and "add tests for new features" would fit anywhere and count for nothing. Judge the whole set, but weigh the files differently: an entry point that is mostly a routing table is fine, even good, when what it routes to is specific — while generic filler in the entry point costs more than generic filler three hops down, because it is loaded into every session whether it is needed or not. Say which files carried the specifics.*
  - Status: PASS
  - Proof: Almost nothing here could be pasted into another repo. `AGENTS.md` names the real layers (`routes/ → services/ → repositories/`), the exact error shape `{ "error": { "code", "message", "details?" } }`, `nowIso()` for dates, the `x-user-id` header for the current user, and what to do when each check fails. `.claude/rules/backend.md` names `<verb><Resource>Schema`, `Type.Enum(ISSUE_STATUSES)`, `rows[0] ?? null` and `reserveIssueNumber()`. `.claude/rules/frontend.md` names `queryKeys`, `apiRequest<T>()`, `formatRelative()`, the `muted` class and `makeIssue()`. All three files carry specifics.
  - Recommendation: —
  - Priority: High

- [x] 5. Do the agent instructions explain where things live and how this project is laid out?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. The map may live in a routed-to file. Judge coverage against the real tree, not against what the files mention: if the set maps one package well but is silent about sibling packages or directories an agent would land in, that is a FAIL with the omission named. In a multi-file set, check the routing too — a layout document nothing points at is a document the agent never opens.*
  - Status: PASS
  - Proof: `AGENTS.md` "Map" covers `apps/api/src/` (routes, schemas, services, repositories, db, errors.ts), `apps/api/drizzle/`, `apps/web/src/` (api, components, pages) and `packages/shared/src/`. Folders the map leaves out are covered elsewhere in the set: `apps/api/src/lib/` and the test helpers in `apps/*/src/test/` are named in "Conventions"; `apps/web/src/lib/` is in the folder table of `.claude/rules/frontend.md`; `_bmad/` and `_bmad-output/` are in "Specs"; `.claude/` and `.github/` are in "Hooks and guardrails". `README.md` adds a full tree under "Project structure".
  - Recommendation: —
  - Priority: High

- [x] 6. Do the agent instructions state the rules that are not obvious from the code — the things never to do here?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. These are the tribal-knowledge traps: the flag that must be exactly this string, the import that breaks the build, the directory that is generated and must not be edited. Rules in a routed-to file count. Two extra checks in a multi-file set: that the entry point signposts the rules clearly enough for an agent to open them *before* it needs them, since a trap found afterwards has already been sprung; and that the files do not contradict each other, because nothing tells the agent which one wins.*
  - Status: PASS
  - Proof: The traps are written down and signposted in the entry point itself: never edit a committed migration (`AGENTS.md` Map and `backend.md` Database), never change the part inside `<frozen-after-approval>`, never call `reply.status(4xx).send(...)` by hand, do not edit `.dependency-cruiser.cjs` to pass, do not silence types with `any`, `as` or `!`, components never call `fetch`, never skip the pre-commit hook. I found no contradiction between `AGENTS.md`, the two rules files and the hook messages in `.claude/hooks/protect-files.mjs`.
  - Recommendation: —
  - Priority: Low

- [x] 7. Has the agent instruction file been updated recently enough to still be true, given how active the repo is?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at the entry-point item. Compare the last commit touching the file against the repo's tempo, then spot-check two or three of its claims against the code — a recently touched file can still lie.*
  - Status: PASS
  - Proof: `git log -- AGENTS.md`: last touched in `3856463` (2026-10-21 09:18), which is also the repo's newest commit. The repo has 20 commits, all on 2026-10-21. Spot checks hold: CI does run `npm run check`, the build and gitleaks on pull requests (`.github/workflows/ci.yml`); the denied commands match `.claude/settings.json`; `npm run check` runs lint, arch, knip, test, typecheck in that order (`package.json`).
  - Recommendation: —
  - Priority: Low

- [x] 8. Is the agent instruction file small enough to load into every session without crowding out the actual task?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at the entry-point item. Measure it: `wc -c`, and bytes divided by four is a fair token estimate. Under ~5k tokens is comfortable; past ~10k it is eating the context window.*
  - Status: PASS
  - Proof: `wc -c`: `CLAUDE.md` 11 bytes, `AGENTS.md` 6,782 bytes, so about 1.7k tokens load in every session. The scoped rules add about 1k tokens (`backend.md`, 3,928 bytes) or 0.8k tokens (`frontend.md`, 3,089 bytes), and only when the agent works in that app. Well under the 5k comfort line.
  - Recommendation: —
  - Priority: Low

- [x] 9. Can a fresh session pick up a half-finished task — is there a file or convention where progress, decisions and what is left get written down?
  *This is not about the agent instruction file. Any durable place in-flight state gets written counts: a TODO.md, a plans or notes directory, task files, linked issues, a specs folder whose entries carry progress and open questions, an agent memory file or directory, a scratchpad or working-notes convention. The test is whether a fresh session could read it and know what was decided and what is left — not what the place is called. Git history alone does not count: it records what happened, not what was decided or what remains.*
  - Status: PASS
  - Proof: The BMAD spec folder holds in-flight state: `_bmad-output/specs/spec-issue-labels/.memlog.md` is a decision log ("(decision) an issue has at most 5 labels; a 6th is rejected with a 400 so the list stays scannable"), `stories.yaml` sets the order of work, and each story file has a `status:` field plus "Implementation Notes", "Spec Change Log" and "Review Triage Log" sections. `AGENTS.md` tells the agent to read the story and its `SPEC.md` first. Small drift: both stories say `status: 'done'` but their task checkboxes are still `[ ]`.
  - Recommendation: —
  - Priority: Low

- [x] 10. Is there a README that says what this project is and how to run it?
  *This is where a good README earns its credit. It needs three things: what the project is, how to run it, and how to check a change. Judge what is on the page, not the file's existence.*
  - Status: PASS
  - Proof: `README.md` says what Tasklane is ("A small Linear-style issue tracker") and what it does, how to run it ("Getting started": Node 24, `npm install`, `npm run db:seed`, `npm run dev`, ports 5173 and 3001), and how to check a change (`npm run check` in the "Scripts" table, plus the "Using the harness" section).
  - Recommendation: —
  - Priority: High

## 2. Specs

- [x] 11. Is the thinking behind this system written down somewhere durable — a specs, RFC, proposals, design-doc or ADR directory, or architecture notes that record not just what but why?
  *Look for the place and for the convention: `specs/`, `docs/adr/`, `rfcs/`, `proposals/`, `.specify/`, a docs or design folder, architecture notes anywhere in the tree, or this ecosystem's equivalent. Judge substance, not location: "we use X because Y" is a decision, a list of technologies is not, an essay about specs is not a spec, and a docs folder of usage guides with no reasoning is a FAIL whose proof says what was in there instead. Other items are answered against whatever this item finds, so name it precisely — and where forward-looking specs and after-the-fact architecture records live in different places, name both, since a decision log cannot answer a question about acceptance criteria.*
  - Status: PASS
  - Proof: Forward-looking specs live in `_bmad-output/specs/spec-<slug>/`, with one entry today: `spec-issue-labels/` (`SPEC.md` with a "Why" section, constraints and non-goals; `stories.yaml`; two story specs). The reasons behind each choice are kept in `spec-issue-labels/.memlog.md` ("label color is picked from a fixed palette of 8 colors, so chips stay readable on the light UI"), and story 1's "Implementation Notes" record a deviation and why (the PUT schema moved to avoid a circular import). There is no separate ADR folder. The why behind the base design (Fastify, `node:sqlite`, the three layers) is written only in commit messages and, for the harness layers, in the "The harness, step by step" table of `README.md`.
  - Recommendation: —
  - Priority: High

- [x] 12. Does the specs directory hold recent entries, or is it an archive nobody has touched?
  *If no specs directory exists, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise compare the newest entry's date against the repo's recent activity.*
  - Status: PASS
  - Proof: The newest spec entries (`SPEC.md`, both stories, `.memlog.md` with `updated: 2026-10-21T09:01`) are from 2026-10-21, the same day as every commit in the repo. Commits `a0b8d19` and `63ca5f5` created and then updated them.
  - Recommendation: —
  - Priority: Low

- [x] 13. Is there a spec template, or an SDD framework, so every spec comes out the same shape?
  *Scaffolding can exist even where no specs directory does — look for a TEMPLATE.md, a `.specify/` directory, or framework config. If neither a directory nor any scaffolding exists, FAIL.*
  - Status: PASS
  - Proof: BMAD Method v6.12.4 is installed (`_bmad/_config/manifest.yaml`, `_bmad/config.toml` with `output_folder = "_bmad-output"`). It ships templates: `.claude/skills/bmad-spec/assets/spec-template.md`, `.claude/skills/bmad-build/spec-template.md` and `.claude/skills/bmad-prd/assets/prd-template.md`. Both stories follow the same shape (Intent, Boundaries, I/O matrix, Code Map, Tasks & Acceptance, Verification).
  - Recommendation: —
  - Priority: Low

- [x] 14. Do the specs state acceptance criteria a machine could check?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise open the two newest specs and quote a criterion: "the endpoint returns 403 for expired tokens" is checkable; "the feature works well" is not.*
  - Status: PASS
  - Proof: Story `1-labels-api.md` has an I/O matrix with checkable rows, for example "Duplicate name | `{ name: \"Bug\" }` when `bug` exists in WEB | No new label | 409 `CONFLICT`", plus Given/When/Then criteria. Story `2-labels-web.md`: "Given the board filtered by `bug`, when a `bug` label is removed from an issue in the panel, then that card leaves the board without a reload." `apps/api/src/routes/labels.test.ts` says it "Mirrors the I/O matrix" of story 1.
  - Recommendation: —
  - Priority: High

- [ ] 15. Open the newest spec: do its criteria go past the happy path — what happens when a step fails, and how the change gets undone?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Look for error cases, edge inputs, and a rollback or undo story, not just the success flow.*
  - Status: FAIL
  - Proof: The newest spec, `stories/2-labels-web.md`, has two failure rows ("Picker shows the API error message", "Duplicate name shows the 409 message") and nothing on how the change is undone. Story 1 covers many error cases (404, 409, 400 for color, project and count) but also has no undo story: it adds migration `apps/api/drizzle/0001_labels.sql` and says nothing about what happens if it must be reverted. `SPEC.md` has no rollback section either.
  - Recommendation: Add a "Rollback" row to the I/O matrix of each story in `_bmad-output/specs/spec-issue-labels/stories/` (for story 1: how to undo `0001_labels.sql` and what happens to `issue_labels` rows), and add a team override in `_bmad/custom/bmad-spec.toml` (a `persistent_facts` entry, the hook `.claude/skills/bmad-spec/customize.toml` documents) saying every story needs a rollback row, so new specs ask for it.
  - Priority: Low

- [x] 16. Do the specs state non-goals, so an agent knows where to stop?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Non-goals written elsewhere (a README's "what this is not" list) are worth naming in the proof, but they do not turn this into a PASS — the question is whether specs carry them.*
  - Status: PASS
  - Proof: `SPEC.md` has a "Non-goals" section ("Renaming, recoloring or deleting labels", "Filtering by more than one label at a time"). Each story has a "Never" list ("No drag and drop. No multi-label filter. No UI to rename, recolor or delete labels. No label management page.").
  - Recommendation: —
  - Priority: Low

- [x] 17. Can recent shipped work be traced back to a spec?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise take the last few substantial commits or PRs and look for a reference to a spec, an issue, or a design doc in the message or description.*
  - Status: PASS
  - Proof: The one product change since specs were adopted, `63ca5f5` "Build labels on issues from the spec", names the two stories in its message and updates both story files in the same commit. The spec itself came first in `a0b8d19`. The 11 commits after it are tooling (tests, typecheck, Biome, Knip, hooks, CI, reviewer); they have no spec, but each message explains why the layer exists and each maps to a row of the README step table.
  - Recommendation: —
  - Priority: Low

## 3. Verification

- [x] 18. Does this project have an automated test suite, in whatever form this ecosystem uses?
  *Work out this ecosystem's convention before concluding anything is missing — check the manifest, the build file, the CI config, the README. A shell script that diffs output files is a test suite. If you find one, run it and record the result.*
  - Status: PASS
  - Proof: Vitest, with a root `vitest.config.ts` that runs the `packages/*` and `apps/*` projects. 9 test files: API route tests with `fastify.inject`, service tests on an in-memory database, web component tests with Testing Library, and helper tests. I ran it inside `npm run check`: "Test Files 9 passed (9), Tests 56 passed (56)", 1.30 s.
  - Recommendation: —
  - Priority: High

- [x] 19. Can the test command be discovered without guessing — is it written down where an agent reads?
  *If no test suite exists, FAIL with a one-line proof pointing at the test-suite item. Otherwise check the places an agent looks: the agent instruction file, the README, the manifest's scripts or targets.*
  - Status: PASS
  - Proof: `npm test` is in the `AGENTS.md` Commands table, in the `README.md` Scripts table, and in `package.json` (`"test": "vitest run"`). `AGENTS.md` and both rules files also say where tests go and which helpers to use.
  - Recommendation: —
  - Priority: High

- [x] 20. Do the tests assert real behaviour, rather than asserting that a mock was called?
  *If no test suite exists, FAIL with a one-line proof pointing at the test-suite item. Otherwise open the largest test files and read the assertions: calling real code on real inputs passes; `expect(mock).toHaveBeenCalled()` as the main dish fails.*
  - Status: PASS
  - Proof: `apps/api/src/routes/labels.test.ts` (98 lines) calls the real app on a fresh in-memory database with real migrations and checks status codes and error codes (`expect(response.statusCode).toBe(409); expect(response.json().error.code).toBe('CONFLICT')`). `apps/api/src/services/labels.test.ts` (100 lines) runs real services. Web tests mock only `fetch` at the network edge and assert on the rendered page by role (`expect(await screen.findByRole('checkbox', { name: /bug/ })).toBeChecked()`). `grep` finds no `vi.mock` and no `toHaveBeenCalled` in any test file.
  - Recommendation: —
  - Priority: High

- [x] 21. Is there a linter or static analysis configured for this language, and does it pass on a clean checkout?
  *Configured is not enough — run it. A linter that exits non-zero on an untouched checkout is a FAIL with the error count in the proof, because an agent cannot tell its own damage from the baseline noise.*
  - Status: PASS
  - Proof: Biome 2.5.15 with the `recommended` rule set (`biome.json`), plus Knip (`knip.json`) and dependency-cruiser (`.dependency-cruiser.cjs`, six named rules). On this untouched checkout: `biome check .` "Checked 115 files in 25ms. No fixes applied.", `depcruise` "no dependency violations found (103 modules, 263 dependencies cruised)", `knip` printed nothing and exited 0.
  - Recommendation: —
  - Priority: High

- [x] 22. Is there a formatter, so an agent's diffs do not churn on style?
  *Look for the config file and the dependency in this ecosystem's form — .prettierrc, rustfmt, gofmt, black, an .editorconfig doing real work. If the language ships one formatting standard with the toolchain, that is a PASS and the proof says so.*
  - Status: PASS
  - Proof: Biome is also the formatter: `biome.json` sets `formatter.enabled: true`, 2 spaces, width 120, single quotes, and turns on import sorting. `npm run format` writes, `npm run lint` checks. The `.claude/hooks/check-file.mjs` hook formats every file the agent edits.
  - Recommendation: —
  - Priority: Low

- [x] 23. Is there a compile-time or type-level gate, if this language offers one?
  *N/A only when the language genuinely has no such gate. If the language offers one and the repo does not use it — no strict mode, no typecheck script, no compiler step — that is a FAIL. Run the gate if it exists and record the result.*
  - Status: PASS
  - Proof: `tsconfig.base.json` has `strict: true` plus `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch` and `noImplicitOverride`. `npm run typecheck` runs `tsc --noEmit` on the root and on `@tasklane/shared`, `@tasklane/api` and `@tasklane/web`. All four passed in my run.
  - Recommendation: —
  - Priority: Low

- [x] 24. Can an agent prove its own work before it pushes — one command, task-runner target or commit hook that runs every check this project has?
  *One command, not a list to remember: a `check` or `verify` target, a `precommit` script, a Makefile target that chains them. Separate commands documented side by side are close but FAIL — the question is whether the agent can run the whole gauntlet without knowing its parts.*
  - Status: PASS
  - Proof: `npm run check` runs `lint && arch && knip && test && typecheck`, so every check in the repo, and stops at the first failure. It passed in 8.6 s. It is also wired in three more places: the Claude Code Stop hook (`.claude/hooks/check-all.mjs`) runs it when the tree changed and blocks the agent while it is red; the lefthook pre-commit runs lint, typecheck and gitleaks; CI runs it on every pull request.
  - Recommendation: —
  - Priority: High

- [x] 25. Is there continuous integration, and does it run before a change lands rather than after?
  *A deploy pipeline that runs on push to the default branch runs after the change has landed — that is a FAIL with the trigger quoted, not a PASS with a caveat. Look for a pre-merge trigger: pull_request events, merge trains, or this forge's equivalent.*
  - Status: PASS
  - Proof: `.github/workflows/ci.yml` triggers `on: pull_request:` and on `push: branches: [main]`. The remote is GitHub (`origin` is `github.com/alfonsograziano/harness-engineering-workshop`). Branch protection that makes the check required is not visible from the repo.
  - Recommendation: —
  - Priority: High

- [x] 26. Does CI actually run the tests and the checks that exist in this repo?
  *If no pipeline of any kind exists, FAIL with a one-line proof pointing at the CI item. Otherwise list what the pipeline runs and diff it against every check found in the Verification section — name each check that exists in the repo but is missing from the pipeline.*
  - Status: PASS
  - Proof: The `check` job runs `npm ci`, `npm run check` (lint, arch, knip, test, typecheck) and `npm run build`. The `secrets` job runs `gitleaks/gitleaks-action@v3` over the full history (`fetch-depth: 0`). Every check found in this section is in the pipeline; none is missing.
  - Recommendation: —
  - Priority: High

- [x] 27. Does anything here get an LLM to read a change and go looking for problems — a review skill, a saved review prompt, or an AI reviewer on the pull requests?
  *Look for a committed review skill or slash command, a CI step calling an AI reviewer, or bot config. Human review rules are a Safety item; this one is specifically about machine review.*
  - Status: PASS
  - Proof: `.claude/agents/reviewer.md` is a read-only subagent told to "Assume the diff contains at least one real bug", with a hunt list and a severity format. `.claude/skills/adversarial-review/SKILL.md` runs it on the diff and sorts findings into fix now, discuss and rejected. `AGENTS.md` tells the agent to run `/adversarial-review` before a pull request. The BMAD `bmad-code-review` skill is there too. There is no AI reviewer in CI.
  - Recommendation: —
  - Priority: Low

## 4. Tooling

- [x] 28. Can an agent reach the outside systems this project depends on, with that access committed to the repo rather than set up per laptop?
  *MCP servers are one form: look for a committed `.mcp.json` or this ecosystem's equivalent. A CLI is another and often the better one — `aws`, `gh`, `psql`, `kubectl`, `stripe`, a vendor's own tool — and it counts when the repo names which tools the work needs and how to authenticate, so an agent is not guessing at a tool it cannot see. Judge the axis, not the mechanism: access that exists only in someone's shell history or laptop config is a FAIL, and so is a committed config that turns out to be gitignored, with the distinction in the proof. Project task scripts have their own item; this one is about reaching past the repo's edge. If this project genuinely talks to nothing outside itself, N/A with that as the reason.*
  - Status: PASS
  - Proof: The app itself reaches nothing outside the repo: SQLite through the built-in `node:sqlite`, no outside APIs in `apps/api/src/config.ts`. The one outside system the work needs is a browser to look at the UI, and that is committed: `.mcp.json` runs `@playwright/mcp@0.0.83` (exact version, `--isolated`), and `git check-ignore` confirms the file is not ignored. `AGENTS.md` says when to use it and says curl is faster for the API. The `gh` CLI is not named, although `AGENTS.md` asks the agent to wait for green CI before review.
  - Recommendation: —
  - Priority: Low

- [x] 29. Is there a skills, commands or reusable-prompt library in the repo?
  *Look for .claude/skills, .agents/skills, .claude/commands, or a prompts directory. Committed and pinned beats committed; note whether anything ties the copies to a source.*
  - Status: PASS
  - Proof: `.claude/skills/` holds two project skills, `add-api-endpoint` (with seven example files) and `adversarial-review`, plus the BMAD `bmad-*` skills. `.claude/agents/reviewer.md` is a subagent. The BMAD copies are tied to a source: `_bmad/_config/manifest.yaml` pins `version: 6.12.4` and `_bmad/_config/files-manifest.csv` lists the installed files.
  - Recommendation: —
  - Priority: Low

- [x] 30. Do the skills, servers and tools that exist cover the work this team plainly repeats?
  *First identify the repeated work from the README and the commit history. If skills, servers or documented tooling exist but miss it, FAIL naming the gap. If none exist at all and the repo plainly repeats work, FAIL pointing at the outside-systems item and the skills-library item. If the project is too small to repeat anything, N/A.*
  - Status: PASS
  - Proof: The repeated work seen in `README.md` and the history is: add an endpoint end to end (the `add-api-endpoint` skill), spec a feature then build it story by story (the `bmad-spec` and `bmad-build` skills), check a UI change (Playwright MCP), review a change (`/adversarial-review`), change the database (`npm run db:generate`, documented in `AGENTS.md` and `backend.md`). Each one has a tool.
  - Recommendation: —
  - Priority: Low

- [x] 31. Are there project CLI scripts or task-runner targets for the common jobs?
  *Check the manifest's scripts, the Makefile, the justfile, or this ecosystem's equivalent. The test: does routine work need a raw multi-flag command that someone has to remember?*
  - Status: PASS
  - Proof: Root `package.json` has 14 scripts: `dev`, `build`, `db:seed`, `db:generate`, `test`, `test:watch`, `typecheck`, `lint`, `format`, `knip`, `arch`, `check`, `prepare`. The longest raw commands (`concurrently --names api,web ...`, `depcruise apps packages --config .dependency-cruiser.cjs --output-type err-long`) are wrapped, so no routine job needs a remembered flag.
  - Recommendation: —
  - Priority: High

- [x] 32. Are those scripts named somewhere the agent will actually read them?
  *If no scripts exist, FAIL with a one-line proof pointing at the task-scripts item. Otherwise check the agent instruction file, the README, and whether the manifest itself is self-explanatory.*
  - Status: PASS
  - Proof: The scripts are listed with a one-line purpose in the `AGENTS.md` Commands table and the `README.md` Scripts table.
  - Recommendation: —
  - Priority: High

- [x] 33. Can an agent get this project running — is there a reproducible environment or a documented setup path?
  *Look for a pinned runtime (.nvmrc, .tool-versions, rust-toolchain), a lockfile, a container or nix file, and written setup steps. Try the first step if it is cheap and safe. This one bites hardest the moment work happens in a fresh git worktree or a new clone — the normal way to run agents in parallel. A new worktree has no installed dependencies, no `.env`, no build cache, so anything that works today only because of untracked state sitting on someone's machine simply does not run there. The test: would a bare checkout plus the written steps get this project up? Name any prerequisite nothing creates — an env file someone hand-made, a seeded database, a manual login — because each one is a wall a worktree hits on its first command.*
  - Status: PASS
  - Proof: Runtime is pinned (`.nvmrc` = `24`, `engines.node >=24.0.0`), there is one root `package-lock.json`, and `README.md` "Getting started" gives three steps: `npm install`, `npm run db:seed`, `npm run dev`. Nothing untracked is needed: no `.env` (every setting in `apps/api/src/config.ts` has a default), the database is created by `db:seed` and migrations run at server start, and tests use an in-memory database. This worktree has no `apps/api/data/` yet and `npm run check` still passed after only `npm ci`. gitleaks is optional locally and the hook says so. I did not run `db:seed`, because it writes to the repo folder.
  - Recommendation: —
  - Priority: High

- [x] 34. Can an agent see the results of a failed run — do the tools here produce output it can read and act on?
  *Judge from the runs you already did in Verification: does a failure print a path, a line, a name — something actionable — or a wall of noise? If nothing could be run, FAIL saying why.*
  - Status: PASS
  - Proof: My runs printed clear summaries (Biome file count, dependency-cruiser module count, Vitest per-file results). On failure, these tools print a file and line: `tsc` and Biome do, dependency-cruiser runs with `--output-type err-long` and each rule in `.dependency-cruiser.cjs` has a `comment` saying what to do instead. The hooks pass the last 60 to 80 lines of the failing output back to the agent (`tail()` in `.claude/hooks/lib.mjs`). I did not force a failure, since that would mean writing to the repo.
  - Recommendation: —
  - Priority: Low

## 5. Safety

- [x] 35. Are credentials kept out of the repo — nothing secret committed, ignore rules in place, an example env file for the shape?
  *Three checks: grep tracked files for key-shaped strings, read the ignore rules for env and key patterns, and look for an example env file. Report each of the three separately.*
  - Status: PASS
  - Proof: Three checks. (1) A `git grep` of tracked files for AWS keys, `sk-`, `ghp_`, Slack tokens, private-key headers and `api_key/secret/password/token = "..."` found nothing. (2) `.gitignore` ignores `.env` and `.env.*` (and allows `.env.example`), and `.claude/settings.json` denies the agent `Read(**/.env)`. (3) There is no example env file, but none is needed: the app reads only `PORT`, `HOST`, `DATABASE_PATH` and `LOG_LEVEL`, all optional with defaults, and none is a secret. These four are written down only in `apps/api/src/config.ts` and `apps/api/src/server.ts`.
  - Recommendation: —
  - Priority: High

- [x] 36. Does anything scan for secrets automatically?
  *Look for gitleaks, trufflehog, detect-secrets or this ecosystem's equivalent, wherever it is wired in — a CI step, a pre-commit hook, or forge-level push protection visible from the repo. CI is where this normally lives, and that is a PASS; a local hook on top is better, because it catches the key before it is pushed rather than after, but its absence is a line in the proof, not a FAIL. Say where the scan runs. "Nothing secret exists today" does not make this N/A — the scan is for the day that changes.*
  - Status: PASS
  - Proof: gitleaks runs in CI in the `secrets` job of `.github/workflows/ci.yml`, over every commit of the branch (`fetch-depth: 0`). It also runs locally in the lefthook pre-commit (`gitleaks git --pre-commit --staged --redact`), but that job exits 0 with a message when gitleaks is not installed, so locally it is best effort.
  - Recommendation: —
  - Priority: High

- [x] 37. Are dependencies pinned, so a build is reproducible?
  *Look for lockfiles in every package of the repo, exact versions for load-bearing dependencies, a pinned runtime, and an install command that respects the lock (npm ci, not npm install).*
  - Status: PASS
  - Proof: One root `package-lock.json` covers all three workspaces (npm workspaces use a single lockfile). CI installs with `npm ci`. Node is pinned to major 24 in `.nvmrc`. Manifests use caret ranges for most dependencies, Biome is exact (`2.5.15`) and TypeScript is tilde (`~5.9.3`); the lockfile fixes the rest. `.claude/hooks/protect-files.mjs` blocks hand edits to the lockfile. The README setup uses `npm install`, not `npm ci`.
  - Recommendation: —
  - Priority: High

- [ ] 38. Is anything watching those dependencies for known vulnerabilities?
  *Look for dependabot or renovate config, an audit step in CI, or this ecosystem's equivalent. Check every lockfile in the repo is covered, not just the root one.*
  - Status: FAIL
  - Proof: No `.github/dependabot.yml`, no `renovate.json` or other Renovate config (`git ls-files` shows only `.github/workflows/ci.yml` under `.github/`), and no `npm audit` step in `ci.yml` or in `npm run check`. Nothing watches the single `package-lock.json`.
  - Recommendation: Add `.github/dependabot.yml` with an `npm` entry for directory `/` (the one lockfile covers all three workspaces) and a `github-actions` entry, and add `npm audit --audit-level=high` as a step in the `check` job of `.github/workflows/ci.yml`.
  - Priority: Low

- [x] 39. Are the review rules written down — who reads a change, and what they check?
  *Look for CONTRIBUTING, a PR template, or a review checklist in the agent instruction set. On a solo repo the "who" is N/A-shaped but the "what gets checked before it lands" still matters — judge that half.*
  - Status: PASS
  - Proof: This is a solo repo (all 20 commits by one author), so the "who" half does not apply. The "what gets checked" half is written down: `AGENTS.md` "Before you say you are done" (green `npm run check`, a test for new behavior, a UI look with Playwright MCP, README updated when a command or endpoint changes), "run `/adversarial-review` before a pull request", and "a pull request is ready for review only when CI is green". `.claude/agents/reviewer.md` lists what the review hunts for. There is no CONTRIBUTING, PR template or CODEOWNERS.
  - Recommendation: —
  - Priority: Low

- [x] 40. Are the operations that need a human named somewhere an agent will read them?
  *Look for a "never without asking" list in the agent instruction file or the README. Docs that hand out production commands with no fence around them count against, and the proof should quote one.*
  - Status: PASS
  - Proof: `AGENTS.md` "Hooks and guardrails" names what is blocked or denied: edits to committed migrations, Drizzle metadata, the lockfile, `.env` files and the harness configs; reading `.env`, `git push --force`, `git commit --no-verify` and `rm -r`. The "Specs" section says the `<frozen-after-approval>` part "is the human's decision". The hook messages say what to hand to a human ("Ask the human to change them", "stop and explain why to the human"). No production command appears in the docs. The one destructive command, `npm run db:seed`, is described as deleting the local database, which is dev data only.
  - Recommendation: —
  - Priority: High

- [x] 41. Does every action that spends money, destroys data or changes production have a human in the way?
  *Start from the damage, not from the tooling: list what in reach of this repo could charge a card, drop or overwrite data, or alter what users are running. Then trace the shortest route an agent could take to each one — a push that auto-deploys, a script carrying live credentials, a migration that runs on merge, an infrastructure apply with no plan-and-approve step. PASS when every route meets a human first, whether that is a review, a manual trigger or a protected environment. FAIL when even one route runs start to finish unattended, and quote that route in the proof so the fix is obvious.*
  - Status: PASS
  - Proof: What could do damage from here: nothing charges money; there is no deploy step in `.github/workflows/ci.yml` (it runs checks, the build and gitleaks only) and no hosting or infra config in the tree, so nothing changes what users run; the only data is the local SQLite file in the gitignored `apps/api/data/`, which `npm run db:seed` rebuilds. History rewrites are fenced: `.claude/settings.json` denies `git push --force`, `rm -r` and `--no-verify`. A plain `git push` to `main` is not denied, but it only triggers checks.
  - Recommendation: —
  - Priority: High

- [x] 42. If a prompt injection landed tonight, how far would it reach — are the credentials an agent can get to here scoped to the job, with nothing production-grade in reach?
  *Inventory what an agent in this repo can reach: env files, cloud CLI profiles, tokens named in docs or config, deploy commands that work from a laptop. Scoped-or-absent passes; production-grade reach fails with the item named.*
  - Status: PASS
  - Proof: Nothing production-grade is in reach from the repo: no env files are tracked or needed, no cloud CLI profile or token is named in any doc or config, and no deploy command exists. The agent is denied reading `.env` files. CI uses only the built-in `GITHUB_TOKEN` with `permissions: contents: read`. The Playwright MCP runs `--isolated`, with no saved browser profile.
  - Recommendation: —
  - Priority: High

- [x] 43. Can a change reach production a slice at a time — a feature flag that defaults to off, a canary, a staged rollout — rather than everyone at once?
  *Look for a flag system and check the default, or canary and staged-rollout config in the deploy pipeline. Flags that need a rebuild to flip are worth naming in the proof — they gate exposure but they are not a kill switch.*
  - Status: N/A
  - Proof: There is no production to roll out to. The repo has no deploy workflow, no hosting, container or infra config, and `README.md` presents it as the sample app of a workshop that runs on localhost. A staged rollout cannot apply until a deploy exists. This becomes a real question the day one is added.
  - Recommendation: —
  - Priority: High

- [x] 44. Once a change is live, can anyone see what it is doing — logs, metrics, traces, alerts that fire on their own, and can an agent read them too?
  *Look for logging setup, an error tracker, analytics, alerting config — and then ask the second half: could an agent reach any of it (a CLI, an MCP server, an API named in the docs), or does observability stop at a dashboard behind a login?*
  - Status: N/A
  - Proof: Nothing goes live, for the same reason as the rollout item: no deploy target exists. Locally there is logging an agent can read: Fastify's logger writes to stdout (`logger: { level: process.env.LOG_LEVEL ?? 'info' }` in `apps/api/src/server.ts`), and unknown errors are logged as `INTERNAL_ERROR` by `apps/api/src/errors.ts`. Alerts and an error tracker would only matter with a production.
  - Recommendation: —
  - Priority: Low

- [x] 45. Is there a way back — can a bad change be undone without a rebuild and a redeploy, including the ones that touched a database or a queue?
  *Look for a documented rollback path, a revert-and-redeploy story, down-migrations, or a flag that can turn the change off at runtime. Deployment docs that only say how to go forward are worth quoting.*
  - Status: N/A
  - Proof: There is no deploy to undo, for the same reason as the rollout item. Worth knowing for the day one is added: migrations are forward-only (`apps/api/drizzle/0001_labels.sql` has no down path, and `backend.md` says to write a new migration rather than edit one), and today the only way back for the database is `npm run db:seed`, which deletes and rebuilds it.
  - Recommendation: —
  - Priority: Low

- [x] 46. Does a past failure leave a check behind — is there a test or a rule in here that exists because something broke once?
  *Look for tests, lint rules or comments that name the incident they guard against — "regression", "this broke when", a linked issue. On a very young repo with no failures yet, N/A with the age as the reason.*
  - Status: PASS
  - Proof: Two rules exist because of failures found in this repo. Knip found ten unused exports, and the rule that caused four of them was changed: `backend.md` now says "Export `type <Resource>Service` ... only when another service takes it as a dependency; `npm run knip` flags an export nobody uses" (commit `f04f440`). The stricter compiler options found 15 happy-path errors such as `rows[0].id`, and they left behind `noUncheckedIndexedAccess` in `tsconfig.base.json` and the `singleRow()` helper in `apps/api/src/db/rows.ts` ("a missing row there is a bug, not a 404") (commit `cf4a3e8`). The incidents are named in commit messages, not in the files. `AGENTS.md` adds: "A bug fix starts with a failing test."
  - Recommendation: —
  - Priority: Low

---

Learn more: **https://ainativesoftware.engineering/**
