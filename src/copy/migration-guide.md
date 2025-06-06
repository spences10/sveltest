# Migration Guide

## Overview

A comprehensive guide for migrating your Svelte testing setup from
`@testing-library/svelte` to `vitest-browser-svelte`, based on
real-world migration experience.

## Why Migrate?

- **Real Browser Environment**: Tests run in actual Playwright
  browsers instead of jsdom
- **Better Svelte 5 Support**: Native support for runes, snippets, and
  modern Svelte patterns
- **Improved Developer Experience**: Better error messages and
  debugging capabilities
- **Future-Proof**: Official Svelte team recommendation for testing
- **Performance**: Faster test execution with built-in retry logic

## Migration Process

### Step 1: Update Dependencies

```bash
# Install vitest-browser-svelte and related packages
pnpm add -D @vitest/browser vitest-browser-svelte playwright

# Remove old testing library dependencies
pnpm remove @testing-library/svelte @testing-library/jest-dom
```

### Step 2: Update Vitest Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
		},
		workspace: [
			{
				test: {
					include: ['**/*.svelte.test.ts'],
					name: 'client',
					browser: { enabled: true },
				},
			},
			{
				test: {
					include: ['**/*.ssr.test.ts'],
					name: 'ssr',
					environment: 'node',
				},
			},
		],
	},
});
```

### Step 3: Update Test Imports

```typescript
// BEFORE: @testing-library/svelte
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

// AFTER: vitest-browser-svelte
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
```

### Step 4: Update Test Patterns

#### Component Rendering

```typescript
// BEFORE
render(MyComponent);
const button = screen.getByRole('button');

// AFTER
render(MyComponent);
const button = page.getByRole('button');
```

#### User Interactions

```typescript
// BEFORE
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');

// AFTER
await button.click();
await input.fill('text');
```

#### Assertions

```typescript
// BEFORE
expect(button).toBeInTheDocument();
expect(button).toHaveClass('active');

// AFTER
await expect.element(button).toBeInTheDocument();
await expect.element(button).toHaveClass('active');
```

## Common Migration Patterns

### Form Testing

```typescript
// BEFORE: @testing-library/svelte
test('form submission', async () => {
	render(LoginForm);

	const email_input = screen.getByLabelText('Email');
	const password_input = screen.getByLabelText('Password');
	const submit_button = screen.getByRole('button', { name: 'Login' });

	await userEvent.type(email_input, 'test@example.com');
	await userEvent.type(password_input, 'password');
	await userEvent.click(submit_button);

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

### Event Testing

```typescript
// BEFORE
test('click handler', async () => {
	const handle_click = vi.fn();
	render(Button, { onClick: handle_click });

	await userEvent.click(screen.getByRole('button'));
	expect(handle_click).toHaveBeenCalled();
});

// AFTER
test('click handler', async () => {
	const handle_click = vi.fn();
	render(Button, { onclick: handle_click });

	await page.getByRole('button').click();
	expect(handle_click).toHaveBeenCalled();
});
```

### Component Props Testing

```typescript
// BEFORE
test('component props', () => {
	render(Alert, { type: 'error', message: 'Something went wrong' });

	const alert = screen.getByRole('alert');
	expect(alert).toHaveClass('alert-error');
	expect(alert).toHaveTextContent('Something went wrong');
});

// AFTER
test('component props', async () => {
	render(Alert, { type: 'error', message: 'Something went wrong' });

	const alert = page.getByRole('alert');
	await expect.element(alert).toHaveClass('alert-error');
	await expect
		.element(alert)
		.toHaveTextContent('Something went wrong');
});
```

## Key Differences

### No More `screen` Object

```typescript
// ❌ Old pattern - screen queries
const button = screen.getByRole('button');

// ✅ New pattern - page queries
const button = page.getByRole('button');
```

### Async Assertions Required

```typescript
// ❌ Old pattern - sync assertions
expect(element).toBeInTheDocument();

// ✅ New pattern - async assertions
await expect.element(element).toBeInTheDocument();
```

### No More userEvent Setup

```typescript
// ❌ Old pattern - userEvent setup
const user = userEvent.setup();
await user.click(button);

// ✅ New pattern - direct interactions
await button.click();
```

### Real Browser APIs

```typescript
// ❌ Old pattern - mocked APIs
Object.defineProperty(window, 'matchMedia', {
	/* mock */
});

// ✅ New pattern - real browser APIs work out of the box
// No mocking needed for browser APIs
```

## Troubleshooting Migration Issues

### "Expected 2 arguments, but got 0"

**Cause**: Mock function signature doesn't match actual function
**Solution**: Update mock to accept correct number of arguments

```typescript
// BEFORE
const mock_fn = vi.fn();

// AFTER
const mock_fn = vi.fn((arg1: string, arg2: number) => 'result');
```

### "lifecycle_outside_component"

**Cause**: Trying to call `getContext` in test **Solution**: Skip the
test and add TODO comment for Svelte 5

```typescript
test.skip('context dependent test', () => {
	// TODO: Update for Svelte 5 context handling
});
```

### Element Not Found Errors

**Cause**: Timing issues or incorrect selectors **Solution**: Use
proper waits and semantic queries

```typescript
// ❌ May fail due to timing
const button = page.getByTestId('submit');

// ✅ Better - semantic query with wait
await expect
	.element(page.getByRole('button', { name: 'Submit' }))
	.toBeInTheDocument();
```

## Migration Checklist

- [ ] **Dependencies**: Remove @testing-library/svelte, install
      vitest-browser-svelte
- [ ] **Configuration**: Update vite.config.ts for browser mode
- [ ] **Imports**: Change render import and add page import
- [ ] **Queries**: Replace screen.getBy* with page.getBy*
- [ ] **Interactions**: Replace userEvent with direct element methods
- [ ] **Assertions**: Add await before expect.element()
- [ ] **Mocks**: Remove browser API mocks (they work natively now)
- [ ] **Tests**: Update all test files one by one
- [ ] **CI/CD**: Update test scripts if needed

## Performance Improvements

After migration, you'll typically see:

- **Faster test execution**: Real browser environment is more
  efficient
- **Better debugging**: Real DevTools available for debugging tests
- **Reduced flakiness**: Built-in retry logic and real browser timing
- **Easier maintenance**: Less mocking required

## Advanced Migration Tips

### Gradual Migration

Migrate tests incrementally:

```typescript
// Keep both patterns during migration
describe('Button Component', () => {
	// New tests with vitest-browser-svelte
	test('modern pattern', async () => {
		render(Button);
		await expect
			.element(page.getByRole('button'))
			.toBeInTheDocument();
	});

	// Legacy tests (gradually convert these)
	test.skip('legacy pattern - TODO: migrate', () => {
		// Old @testing-library/svelte test
	});
});
```

### Component Libraries

For component libraries, update testing approach:

```typescript
// BEFORE: Testing internal implementation
expect(component.$$).toBeDefined();

// AFTER: Testing public API
await expect
	.element(page.getByRole('button'))
	.toHaveAttribute('aria-label', 'Submit');
```

### Custom Matchers

Convert custom matchers:

```typescript
// BEFORE
expect.extend({
	toBeVisibleInViewport(received) {
		// Custom implementation
	},
});

// AFTER - often not needed with real browser
await expect.element(element).toBeVisible(); // Built-in works better
```

## Migration Resources

- [Complete Migration Example](https://github.com/spences10/sveltest) -
  See full before/after
- [vitest-browser-svelte Docs](https://github.com/vitest-dev/vitest-browser-svelte) -
  Official documentation
- [Vitest Browser Mode](https://vitest.dev/guide/browser.html) -
  Browser testing guide
- [Migration Blog Post](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte) -
  Detailed migration story

The migration from @testing-library/svelte to vitest-browser-svelte
represents a significant improvement in testing capabilities for
Svelte applications, providing better developer experience and more
reliable tests.
