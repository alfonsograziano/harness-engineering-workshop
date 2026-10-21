// The architecture rules from AGENTS.md, as checks. Run with `npm run arch`.
// Each `comment` is what the agent reads when a rule breaks, so it says what to do instead.

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'routes-use-services-only',
      severity: 'error',
      comment:
        'Routes must not touch data access. Move the query into a repository (apps/api/src/repositories/), ' +
        'call it from a service, and call the service from the route through app.services.',
      from: { path: '^apps/api/src/routes/' },
      to: { path: ['^apps/api/src/repositories/', '^apps/api/src/db/', 'node_modules/drizzle-orm/'] },
    },
    {
      name: 'services-do-not-query',
      severity: 'error',
      comment:
        'Services must not use Drizzle or the db schema directly. Add a method to the repository for this ' +
        'resource and take the repository as a dependency. Only services/index.ts wires the database in.',
      from: { path: '^apps/api/src/services/', pathNot: '^apps/api/src/services/index\\.ts$' },
      to: { path: ['^apps/api/src/db/', 'node_modules/drizzle-orm/'] },
    },
    {
      name: 'services-do-not-know-http',
      severity: 'error',
      comment:
        'Services must not depend on Fastify, requests or replies. Read the input in the route and pass plain ' +
        'values to the service; throw an AppError subclass from src/errors.ts to send an HTTP error.',
      from: { path: '^apps/api/src/services/' },
      to: { path: ['node_modules/fastify/', '^apps/api/src/routes/', '^apps/api/src/lib/current-user\\.ts$'] },
    },
    {
      name: 'web-does-not-import-api',
      severity: 'error',
      comment:
        'The web app must not import code from apps/api. Move the shared type or constant to packages/shared ' +
        'and import it from @tasklane/shared on both sides.',
      from: { path: '^apps/web/' },
      to: { path: '^apps/api/' },
    },
    {
      name: 'shared-is-a-leaf',
      severity: 'error',
      comment:
        'packages/shared is used by both apps, so it must not import from either of them. Keep it to types, ' +
        'constants and pure functions.',
      from: { path: '^packages/shared/' },
      to: { path: '^apps/' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'This import creates a cycle. Move the shared piece into its own module, or pass it in as a dependency ' +
        'the way services/index.ts does.',
      from: {},
      // A cycle that exists only through `import type` disappears at runtime, so it is allowed.
      to: { circular: true, viaOnly: { dependencyTypesNot: ['type-only'] } },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: ['\\.claude/', '_bmad', 'dist/'] },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.base.json' },
    combinedDependencies: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
