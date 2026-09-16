# Migration Guide: Testing Library to the Svelte CLI Baseline

The maintained, detailed migration guide is
[`apps/website/src/copy/migration-guide.md`](apps/website/src/copy/migration-guide.md),
also published at
[sveltest.dev/docs/migration-guide](https://sveltest.dev/docs/migration-guide).
The website, documentation API, and full LLM documentation share those
sources, so CLI consumers receive the same guidance after deployment.

## New Projects

The official Svelte CLI now scaffolds Vitest browser component tests
and Node unit tests. No manual Testing Library migration is needed:

```bash
pnpm dlx sv@latest create my-app
cd my-app
pnpm dlx sv@latest add vitest="usages:unit,component" playwright
pnpm exec playwright install chromium
```

See [Getting Started](apps/website/src/copy/getting-started.md) for
the complete baseline configuration.

## Existing Projects

1. Install `vitest`, `@vitest/browser-playwright`,
   `vitest-browser-svelte`, and `playwright`. Keep `@playwright/test`
   for E2E tests.
2. Remove Testing Library, jest-dom, and jsdom dependencies only after
   migrating tests that use them. The direct `@vitest/browser`
   dependency is not needed for this setup.
3. Use `defineConfig` from `vitest/config`, `projects` instead of
   `workspace`, and `provider: playwright()` instead of the provider
   string. Configure
   `instances: [{ browser: 'chromium', headless: true }]` in the
   client project, not globally.
4. Keep `expect: { requireAssertions: true }` at the root of `test`.
   Replace assertion-free smoke tests with meaningful checks.
5. Import `page` from `vitest/browser`, replacing the old
   `@vitest/browser/context` entry point. Import `render` from
   `vitest-browser-svelte`; with version 3, await it. This import
   registers cleanup without a setup file. `page.render(...)` users
   can register the package in the client project's `setupFiles`.
6. Replace container queries with semantic locators and use
   `await expect.element(...)` for Vitest browser assertions.
7. Remove obsolete jsdom polyfills and type-reference setup files.
8. Colocate E2E tests, rename them to `.e2e.ts`, and configure
   Playwright with `testMatch: '**/*.e2e.{ts,js}'` rather than
   `testDir: 'e2e'`. Update imports and CI path filters when moving
   files.

## Runner Boundaries

| Files                                 | Runner                                       |
| ------------------------------------- | -------------------------------------------- |
| `src/**/*.svelte.{test,spec}.{js,ts}` | Vitest client, excluding `src/lib/server/**` |
| `src/**/*.{test,spec}.{js,ts}`        | Vitest Node, excluding component tests       |
| `**/*.e2e.{ts,js}`                    | Playwright against the built application     |

All test types can live beside their source. For example:

```text
src/routes/contact/
├── +page.svelte
├── +page.server.ts
├── page.svelte.test.ts
├── page.server.test.ts
├── page.ssr.test.ts
└── page.svelte.e2e.ts
```

A separate `ssr` project is a Sveltest extension, not a CLI
requirement. If you add it, include `src/**/*.ssr.{test,spec}.{js,ts}`
there and exclude those files from `server` to avoid duplicate runs.
See [SSR testing](apps/website/src/copy/ssr-testing.md).

If coverage includes every source file, exclude `**/*.e2e.{js,ts}`
from Vitest coverage. Playwright E2E assertions use
`await expect(locator)`, not Vitest's `expect.element`.

## Verify the Migration

```bash
pnpm test:unit --run
pnpm test:e2e --list
pnpm test:e2e
pnpm lint
```

Check that each runner collects only its own files and every active
test contains assertions. Use component tests for UI state and
Playwright for actual SvelteKit form submissions.

Official references:
[Vitest add-on](https://svelte.dev/docs/cli/vitest),
[Playwright add-on](https://svelte.dev/docs/cli/playwright), and
[Svelte testing](https://svelte.dev/docs/svelte/testing).
