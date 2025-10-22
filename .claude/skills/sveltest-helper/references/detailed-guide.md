# Sveltest Comprehensive Testing Guide

**Comprehensive testing patterns for Svelte 5 applications using
vitest-browser-svelte**

This guide demonstrates real-world testing patterns for SvelteKit
applications, covering client-side, server-side, and SSR testing with
the "Foundation First" approach.

## Table of Contents

- [Core Principles](#core-principles)
- [Foundation First Methodology](#foundation-first-methodology)
- [Complete Examples](#complete-examples)
- [Critical Patterns](#critical-patterns)
- [Client-Server Alignment](#client-server-alignment)
- [Common Errors & Solutions](#common-errors--solutions)
- [Quick Reference](#quick-reference)

---

## Core Principles

### 1. Always Use Locators, Never Containers

vitest-browser-svelte uses Playwright-style locators with automatic
retry logic. **Never** use the `container` object.

```typescript
// ❌ NEVER - No retry logic, brittle tests
const { container } = render(MyComponent);
const button = container.querySelector('button');

// ✅ ALWAYS - Auto-retry, resilient tests
render(MyComponent);
const button = page.getByRole('button', { name: 'Submit' });
await button.click();
```

### 2. Handle Strict Mode Violations

When multiple elements match a locator, use `.first()`, `.nth()`, or
`.last()`:

```typescript
// ❌ FAILS: "strict mode violation: resolved to 2 elements"
page.getByRole('link', { name: 'Home' }); // Desktop + mobile nav

// ✅ CORRECT: Handle multiple elements explicitly
page.getByRole('link', { name: 'Home' }).first();
page.getByRole('link', { name: 'Home' }).nth(1); // Second element
page.getByRole('link', { name: 'Home' }).last();
```

### 3. Use `untrack()` for $derived Values

Svelte 5 runes require `untrack()` when accessing `$derived` values in
tests:

```typescript
import { untrack } from 'svelte';

// ✅ Access $derived values
const value = untrack(() => component.derivedValue);
expect(value).toBe(42);

// ✅ For getters: get function first, then untrack
const derivedFn = component.computedValue;
expect(untrack(() => derivedFn())).toBe(expected);
```

### 4. Real FormData/Request Objects

Use real web APIs instead of heavy mocking to catch client-server
mismatches:

```typescript
// ❌ BRITTLE: Mocks hide API mismatches
const mockRequest = {
	formData: vi.fn().mockResolvedValue({
		get: vi.fn().mockReturnValue('test@example.com'),
	}),
};

// ✅ ROBUST: Real FormData catches mismatches
const formData = new FormData();
formData.append('email', 'test@example.com');
const request = new Request('http://localhost/api/users', {
	method: 'POST',
	body: formData,
});

// Only mock external services
vi.mocked(database.createUser).mockResolvedValue({
	id: '123',
	email: 'test@example.com',
});
```

---

## Foundation First Methodology

**Aim for 100% test coverage** by planning comprehensive test
structure before implementation.

### Step 1: Create Test Structure with `.skip`

```typescript
// form.svelte.test.ts
import { test, describe } from 'vitest';

describe('ContactForm', () => {
	describe('Initial Rendering', () => {
		test.skip('renders with default props', () => {});
		test.skip('renders all form fields', () => {});
		test.skip('has proper ARIA labels', () => {});
	});

	describe('Form Validation', () => {
		test.skip('validates email format', () => {});
		test.skip('requires all fields', () => {});
		test.skip('shows validation errors', () => {});
		test.skip('validates on blur', () => {});
	});

	describe('User Interactions', () => {
		test.skip('handles input changes', () => {});
		test.skip('clears form on reset', () => {});
		test.skip('disables submit when invalid', () => {});
	});

	describe('Edge Cases', () => {
		test.skip('handles empty submission', () => {});
		test.skip('handles server errors', () => {});
		test.skip('shows loading state', () => {});
	});

	describe('Accessibility', () => {
		test.skip('supports keyboard navigation', () => {});
		test.skip('announces errors to screen readers', () => {});
	});
});
```

### Step 2: Implement Tests Incrementally

Remove `.skip` as you implement each test:

```typescript
describe('ContactForm', () => {
	describe('Initial Rendering', () => {
		test('renders with default props', async () => {
			render(ContactForm);

			await expect
				.element(page.getByRole('textbox', { name: /email/i }))
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('textbox', { name: /message/i }))
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('button', { name: /submit/i }))
				.toBeInTheDocument();
		});

		test.skip('renders all form fields', () => {});
		// Continue implementing...
	});
});
```

---

## Complete Examples

### Example 1: Client-Side Component Test

Real browser testing with user interactions:

```typescript
// button.svelte.test.ts
import { render } from 'vitest-browser-svelte';
import { test, expect, describe } from 'vitest';
import { userEvent } from '@vitest/browser/context';
import Button from './button.svelte';

describe('Button Component', () => {
	test('increments counter on click', async () => {
		const { page } = render(Button, { props: { label: 'Click me' } });

		const button = page.getByRole('button', { name: /click me/i });

		await userEvent.click(button);
		await expect.element(button).toHaveTextContent('Clicked: 1');

		await userEvent.click(button);
		await expect.element(button).toHaveTextContent('Clicked: 2');
	});

	test('supports keyboard interaction', async () => {
		render(Button, { props: { label: 'Press me' } });

		const button = page.getByRole('button', { name: /press me/i });
		await button.focus();
		await userEvent.keyboard('{Enter}');

		await expect.element(button).toHaveTextContent('Clicked: 1');
	});

	test('handles multiple buttons with .first()', async () => {
		render(ButtonGroup); // Renders multiple buttons

		// Handle multiple buttons explicitly
		const firstButton = page.getByRole('button').first();
		const secondButton = page.getByRole('button').nth(1);

		await firstButton.click();
		await expect.element(firstButton).toHaveTextContent('Clicked: 1');

		await secondButton.click();
		await expect
			.element(secondButton)
			.toHaveTextContent('Clicked: 1');
	});
});
```

### Example 2: Testing Svelte 5 Runes

```typescript
// counter.svelte.test.ts
import { render } from 'vitest-browser-svelte';
import { test, expect } from 'vitest';
import { untrack, flushSync } from 'svelte';
import Counter from './counter.svelte';

test('$state and $derived reactivity', async () => {
	const { component } = render(Counter);

	// Access $state value directly
	expect(component.count).toBe(0);

	// Update state
	component.increment();

	// Force synchronous update
	flushSync(() => {});

	// Access $derived value with untrack
	const doubled = untrack(() => component.doubled);
	expect(doubled).toBe(2);
});

test('form validation lifecycle', async () => {
	const { component } = render(FormComponent);

	// Initially valid (no validation run yet)
	expect(untrack(() => component.isFormValid())).toBe(true);

	// Trigger validation
	component.validateAllFields();

	// Now invalid (empty required fields)
	expect(untrack(() => component.isFormValid())).toBe(false);

	// Fix validation errors
	component.email.value = 'test@example.com';
	component.validateAllFields();

	// Valid again
	expect(untrack(() => component.isFormValid())).toBe(true);
});
```

### Example 3: Server-Side API Test

Test with real FormData/Request objects:

```typescript
// api/users/server.test.ts
import { test, expect, describe, vi } from 'vitest';
import { POST } from './+server';
import * as database from '$lib/server/database';

vi.mock('$lib/server/database');

describe('POST /api/users', () => {
	test('creates user with valid data', async () => {
		// Mock only external services
		vi.mocked(database.createUser).mockResolvedValue({
			id: '123',
			email: 'user@example.com',
		});

		// Use real FormData
		const formData = new FormData();
		formData.append('email', 'user@example.com');
		formData.append('password', 'securepass123');

		// Use real Request object
		const request = new Request('http://localhost/api/users', {
			method: 'POST',
			body: formData,
		});

		const response = await POST({ request });
		const data = await response.json();

		expect(response.status).toBe(201);
		expect(data.email).toBe('user@example.com');
		expect(database.createUser).toHaveBeenCalledWith({
			email: 'user@example.com',
			password: 'securepass123',
		});
	});

	test('rejects invalid email format', async () => {
		const formData = new FormData();
		formData.append('email', 'invalid-email');
		formData.append('password', 'pass123');

		const request = new Request('http://localhost/api/users', {
			method: 'POST',
			body: formData,
		});

		const response = await POST({ request });
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.errors.email).toBeDefined();
		expect(database.createUser).not.toHaveBeenCalled();
	});

	test('handles missing required fields', async () => {
		const formData = new FormData();
		// Missing email and password

		const request = new Request('http://localhost/api/users', {
			method: 'POST',
			body: formData,
		});

		const response = await POST({ request });
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.errors.email).toBeDefined();
		expect(data.errors.password).toBeDefined();
	});
});
```

### Example 4: SSR Test

Test server-side rendering output:

```typescript
// page.ssr.test.ts
import { test, expect, describe } from 'vitest';
import PageComponent from './+page.svelte';

describe('Page SSR', () => {
	test('renders without errors', () => {
		expect(() =>
			PageComponent.render({
				data: { title: 'Welcome' },
			}),
		).not.toThrow();
	});

	test('renders correct HTML structure', () => {
		const { html } = PageComponent.render({
			data: {
				title: 'Welcome',
				items: ['Alpha', 'Beta', 'Gamma'],
			},
		});

		expect(html).toContain('<h1>Welcome</h1>');
		expect(html).toContain('<li>Alpha</li>');
		expect(html).toContain('<li>Beta</li>');
		expect(html).toContain('<li>Gamma</li>');
	});

	test('applies correct CSS classes', () => {
		const { html } = PageComponent.render({
			data: { status: 'success' },
		});

		// Test semantic CSS classes, not implementation details
		expect(html).toContain('text-success');
		expect(html).toContain('<svg'); // Icon present
	});

	test('handles empty data gracefully', () => {
		const { html } = PageComponent.render({
			data: { items: [] },
		});

		expect(html).toContain('No items found');
	});
});
```

---

## Critical Patterns

### Form Handling in SvelteKit

**NEVER click submit buttons** in SvelteKit forms - they trigger full
page navigation:

```typescript
// ❌ DON'T - Causes navigation/hangs
const submit = page.getByRole('button', { name: /submit/i });
await submit.click(); // ⚠️ Infinite hang

// ✅ DO - Test form state directly
render(MyForm, { props: { errors: { email: 'Required' } } });

const emailInput = page.getByRole('textbox', { name: /email/i });
await emailInput.fill('test@example.com');

// Verify form state
await expect.element(emailInput).toHaveValue('test@example.com');

// Test error display
await expect.element(page.getByText('Required')).toBeInTheDocument();
```

### Semantic Queries (Preferred)

Use semantic role-based queries for better accessibility and
maintainability:

```typescript
// ✅ BEST - Semantic queries
page.getByRole('button', { name: 'Submit' });
page.getByRole('textbox', { name: 'Email' });
page.getByRole('heading', { name: 'Welcome', level: 1 });
page.getByLabel('Email address');
page.getByText('Welcome back');

// ⚠️ OK - Use when no role available
page.getByTestId('custom-widget');
page.getByPlaceholder('Enter your email');

// ❌ AVOID - Brittle, implementation-dependent
container.querySelector('.submit-button');
```

### Common Role Mistakes

```typescript
// ❌ WRONG: "input" is not a role
page.getByRole('input', { name: 'Email' });

// ✅ CORRECT: Use "textbox" for input fields
page.getByRole('textbox', { name: 'Email' });

// ❌ WRONG: Using link role when element has role="button"
page.getByRole('link', { name: 'Submit' }); // <a role="button">

// ✅ CORRECT: Use the actual role attribute
page.getByRole('button', { name: 'Submit' });

// ✅ Check actual roles in browser DevTools
// Right-click element → Inspect → Accessibility tab
```

### Avoid Testing Implementation Details

Test user-visible behavior, not internal implementation:

```typescript
// ❌ BRITTLE - Tests exact SVG path
expect(html).toContain(
	'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
);
// Breaks when icon library updates!

// ✅ ROBUST - Tests semantic structure
expect(html).toContain('text-success'); // CSS class
expect(html).toContain('<svg'); // Icon present

// ✅ BEST - Tests user experience
await expect
	.element(page.getByRole('img', { name: /success/i }))
	.toBeInTheDocument();
```

### Using `force: true` for Animations

```typescript
// Some elements require force: true due to animations
await button.click({ force: true });
await input.fill('text', { force: true });
```

---

## Client-Server Alignment

### The Problem

Heavy mocking in server tests can hide client-server mismatches that
only appear in production.

### The Solution

Use real `FormData` and `Request` objects. Only mock external services
(database, APIs).

```typescript
// ❌ BRITTLE APPROACH
const mockRequest = {
	formData: vi.fn().mockResolvedValue({
		get: vi.fn((key) => {
			if (key === 'email') return 'test@example.com';
			if (key === 'password') return 'pass123';
		}),
	}),
};
// This passes even if real FormData API differs!

// ✅ ROBUST APPROACH
const formData = new FormData();
formData.append('email', 'test@example.com');
formData.append('password', 'pass123');

const request = new Request('http://localhost/register', {
	method: 'POST',
	body: formData,
});

// Only mock external services
vi.mocked(database.createUser).mockResolvedValue({
	id: '123',
	email: 'test@example.com',
});

const response = await POST({ request });
```

### Shared Validation Logic

Use the same validation on client and server:

```typescript
// lib/validation.ts
export function validateEmail(email: string) {
	if (!email) return 'Email is required';
	if (!email.includes('@')) return 'Invalid email format';
	return null;
}

// Component test
import { validateEmail } from '$lib/validation';
test('validates email', () => {
	expect(validateEmail('')).toBe('Email is required');
	expect(validateEmail('invalid')).toBe('Invalid email format');
	expect(validateEmail('test@example.com')).toBe(null);
});

// Server test - same validation!
const emailError = validateEmail(formData.get('email'));
if (emailError) {
	return json({ errors: { email: emailError } }, { status: 400 });
}
```

---

## Common Errors & Solutions

### Error 1: Strict Mode Violation

**Error:** `strict mode violation: getByRole() resolved to X elements`

**Cause:** Multiple elements match (common with responsive design -
desktop + mobile nav)

**Solution:**

```typescript
// Before
page.getByRole('link', { name: 'Home' });

// After
page.getByRole('link', { name: 'Home' }).first();
```

### Error 2: Async Assertion Failures

**Error:** Element assertions fail intermittently

**Cause:** Not using `await expect.element()`

**Solution:**

```typescript
// ❌ WRONG - No auto-retry
expect(element).toHaveTextContent('text');

// ✅ CORRECT - Waits for element
await expect.element(element).toHaveTextContent('text');
```

### Error 3: Cannot Access $derived

**Error:** Cannot read $derived value in test

**Cause:** Svelte 5 reactive values need `untrack()`

**Solution:**

```typescript
import { untrack } from 'svelte';

// Before
const value = component.derivedValue; // Error!

// After
const value = untrack(() => component.derivedValue);
```

### Error 4: Form Submit Hangs

**Error:** Test hangs after clicking submit button

**Cause:** SvelteKit form submission triggers full page navigation

**Solution:**

```typescript
// ❌ DON'T
await submitButton.click(); // Hangs!

// ✅ DO - Test form state directly
render(MyForm, { props: { errors: { email: 'Required' } } });
await expect.element(page.getByText('Required')).toBeInTheDocument();
```

### Error 5: Wrong ARIA Role

**Error:** Locator doesn't find element

**Cause:** Using wrong role name

**Solution:**

```typescript
// ❌ Wrong roles
page.getByRole('input', { name: 'Email' }); // No "input" role
page.getByRole('div', { name: 'Container' }); // No "div" role

// ✅ Correct roles
page.getByRole('textbox', { name: 'Email' }); // For <input>
page.getByRole('button', { name: 'Submit' }); // For <button>
page.getByRole('link', { name: 'Home' }); // For <a>

// 💡 Tip: Check DevTools → Accessibility tab for actual roles
```

---

## Quick Reference

### ✅ DO

- Use locators (`page.getBy*()`) - never containers
- Always `await expect.element()` for locator assertions
- Use `.first()`, `.nth()`, `.last()` for multiple elements
- Use `untrack()` for `$derived` values
- Use `force: true` for animated elements
- Test form validation lifecycle: initial (valid) → validate → invalid
  → fix
- Use real `FormData`/`Request` objects in server tests
- Test semantic structure and CSS classes
- Focus on user-visible behavior
- Plan with `.skip` blocks before implementing

### ❌ DON'T

- Never click SvelteKit form submit buttons
- Don't ignore strict mode violations
- Don't assume element roles - verify in DevTools
- Don't test implementation details (SVG paths, exact markup)
- Don't write brittle tests that break on library updates
- Don't mock browser APIs (FormData, Request, etc.)
- Don't expect forms to be invalid initially
- Avoid `children` props in vitest-browser-svelte

### Common Locator Methods

```typescript
// Semantic queries (preferred)
page.getByRole('button', { name: 'Submit' });
page.getByRole('textbox', { name: 'Email' });
page.getByRole('heading', { name: 'Title', level: 1 });
page.getByLabel('Email address');
page.getByText('Welcome');

// Fallback queries
page.getByTestId('custom-widget');
page.getByPlaceholder('Enter email');

// Multiple element handling
page.getByRole('link').first(); // First match
page.getByRole('link').nth(1); // Second match (0-indexed)
page.getByRole('link').last(); // Last match
```

### Test File Patterns

```typescript
// Client-side component test
// button.svelte.test.ts
import { render } from 'vitest-browser-svelte';
import { expect } from 'vitest';

test('component behavior', async () => {
	render(Component);
	await expect.element(page.getByRole('button')).toBeInTheDocument();
});

// Server-side API test
// api/users/server.test.ts
import { POST } from './+server';

test('API endpoint', async () => {
	const formData = new FormData();
	const request = new Request('http://localhost/api', {
		method: 'POST',
		body: formData,
	});
	const response = await POST({ request });
	expect(response.status).toBe(200);
});

// SSR test
// page.ssr.test.ts
import PageComponent from './+page.svelte';

test('SSR rendering', () => {
	const { html } = PageComponent.render({ data: {} });
	expect(html).toContain('expected content');
});
```

---

## Additional Resources

- [vitest-browser-svelte Documentation](https://github.com/vitest-dev/vitest-browser-svelte)
- [Playwright Locators Reference](https://playwright.dev/docs/locators)
- [ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/what-are-runes)

## Contributing

Found a pattern that works well? Add it to this guide! This is a
living document that grows with the team's experience.

---

**Last Updated:** 2025-10-22 **Maintained by:** Sveltest Team
