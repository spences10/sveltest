# API Reference

Complete reference for vitest-browser-svelte testing APIs, organized
by immediate developer needs. These APIs support the **Client-Server
Alignment Strategy** for reliable full-stack testing.

## Quick Start Imports

### Essential Setup

```typescript
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
```

### Svelte 5 Runes & SSR

```typescript
import { createRawSnippet } from 'svelte';
import { flushSync, untrack } from 'svelte';
import { render } from 'svelte/server'; // SSR testing only
```

### Server Testing (Client-Server Alignment)

```typescript
// Real web APIs for server tests - no mocking
const form_data = new FormData();
const request = new Request('http://localhost/api/endpoint', {
	method: 'POST',
	body: form_data,
});
```

## 🎯 Locators (Auto-Retry Built-in)

> **CRITICAL**: Always use locators, never containers. Locators have
> automatic waiting and retrying.

### Semantic Queries (Preferred)

```typescript
// ✅ Buttons - test accessibility
page.getByRole('button', { name: 'Submit' });
page.getByRole('button', { name: /submit/i }); // Case insensitive

// ✅ Form controls - semantic HTML
page.getByRole('textbox', { name: 'Email' }); // <input type="text">
page.getByRole('checkbox', { name: 'Remember me' });
page.getByRole('combobox', { name: 'Country' }); // <select>

// ✅ Navigation & structure
page.getByRole('link', { name: 'Documentation' });
page.getByRole('heading', { level: 1 });
page.getByRole('main');
page.getByRole('navigation');
```

### Form-Specific Queries

```typescript
// ✅ Labels - best for forms
page.getByLabel('Email address');
page.getByLabel('Password');
page.getByLabel(/phone/i);

// ✅ Placeholders - when no label
page.getByPlaceholder('Enter your email');
page.getByPlaceholder(/search/i);
```

### Content Queries

```typescript
// ✅ Text content
page.getByText('Welcome back');
page.getByText('Welcome', { exact: false }); // Partial match
page.getByText(/welcome/i); // Regex
```

### Test ID Fallback

```typescript
// ✅ Only when semantic queries aren't possible
page.getByTestId('submit-button');
page.getByTestId('error-message');
page.getByTestId('loading-spinner');
```

### 🚨 Handle Multiple Elements (Strict Mode)

```typescript
// ❌ FAILS: "strict mode violation" - multiple elements
page.getByRole('link', { name: 'Home' });

// ✅ CORRECT: Use .first(), .nth(), .last()
page.getByRole('link', { name: 'Home' }).first();
page.getByRole('listitem').nth(2); // Zero-indexed
page.getByRole('button').last();

// ✅ Filter for specificity
page.getByRole('button').filter({ hasText: 'Delete' });

// ✅ Chain for context
page.getByRole('dialog').getByRole('button', { name: 'Close' });
```

## 🔍 Assertions (Always Await)

### Element Presence

```typescript
// ✅ Always await element assertions
await expect.element(page.getByText('Success')).toBeInTheDocument();
await expect.element(page.getByRole('button')).toBeVisible();
await expect.element(page.getByTestId('error')).toBeHidden();
await expect.element(page.getByRole('dialog')).toBeAttached();
```

### Element States

```typescript
// ✅ Interactive states
await expect.element(page.getByRole('button')).toBeEnabled();
await expect.element(page.getByRole('button')).toBeDisabled();
await expect.element(page.getByRole('checkbox')).toBeChecked();
await expect.element(page.getByRole('textbox')).toBeFocused();
```

### Content & Attributes

```typescript
// ✅ Text content
await expect.element(page.getByRole('heading')).toHaveText('Welcome');
await expect.element(page.getByTestId('counter')).toContainText('5');

// ✅ Form values
await expect
	.element(page.getByRole('textbox'))
	.toHaveValue('john@example.com');

// ✅ Attributes & classes
await expect
	.element(page.getByRole('link'))
	.toHaveAttribute('href', '/docs');
await expect
	.element(page.getByRole('button'))
	.toHaveClass('btn-primary');
```

### Count Assertions

```typescript
// ✅ Exact count
await expect.element(page.getByRole('listitem')).toHaveCount(3);

// ✅ Range counts
await expect
	.element(page.getByRole('button'))
	.toHaveCount({ min: 1 });
await expect
	.element(page.getByRole('button'))
	.toHaveCount({ max: 5 });
```

## 🖱️ User Interactions

### Click Events

```typescript
// ✅ Simple click
await page.getByRole('button', { name: 'Submit' }).click();

// ✅ Force click (bypass animations)
await page.getByRole('button').click({ force: true });

// ✅ Advanced click options
await page.getByRole('button').click({
	button: 'right', // Right click
	clickCount: 2, // Double click
	position: { x: 10, y: 20 }, // Specific position
});
```

### Form Interactions

```typescript
// ✅ Fill inputs
await page
	.getByRole('textbox', { name: 'Email' })
	.fill('john@example.com');

// ✅ Clear and refill
await page.getByRole('textbox').clear();
await page.getByRole('textbox').fill('new-value');

// ✅ Checkboxes and selects
await page.getByRole('checkbox').check();
await page.getByRole('checkbox').uncheck();
await page.getByRole('combobox').selectOption('value');
await page.getByRole('combobox').selectOption(['value1', 'value2']);

// ✅ File uploads
await page
	.getByRole('textbox', { name: 'Upload' })
	.setInputFiles('path/to/file.txt');
```

### Keyboard Interactions

```typescript
// ✅ Key presses
await page.keyboard.press('Enter');
await page.keyboard.press('Escape');
await page.keyboard.press('Tab');

// ✅ Key combinations
await page.keyboard.press('Control+A');
await page.keyboard.press('Shift+Tab');

// ✅ Type text
await page.keyboard.type('Hello World');

// ✅ Element-specific keyboard
await page.getByRole('textbox').press('Enter');
```

## 🎭 Component Rendering

### Basic Rendering

```typescript
// ✅ Simple component with snake_case props
render(Button, {
	variant: 'primary',
	is_disabled: false,
	click_handler: vi.fn(),
});

// ✅ Form component with validation
render(Input, {
	input_type: 'email',
	label_text: 'Email',
	current_value: 'test@example.com',
	error_message: 'Invalid email',
	is_required: true,
});
```

### Advanced Rendering

```typescript
// ✅ Event handlers with snake_case
const handle_click = vi.fn();
const handle_submit = vi.fn();

render(Button, {
	onclick: handle_click,
	onsubmit: handle_submit,
	children: 'Click me',
});

// ✅ Svelte 5 snippets (limited support)
const children = createRawSnippet(() => ({
	render: () => `<span>Custom content</span>`, // Must return HTML
}));
render(Modal, { children });

// ✅ Component with context
render(
	Component,
	{ user_data: { name: 'Test' } },
	{ context: new Map([['theme', 'dark']]) },
);
```

## 🔄 Svelte 5 Runes Testing

### State Testing

```typescript
// ✅ $state - direct testing
test('reactive state updates', () => {
	let count = $state(0);
	expect(count).toBe(0);

	count = 5;
	expect(count).toBe(5);
});

// ✅ $derived - ALWAYS use untrack()
test('derived state calculation', () => {
	let count = $state(0);
	let doubled = $derived(count * 2);

	// CRITICAL: Always untrack derived values
	expect(untrack(() => doubled)).toBe(0);

	count = 5;
	flushSync(); // Force synchronous update
	expect(untrack(() => doubled)).toBe(10);
});

// ✅ Complex derived with getters
test('derived getter functions', () => {
	const form_state = create_form_state();
	const is_valid_getter = form_state.is_form_valid;

	// Get function first, then untrack
	expect(untrack(() => is_valid_getter())).toBe(true);
});
```

### Effect Testing

```typescript
// ✅ $effect with spy functions
test('effect runs on state change', () => {
	const effect_spy = vi.fn();
	let count = $state(0);

	$effect(() => {
		effect_spy(count);
	});

	count = 1;
	flushSync();

	expect(effect_spy).toHaveBeenCalledWith(1);
});
```

## 🖥️ SSR Testing

### Component Rendering

```typescript
import { render } from 'svelte/server';

// ✅ Basic SSR render
const { body, head } = render(Component);

// ✅ With props using snake_case
const { body, head } = render(Component, {
	props: {
		page_title: 'Test Page',
		user_data: { name: 'Test User' },
	},
});

// ✅ With context
const { body, head } = render(Component, {
	props: {},
	context: new Map([['theme', 'dark']]),
});
```

### SSR Assertions

```typescript
// ✅ Content structure (not implementation details)
expect(body).toContain('<h1>Welcome</h1>');
expect(body).toContain('role="main"');
expect(body).toContain('aria-label="Navigation"');

// ✅ Head content for SEO
expect(head).toContain('<title>Page Title</title>');
expect(head).toContain('<meta name="description"');

// ❌ AVOID: Testing exact SVG paths or implementation details
// expect(body).toContain('M9 12l2 2 4-4m6 2a9'); // Brittle!

// ✅ BETTER: Test semantic structure
expect(body).toContain('<svg');
expect(body).toContain('text-success');
```

## 🎭 Mocking (Minimal - Real Browser Testing)

> **PRINCIPLE**: In vitest-browser-svelte, render real components.
> Mock only when necessary.

### Component Mocking Decision Tree

```
Is component EXTERNAL? → Mock it
Is component STATELESS/PRESENTATIONAL? → Mock it
Does component have COMPLEX LOGIC? → Mock for unit, render for integration
DEFAULT → Render the component
```

### When to Mock Components

```typescript
// ✅ Mock EXTERNAL components (third-party libraries)
vi.mock('@external/heavy-chart', () => ({
	default: vi.fn(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
	})),
}));

// ✅ Mock STATELESS presentational components in unit tests
vi.mock('$lib/components/icon.svelte', () => ({
	default: vi.fn(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
	})),
}));

// ❌ DON'T mock your own components with logic - render them!
// render(MyComplexComponent); // Test the real thing
```

### Function & Module Mocking

```typescript
// ✅ Mock utility functions with snake_case
const mock_validate_email = vi.fn(() => true);
const mock_api_call = vi.fn((user_id: string) => ({
	user_id,
	user_name: 'Test User',
	is_active: true,
}));

// ✅ Mock external APIs and services
vi.mock('$lib/api', () => ({
	fetch_user_data: vi.fn(() => Promise.resolve({ user_id: 1 })),
	send_analytics: vi.fn(),
}));

// ✅ Spy on existing functions when needed
const validate_spy = vi.spyOn(utils, 'validate_email');
```

## ⏱️ Wait Utilities

### Element Waiting

```typescript
// ✅ Wait for elements (built into locators)
await expect
	.element(page.getByText('Loading complete'))
	.toBeInTheDocument();

// ✅ Custom timeout
await expect
	.element(page.getByText('Data loaded'))
	.toBeInTheDocument({ timeout: 10000 });

// ✅ Wait for disappearance
await expect
	.element(page.getByText('Loading...'))
	.not.toBeInTheDocument();
```

### Custom Conditions

```typescript
// ✅ Wait for JavaScript conditions
await page.waitForFunction(() => window.data_loaded === true);

// ✅ Wait for network requests
await page.waitForResponse('**/api/user-data');

// ✅ Simple timeout (use sparingly)
await page.waitForTimeout(1000);
```

## 🚨 Error Handling & Edge Cases

### Form Validation Testing

```typescript
// ✅ Test validation lifecycle: valid → validate → invalid → fix → valid
test('form validation lifecycle', async () => {
	const form_state = create_form_state({
		email: { value: '', validation_rules: { required: true } },
	});

	// Initially valid (no validation run yet)
	expect(untrack(() => form_state.is_form_valid())).toBe(true);

	// Trigger validation - now invalid
	form_state.validate_all_fields();
	expect(untrack(() => form_state.is_form_valid())).toBe(false);

	// Fix the error - valid again
	form_state.update_field('email', 'test@example.com');
	expect(untrack(() => form_state.is_form_valid())).toBe(true);
});
```

### Component Error Testing

```typescript
// ✅ Test error boundaries
expect(() => {
	render(BrokenComponent);
}).toThrow('Component error');

// ✅ Test error states
render(Component, {
	props: {
		error_message: 'Something went wrong',
		has_error: true,
	},
});
await expect
	.element(page.getByText('Something went wrong'))
	.toBeInTheDocument();
```

### Assertion Error Handling

```typescript
// ✅ Handle expected assertion failures
try {
	await expect
		.element(page.getByText('Nonexistent'))
		.toBeInTheDocument();
} catch (error) {
	expect(error.message).toContain('Element not found');
}
```

## 🛠️ Custom Utilities

### Test Helpers

```typescript
// ✅ Custom render helper with snake_case
const render_with_theme = (Component: any, props = {}) => {
	return render(Component, {
		...props,
		context: new Map([['theme', 'dark']]),
	});
};

// ✅ Form testing helper
const fill_form_data = async (form_data: Record<string, string>) => {
	for (const [field_name, field_value] of Object.entries(form_data)) {
		await page.getByLabelText(field_name).fill(field_value);
	}
};

// ✅ Loading state helper
const wait_for_loading_complete = async () => {
	await expect
		.element(page.getByTestId('loading-spinner'))
		.not.toBeInTheDocument();
};
```

### Custom Matchers

```typescript
// ✅ Extend expect with domain-specific matchers
expect.extend({
	to_have_validation_error(received: any, expected_error: string) {
		const error_element = page.getByText(expected_error);
		const element_exists = !!error_element;

		return {
			pass: element_exists,
			message: () =>
				element_exists
					? `Expected not to have validation error: ${expected_error}`
					: `Expected to have validation error: ${expected_error}`,
		};
	},
});
```

## ⚙️ Configuration Reference

### Vitest Browser Config

```typescript
// vite.config.ts
export default defineConfig({
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			// Debugging options
			slowMo: 100, // Slow down for debugging
			screenshot: 'only-on-failure',
			// Headless mode
			headless: true,
		},
		// Workspace configuration
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

### Test Environment Setup

```typescript
// ✅ Environment variables
process.env.NODE_ENV = 'test';
process.env.API_URL = 'http://localhost:3000';

// ✅ Custom timeouts
test(
	'slow integration test',
	async () => {
		// Test implementation
	},
	{ timeout: 30000 },
);

// ✅ Test-specific configuration
test.concurrent('parallel test', async () => {
	// Runs in parallel with other concurrent tests
});
```

## 🚫 Critical Anti-Patterns

### ❌ Never Use Containers

```typescript
// ❌ NEVER - No auto-retry, manual DOM queries
const { container } = render(MyComponent);
const button = container.querySelector('[data-testid="submit"]');

// ✅ ALWAYS - Auto-retry, semantic queries
render(MyComponent);
const button = page.getByTestId('submit');
await button.click();
```

### ❌ Don't Test Implementation Details

```typescript
// ❌ BRITTLE - Tests exact SVG path data
expect(body).toContain(
	'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
);

// ✅ ROBUST - Tests user-visible behavior
await expect
	.element(page.getByRole('img', { name: /success/i }))
	.toBeInTheDocument();
```

### ❌ Don't Click Form Submits

```typescript
// ❌ Can cause hangs with SvelteKit enhance
await page.getByRole('button', { name: 'Submit' }).click();

// ✅ Test form state directly
render(MyForm, { props: { errors: { email: 'Required' } } });
await expect.element(page.getByText('Required')).toBeInTheDocument();
```

## 📚 Quick Reference

### Essential Patterns

- ✅ Use `page.getBy*()` locators - never containers
- ✅ Always `await expect.element()` for assertions
- ✅ Use `.first()`, `.nth()`, `.last()` for multiple elements
- ✅ Use `untrack()` for `$derived` values
- ✅ Use `force: true` for animations
- ✅ Use snake_case for variables/functions
- ✅ Test form validation lifecycle
- ✅ Handle strict mode violations properly

### Common Fixes

- **"strict mode violation"**: Use `.first()`, `.nth()`, `.last()`
- **Role confusion**: Links with `role="button"` are buttons
- **Input elements**: Use `getByRole('textbox')`, not
  `getByRole('input')`
- **Derived values**: Always use `untrack(() => derived_value)`
- **Form validation**: Test initial valid → validate → invalid → fix →
  valid
