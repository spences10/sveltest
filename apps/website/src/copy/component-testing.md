# Component Testing

## Overview

This guide covers component testing patterns for Svelte 5 applications
using vitest-browser-svelte. For general testing patterns, see
[Testing Patterns](./testing-patterns). For setup and configuration,
see [Getting Started](./getting-started).

## Essential Setup Pattern

Every component test file should start with this setup:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { createRawSnippet } from 'svelte';
import { flushSync, untrack } from 'svelte';

// Import your component
import MyComponent from './my-component.svelte';
```

## Locator Patterns

### Basic Locator Usage

```typescript
it('should use semantic locators', async () => {
	render(MyComponent);

	// ✅ Semantic queries (preferred - test accessibility)
	const submit_button = page.getByRole('button', { name: 'Submit' });
	const email_input = page.getByRole('textbox', { name: 'Email' });
	const email_label = page.getByLabel('Email address');
	const welcome_text = page.getByText('Welcome');

	// ✅ Test IDs (when semantic queries aren't possible)
	const complex_widget = page.getByTestId('data-visualization');

	// ✅ Always await assertions
	await expect.element(submit_button).toBeInTheDocument();
	await expect.element(email_input).toHaveAttribute('type', 'email');
});
```

### DOM Manipulation Methods

**Important**: Vitest browser locators require `.element()` to access
native DOM methods like `focus()` and `blur()`:

```typescript
it('should access DOM methods through .element()', async () => {
	render(MyComponent);

	const input = page.getByRole('textbox', { name: 'Email' });

	// ❌ WRONG: focus() doesn't exist on Vitest locators
	// await input.focus();

	// ✅ CORRECT: Use .element() to access native DOM methods
	await input.element().focus();
	await input.element().blur();

	// Note: This is different from Playwright e2e tests where
	// locators have focus() directly: await locator.focus()
});
```

**Why the difference?**

- **Playwright locators** (e2e tests with `@playwright/test`): Have
  `focus()`, `blur()`, etc. directly available
- **Vitest browser locators** (component tests with
  `vitest-browser-svelte`): Require `.element()` to access these
  methods

This design keeps Vitest locators lightweight while providing access
to all native DOM methods when needed.

## Handling Multiple Elements (Strict Mode)

vitest-browser-svelte operates in strict mode - if multiple elements
match, you must specify which one:

```typescript
it('should handle multiple matching elements', async () => {
	render(NavigationComponent);

	// ❌ FAILS: Strict mode violation if desktop + mobile nav both exist
	// page.getByRole('link', { name: 'Home' });

	// ✅ CORRECT: Use .first(), .nth(), or .last()
	const desktop_home_link = page
		.getByRole('link', { name: 'Home' })
		.first();
	const mobile_home_link = page
		.getByRole('link', { name: 'Home' })
		.last();
	const second_link = page.getByRole('link', { name: 'Home' }).nth(1);

	await expect.element(desktop_home_link).toBeInTheDocument();
	await expect.element(mobile_home_link).toBeInTheDocument();
});
```

## Role Confusion Fixes

Common role mistakes and their solutions:

```typescript
it('should use correct element roles', async () => {
	render(FormComponent);

	// ❌ WRONG: Input role doesn't exist
	// page.getByRole('input', { name: 'Email' });

	// ✅ CORRECT: Use textbox for input elements
	const email_input = page.getByRole('textbox', { name: 'Email' });

	// ❌ WRONG: Looking for link when element has role="button"
	// page.getByRole('link', { name: 'Submit' }); // <a role="button">Submit</a>

	// ✅ CORRECT: Use the actual role attribute
	const submit_link_button = page.getByRole('button', {
		name: 'Submit',
	});

	await expect.element(email_input).toBeInTheDocument();
	await expect.element(submit_link_button).toBeInTheDocument();
});
```

## Component Testing Patterns

### Button Component Pattern

```typescript
describe('Button Component', () => {
	it('should render with variant styling', async () => {
		render(Button, { variant: 'primary', children: 'Click me' });

		const button = page.getByRole('button', { name: 'Click me' });
		await expect.element(button).toBeInTheDocument();
		await expect.element(button).toHaveClass('btn-primary');
	});

	it('should handle click events', async () => {
		const click_handler = vi.fn();
		render(Button, { onclick: click_handler, children: 'Click me' });

		const button = page.getByRole('button', { name: 'Click me' });
		await button.click();

		expect(click_handler).toHaveBeenCalledOnce();
	});

	it('should support disabled state', async () => {
		render(Button, { disabled: true, children: 'Disabled' });

		const button = page.getByRole('button', { name: 'Disabled' });
		await expect.element(button).toBeDisabled();
		await expect.element(button).toHaveClass('btn-disabled');
	});

	it('should handle animations with force click', async () => {
		render(AnimatedButton, { children: 'Animated' });

		const button = page.getByRole('button', { name: 'Animated' });
		// Use force: true for elements that may be animating
		await button.click({ force: true });

		await expect
			.element(page.getByText('Animation complete'))
			.toBeInTheDocument();
	});
});
```

### Input Component Pattern

```typescript
describe('Input Component', () => {
	it('should handle user input', async () => {
		render(Input, { type: 'text', label: 'Full Name' });

		const input = page.getByLabelText('Full Name');
		await input.fill('John Doe');

		await expect.element(input).toHaveValue('John Doe');
	});

	it('should display validation errors', async () => {
		render(Input, {
			type: 'email',
			label: 'Email',
			error: 'Invalid email format',
		});

		const input = page.getByLabelText('Email');
		const error_message = page.getByText('Invalid email format');

		await expect.element(error_message).toBeInTheDocument();
		await expect
			.element(input)
			.toHaveAttribute('aria-invalid', 'true');
		await expect.element(input).toHaveClass('input-error');
	});

	it('should support different input types', async () => {
		render(Input, { type: 'password', label: 'Password' });

		const input = page.getByLabelText('Password');
		await expect.element(input).toHaveAttribute('type', 'password');
	});
});
```

### Modal Component Pattern

```typescript
describe('Modal Component', () => {
	it('should handle focus management', async () => {
		render(Modal, { open: true, children: 'Modal content' });

		const modal = page.getByRole('dialog');
		await expect.element(modal).toBeInTheDocument();

		// Test focus trap
		await page.keyboard.press('Tab');
		const close_button = page.getByRole('button', { name: 'Close' });
		await expect.element(close_button).toBeFocused();
	});

	it('should close on escape key', async () => {
		const close_handler = vi.fn();
		render(Modal, { open: true, onclose: close_handler });

		await page.keyboard.press('Escape');
		expect(close_handler).toHaveBeenCalledOnce();
	});

	it('should prevent background scroll when open', async () => {
		render(Modal, { open: true });

		const body = page.locator('body');
		await expect.element(body).toHaveClass('modal-open');
	});
});
```

### Dropdown/Select Component Pattern

```typescript
describe('Dropdown Component', () => {
	it('should open and close on click', async () => {
		const options = [
			{ value: 'option1', label: 'Option 1' },
			{ value: 'option2', label: 'Option 2' },
		];
		render(Dropdown, { options, label: 'Choose option' });

		const trigger = page.getByRole('button', {
			name: 'Choose option',
		});
		await trigger.click();

		// Dropdown should be open
		const option1 = page.getByRole('option', { name: 'Option 1' });
		await expect.element(option1).toBeInTheDocument();

		// Select an option
		await option1.click();

		// Dropdown should close and show selected value
		await expect.element(trigger).toHaveTextContent('Option 1');
	});

	it('should support keyboard navigation', async () => {
		const options = [
			{ value: 'option1', label: 'Option 1' },
			{ value: 'option2', label: 'Option 2' },
		];
		render(Dropdown, { options, label: 'Choose option' });

		const trigger = page.getByRole('button', {
			name: 'Choose option',
		});
		await trigger.element().focus();
		await page.keyboard.press('Enter');

		// Navigate with arrow keys
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		await expect.element(trigger).toHaveTextContent('Option 1');
	});
});
```

## Mocking Patterns

### Component Mocking Pattern

```typescript
// Mock child components to isolate testing
vi.mock('./child-component.svelte', () => ({
	default: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
}));

describe('Parent Component', () => {
	it('should render with mocked child', async () => {
		render(ParentComponent);

		// Test parent functionality without child complexity
		const parent_element = page.getByTestId('parent');
		await expect.element(parent_element).toBeInTheDocument();
	});
});
```

### Utility Function Mocking Pattern

```typescript
// Mock utility functions with realistic return values
vi.mock('$lib/utils/api', () => ({
	fetch_user_data: vi.fn(() =>
		Promise.resolve({
			id: 1,
			name: 'John Doe',
			email: 'john@example.com',
		}),
	),
	validate_email: vi.fn((email: string) => email.includes('@')),
}));

describe('User Profile Component', () => {
	it('should load user data on mount', async () => {
		render(UserProfile, { user_id: 1 });

		await expect
			.element(page.getByText('John Doe'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('john@example.com'))
			.toBeInTheDocument();
	});
});
```

### Store Mocking Pattern

```typescript
// Mock Svelte stores
vi.mock('$lib/stores/user', () => ({
	user_store: {
		subscribe: vi.fn((callback) => {
			callback({ id: 1, name: 'Test User' });
			return () => {}; // Unsubscribe function
		}),
		set: vi.fn(),
		update: vi.fn(),
	},
}));

describe('User Dashboard', () => {
	it('should display user information from store', async () => {
		render(UserDashboard);

		await expect
			.element(page.getByText('Test User'))
			.toBeInTheDocument();
	});
});
```

## Quick Reference

### Essential Patterns Checklist

- ✅ Use `page.getBy*()` locators - never containers
- ✅ Always await locator assertions: `await expect.element()`
- ✅ Use `.first()`, `.nth()`, `.last()` for multiple elements
- ✅ Use `force: true` for animations:
  `await element.click({ force: true })`
- ✅ Use snake_case for variables/functions, kebab-case for files
- ✅ Handle role confusion: `textbox` not `input`, check actual `role`
  attributes

### Common Fixes

- **"strict mode violation"**: Use `.first()`, `.nth()`, `.last()`
- **Role confusion**: Links with `role="button"` are buttons, use
  `getByRole('button')`
- **Input elements**: Use `getByRole('textbox')`, not
  `getByRole('input')`
- **Animation issues**: Use `force: true` for click events

### Anti-Patterns to Avoid

- ❌ Never use containers: `const { container } = render()`
- ❌ Don't ignore strict mode violations
- ❌ Don't assume element roles - verify with browser dev tools
