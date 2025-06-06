# Testing Patterns

## Overview

This guide covers the three main testing patterns used in Sveltest:
Component Testing, SSR Testing, and Server Testing. Each pattern
serves a specific purpose in ensuring your Svelte application works
reliably across different environments.

## Component Testing (Client-Side)

### Essential Setup

Component tests run in real browser environments using
vitest-browser-svelte and Playwright:

```typescript
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import { expect, test } from 'vitest';
import { createRawSnippet } from 'svelte';
import { flushSync, untrack } from 'svelte';
```

### Critical: Always Use Locators

```typescript
// ✅ ALWAYS use locators - auto-retry, semantic queries
render(MyComponent);
const button = page.getByTestId('submit');
await button.click(); // Automatic waiting and retrying

// ❌ NEVER use containers - no auto-retry, manual DOM queries
const { container } = render(MyComponent);
const button = container.querySelector('[data-testid="submit"]');
```

### Locator Patterns

```typescript
// ✅ Semantic queries (preferred - test accessibility)
page.getByRole('button', { name: 'Submit' });
page.getByRole('textbox', { name: 'Email' });
page.getByLabel('Email address');
page.getByText('Welcome');

// ✅ Test IDs (when semantic queries aren't possible)
page.getByTestId('submit-button');

// ✅ Assertions with locators (always await)
await expect.element(page.getByText('Success')).toBeInTheDocument();
await expect.element(page.getByRole('button')).toBeDisabled();
```

### Svelte 5 Runes Testing

```typescript
// ✅ Always use untrack() when accessing $derived values
test('reactive state with runes', () => {
	let count = $state(0);
	let doubled = $derived(count * 2);

	expect(untrack(() => doubled)).toBe(0);

	count = 5;
	flushSync(); // Still needed for derived state evaluation

	expect(untrack(() => doubled)).toBe(10);
});
```

### Component Examples

#### Button Component Testing

```typescript
describe('Button Component', () => {
	test('should render with correct variant', async () => {
		render(Button, { variant: 'primary', children: 'Click me' });

		const button = page.getByRole('button', { name: 'Click me' });
		await expect.element(button).toBeInTheDocument();
		await expect.element(button).toHaveClass('btn-primary');
	});

	test('should handle click events', async () => {
		const click_handler = vi.fn();
		render(Button, { onclick: click_handler, children: 'Click me' });

		const button = page.getByRole('button', { name: 'Click me' });
		await button.click();

		expect(click_handler).toHaveBeenCalledOnce();
	});
});
```

#### Input Component Testing

```typescript
describe('Input Component', () => {
	test('should display validation errors', async () => {
		render(Input, {
			type: 'email',
			label: 'Email',
			error: 'Invalid email format',
		});

		await expect
			.element(page.getByText('Invalid email format'))
			.toBeInTheDocument();
		await expect
			.element(page.getByLabelText('Email'))
			.toHaveAttribute('aria-invalid', 'true');
	});

	test('should handle user input', async () => {
		render(Input, { type: 'text', label: 'Name' });

		const input = page.getByLabelText('Name');
		await input.fill('John Doe');

		await expect.element(input).toHaveValue('John Doe');
	});
});
```

#### Modal Component Testing

```typescript
describe('Modal Component', () => {
	test('should handle focus management', async () => {
		render(Modal, { open: true, children: 'Modal content' });

		const modal = page.getByRole('dialog');
		await expect.element(modal).toBeInTheDocument();

		// Test focus trap
		await page.keyboard.press('Tab');
		const close_button = page.getByRole('button', { name: 'Close' });
		await expect.element(close_button).toBeFocused();
	});

	test('should close on escape key', async () => {
		const close_handler = vi.fn();
		render(Modal, { open: true, onclose: close_handler });

		await page.keyboard.press('Escape');
		expect(close_handler).toHaveBeenCalledOnce();
	});
});
```

## SSR Testing (Server-Side Rendering)

### Essential Setup

SSR tests validate server-side rendering without requiring a browser:

```typescript
import { render } from 'svelte/server';
import { expect, test } from 'vitest';
```

### SSR Test Patterns

```typescript
describe('Component SSR', () => {
	test('should render without errors', () => {
		expect(() => {
			render(ComponentName);
		}).not.toThrow();
	});

	test('should render essential content for SEO', () => {
		const { body } = render(ComponentName);

		// Test core content, navigation links, semantic HTML
		expect(body).toContain('Primary heading');
		expect(body).toContain('href="/important-link"');
	});

	test('should render meta information', () => {
		const { head } = render(ComponentName);

		expect(head).toContain('<title>');
		expect(head).toContain('meta name="description"');
	});
});
```

### Layout SSR Testing

```typescript
describe('Layout SSR', () => {
	test('should render navigation structure', () => {
		const { body } = render(Layout);

		expect(body).toContain('<nav');
		expect(body).toContain('aria-label="Main navigation"');
		expect(body).toContain('href="/docs"');
		expect(body).toContain('href="/examples"');
	});

	test('should include accessibility features', () => {
		const { body } = render(Layout);

		expect(body).toContain('role="main"');
		expect(body).toContain('aria-label');
		expect(body).toContain('skip-to-content');
	});
});
```

## Server Testing (API Routes & Hooks)

### API Route Testing

```typescript
describe('API Route', () => {
	test('should authenticate valid requests', async () => {
		const request = new Request('http://localhost/api/secure-data', {
			headers: { Authorization: 'Bearer valid-token' },
		});

		const response = await GET({ request });
		expect(response.status).toBe(200);
	});

	test('should handle validation errors', async () => {
		const request = new Request('http://localhost/api/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: '' }), // Invalid data
		});

		const response = await POST({ request });
		expect(response.status).toBe(400);
	});
});
```

### Server Hook Testing

```typescript
describe('Server Hooks', () => {
	test('should add security headers', async () => {
		const event = createMockEvent('GET', '/');
		const response = await handle({ event, resolve: mockResolve });

		expect(response.headers.get('X-Content-Type-Options')).toBe(
			'nosniff',
		);
		expect(response.headers.get('X-Frame-Options')).toBe(
			'SAMEORIGIN',
		);
	});

	test('should handle CSP violations', async () => {
		const request = new Request('http://localhost/api/csp-report', {
			method: 'POST',
			body: JSON.stringify({
				'csp-report': { 'violated-directive': 'script-src' },
			}),
		});

		const response = await POST({ request });
		expect(response.status).toBe(204);
	});
});
```

## Integration Testing Patterns

### Form Integration Testing

```typescript
describe('Todo Form Integration', () => {
	test('should handle complete todo lifecycle', async () => {
		render(TodoManager);

		// Add todo
		const input = page.getByLabelText('New todo');
		await input.fill('Buy groceries');

		const add_button = page.getByRole('button', { name: 'Add Todo' });
		await add_button.click();

		// Verify todo appears
		await expect
			.element(page.getByText('Buy groceries'))
			.toBeInTheDocument();

		// Complete todo
		const checkbox = page.getByRole('checkbox', {
			name: 'Mark Buy groceries as complete',
		});
		await checkbox.check();

		// Verify completion
		await expect.element(checkbox).toBeChecked();
	});
});
```

### Navigation Testing

```typescript
describe('Navigation Integration', () => {
	test('should navigate between pages', async () => {
		render(App);

		const docs_link = page.getByRole('link', {
			name: 'Documentation',
		});
		await docs_link.click();

		await expect
			.element(page.getByText('Getting Started'))
			.toBeInTheDocument();
	});
});
```

## Best Practices

### Test Organization

```typescript
describe('ComponentName', () => {
	describe('Initial Rendering', () => {
		test('should render with default props', async () => {
			// Implementation
		});

		test.skip('should render with all prop variants', async () => {
			// TODO: Test all type combinations
		});
	});

	describe('User Interactions', () => {
		test('should handle click events', async () => {
			// Real browser click events
		});
	});

	describe('Edge Cases', () => {
		test.skip('should handle empty data gracefully', async () => {
			// TODO: Test with null/undefined/empty arrays
		});
	});
});
```

### Avoid Common Pitfalls

```typescript
// ❌ Can cause infinite hangs - avoid clicking submit buttons with SvelteKit enhance
await submit_button.click(); // SSR errors!

// ✅ Test form state directly
render(MyForm, { props: { errors: { email: 'Required' } } });
await expect.element(page.getByText('Required')).toBeInTheDocument();

// ✅ Use force: true for elements that may be animating
await button.click({ force: true });
```

### Mock Patterns

```typescript
// ✅ Mock utility functions with realistic return values
vi.mock('$lib/utils/module', () => ({
	util_function: vi.fn(() => [
		{ value: 'option1', label: 'Option 1', disabled: false },
		{ value: 'option2', label: 'Option 2', disabled: false },
	]),
}));

// ✅ Mock UI components with proper Svelte structure
vi.mock('ui', () => ({
	Button: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
}));
```

## Performance Optimization

### Parallel Test Execution

```typescript
// Use concurrent tests for independent operations
test.concurrent('fast test 1', async () => {});
test.concurrent('fast test 2', async () => {});

// Mock heavy operations
vi.mock('$lib/heavy-computation', () => ({
	compute: vi.fn(() => 'mocked-result'),
}));
```

### Test Environment Configuration

```typescript
// vite.config.ts
export default defineConfig({
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

## Quick Reference

- ✅ Use locators (`page.getBy*()`) - never containers
- ✅ Always await locator assertions: `await expect.element()`
- ✅ Use `untrack()` for `$derived`:
  `expect(untrack(() => derived_value))`
- ✅ Use `force: true` for animations:
  `await element.click({ force: true })`
- ✅ Start with `.skip` blocks for 100% coverage planning
- ❌ Never click SvelteKit form submits - test state directly
- ❌ Don't mock browser APIs - real APIs work in vitest-browser-svelte
