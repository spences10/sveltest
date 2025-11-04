# Best Practices

## Foundation First Approach

### The Strategic Test Planning Method

Start with complete test structure using `describe` and `it.skip` to
plan comprehensively:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';

describe('TodoManager Component', () => {
	describe('Initial Rendering', () => {
		it('should render empty state', async () => {
			render(TodoManager);

			await expect
				.element(page.getByText('No todos yet'))
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('list'))
				.toHaveAttribute('aria-label', 'Todo list');
		});

		it.skip('should render with initial todos', async () => {
			// TODO: Test with pre-populated data
		});
	});

	describe('User Interactions', () => {
		it('should add new todo', async () => {
			render(TodoManager);

			const input = page.getByLabelText('New todo');
			const add_button = page.getByRole('button', {
				name: 'Add Todo',
			});

			await input.fill('Buy groceries');
			await add_button.click();

			await expect
				.element(page.getByText('Buy groceries'))
				.toBeInTheDocument();
		});

		it.skip('should edit existing todo', async () => {
			// TODO: Test inline editing
		});

		it.skip('should delete todo', async () => {
			// TODO: Test deletion flow
		});
	});

	describe('Form Validation', () => {
		it.skip('should prevent empty todo submission', async () => {
			// TODO: Test validation rules
		});

		it.skip('should handle duplicate todos', async () => {
			// TODO: Test duplicate prevention
		});
	});

	describe('Accessibility', () => {
		it.skip('should support keyboard navigation', async () => {
			// TODO: Test tab order and shortcuts
		});

		it.skip('should announce changes to screen readers', async () => {
			// TODO: Test ARIA live regions
		});
	});

	describe('Edge Cases', () => {
		it.skip('should handle network failures gracefully', async () => {
			// TODO: Test offline scenarios
		});

		it.skip('should handle large todo lists', async () => {
			// TODO: Test performance with 1000+ items
		});
	});
});
```

### Benefits of Foundation First

- **Complete picture**: See all requirements upfront
- **Incremental progress**: Remove `.skip` as you implement features
- **No forgotten tests**: All edge cases planned from start
- **Team alignment**: Everyone sees the testing scope
- **Flexible coverage**: Implement tests as needed, not for arbitrary
  coverage metrics

## Client-Server Alignment Strategy

### The Problem with Heavy Mocking

**The Issue**: Server unit tests with heavy mocking can pass while
production breaks due to client-server mismatches. Forms send data in
one format, servers expect another, and mocked tests miss the
disconnect.

**Real-World Example**: Your client sends `FormData` with field names
like `email`, but your server expects `user_email`. Mocked tests pass
because they don't use real `FormData` objects, but production fails
silently.

### The Multi-Layer Testing Solution

This project demonstrates a strategic approach with minimal mocking:

```typescript
// ❌ BRITTLE: Heavy mocking hides client-server mismatches
describe('User Registration - WRONG WAY', () => {
	it('should register user', async () => {
		const mock_request = {
			formData: vi.fn().mockResolvedValue({
				get: vi.fn().mockReturnValue('test@example.com'),
			}),
		};

		// This passes but doesn't test real FormData behavior
		const result = await register_user(mock_request);
		expect(result.success).toBe(true);
	});
});

// ✅ ROBUST: Real FormData objects catch actual mismatches
describe('User Registration - CORRECT WAY', () => {
	it('should register user with real FormData', async () => {
		const form_data = new FormData();
		form_data.append('email', 'test@example.com');
		form_data.append('password', 'secure123');

		const request = new Request('http://localhost/register', {
			method: 'POST',
			body: form_data,
		});

		// Only mock external services (database), not data structures
		vi.mocked(database.create_user).mockResolvedValue({
			id: '123',
			email: 'test@example.com',
		});

		const result = await register_user(request);
		expect(result.success).toBe(true);
	});
});
```

### Four-Layer Testing Strategy

#### 1. Shared Validation Logic

```typescript
// lib/validation/user-schema.ts
export const user_registration_schema = {
	email: { required: true, type: 'email' },
	password: { required: true, min_length: 8 },
};

// Used in both client and server
export const validate_user_registration = (data: FormData) => {
	const email = data.get('email')?.toString();
	const password = data.get('password')?.toString();

	// Same validation logic everywhere
	return {
		email: validate_email(email),
		password: validate_password(password),
	};
};
```

#### 2. Real FormData/Request Objects in Server Tests

```typescript
describe('Registration API', () => {
	it('should handle real form submission', async () => {
		// Real FormData - catches field name mismatches
		const form_data = new FormData();
		form_data.append('email', 'user@example.com');
		form_data.append('password', 'secure123');

		// Real Request object - catches header/method issues
		const request = new Request('http://localhost/api/register', {
			method: 'POST',
			body: form_data,
			headers: { 'Content-Type': 'multipart/form-data' },
		});

		// Only mock external services
		vi.mocked(database.users.create).mockResolvedValue({
			id: '123',
			email: 'user@example.com',
		});

		const response = await POST({ request });
		expect(response.status).toBe(201);
	});
});
```

#### 3. TypeScript Contracts

```typescript
// lib/types/user.ts
export interface UserRegistration {
	email: string;
	password: string;
}

export interface UserResponse {
	id: string;
	email: string;
	created_at: string;
}

// Both client and server use the same types
// Compiler catches mismatches at build time
```

#### 4. E2E Safety Net

```typescript
// e2e/registration.spec.ts
test('full registration flow', async ({ page }) => {
	await page.goto('/register');

	await page.getByLabelText('Email').fill('user@example.com');
	await page.getByLabelText('Password').fill('secure123');
	await page.getByRole('button', { name: 'Register' }).click();

	// Tests the complete client-server integration
	await expect(page.getByText('Welcome!')).toBeVisible();
});
```

### Benefits of This Approach

- **Fast unit test feedback** with minimal mocking overhead
- **Confidence that client and server actually work together**
- **Catches contract mismatches early** in development
- **Reduces production bugs** from client-server disconnects
- **Maintains test speed** while improving reliability

### What to Mock vs What to Keep Real

#### ✅ Mock These (External Dependencies)

```typescript
// Database operations
vi.mock('$lib/database', () => ({
	users: {
		create: vi.fn(),
		find_by_email: vi.fn(),
	},
}));

// External APIs
vi.mock('$lib/email-service', () => ({
	send_welcome_email: vi.fn(),
}));

// File system operations
vi.mock('fs/promises', () => ({
	writeFile: vi.fn(),
	readFile: vi.fn(),
}));
```

#### ❌ Keep These Real (Data Contracts)

```typescript
// ✅ Real FormData objects
const form_data = new FormData();
form_data.append('email', 'test@example.com');

// ✅ Real Request/Response objects
const request = new Request('http://localhost/api/users', {
	method: 'POST',
	body: form_data,
});

// ✅ Real validation functions
const validation_result = validate_user_input(form_data);

// ✅ Real data transformation utilities
const formatted_data = format_user_data(raw_input);
```

## Always Use Locators, Never Containers

### The Critical vitest-browser-svelte Pattern

**NEVER** use containers - they don't have auto-retry and require
manual DOM queries:

```typescript
// ❌ NEVER use containers - no auto-retry, manual DOM queries
it('should handle button click - WRONG WAY', async () => {
	const { container } = render(MyComponent);
	const button = container.querySelector('[data-testid="submit"]');
	// This can fail randomly due to timing issues
});

// ✅ ALWAYS use locators - auto-retry, semantic queries
it('should handle button click', async () => {
	render(MyComponent);
	const button = page.getByTestId('submit');
	await button.click(); // Automatic waiting and retrying

	await expect.element(page.getByText('Success')).toBeInTheDocument();
});
```

### Locator Patterns with Auto-retry

```typescript
describe('Locator Best Practices', () => {
	it('should use semantic queries first', async () => {
		render(LoginForm);

		// ✅ Semantic queries (preferred - test accessibility)
		const email_input = page.getByRole('textbox', { name: 'Email' });
		const password_input = page.getByLabelText('Password');
		const submit_button = page.getByRole('button', {
			name: 'Sign In',
		});

		await email_input.fill('user@example.com');
		await password_input.fill('password123');
		await submit_button.click();

		await expect
			.element(page.getByText('Welcome back!'))
			.toBeInTheDocument();
	});

	it('should handle multiple elements with strict mode', async () => {
		render(NavigationMenu);

		// ❌ FAILS: Multiple elements match
		// page.getByRole('link', { name: 'Home' });

		// ✅ CORRECT: Use .first(), .nth(), .last()
		const home_link = page
			.getByRole('link', { name: 'Home' })
			.first();
		await home_link.click();

		await expect
			.element(page.getByHeading('Welcome Home'))
			.toBeInTheDocument();
	});

	it('should use test ids when semantic queries are not possible', async () => {
		render(ComplexWidget);

		// ✅ Test IDs (when semantic queries aren't possible)
		const widget = page.getByTestId('complex-widget');
		await expect.element(widget).toBeInTheDocument();

		// Still prefer semantic queries for interactions
		const action_button = page.getByRole('button', {
			name: 'Process Data',
		});
		await action_button.click();
	});
});
```

## Avoid Testing Implementation Details

### Focus on User Value, Not Internal Structure

**NEVER** test exact implementation details that provide no user
value:

```typescript
// ❌ BRITTLE ANTI-PATTERN - Tests exact SVG path data
it('should render check icon - WRONG WAY', () => {
	const { body } = render(StatusIcon, { status: 'success' });

	// This breaks when icon libraries update, even if visually identical
	expect(body).toContain(
		'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
	);
});

// ✅ ROBUST PATTERN - Tests semantic meaning and user experience
it('should indicate success state to users', async () => {
	render(StatusIcon, { status: 'success' });

	// Test what users actually see and experience
	await expect
		.element(page.getByRole('img', { name: /success/i }))
		.toBeInTheDocument();
	await expect
		.element(page.getByTestId('status-icon'))
		.toHaveClass('text-success');
});
```

### Test These ✅

**Semantic Classes**: CSS classes that control user-visible appearance

```typescript
it('should apply correct styling classes', () => {
	const { body } = render(Button, { variant: 'success' });

	expect(body).toContain('text-success'); // Color indicates success
	expect(body).toContain('btn-success'); // Semantic button class
	expect(body).toContain('px-4 py-2'); // Consistent spacing
});
```

**User-Visible Behavior**: What users actually experience

```typescript
it('should respond to user interactions', async () => {
	const click_handler = vi.fn();
	render(Button, { onclick: click_handler });

	const button = page.getByRole('button');
	await button.click();

	expect(click_handler).toHaveBeenCalledOnce();
	await expect.element(button).toBeFocused();
});
```

### Don't Test These ❌

**Exact SVG Path Coordinates**: Mathematical details users don't see

```typescript
// ❌ Brittle - breaks when icon library updates
expect(body).toContain(
	'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
);
```

**Internal Implementation Details**: Library-specific markup

```typescript
// ❌ Brittle - breaks when component library updates
expect(body).toContain('__svelte_component_internal_123');
expect(body).toContain('data-radix-collection-item');
```

## Svelte 5 Runes Testing

### Testing Reactive State with untrack()

```typescript
import { flushSync, untrack } from 'svelte';

describe('Reactive State', () => {
	it('should handle $state and $derived correctly', () => {
		let count = $state(0);
		let doubled = $derived(count * 2);

		// ✅ Always use untrack() for $derived values
		expect(untrack(() => doubled)).toBe(0);

		count = 5;
		flushSync(); // Still needed for derived state evaluation

		expect(untrack(() => doubled)).toBe(10);
	});

	it('should test form state lifecycle', () => {
		const form_state = create_form_state({
			email: { value: '', validation_rules: { required: true } },
		});

		// ✅ Test the full lifecycle: valid → validate → invalid → fix → valid
		expect(untrack(() => form_state.is_form_valid())).toBe(true); // Initially valid

		form_state.validate_all_fields();
		expect(untrack(() => form_state.is_form_valid())).toBe(false); // Now invalid

		form_state.email.value = 'user@example.com';
		expect(untrack(() => form_state.is_form_valid())).toBe(true); // Valid again
	});
});
```

## Accessibility Testing Patterns

### Semantic Queries Priority

Always prefer semantic queries that test accessibility:

```typescript
describe('Accessibility Best Practices', () => {
	it('should use semantic queries for better accessibility testing', async () => {
		render(ContactForm);

		// ✅ EXCELLENT - Tests accessibility and semantics
		const name_input = page.getByRole('textbox', {
			name: 'Full Name',
		});
		const email_input = page.getByLabelText('Email address');
		const submit_button = page.getByRole('button', {
			name: 'Submit form',
		});

		await name_input.fill('John Doe');
		await email_input.fill('john@example.com');
		await submit_button.click();

		// ✅ GOOD - Tests text content users see
		await expect
			.element(page.getByText('Thank you, John!'))
			.toBeInTheDocument();
	});

	it('should test ARIA properties and roles', async () => {
		render(Modal, { open: true, title: 'Settings' });

		const modal = page.getByRole('dialog');
		await expect.element(modal).toHaveAttribute('aria-labelledby');
		await expect.element(modal).toHaveAttribute('aria-modal', 'true');

		const title = page.getByRole('heading', { level: 2 });
		await expect.element(title).toHaveText('Settings');
	});

	it('should test keyboard navigation', async () => {
		render(TabPanel);

		const first_tab = page.getByRole('tab').first();
		await first_tab.element().focus();

		// Test arrow key navigation
		await page.keyboard.press('ArrowRight');
		const second_tab = page.getByRole('tab').nth(1);
		await expect.element(second_tab).toBeFocused();

		// Test Enter key activation
		await page.keyboard.press('Enter');
		await expect
			.element(second_tab)
			.toHaveAttribute('aria-selected', 'true');
	});
});
```

## Component Testing Patterns

### Props and Event Testing

```typescript
describe('Component Props and Events', () => {
	it('should handle all prop variants systematically', async () => {
		const variants = ['primary', 'secondary', 'danger'] as const;
		const sizes = ['sm', 'md', 'lg'] as const;

		for (const variant of variants) {
			for (const size of sizes) {
				render(Button, { variant, size });

				const button = page.getByRole('button');
				await expect.element(button).toHaveClass(`btn-${variant}`);
				await expect.element(button).toHaveClass(`btn-${size}`);
			}
		}
	});

	it('should handle multiple event types', async () => {
		const handlers = {
			click: vi.fn(),
			focus: vi.fn(),
			blur: vi.fn(),
			keydown: vi.fn(),
		};

		render(InteractiveComponent, {
			onclick: handlers.click,
			onfocus: handlers.focus,
			onblur: handlers.blur,
			onkeydown: handlers.keydown,
		});

		const element = page.getByRole('button');

		// Test click
		await element.click();
		expect(handlers.click).toHaveBeenCalledOnce();

		// Test focus/blur
		await element.element().focus();
		expect(handlers.focus).toHaveBeenCalledOnce();

		await element.element().blur();
		expect(handlers.blur).toHaveBeenCalledOnce();

		// Test keyboard
		await element.element().focus();
		await element.press('Enter');
		expect(handlers.keydown).toHaveBeenCalledWith(
			expect.objectContaining({ key: 'Enter' }),
		);
	});
});
```

## Mocking Best Practices

### Smart Mocking Strategy

```typescript
describe('Mocking Patterns', () => {
	// ✅ Mock utility functions with realistic return values
	vi.mock('$lib/utils/data-fetcher', () => ({
		fetch_user_data: vi.fn(() =>
			Promise.resolve({
				id: '1',
				name: 'Test User',
				email: 'test@example.com',
			}),
		),
		fetch_todos: vi.fn(() =>
			Promise.resolve([
				{ id: '1', title: 'Test Todo', completed: false },
			]),
		),
	}));

	it('should verify mocks are working correctly', async () => {
		const { fetch_user_data } = await import(
			'$lib/utils/data-fetcher'
		);

		expect(fetch_user_data).toBeDefined();
		expect(vi.isMockFunction(fetch_user_data)).toBe(true);

		const result = await fetch_user_data('123');
		expect(result).toEqual({
			id: '1',
			name: 'Test User',
			email: 'test@example.com',
		});
	});

	it('should test component with mocked data', async () => {
		render(UserProfile, { user_id: '123' });

		// Wait for async data loading
		await expect
			.element(page.getByText('Test User'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('test@example.com'))
			.toBeInTheDocument();
	});
});
```

## Error Handling and Edge Cases

### Robust Error Testing

```typescript
describe('Error Handling', () => {
	it('should handle component errors gracefully', async () => {
		// Mock console.error to avoid test noise
		const console_error = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		render(ErrorBoundary, {
			children: createRawSnippet(() => ({
				render: () => {
					throw new Error('Component crashed!');
				},
			})),
		});

		await expect
			.element(page.getByText('Something went wrong'))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: 'Try again' }))
			.toBeInTheDocument();

		console_error.mockRestore();
	});

	it('should handle network failures', async () => {
		// Mock fetch to simulate network error
		vi.spyOn(global, 'fetch').mockRejectedValueOnce(
			new Error('Network error'),
		);

		render(DataComponent);

		await expect
			.element(page.getByText('Failed to load data'))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: 'Retry' }))
			.toBeInTheDocument();
	});

	it('should handle empty data states', async () => {
		render(TodoList, { todos: [] });

		await expect
			.element(page.getByText('No todos yet'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Add your first todo to get started'))
			.toBeInTheDocument();
	});
});
```

## Performance and Animation Testing

### Handle Animations and Timing

```typescript
describe('Animation and Performance', () => {
	it('should handle animated elements', async () => {
		render(AnimatedModal, { open: true });

		const modal = page.getByRole('dialog');

		// ✅ Use force: true for elements that may be animating
		const close_button = page.getByRole('button', { name: 'Close' });
		await close_button.click({ force: true });

		// Wait for animation to complete
		await expect.element(modal).not.toBeInTheDocument();
	});

	it('should test component performance', async () => {
		const start = performance.now();

		render(ComplexDashboard, { data: large_dataset });

		// Wait for initial render
		await expect
			.element(page.getByTestId('dashboard'))
			.toBeInTheDocument();

		const render_time = performance.now() - start;
		expect(render_time).toBeLessThan(1000); // Should render within 1 second
	});
});
```

## SSR Testing Patterns

### Server-Side Rendering Validation

```typescript
import { render } from 'svelte/server';

describe('SSR Testing', () => {
	it('should render without errors on server', () => {
		expect(() => {
			render(ComponentName);
		}).not.toThrow();
	});

	it('should render essential content for SEO', () => {
		const { body, head } = render(HomePage);

		// Test core content
		expect(body).toContain('<h1>Welcome to Our Site</h1>');
		expect(body).toContain('href="/about"');
		expect(body).toContain('main');

		// Test meta information
		expect(head).toContain('<title>');
		expect(head).toContain('meta name="description"');
	});

	it('should handle props correctly in SSR', () => {
		const { body } = render(UserCard, {
			user: { name: 'John Doe', email: 'john@example.com' },
		});

		expect(body).toContain('John Doe');
		expect(body).toContain('john@example.com');
	});
});
```

## Quick Reference Checklist

### Essential Patterns ✅

- Use `describe` and `it` (not `test`) for consistency with Vitest
  docs
- Use `it.skip` for planned tests, not strict 100% coverage
- Always use locators (`page.getBy*()`) - never containers
- Always await locator assertions: `await expect.element()`
- Use `untrack()` for Svelte 5 `$derived` values
- Use `.first()`, `.nth()`, `.last()` for multiple elements
- Use `force: true` for animations:
  `await element.click({ force: true })`
- Prefer semantic queries over test IDs
- Test user value, not implementation details
- Use real `FormData`/`Request` objects in server tests
- Share validation logic between client and server
- Mock external services, keep data contracts real

### Common Mistakes ❌

- Never click SvelteKit form submits - test state directly
- Don't ignore strict mode violations - use `.first()` instead
- Don't test SVG paths or internal markup
- Don't assume element roles - verify with browser dev tools
- Don't write tests for arbitrary coverage metrics
- Don't use containers from render() - use page locators instead

### Code Style Requirements

- Use `snake_case` for variables and functions
- Use `kebab-case` for file names
- Prefer arrow functions where possible
- Keep interfaces in TitleCase
