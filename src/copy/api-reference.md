# API Reference

## Essential Imports

### Core Testing Framework

```typescript
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
```

### Svelte 5 Specific

```typescript
import { createRawSnippet } from 'svelte';
import { flushSync, untrack } from 'svelte';
import { render } from 'svelte/server'; // For SSR testing
```

### Component Imports

```typescript
import Button from '$lib/components/button.svelte';
import Input from '$lib/components/input.svelte';
import Modal from '$lib/components/modal.svelte';
```

## Locators & Queries

### Semantic Queries (Preferred)

#### getByRole()

```typescript
// Buttons
page.getByRole('button', { name: 'Submit' });
page.getByRole('button', { name: /submit/i }); // Case insensitive

// Form controls
page.getByRole('textbox', { name: 'Email' });
page.getByRole('checkbox', { name: 'Remember me' });
page.getByRole('combobox', { name: 'Country' });

// Navigation
page.getByRole('link', { name: 'Documentation' });
page.getByRole('navigation');

// Structure
page.getByRole('heading', { level: 1 });
page.getByRole('dialog');
page.getByRole('main');
```

#### getByLabel()

```typescript
// Form labels
page.getByLabel('Email address');
page.getByLabel('Password');
page.getByLabel(/phone/i); // Regex matching
```

#### getByText()

```typescript
// Exact text
page.getByText('Welcome back');

// Partial text
page.getByText('Welcome', { exact: false });

// Regex
page.getByText(/welcome/i);
```

#### getByPlaceholder()

```typescript
page.getByPlaceholder('Enter your email');
page.getByPlaceholder(/search/i);
```

### Test ID Queries

```typescript
// When semantic queries aren't possible
page.getByTestId('submit-button');
page.getByTestId('error-message');
page.getByTestId('loading-spinner');
```

### Advanced Selectors

```typescript
// Multiple elements
page.getByRole('button').filter({ hasText: 'Delete' });

// Chaining
page.getByRole('dialog').getByRole('button', { name: 'Close' });

// First/Last
page.getByRole('listitem').first();
page.getByRole('listitem').last();

// Nth element
page.getByRole('listitem').nth(2);
```

## Assertions

### Element Presence

```typescript
// Element exists in DOM
await expect.element(page.getByText('Success')).toBeInTheDocument();

// Element is visible
await expect.element(page.getByRole('button')).toBeVisible();

// Element is hidden
await expect.element(page.getByTestId('error')).toBeHidden();

// Element is attached
await expect.element(page.getByRole('dialog')).toBeAttached();
```

### Element States

```typescript
// Enabled/Disabled
await expect.element(page.getByRole('button')).toBeEnabled();
await expect.element(page.getByRole('button')).toBeDisabled();

// Checked/Unchecked
await expect.element(page.getByRole('checkbox')).toBeChecked();
await expect.element(page.getByRole('checkbox')).not.toBeChecked();

// Focused
await expect.element(page.getByRole('textbox')).toBeFocused();

// Selected
await expect.element(page.getByRole('option')).toBeSelected();
```

### Content Assertions

```typescript
// Text content
await expect.element(page.getByRole('heading')).toHaveText('Welcome');
await expect.element(page.getByTestId('counter')).toContainText('5');

// Values
await expect
	.element(page.getByRole('textbox'))
	.toHaveValue('john@example.com');
await expect.element(page.getByRole('textbox')).toHaveValue(/john/);

// Attributes
await expect
	.element(page.getByRole('link'))
	.toHaveAttribute('href', '/docs');
await expect
	.element(page.getByRole('textbox'))
	.toHaveAttribute('aria-invalid', 'true');

// CSS Classes
await expect
	.element(page.getByRole('button'))
	.toHaveClass('btn-primary');
await expect
	.element(page.getByRole('button'))
	.toHaveClass(['btn', 'btn-primary']);
```

### Count Assertions

```typescript
// Exact count
await expect.element(page.getByRole('listitem')).toHaveCount(3);

// At least/most
await expect
	.element(page.getByRole('button'))
	.toHaveCount({ min: 1 });
await expect
	.element(page.getByRole('button'))
	.toHaveCount({ max: 5 });
```

## User Interactions

### Click Events

```typescript
// Simple click
await page.getByRole('button', { name: 'Submit' }).click();

// Click with options
await page.getByRole('button').click({
	force: true, // Bypass actionability checks
	button: 'right', // Right click
	clickCount: 2, // Double click
});

// Click at specific position
await page.getByRole('button').click({ position: { x: 10, y: 20 } });
```

### Form Interactions

```typescript
// Fill input
await page
	.getByRole('textbox', { name: 'Email' })
	.fill('john@example.com');

// Clear and fill
await page.getByRole('textbox').clear();
await page.getByRole('textbox').fill('new-value');

// Check/uncheck
await page.getByRole('checkbox').check();
await page.getByRole('checkbox').uncheck();

// Select options
await page.getByRole('combobox').selectOption('value');
await page.getByRole('combobox').selectOption(['value1', 'value2']);

// Upload files
await page
	.getByRole('textbox', { name: 'Upload' })
	.setInputFiles('path/to/file.txt');
```

### Keyboard Interactions

```typescript
// Single key press
await page.keyboard.press('Enter');
await page.keyboard.press('Escape');
await page.keyboard.press('Tab');

// Key combinations
await page.keyboard.press('Control+A');
await page.keyboard.press('Shift+Tab');

// Type text
await page.keyboard.type('Hello World');

// Element-specific keyboard
await page.getByRole('textbox').press('Enter');
```

### Mouse Interactions

```typescript
// Hover
await page.getByRole('button').hover();

// Drag and drop
await page
	.getByTestId('draggable')
	.dragTo(page.getByTestId('dropzone'));

// Mouse wheel
await page.mouse.wheel(0, 100); // Scroll down
```

## Component Rendering

### Basic Rendering

```typescript
// Simple component
render(Button, { variant: 'primary', children: 'Click me' });

// Component with props
render(Input, {
	type: 'email',
	label: 'Email',
	value: 'test@example.com',
	error: 'Invalid email',
});
```

### Advanced Rendering

```typescript
// Component with event handlers
const click_handler = vi.fn();
render(Button, {
	onclick: click_handler,
	children: 'Click me',
});

// Component with slots/children
const children = createRawSnippet(() => ({
	render: () => `<span>Custom content</span>`,
}));
render(Modal, { children });

// Component with context
render(
	Component,
	{ props },
	{ context: new Map([['key', 'value']]) },
);
```

## Svelte 5 Runes

### State Testing

```typescript
// $state
test('reactive state', () => {
	let count = $state(0);
	expect(count).toBe(0);

	count = 5;
	expect(count).toBe(5);
});

// $derived
test('derived state', () => {
	let count = $state(0);
	let doubled = $derived(count * 2);

	expect(untrack(() => doubled)).toBe(0);

	count = 5;
	flushSync();
	expect(untrack(() => doubled)).toBe(10);
});
```

### Effect Testing

```typescript
// $effect
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

## SSR Testing API

### Component Rendering

```typescript
import { render } from 'svelte/server';

// Basic SSR render
const { body, head } = render(Component);

// With props
const { body, head } = render(Component, {
	props: { title: 'Test' },
});

// With context
const { body, head } = render(Component, {
	props: {},
	context: new Map([['theme', 'dark']]),
});
```

### SSR Assertions

```typescript
// Content assertions
expect(body).toContain('<h1>Welcome</h1>');
expect(body).toMatch(/<nav.*>.*<\/nav>/);

// Head assertions
expect(head).toContain('<title>Page Title</title>');
expect(head).toContain('<meta name="description"');

// Structure assertions
expect(body).toContain('role="main"');
expect(body).toContain('aria-label="Navigation"');
```

## Mocking

### Function Mocking

```typescript
// Simple mock
const mock_fn = vi.fn();

// Mock with return value
const mock_fn = vi.fn(() => 'mocked-result');

// Mock with implementation
const mock_fn = vi.fn((input: string) => `processed-${input}`);

// Spy on existing function
const spy = vi.spyOn(obj, 'method');
```

### Module Mocking

```typescript
// Mock entire module
vi.mock('$lib/utils', () => ({
	validate_email: vi.fn(() => true),
	format_date: vi.fn(() => '2023-01-01'),
}));

// Partial module mock
vi.mock('$lib/api', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		fetch_user: vi.fn(() => ({ id: 1, name: 'Test User' })),
	};
});
```

### Component Mocking

```typescript
// Mock Svelte component
vi.mock('$lib/components/heavy-component.svelte', () => ({
	default: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
}));
```

## Wait Utilities

### Wait for Elements

```typescript
// Wait for element to appear
await expect
	.element(page.getByText('Loading complete'))
	.toBeInTheDocument();

// Wait with timeout
await expect
	.element(page.getByText('Data loaded'))
	.toBeInTheDocument({ timeout: 10000 });

// Wait for element to disappear
await expect
	.element(page.getByText('Loading...'))
	.not.toBeInTheDocument();
```

### Wait for Conditions

```typescript
// Wait for custom condition
await page.waitForFunction(() => window.dataLoaded === true);

// Wait for network
await page.waitForResponse('**/api/data');

// Wait for timeout
await page.waitForTimeout(1000);
```

## Error Handling

### Assertion Errors

```typescript
try {
	await expect
		.element(page.getByText('Nonexistent'))
		.toBeInTheDocument();
} catch (error) {
	expect(error.message).toContain('Element not found');
}
```

### Component Error Testing

```typescript
// Test error boundaries
expect(() => {
	render(BrokenComponent);
}).toThrow('Component error');

// Test error states
render(Component, { props: { error: 'Something went wrong' } });
await expect
	.element(page.getByText('Something went wrong'))
	.toBeInTheDocument();
```

## Performance Testing

### Timing

```typescript
// Measure render time
const start = performance.now();
render(HeavyComponent);
const render_time = performance.now() - start;
expect(render_time).toBeLessThan(100); // ms
```

### Memory

```typescript
// Check for memory leaks (simplified)
const initial_heap = performance.memory?.usedJSHeapSize || 0;
render(Component);
// ... perform operations
const final_heap = performance.memory?.usedJSHeapSize || 0;
expect(final_heap - initial_heap).toBeLessThan(1000000); // bytes
```

## Custom Utilities

### Test Helpers

```typescript
// Custom render helper
function render_with_theme(Component: any, props = {}) {
	return render(Component, {
		...props,
		context: new Map([['theme', 'dark']]),
	});
}

// Form testing helper
async function fill_form(data: Record<string, string>) {
	for (const [field, value] of Object.entries(data)) {
		await page.getByLabelText(field).fill(value);
	}
}

// Wait helper
async function wait_for_loading_to_complete() {
	await expect
		.element(page.getByTestId('loading'))
		.not.toBeInTheDocument();
}
```

### Custom Matchers

```typescript
// Extend expect with custom matchers
expect.extend({
	toHaveValidationError(received: any, expected: string) {
		const error_element = page.getByText(expected);
		const pass = !!error_element;

		return {
			pass,
			message: () =>
				pass
					? `Expected not to have validation error: ${expected}`
					: `Expected to have validation error: ${expected}`,
		};
	},
});
```

## Configuration

### Vitest Browser Config

```typescript
// vite.config.ts
export default defineConfig({
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			// Slow tests down for debugging
			slowMo: 100,
			// Take screenshots on failure
			screenshot: 'only-on-failure',
		},
	},
});
```

### Test Environment

```typescript
// Set environment variables
process.env.NODE_ENV = 'test';
process.env.API_URL = 'http://localhost:3000';

// Configure test timeouts
test(
	'slow test',
	async () => {
		// Custom timeout for this test
	},
	{ timeout: 30000 },
);
```
