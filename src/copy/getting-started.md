# Getting Started

## Learn Modern Svelte Testing

This guide goes through getting set up for testing Svelte 5
applications using the experimental `vitest-browser-svelte` - the
modern testing solution that runs your tests in real browsers instead
of simulated environments.

> **Note:** Vitest Browser Mode is currently experimental. While
> stable for most use cases, APIs may change in future versions. Pin
> your Vitest version when using Browser Mode in production.

**You'll learn:**

- Essential testing patterns that work in real browsers
- Best practices for testing Svelte 5 components with runes
- How to avoid common pitfalls and write reliable tests
- The **Client-Server Alignment Strategy** for reliable full-stack
  testing

### What is Sveltest?

Sveltest is a **reference guide and example project** that
demonstrates real-world testing patterns with `vitest-browser-svelte`.
You don't install Sveltest - you learn from it and apply these
patterns to your own Svelte applications.

**Use this guide to:**

- Learn `vitest-browser-svelte` testing patterns
- Understand best practices through working code
- See comprehensive test coverage in action

### Who is Sveltest For?

- **Svelte developers** wanting to learn modern testing approaches
- **Teams** looking to establish consistent testing patterns
- **Developers migrating** from @testing-library/svelte or other
  testing tools
- **Anyone** who wants to test Svelte components in real browser
  environments

## Setup Your Own Project

To follow along, you'll need a Svelte project with
`vitest-browser-svelte` configured. This may _soon_ be the default,
currently (at the time of writing) it is not. To start testing
components in an actual browser using `vitest-browser-svelte` create a
new project using the `sv` CLI:

```bash
# Create a new SvelteKit project with sv
pnpm dlx sv@latest create my-testing-app
```

These are the options that will be used in these examples:

```bash
┌  Welcome to the Svelte CLI! (v0.8.7)
│
◆  Which template would you like?
│  ● SvelteKit minimal (barebones scaffolding for your new app)
│
◆  Add type checking with TypeScript?
│  ● Yes, using TypeScript syntax
│
◆  What would you like to add to your project?
│  ◼ prettier
│  ◼ eslint
│  ◼ vitest (unit testing)
│  ◼ playwright
│  ◼ tailwindcss
└
```

### Install Browser Testing Dependencies

```bash
cd my-testing-app
# Add vitest browser, Svelte testing and playwright
pnpm install -D @vitest/browser vitest-browser-svelte playwright

# remove testing library and jsdom
pnpm un @testing-library/jest-dom @testing-library/svelte jsdom
```

### Configure Vitest Browser Mode

Update your `vite.config.ts` to use the official Vitest Browser
configuration. This multi-project setup supports the **Client-Server
Alignment Strategy** - testing client components in real browsers
while keeping server tests fast with minimal mocking:

```typescript
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],

	test: {
		projects: [
			{
				// Client-side tests (Svelte components)
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					// Timeout for browser tests - prevent hanging on element lookups
					testTimeout: 2000,
					browser: {
						enabled: true,
						provider: 'playwright',
						// Multiple browser instances for better performance
						// Uses single Vite server with shared caching
						instances: [
							{ browser: 'chromium' },
							// { browser: 'firefox' },
							// { browser: 'webkit' },
						],
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: [
						'src/lib/server/**',
						'src/**/*.ssr.{test,spec}.{js,ts}',
					],
					setupFiles: ['./src/vitest-setup-client.ts'],
				},
			},
			{
				// SSR tests (Server-side rendering)
				extends: './vite.config.ts',
				test: {
					name: 'ssr',
					environment: 'node',
					include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
				},
			},
			{
				// Server-side tests (Node.js utilities)
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'src/**/*.ssr.{test,spec}.{js,ts}',
					],
				},
			},
		],
	},
});
```

### Edit Setup File

Replace the contents of the `src/vitest-setup-client.ts` with this:

```typescript
/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />
```

### Run the tests

Running `pnpm run test:unit` on the project now is going to fail! The
`page.svelte.test.ts` file is still configured to use
`@testing-library/svelte`, replace the contents with this:

```ts
import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page);

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});
});
```

Running `pnpm run test:unit` should run the `page.svelte.test.ts` file
in the browser and pass!

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
import { page } from '@vitest/browser/context';
import { createRawSnippet } from 'svelte';
import MyButton from './my-button.svelte';

describe('MyButton', () => {
	it('should render with correct text', async () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Click me</span>`,
		}));

		render(MyButton, { children });

		const button = page.getByRole('button', { name: 'Click me' });
		await expect.element(button).toBeInTheDocument();
	});

	it('should handle click events', async () => {
		const click_handler = vi.fn();
		const children = createRawSnippet(() => ({
			render: () => `<span>Click me</span>`,
		}));

		render(MyButton, { onclick: click_handler, children });

		const button = page.getByRole('button', { name: 'Click me' });
		await button.click();

		expect(click_handler).toHaveBeenCalledOnce();
	});

	it('should apply correct variant class', async () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Secondary</span>`,
		}));

		render(MyButton, { variant: 'secondary', children });

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
import { page } from '@vitest/browser/context'; // Browser interactions
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
	render(MyInput, { label: 'Email', type: 'email' });

	const input = page.getByLabel('Email');
	await input.fill('user@example.com');

	await expect.element(input).toHaveValue('user@example.com');
});
```

### Testing Conditional Rendering

```typescript
it('should show error message when invalid', async () => {
	render(MyInput, {
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

	render(MyButton, { loading: true, children });

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

Start every component test with this structure:

```typescript
describe('ComponentName', () => {
	describe('Initial Rendering', () => {
		it('should render with default props', async () => {
			// Your first test here
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
		const { my_util_function } = await import('$lib/utils/my-utils');

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

	render(MyComponent, { children });

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
render(MyForm, { errors: { email: 'Required' } });
await expect.element(page.getByText('Required')).toBeInTheDocument();
```

### "Expected 2 arguments, but got 0"

Your mock function signature doesn't match the real function:

```typescript
// ❌ Wrong signature
vi.mock('$lib/utils', () => ({
	my_function: vi.fn(),
}));

// ✅ Correct signature
vi.mock('$lib/utils', () => ({
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
