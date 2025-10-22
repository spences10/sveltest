# Testing Patterns

## Overview

This guide provides specific, actionable testing patterns for common
scenarios in Svelte 5 applications.

For comprehensive best practices and philosophy, see
[Best Practices](./best-practices.md). For setup and configuration,
see [Getting Started](./getting-started.md).

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

### Handling Multiple Elements (Strict Mode)

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

### Role Confusion Fixes

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
		await trigger.focus();
		await page.keyboard.press('Enter');

		// Navigate with arrow keys
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		await expect.element(trigger).toHaveTextContent('Option 1');
	});
});
```

## Svelte 5 Runes Testing Patterns

### $state and $derived Testing

```typescript
describe('Reactive State Component', () => {
	it('should handle $state updates', async () => {
		render(CounterComponent);

		const count_display = page.getByTestId('count');
		const increment_button = page.getByRole('button', {
			name: 'Increment',
		});

		// Initial state
		await expect.element(count_display).toHaveTextContent('0');

		// Update state
		await increment_button.click();
		await expect.element(count_display).toHaveTextContent('1');
	});

	it('should handle $derived values with untrack', () => {
		let count = $state(0);
		let doubled = $derived(count * 2);

		// ✅ Always use untrack() when accessing $derived values
		expect(untrack(() => doubled)).toBe(0);

		count = 5;
		flushSync(); // Ensure derived state is evaluated

		expect(untrack(() => doubled)).toBe(10);
	});

	it('should handle $derived from object getters', () => {
		const state_object = {
			get computed_value() {
				return $derived(() => some_calculation());
			},
		};

		// ✅ Get the $derived function first, then use untrack
		const derived_fn = state_object.computed_value;
		expect(untrack(() => derived_fn())).toBe(expected_value);
	});
});
```

### Real-World Untrack Examples

#### Testing Form State with Multiple $derived Values

```typescript
// From form-state.test.ts - Testing complex derived state
describe('Form State Derived Values', () => {
	it('should validate form state correctly', () => {
		const form = create_form_state({
			email: { value: '', validation_rules: { required: true } },
			password: {
				value: '',
				validation_rules: { required: true, min_length: 8 },
			},
		});

		// Test initial state
		expect(untrack(() => form.is_form_valid())).toBe(true);
		expect(untrack(() => form.has_changes())).toBe(false);
		expect(untrack(() => form.field_errors())).toEqual({});

		// Update field and test derived state changes
		form.update_field('email', 'invalid');
		flushSync();

		expect(untrack(() => form.is_form_valid())).toBe(false);
		expect(untrack(() => form.has_changes())).toBe(true);

		const errors = untrack(() => form.field_errors());
		expect(errors.email).toBe('Invalid format');
	});
});
```

#### Testing Calculator State Transitions

```typescript
// From calculator.test.ts - Testing state getters
describe('Calculator State Management', () => {
	it('should handle calculator state transitions', () => {
		// Test initial state
		expect(untrack(() => calculator_state.current_value)).toBe('0');
		expect(untrack(() => calculator_state.previous_value)).toBe('');
		expect(untrack(() => calculator_state.operation)).toBe('');
		expect(untrack(() => calculator_state.waiting_for_operand)).toBe(
			false,
		);

		// Perform operation and test state changes
		calculator_state.input_digit('5');
		calculator_state.input_operation('+');
		flushSync();

		expect(untrack(() => calculator_state.current_value)).toBe('5');
		expect(untrack(() => calculator_state.operation)).toBe('+');
		expect(untrack(() => calculator_state.waiting_for_operand)).toBe(
			true,
		);
	});
});
```

#### ✅ VALIDATED: Creating $derived State in Tests

**Key Discovery**: Runes can only be used in `.test.svelte.ts` files,
not regular `.ts` files!

```typescript
// From untrack-validation.test.svelte.ts - PROVEN WORKING PATTERN
describe('Untrack Usage Validation', () => {
	it('should access $derived values using untrack', () => {
		// ✅ Create reactive state directly in test (.test.svelte.ts file)
		let email = $state('');
		const email_validation = $derived(validate_email(email));

		// Test invalid email
		email = 'invalid-email';
		flushSync();

		// ✅ CORRECT: Use untrack to access $derived value
		const result = untrack(() => email_validation);
		expect(result.is_valid).toBe(false);
		expect(result.error_message).toBe('Invalid format');

		// Test valid email
		email = 'test@example.com';
		flushSync();

		const valid_result = untrack(() => email_validation);
		expect(valid_result.is_valid).toBe(true);
		expect(valid_result.error_message).toBe('');
	});

	it('should handle complex derived logic', () => {
		// ✅ Recreate component logic in test
		let email = $state('');
		let submit_attempted = $state(false);
		let email_touched = $state(false);

		const email_validation = $derived(validate_email(email));
		const show_email_error = $derived(
			submit_attempted || email_touched,
		);
		const email_error = $derived(
			show_email_error && !email_validation.is_valid
				? email_validation.error_message
				: '',
		);

		// Initially no errors shown
		expect(untrack(() => show_email_error)).toBe(false);
		expect(untrack(() => email_error)).toBe('');

		// After touching field with invalid email
		email = 'invalid';
		email_touched = true;
		flushSync();

		expect(untrack(() => show_email_error)).toBe(true);
		expect(untrack(() => email_error)).toBe('Invalid format');
	});

	it('should test state transitions with untrack', () => {
		// ✅ Test reactive state changes
		let count = $state(0);
		let doubled = $derived(count * 2);
		let is_even = $derived(count % 2 === 0);

		// Initial state
		expect(untrack(() => count)).toBe(0);
		expect(untrack(() => doubled)).toBe(0);
		expect(untrack(() => is_even)).toBe(true);

		// Update state
		count = 3;
		flushSync();

		// Test all derived values
		expect(untrack(() => count)).toBe(3);
		expect(untrack(() => doubled)).toBe(6);
		expect(untrack(() => is_even)).toBe(false);
	});

	it('should handle form validation patterns', () => {
		// ✅ Recreate login form validation logic
		let email = $state('');
		let password = $state('');
		let loading = $state(false);

		const email_validation = $derived(validate_email(email));
		const password_validation = $derived(validate_password(password));
		const form_is_valid = $derived(
			email_validation.is_valid && password_validation.is_valid,
		);
		const can_submit = $derived(form_is_valid && !loading);

		// Test form validation chain
		email = 'test@example.com';
		password = 'ValidPassword123';
		flushSync();

		expect(untrack(() => email_validation.is_valid)).toBe(true);
		expect(untrack(() => password_validation.is_valid)).toBe(true);
		expect(untrack(() => form_is_valid)).toBe(true);
		expect(untrack(() => can_submit)).toBe(true);

		// Test loading state
		loading = true;
		flushSync();

		expect(untrack(() => can_submit)).toBe(false);
	});
});
```

#### Testing Component $derived Values (Theoretical)

```typescript
// NOTE: This pattern requires component internals to be exposed
// Currently not possible with Svelte 5 component encapsulation
describe('LoginForm Derived State', () => {
	it('should validate email and calculate form validity', async () => {
		const { component } = render(LoginForm);

		// ❌ This doesn't work - component internals not exposed
		// component.email = 'invalid-email';
		// expect(untrack(() => component.email_validation)).toBe(...);

		// ✅ Instead, test through UI interactions
		const email_input = page.getByLabelText('Email');
		await email_input.fill('invalid-email');
		await email_input.blur();

		await expect
			.element(page.getByText('Invalid format'))
			.toBeInTheDocument();
	});
});
```

### Form Validation Lifecycle Pattern

```typescript
describe('Form Validation Component', () => {
	it('should follow validation lifecycle', () => {
		const form_state = create_form_state({
			email: {
				value: '',
				validation_rules: { required: true },
			},
		});

		// ✅ CORRECT: Forms typically start valid (not validated yet)
		const is_form_valid = form_state.is_form_valid;
		expect(untrack(() => is_form_valid())).toBe(true);

		// Trigger validation - now should be invalid
		form_state.validate_all_fields();
		flushSync();
		expect(untrack(() => is_form_valid())).toBe(false);

		// Fix the field - should become valid again
		form_state.update_field('email', 'valid@example.com');
		flushSync();
		expect(untrack(() => is_form_valid())).toBe(true);
	});

	it('should handle field-level validation', async () => {
		render(FormComponent);

		const email_input = page.getByLabelText('Email');

		// Initially no error
		await expect
			.element(page.getByText('Email is required'))
			.not.toBeInTheDocument();

		// Trigger validation by focusing and blurring
		await email_input.focus();
		await email_input.blur();

		// Error should appear
		await expect
			.element(page.getByText('Email is required'))
			.toBeInTheDocument();

		// Fix the error
		await email_input.fill('valid@example.com');
		await email_input.blur();

		// Error should disappear
		await expect
			.element(page.getByText('Email is required'))
			.not.toBeInTheDocument();
	});
});
```

## Integration Testing Patterns

### Form Submission Pattern

```typescript
describe('Contact Form Integration', () => {
	it('should handle complete form submission flow', async () => {
		const submit_handler = vi.fn();
		render(ContactForm, { onsubmit: submit_handler });

		// Fill out form
		const name_input = page.getByLabelText('Name');
		const email_input = page.getByLabelText('Email');
		const message_input = page.getByLabelText('Message');

		await name_input.fill('John Doe');
		await email_input.fill('john@example.com');
		await message_input.fill('Hello world');

		// Submit form
		const submit_button = page.getByRole('button', {
			name: 'Send Message',
		});
		await submit_button.click();

		// Verify submission
		expect(submit_handler).toHaveBeenCalledWith({
			name: 'John Doe',
			email: 'john@example.com',
			message: 'Hello world',
		});

		// Verify success message
		await expect
			.element(page.getByText('Message sent successfully'))
			.toBeInTheDocument();
	});

	it('should prevent submission with invalid data', async () => {
		const submit_handler = vi.fn();
		render(ContactForm, { onsubmit: submit_handler });

		// Try to submit empty form
		const submit_button = page.getByRole('button', {
			name: 'Send Message',
		});
		await submit_button.click();

		// Should show validation errors
		await expect
			.element(page.getByText('Name is required'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Email is required'))
			.toBeInTheDocument();

		// Should not call submit handler
		expect(submit_handler).not.toHaveBeenCalled();
	});
});
```

### Todo List Pattern

```typescript
describe('Todo List Integration', () => {
	it('should handle complete todo lifecycle', async () => {
		render(TodoManager);

		// Add todo
		const input = page.getByLabelText('New todo');
		await input.fill('Buy groceries');

		const add_button = page.getByRole('button', { name: 'Add Todo' });
		await add_button.click();

		// Verify todo appears
		const todo_item = page.getByText('Buy groceries');
		await expect.element(todo_item).toBeInTheDocument();

		// Complete todo
		const checkbox = page.getByRole('checkbox', {
			name: 'Mark Buy groceries as complete',
		});
		await checkbox.check();

		// Verify completion styling
		await expect.element(checkbox).toBeChecked();
		await expect.element(todo_item).toHaveClass('todo-completed');

		// Delete todo
		const delete_button = page.getByRole('button', {
			name: 'Delete Buy groceries',
		});
		await delete_button.click();

		// Verify removal
		await expect.element(todo_item).not.toBeInTheDocument();
	});
});
```

### Navigation Pattern

```typescript
describe('Navigation Integration', () => {
	it('should navigate between pages', async () => {
		render(AppLayout);

		// Navigate to docs
		const docs_link = page
			.getByRole('link', { name: 'Documentation' })
			.first();
		await docs_link.click();

		await expect
			.element(page.getByText('Getting Started'))
			.toBeInTheDocument();

		// Navigate to examples
		const examples_link = page
			.getByRole('link', { name: 'Examples' })
			.first();
		await examples_link.click();

		await expect
			.element(page.getByText('Example Components'))
			.toBeInTheDocument();
	});

	it('should highlight active navigation', async () => {
		render(AppLayout, { current_page: '/docs' });

		const docs_link = page
			.getByRole('link', { name: 'Documentation' })
			.first();
		await expect.element(docs_link).toHaveClass('nav-active');

		const home_link = page
			.getByRole('link', { name: 'Home' })
			.first();
		await expect.element(home_link).not.toHaveClass('nav-active');
	});
});
```

## SSR Testing Patterns

### When to Add SSR Tests

SSR tests ensure server-rendered HTML matches client expectations and
prevent hydration mismatches.

#### Always Add SSR Tests For:

- **Form components** - Inputs, selects, textareas (progressive
  enhancement critical)
- **Navigation components** - Links, menus, breadcrumbs (SEO +
  accessibility)
- **Content components** - Cards, articles, headers (SEO critical)
- **Layout components** - Page shells, grids (hydration mismatch
  prone)

#### Usually Add SSR Tests For:

- **Components with complex CSS logic** - Conditional classes,
  variants
- **Components with ARIA attributes** - Screen reader compatibility
- **Components that render different content server vs client**
- **Components used in `+page.svelte` files** (always SSR'd)

#### Rarely Need SSR Tests For:

- **Pure interaction components** - Modals, dropdowns, tooltips
- **Client-only components** - Charts, maps, rich editors
- **Simple presentational components** - Icons, badges, dividers

#### Red Flags That Require SSR Tests:

- Hydration mismatches in browser console
- Different appearance on first load vs after hydration
- SEO issues with missing content
- Accessibility tools can't find elements
- Form doesn't work without JavaScript

#### Quick Decision Framework:

```
Does it render different HTML server vs client? → SSR test
Is it SEO critical? → SSR test
Does it need to work without JS? → SSR test
Is it just interactive behavior? → Skip SSR test
```

**Start with browser tests only, add SSR tests when you hit problems
or have specific SSR requirements.**

### Basic SSR Pattern

```typescript
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';

describe('Component SSR', () => {
	it('should render without errors', () => {
		expect(() => {
			render(ComponentName);
		}).not.toThrow();
	});

	it('should render essential content for SEO', () => {
		const { body } = render(ComponentName, {
			props: { title: 'Page Title', description: 'Page description' },
		});

		expect(body).toContain('<h1>Page Title</h1>');
		expect(body).toContain('Page description');
		expect(body).toContain('href="/important-link"');
	});

	it('should render meta information', () => {
		const { head } = render(ComponentName, {
			props: { title: 'Page Title' },
		});

		expect(head).toContain('<title>Page Title</title>');
		expect(head).toContain('meta name="description"');
	});
});
```

### Layout SSR Pattern

```typescript
describe('Layout SSR', () => {
	it('should render navigation structure', () => {
		const { body } = render(Layout);

		expect(body).toContain('<nav');
		expect(body).toContain('aria-label="Main navigation"');
		expect(body).toContain('href="/docs"');
		expect(body).toContain('href="/examples"');
	});

	it('should include accessibility features', () => {
		const { body } = render(Layout);

		expect(body).toContain('role="main"');
		expect(body).toContain('aria-label');
		expect(body).toContain('skip-to-content');
	});

	it('should render footer information', () => {
		const { body } = render(Layout);

		expect(body).toContain('<footer');
		expect(body).toContain('© 2024');
		expect(body).toContain('Privacy Policy');
	});
});
```

## Server Testing Patterns

### Client-Server Alignment in Server Tests

Server tests follow the **Client-Server Alignment Strategy** by using
real `FormData` and `Request` objects instead of heavy mocking. This
catches client-server contract mismatches that mocked tests miss.

### API Route Pattern

```typescript
describe('API Route', () => {
	it('should handle GET requests', async () => {
		// ✅ Real Request object - catches URL/header issues
		const request = new Request('http://localhost/api/todos');
		const response = await GET({ request });

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty('todos');
		expect(Array.isArray(data.todos)).toBe(true);
	});

	it('should handle POST requests with validation', async () => {
		// ✅ Real Request with JSON body - tests actual parsing
		const request = new Request('http://localhost/api/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: 'New todo', completed: false }),
		});

		const response = await POST({ request });
		expect(response.status).toBe(201);

		const data = await response.json();
		expect(data.todo.title).toBe('New todo');
	});

	it('should handle validation errors', async () => {
		const request = new Request('http://localhost/api/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: '' }), // Invalid data
		});

		const response = await POST({ request });
		expect(response.status).toBe(400);

		const data = await response.json();
		expect(data.error).toContain('Title is required');
	});

	it('should handle authentication', async () => {
		const request = new Request('http://localhost/api/secure-data', {
			headers: { Authorization: 'Bearer valid-token' },
		});

		const response = await GET({ request });
		expect(response.status).toBe(200);
	});

	it('should handle FormData submissions', async () => {
		// ✅ Real FormData - catches field name mismatches
		const form_data = new FormData();
		form_data.append('email', 'user@example.com');
		form_data.append('password', 'secure123');

		const request = new Request('http://localhost/api/register', {
			method: 'POST',
			body: form_data,
		});

		// Only mock external services, not data structures
		vi.mocked(database.users.create).mockResolvedValue({
			id: '123',
			email: 'user@example.com',
		});

		const response = await POST({ request });
		expect(response.status).toBe(201);

		const data = await response.json();
		expect(data.user.email).toBe('user@example.com');
	});
});
```

### Server Hook Pattern

```typescript
describe('Server Hooks', () => {
	it('should add security headers', async () => {
		const event = create_mock_event('GET', '/');
		const response = await handle({ event, resolve: mock_resolve });

		expect(response.headers.get('X-Content-Type-Options')).toBe(
			'nosniff',
		);
		expect(response.headers.get('X-Frame-Options')).toBe(
			'SAMEORIGIN',
		);
		expect(response.headers.get('X-XSS-Protection')).toBe(
			'1; mode=block',
		);
	});

	it('should handle authentication', async () => {
		const event = create_mock_event('GET', '/protected', {
			cookies: { session: 'invalid-session' },
		});

		const response = await handle({ event, resolve: mock_resolve });
		expect(response.status).toBe(302);
		expect(response.headers.get('Location')).toBe('/login');
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

## Error Handling Patterns

### Async Error Pattern

```typescript
describe('Async Component', () => {
	it('should handle loading states', async () => {
		render(AsyncDataComponent);

		// Should show loading initially
		await expect
			.element(page.getByText('Loading...'))
			.toBeInTheDocument();

		// Wait for data to load
		await expect
			.element(page.getByText('Data loaded'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Loading...'))
			.not.toBeInTheDocument();
	});

	it('should handle error states', async () => {
		// Mock API to throw error
		vi.mocked(fetch_data).mockRejectedValueOnce(
			new Error('API Error'),
		);

		render(AsyncDataComponent);

		await expect
			.element(page.getByText('Error: API Error'))
			.toBeInTheDocument();
	});
});
```

### Form Error Pattern

```typescript
describe('Form Error Handling', () => {
	it('should display server errors', async () => {
		const submit_handler = vi.fn().mockRejectedValueOnce({
			message: 'Server error',
			field_errors: { email: 'Email already exists' },
		});

		render(RegistrationForm, { onsubmit: submit_handler });

		const submit_button = page.getByRole('button', {
			name: 'Register',
		});
		await submit_button.click();

		await expect
			.element(page.getByText('Server error'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Email already exists'))
			.toBeInTheDocument();
	});
});
```

## Performance Testing Patterns

### Large List Pattern

```typescript
describe('Large List Performance', () => {
	it('should handle large datasets', async () => {
		const large_dataset = Array.from({ length: 1000 }, (_, i) => ({
			id: i,
			name: `Item ${i}`,
		}));

		render(VirtualizedList, { items: large_dataset });

		// Should render without hanging
		await expect
			.element(page.getByText('Item 0'))
			.toBeInTheDocument();

		// Should support scrolling
		const list_container = page.getByTestId('list-container');
		await list_container.scroll({ top: 5000 });

		// Should render items further down
		await expect
			.element(page.getByText('Item 50'))
			.toBeInTheDocument();
	});
});
```

### Debounced Input Pattern

```typescript
describe('Search Input Performance', () => {
	it('should debounce search queries', async () => {
		const search_handler = vi.fn();
		render(SearchInput, { onsearch: search_handler });

		const input = page.getByLabelText('Search');

		// Type quickly
		await input.fill('a');
		await input.fill('ab');
		await input.fill('abc');

		// Should not call handler immediately
		expect(search_handler).not.toHaveBeenCalled();

		// Wait for debounce
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Should call handler once with final value
		expect(search_handler).toHaveBeenCalledOnce();
		expect(search_handler).toHaveBeenCalledWith('abc');
	});
});
```

## Quick Reference

### Essential Patterns Checklist

- ✅ Use `page.getBy*()` locators - never containers
- ✅ Always await locator assertions: `await expect.element()`
- ✅ Use `.first()`, `.nth()`, `.last()` for multiple elements
- ✅ Use `untrack()` for `$derived`:
  `expect(untrack(() => derived_value))`
- ✅ Use `force: true` for animations:
  `await element.click({ force: true })`
- ✅ Test form validation lifecycle: initial (valid) → validate → fix
- ✅ Use snake_case for variables/functions, kebab-case for files
- ✅ Handle role confusion: `textbox` not `input`, check actual `role`
  attributes

### Common Fixes

- **"strict mode violation"**: Use `.first()`, `.nth()`, `.last()`
- **Role confusion**: Links with `role="button"` are buttons, use
  `getByRole('button')`
- **Input elements**: Use `getByRole('textbox')`, not
  `getByRole('input')`
- **Form hangs**: Don't click SvelteKit form submits - test state
  directly
- **Animation issues**: Use `force: true` for click events

### Anti-Patterns to Avoid

- ❌ Never use containers: `const { container } = render()`
- ❌ Don't ignore strict mode violations
- ❌ Don't assume element roles - verify with browser dev tools
- ❌ Don't expect forms to be invalid initially
- ❌ Don't click SvelteKit form submits in tests
