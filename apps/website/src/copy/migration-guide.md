# Migration Guide

A comprehensive, step-by-step guide for migrating your Svelte testing
setup from `@testing-library/svelte` to `vitest-browser-svelte`, based
on real-world migration experience and current best practices.

## 🎯 Why Migrate to vitest-browser-svelte?

- **Real Browser Environment**: Tests run in actual Playwright
  browsers instead of jsdom simulation
- **Better Svelte 5 Support**: Native support for runes, snippets, and
  modern Svelte patterns
- **Auto-retry Logic**: Built-in element waiting and retrying
  eliminates flaky tests
- **Client-Server Alignment**: Enables testing with real FormData and
  Request objects for better integration confidence
- **Future-Proof**: Official Svelte team recommendation for modern
  testing

## 📋 Migration Strategy

This guide follows a proven **Foundation First** approach that
supports the **Client-Server Alignment Strategy**:

1. **Phase 1**: Environment setup and configuration
2. **Phase 2**: Core pattern migration (one test file at a time)
3. **Phase 3**: Advanced patterns and server testing alignment
4. **Phase 4**: Cleanup and validation

## 🚀 Phase 1: Environment Setup

### Step 1: Update Dependencies

```bash
# Install vitest-browser-svelte and related packages (Vitest v4)
pnpm add -D @vitest/browser-playwright vitest-browser-svelte playwright

# Remove old testing library dependencies
pnpm remove @testing-library/svelte @testing-library/jest-dom jsdom
```

### Step 2: Update Vitest Configuration

Replace your existing test configuration with browser mode:

```typescript
// vite.config.ts (Vitest v4)
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],

	test: {
		projects: [
			{
				// Client-side tests (Svelte components)
				extends: true,
				test: {
					name: 'client',
					// Timeout for browser tests - prevent hanging on element lookups
					testTimeout: 2000,
					browser: {
						enabled: true,
						provider: playwright(),
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
				extends: true,
				test: {
					name: 'ssr',
					environment: 'node',
					include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
				},
			},
			{
				// Server-side tests (Node.js utilities)
				extends: true,
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: [
						'src/**/*.svelte.{test,spec}.{js,ts}'],
						'src/**/*.ssr.{test,spec}.{js,ts}',
					],
				},
			},
		],
	},
});
```

### Step 3: Update Setup Files

Remove jsdom-specific polyfills in `src/vitest-setup-client.ts` since
you're now using real browsers:

```typescript
// BEFORE: src/vitest-setup-client.ts (remove these)
import '@testing-library/jest-dom';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		// ... more jsdom polyfills
	})),
});

// AFTER: src/vitest-setup-client.ts (minimal setup)
/// <reference types="vitest/browser" />
/// <reference types="@vitest/browser-playwright" />
```

## 🧪 Phase 2: Core Pattern Migration

### Essential Import Changes

```typescript
// BEFORE: @testing-library/svelte
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

// AFTER: vitest-browser-svelte
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
```

### Critical Pattern: Always Use Locators

```typescript
// ❌ NEVER use containers - no auto-retry, manual DOM queries
const { container } = render(MyComponent);
const button = container.querySelector('[data-testid="submit"]');

// ✅ ALWAYS use locators - auto-retry, semantic queries
render(MyComponent);
const button = page.getByTestId('submit');
await button.click(); // Automatic waiting and retrying
```

### Component Rendering Migration

```typescript
// BEFORE: @testing-library/svelte
test('button renders with correct variant', () => {
	render(Button, { variant: 'primary' });
	const button = screen.getByRole('button');
	expect(button).toBeInTheDocument();
	expect(button).toHaveClass('btn-primary');
});

// AFTER: vitest-browser-svelte
test('button renders with correct variant', async () => {
	render(Button, { variant: 'primary' });
	const button = page.getByRole('button');
	await expect.element(button).toBeInTheDocument();
	await expect.element(button).toHaveClass('btn-primary');
});
```

### User Interaction Migration

```typescript
// BEFORE: @testing-library/svelte
test('form submission', async () => {
	const user = userEvent.setup();
	render(LoginForm);

	const email_input = screen.getByLabelText('Email');
	const password_input = screen.getByLabelText('Password');
	const submit_button = screen.getByRole('button', { name: 'Login' });

	await user.type(email_input, 'test@example.com');
	await user.type(password_input, 'password');
	await user.click(submit_button);

	expect(screen.getByText('Welcome!')).toBeInTheDocument();
});

// AFTER: vitest-browser-svelte
test('form submission', async () => {
	render(LoginForm);

	const email_input = page.getByLabelText('Email');
	const password_input = page.getByLabelText('Password');
	const submit_button = page.getByRole('button', { name: 'Login' });

	await email_input.fill('test@example.com');
	await password_input.fill('password');
	await submit_button.click();

	await expect
		.element(page.getByText('Welcome!'))
		.toBeInTheDocument();
});
```

### Event Handler Testing

```typescript
// BEFORE: @testing-library/svelte
test('click handler', async () => {
	const handle_click = vi.fn();
	render(Button, { onClick: handle_click });

	await userEvent.click(screen.getByRole('button'));
	expect(handle_click).toHaveBeenCalled();
});

// AFTER: vitest-browser-svelte
test('click handler', async () => {
	const handle_click = vi.fn();
	render(Button, { onclick: handle_click });

	await page.getByRole('button').click();
	expect(handle_click).toHaveBeenCalled();
});
```

## 🔄 Key Migration Transformations

### 1. Query Transformations

| @testing-library/svelte          | vitest-browser-svelte          |
| -------------------------------- | ------------------------------ |
| `screen.getByRole('button')`     | `page.getByRole('button')`     |
| `screen.getByText('Hello')`      | `page.getByText('Hello')`      |
| `screen.getByTestId('submit')`   | `page.getByTestId('submit')`   |
| `screen.getByLabelText('Email')` | `page.getByLabelText('Email')` |

### 2. Assertion Transformations

| @testing-library/svelte                   | vitest-browser-svelte                                   |
| ----------------------------------------- | ------------------------------------------------------- |
| `expect(element).toBeInTheDocument()`     | `await expect.element(element).toBeInTheDocument()`     |
| `expect(element).toHaveClass('btn')`      | `await expect.element(element).toHaveClass('btn')`      |
| `expect(element).toHaveTextContent('Hi')` | `await expect.element(element).toHaveTextContent('Hi')` |
| `expect(element).toBeVisible()`           | `await expect.element(element).toBeVisible()`           |

### 3. Event Handling Transformations

| @testing-library/svelte                                        | vitest-browser-svelte                 |
| -------------------------------------------------------------- | ------------------------------------- |
| `await fireEvent.click(button)`                                | `await button.click()`                |
| `await fireEvent.change(input, { target: { value: 'test' } })` | `await input.fill('test')`            |
| `await fireEvent.keyDown(element, { key: 'Enter' })`           | `await userEvent.keyboard('{Enter}')` |
| `await fireEvent.focus(input)`                                 | `await input.element().focus()`       |

## 🎯 Phase 3: Advanced Patterns

### Svelte 5 Runes Testing

```typescript
// Testing components with Svelte 5 runes
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { untrack } from 'svelte';

test('counter with runes', async () => {
	let count = $state(0);
	let doubled = $derived(count * 2);

	render(Counter, { initial_count: 5 });

	const count_display = page.getByTestId('count');
	await expect.element(count_display).toHaveTextContent('5');

	const increment_button = page.getByRole('button', {
		name: 'Increment',
	});
	await increment_button.click();

	await expect.element(count_display).toHaveTextContent('6');

	// Test derived values with untrack
	expect(untrack(() => doubled)).toBe(12);
});
```

### Form Validation Lifecycle Testing

```typescript
// Test the full lifecycle: valid → validate → invalid → fix → valid
test('form validation lifecycle', async () => {
	render(LoginForm);

	const email_input = page.getByLabelText('Email');
	const submit_button = page.getByRole('button', { name: 'Submit' });

	// Initially valid (no validation triggered)
	await expect.element(submit_button).toBeEnabled();

	// Trigger validation with invalid data
	await email_input.fill('invalid-email');
	await submit_button.click({ force: true });

	// Now invalid with error message
	const error_message = page.getByText(
		'Please enter a valid email address',
	);
	await expect.element(error_message).toBeVisible();

	// Fix the error
	await email_input.fill('valid@example.com');
	await submit_button.click();

	// Back to valid state
	await expect.element(error_message).not.toBeVisible();
});
```

### Handling Strict Mode Violations

```typescript
// ❌ FAILS: Multiple elements match
test('navigation links', async () => {
	render(Navigation);
	const home_link = page.getByRole('link', { name: 'Home' }); // Error!
});

// ✅ CORRECT: Use .first(), .nth(), .last()
test('navigation links', async () => {
	render(Navigation);
	const home_link = page.getByRole('link', { name: 'Home' }).first();
	await expect.element(home_link).toBeVisible();
});
```

### Component Dependencies and Mocking

```typescript
// Mock utility functions with realistic return values
vi.mock('$lib/utils/validation', () => ({
	validate_email: vi.fn(() => ({ valid: true, message: '' })),
	validate_password: vi.fn(() => ({ valid: true, message: '' })),
}));

test('form uses validation utilities', async () => {
	const mock_validate_email = vi.mocked(validate_email);

	render(LoginForm);

	const email_input = page.getByLabelText('Email');
	await email_input.fill('test@example.com');

	expect(mock_validate_email).toHaveBeenCalledWith(
		'test@example.com',
	);
});
```

## 🚨 Common Migration Pitfalls

### 1. Locator vs Matcher Confusion

```typescript
// ❌ WRONG: Using locators as matchers
await expect(page.getByRole('button')).toBeInTheDocument();

// ✅ CORRECT: Use expect.element() for locators
await expect.element(page.getByRole('button')).toBeInTheDocument();

// ✅ CORRECT: Use regular expect for values
expect(some_value).toBe(true);
```

### 2. Async Assertions Required

```typescript
// ❌ OLD: Sync assertions
expect(element).toBeInTheDocument();

// ✅ NEW: Async assertions with auto-retry
await expect.element(element).toBeInTheDocument();
```

### 3. No More Manual Waiting

```typescript
// ❌ OLD: Manual waiting with @testing-library/svelte
import { waitFor } from '@testing-library/dom';

await waitFor(() => {
	expect(screen.getByText('Success')).toBeInTheDocument();
});

// ✅ NEW: Built-in retry with vitest-browser-svelte
await expect.element(page.getByText('Success')).toBeInTheDocument();
```

### 4. Animation and Transition Issues

```typescript
// ❌ Can cause hangs - avoid clicking submit buttons with SvelteKit enhance
await submit_button.click(); // May cause SSR errors!

// ✅ Test form state directly or use force: true
await submit_button.click({ force: true });

// ✅ Or test validation state instead
render(MyForm, { errors: { email: 'Required' } });
await expect.element(page.getByText('Required')).toBeInTheDocument();
```

## 🔧 Phase 4: Cleanup and Validation

### Update Package Scripts

```json
{
	"scripts": {
		"test:unit": "vitest",
		"test:server": "vitest --project=server",
		"test:client": "vitest --project=client",
		"test:ssr": "vitest --project=ssr",
		"test": "npm run test:unit -- --run && npm run test:e2e",
		"test:e2e": "playwright test"
	}
}
```

### Migration Checklist

- [ ] **Dependencies**: Removed @testing-library/svelte, installed
      vitest-browser-svelte
- [ ] **Configuration**: Updated vite.config.ts for browser mode
- [ ] **Imports**: Changed render import and added page import
- [ ] **Queries**: Replaced screen.getBy* with page.getBy*
- [ ] **Interactions**: Replaced userEvent with direct element methods
- [ ] **Assertions**: Added await before expect.element()
- [ ] **Mocks**: Removed browser API mocks (they work natively now)
- [ ] **Animation**: Added Element.animate mock for Svelte 5
- [ ] **Tests**: Updated all test files with new patterns
- [ ] **CI/CD**: Updated test scripts and pipeline configuration

## 🔗 Migration Resources

- [Complete Migration Example](https://github.com/spences10/sveltest) -
  See full before/after
- [vitest-browser-svelte Docs](https://github.com/vitest-dev/vitest-browser-svelte) -
  Official documentation
- [Vitest Browser Mode](https://vitest.dev/guide/browser.html) -
  Browser testing guide
- [Migration Blog Post](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte) -
  Detailed migration story

---

This migration guide represents a significant improvement in testing
capabilities for Svelte applications, providing better developer
experience and more reliable tests through real browser environments.
