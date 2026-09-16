# Getting Started

Sveltest is a reference guide and example project for testing Svelte
and SvelteKit. Its baseline follows the official Svelte CLI: Vitest
for unit and browser component tests, plus Playwright for E2E tests.
This is the CLI default, not the only supported testing approach.

## Set Up Your Project

```bash
pnpm dlx sv@latest create my-testing-app
cd my-testing-app
pnpm dlx sv@latest add vitest="usages:unit,component" playwright
pnpm exec playwright install chromium
```

You can also select these add-ons during project creation. Choose both
unit and component testing for Vitest. The CLI installs Vitest,
`@vitest/browser-playwright`, `vitest-browser-svelte`, and Playwright.
A fresh scaffold does not need a Testing Library or jsdom migration.
For an existing setup, see the
[migration guide](/docs/migration-guide).

Official references:
[Vitest add-on](https://svelte.dev/docs/cli/vitest) and
[Playwright add-on](https://svelte.dev/docs/cli/playwright).

## Vitest Configuration

The generated configuration separates tests by filename. Keep your
existing application plugins; the important part is `test`:

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }],
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
				},
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				},
			},
		],
	},
});
```

Importing `render` from `vitest-browser-svelte` registers automatic
cleanup; this pattern does not require `setupFiles`. Sveltest uses
version 3 of the renderer, so its examples use `await render(...)`. If
you use `page.render(...)` instead of importing `render`, register
`vitest-browser-svelte` in the client project's `setupFiles`.

If TypeScript cannot find the renderer's browser types, add
`vitest-browser-svelte` to your existing `compilerOptions.types`.

## Colocate Every Test Type

```text
src/
├── lib/components/
│   ├── button.svelte
│   ├── button.svelte.test.ts
│   └── button.ssr.test.ts
└── routes/
    ├── +page.svelte
    ├── +page.server.ts
    ├── page.svelte.test.ts
    ├── page.server.test.ts
    ├── page.ssr.test.ts
    └── page.svelte.e2e.ts
```

| Filename                              | Runner                                     | Purpose                                       |
| ------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| `*.svelte.test.ts`                    | Vitest client                              | Components in real Chromium                   |
| `*.test.ts` excluding component tests | Vitest server                              | Utilities, load functions, actions, endpoints |
| `*.ssr.test.ts`                       | Vitest Node; optional separate SSR project | Server-rendered HTML                          |
| `*.e2e.ts`                            | Playwright                                 | Complete application workflows                |

Vitest also accepts `.spec.ts` and JavaScript equivalents. Playwright
uses `.e2e.ts` or `.e2e.js`, not `.spec.ts` in this setup, so neither
runner collects the other's tests. Colocation is supported, not newly
required. Put cross-route journeys at the nearest shared route
directory; no separate `e2e/` directory is needed.

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
	},
	testMatch: '**/*.e2e.{ts,js}',
});
```

See [E2E testing](/docs/e2e-testing) for full browser workflows.

### Optional SSR Project

The CLI scaffold has two Vitest projects, `client` and `server`.
Sveltest adds `ssr` to run rendering tests independently. Add its
include pattern and exclude those files from `server` to avoid
duplicate runs; see [SSR testing](/docs/ssr-testing) for the
configuration.

Sveltest uses Vite+ for development, builds, tests, linting,
formatting, and CLI packaging. Its Vite core alias and Vitest
dependencies are aligned with the bundled toolchain. Repository tests
import from `vite-plus/test` and `vite-plus/test/browser`; the guide
examples keep standard Vitest imports so they work with the official
Svelte CLI scaffold. See
[Vite+ migration notes](/docs/migration-guide#projects-using-vite).

Our headless browser tests disable the runner UI to avoid scaled click
targets. This and the temporary browser runner workaround are
repository-specific, not scaffold requirements.

## Run Tests

```bash
pnpm test:unit --run
pnpm test:e2e
```

In this repository, `pnpm test:ssr --run` runs the optional SSR
project.

## Understanding the Client-Server Alignment Strategy

Before diving into component testing, it's important to understand the
**Client-Server Alignment Strategy** that guides this testing
approach:

### The Four-Layer Approach

1. **Shared Validation Logic**: Use the same validation functions on
   both client and server
2. **Real FormData/Request Objects**: Server tests use real web APIs,
   not mocks
3. **TypeScript Contracts**: Shared interfaces catch mismatches at
   compile time
4. **E2E Tests**: Final safety net for complete integration validation

### Why This Matters

Traditional testing with heavy mocking can pass while production fails
due to client-server mismatches. This strategy ensures your tests
catch real integration issues:

```typescript
// ❌ BRITTLE: Heavy mocking hides real issues
const mock_request = { formData: vi.fn().mockResolvedValue(...) };

// ✅ ROBUST: Real FormData catches field name mismatches
const form_data = new FormData();
form_data.append('email', 'user@example.com');
const request = new Request('http://localhost/api/register', {
	method: 'POST',
	body: form_data,
});
```

This multi-project Vitest setup supports this strategy by keeping
client, server, and SSR tests separate while maintaining shared
validation logic.

## Write Your First Test

Let's create a simple button component and test it step-by-step **in
your own project**.

### Step 1: Create a Simple Component

Create `src/lib/components/my-button.svelte`:

```svelte
<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary';
		disabled?: boolean;
		onclick?: () => void;
		children: any;
	}

	let {
		variant = 'primary',
		disabled = false,
		onclick,
		children,
	}: Props = $props();
</script>

<button
	class="btn btn-{variant}"
	{disabled}
	{onclick}
	data-testid="my-button"
>
	{@render children()}
</button>
```

### Step 2: Write Your First Test

Create `src/lib/components/my-button.svelte.test.ts`:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { createRawSnippet } from 'svelte';
import MyButton from './my-button.svelte';

describe('MyButton', () => {
	it('should render with correct text', async () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Click me</span>`,
		}));

		await render(MyButton, { children });

		const button = page.getByRole('button', { name: 'Click me' });
		await expect.element(button).toBeInTheDocument();
	});

	it('should handle click events', async () => {
		const click_handler = vi.fn();
		const children = createRawSnippet(() => ({
			render: () => `<span>Click me</span>`,
		}));

		await render(MyButton, { onclick: click_handler, children });

		const button = page.getByRole('button', { name: 'Click me' });
		await button.click();

		expect(click_handler).toHaveBeenCalledOnce();
	});

	it('should apply correct variant class', async () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Secondary</span>`,
		}));

		await render(MyButton, { variant: 'secondary', children });

		const button = page.getByTestId('my-button');
		await expect.element(button).toHaveClass('btn-secondary');
	});
});
```

Time to test it out!

### Step 3: Run Your Test

If you already have `pnpm run test:unit` running it should update in
watch mode!

You can test on a component basis too, this is handy if you have a lot
of tests and want to isolate what you're testing:

```bash
# run once
pnpm vitest run src/lib/components/my-button.svelte
# use watch mode
pnpm vitest src/lib/components/my-button.svelte
```

You should see all tests pass! 🎉

## Understanding the Test Structure

Let's break down what makes this test work with Vitest Browser Mode:

### Essential Imports

```typescript
import { describe, expect, it, vi } from 'vitest'; // Test framework
import { render } from 'vitest-browser-svelte'; // Svelte rendering
import { page } from 'vitest/browser'; // Browser interactions
import { createRawSnippet } from 'svelte'; // Svelte 5 snippets
```

### The Golden Rule: Always Use Locators

Following the official Vitest Browser documentation, **always use
locators** for reliable, auto-retrying queries:

```typescript
// ✅ DO: Use page locators (auto-retry, semantic)
const button = page.getByRole('button', { name: 'Click me' });
await button.click();

// ❌ DON'T: Use containers (no auto-retry, manual queries)
const { container } = render(MyButton);
const button = container.querySelector('button');
```

### Locator Hierarchy (Use in This Order)

Following Vitest Browser best practices:

1. **Semantic roles** (best for accessibility):

   ```typescript
   page.getByRole('button', { name: 'Submit' });
   page.getByRole('textbox', { name: 'Email' });
   ```

2. **Labels** (good for forms):

   ```typescript
   page.getByLabel('Email address');
   ```

3. **Text content** (good for unique text):

   ```typescript
   page.getByText('Welcome back');
   ```

4. **Test IDs** (fallback for complex cases):
   ```typescript
   page.getByTestId('submit-button');
   ```

### Critical: Handle Multiple Elements

Vitest Browser operates in **strict mode** - if multiple elements
match, you'll get an error:

```typescript
// ❌ FAILS: "strict mode violation" if multiple elements match
page.getByRole('link', { name: 'Home' });

// ✅ CORRECT: Use .first(), .nth(), .last() for multiple elements
page.getByRole('link', { name: 'Home' }).first();
page.getByRole('link', { name: 'Home' }).nth(1); // Second element (0-indexed)
page.getByRole('link', { name: 'Home' }).last();
```

## Common Patterns You'll Use Daily

### Testing Form Inputs

```typescript
it('should handle form input', async () => {
	await render(MyInput, { label: 'Email', type: 'email' });

	const input = page.getByLabel('Email');
	await input.fill('user@example.com');

	await expect.element(input).toHaveValue('user@example.com');
});
```

### Testing Conditional Rendering

```typescript
it('should show error message when invalid', async () => {
	await render(MyInput, {
		label: 'Email',
		error: 'Invalid email format',
	});

	await expect
		.element(page.getByText('Invalid email format'))
		.toBeInTheDocument();
});
```

### Testing Loading States

```typescript
it('should show loading state', async () => {
	const children = createRawSnippet(() => ({
		render: () => `<span>Loading...</span>`,
	}));

	await render(MyButton, { loading: true, children });

	await expect.element(page.getByRole('button')).toBeDisabled();
	await expect
		.element(page.getByText('Loading...'))
		.toBeInTheDocument();
});
```

### Testing Svelte 5 Runes

Use `untrack()` when testing derived state:

```typescript
import { untrack, flushSync } from 'svelte';

it('should handle reactive state', () => {
	let count = $state(0);
	let doubled = $derived(count * 2);

	expect(untrack(() => doubled)).toBe(0);

	count = 5;
	flushSync(); // Ensure derived state updates
	expect(untrack(() => doubled)).toBe(10);
});
```

## Quick Wins: Copy These Patterns

### The Foundation First Template

This is Sveltest's planning convention, not a Svelte CLI requirement.
Keep unfinished cases skipped; every enabled test must assert a
meaningful outcome because `expect.requireAssertions` is enabled.

```typescript
describe('ComponentName', () => {
	describe('Initial Rendering', () => {
		it.skip('should render with default props', async () => {
			// Implement the test and add assertions before enabling it
		});

		it.skip('should render with all prop variants', async () => {
			// TODO: Test different prop combinations
		});
	});

	describe('User Interactions', () => {
		it.skip('should handle click events', async () => {
			// TODO: Test user interactions
		});
	});

	describe('Edge Cases', () => {
		it.skip('should handle empty data gracefully', async () => {
			// TODO: Test edge cases
		});
	});
});
```

### The Mock Verification Pattern

Always verify your mocks work:

```typescript
describe('Mock Verification', () => {
	it('should have utility functions mocked correctly', async () => {
		const { my_util_function } =
			await import('#lib/utils/my-utils.js');

		expect(my_util_function).toBeDefined();
		expect(vi.isMockFunction(my_util_function)).toBe(true);
	});
});
```

### The Accessibility Test Pattern

```typescript
it('should be accessible', async () => {
	const children = createRawSnippet(() => ({
		render: () => `<span>Submit</span>`,
	}));

	await render(MyComponent, { children });

	const button = page.getByRole('button', { name: 'Submit' });
	await expect.element(button).toHaveAttribute('aria-label');

	// Test keyboard navigation
	await page.keyboard.press('Tab');
	await expect.element(button).toBeFocused();
});
```

## Common First-Day Issues

### "strict mode violation: getByRole() resolved to X elements"

**Most common issue** with Vitest Browser Mode. Multiple elements
match your locator:

```typescript
// ❌ FAILS: Multiple nav links (desktop + mobile)
page.getByRole('link', { name: 'Home' });

// ✅ WORKS: Target specific element
page.getByRole('link', { name: 'Home' }).first();
```

### "My test is hanging, what's wrong?"

Usually caused by clicking form submit buttons with SvelteKit enhance.
Test form state directly:

```typescript
// ❌ Can hang with SvelteKit forms
await submit_button.click();

// ✅ Test the state directly
await render(MyForm, { errors: { email: 'Required' } });
await expect.element(page.getByText('Required')).toBeInTheDocument();
```

### "Expected 2 arguments, but got 0"

Your mock function signature doesn't match the real function:

```typescript
// ❌ Wrong signature
vi.mock('#lib/utils.js', () => ({
	my_function: vi.fn(),
}));

// ✅ Correct signature
vi.mock('#lib/utils.js', () => ({
	my_function: vi.fn((param1: string, param2: number) => 'result'),
}));
```

### Role and Element Confusion

```typescript
// ❌ WRONG: Looking for link when element has role="button"
page.getByRole('link', { name: 'Submit' }); // <a role="button">Submit</a>

// ✅ CORRECT: Use the actual role
page.getByRole('button', { name: 'Submit' });

// ❌ WRONG: Input role doesn't exist
page.getByRole('input', { name: 'Email' });

// ✅ CORRECT: Use textbox for input elements
page.getByRole('textbox', { name: 'Email' });
```

### Explore the Examples (Optional)

Want to see these patterns in action? Clone the Sveltest repository:

```bash
# Clone to explore examples
git clone https://github.com/spences10/sveltest.git
cd sveltest
pnpm install

# Run the example tests
pnpm test:unit
```

## What's Next?

Now that you've written your first test with Vitest Browser Mode,
explore these areas:

1. **[Testing Patterns](/docs/testing-patterns)** - Learn component,
   SSR, and server testing patterns
2. **[Best Practices](/docs/best-practices)** - Master the Foundation
   First approach and avoid common pitfalls
3. **[API Reference](/docs/api-reference)** - Complete reference for
   all testing utilities
4. **[Migration Guide](/docs/migration-guide)** - If you're coming
   from @testing-library/svelte

## Ready to Level Up?

You now have the foundation to write effective tests with Vitest
Browser Mode and `vitest-browser-svelte`. The patterns you've learned
here scale from simple buttons to complex applications.

**Next Steps:**

- Explore the [component examples](/components) to see these patterns
  in action
- Check out the [todo application](/todos) for a complete testing
  example
- Review the comprehensive [testing rules](/.cursor/rules/testing.mdc)
  for advanced patterns

Happy testing! 🧪✨
