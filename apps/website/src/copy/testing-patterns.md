# Testing Patterns

## Overview

This guide provides specific, actionable testing patterns for common
scenarios in Svelte 5 applications.

For comprehensive best practices and philosophy, see
[Best Practices](./best-practices). For setup and configuration, see
[Getting Started](./getting-started). For Svelte 5 runes testing
(`$state`, `$derived`, `untrack()`, `flushSync()`), see
[Runes Testing](./runes-testing).

## Component Testing

For locator patterns, handling multiple elements, role confusion
fixes, component patterns (Button, Input, Modal, Dropdown), and
mocking patterns, see [Component Testing](./component-testing).

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

For comprehensive SSR testing guidance including when to add SSR
tests, basic patterns, layout patterns, and head/body testing, see
[SSR Testing](./ssr-testing).

## Server Testing Patterns

For comprehensive server testing patterns including API routes, form
actions, and server hooks, see [Server Testing](./server-testing).

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
