// Keeps build-time code out of the app bundle. src/ is the app, build/ runs
// only at build time, and shared/ is what both use.
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-app-to-build',
      comment: 'build/ is build-time only; move what src/ needs into shared/.',
      severity: 'error',
      from: { path: '^(src|shared)/' },
      to: { path: '^build/' },
    },
    {
      name: 'no-build-to-app',
      comment:
        'src/ is the app; move what build/ or shared/ needs into shared/.',
      severity: 'error',
      from: { path: '^(build|shared)/' },
      to: { path: '^src/' },
    },
    {
      name: 'schemas-types-only',
      comment:
        'The zod schemas validate at build time; the app may take only their inferred types, so zod stays out of the bundle.',
      severity: 'error',
      from: { path: '^(src|shared)/', pathNot: '^shared/schemas/' },
      to: { path: '^shared/schemas/', dependencyTypesNot: ['type-only'] },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    // swc rather than tsc, which dependency-cruiser can't load at TypeScript 7.
    // It parses `import type` too, tagging it type-only, which is what lets
    // `schemas-types-only` tell a type import from a value import.
    parser: 'swc',
    tsConfig: { fileName: 'tsconfig.json' },
  },
}
