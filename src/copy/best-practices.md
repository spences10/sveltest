# Best Practices

## Foundation First Approach

### The 100% Test Coverage Strategy

Start with complete test structure before implementation:

```typescript
describe('TodoManager Component', () => {
	describe('Initial Rendering', () => {
		test('should render empty state', async () => {
			// Implemented
		});

		test.skip('should render with initial todos', async () => {
			// TODO: Test with pre-populated data
		});
	});

	describe('User Interactions', () => {
		test('should add new todo', async () => {
			// Implemented
		});

		test.skip('should edit existing todo', async () => {
			// TODO: Test inline editing
		});

		test.skip('should delete todo', async () => {
			// TODO: Test deletion flow
		});
	});

	describe('Form Validation', () => {
		test.skip('should prevent empty todo submission', async () => {
			// TODO: Test validation rules
		});

		test.skip('should handle duplicate todos', async () => {
			// TODO: Test duplicate prevention
		});
	});

	describe('State Management', () => {
		test.skip('should persist todos to localStorage', async () => {
			// TODO: Test persistence
		});

		test.skip('should restore todos on reload', async () => {
			// TODO: Test restoration
		});
	});

	describe('Accessibility', () => {
		test.skip('should support keyboard navigation', async () => {
			// TODO: Test tab order and shortcuts
		});

		test.skip('should announce changes to screen readers', async () => {
			// TODO: Test ARIA live regions
		});
	});

	describe('Edge Cases', () => {
		test.skip('should handle network failures gracefully', async () => {
			// TODO: Test offline scenarios
		});

		test.skip('should handle large todo lists', async () => {
			// TODO: Test performance with 1000+ items
		});
	});
});
```

### Benefits of Foundation First

- **Complete picture**: See all requirements upfront
- **Incremental progress**: Remove `.skip` as you implement
- **No forgotten tests**: All edge cases planned from start
- **Team alignment**: Everyone sees the testing scope

## Accessibility Testing

### Semantic Queries Priority

Always prefer semantic queries that test accessibility:

```typescript
// ✅ EXCELLENT - Tests accessibility and semantics
page.getByRole('button', { name: 'Submit form' });
page.getByLabelText('Email address');
page.getByRole('textbox', { name: 'Search products' });

// ✅ GOOD - Tests text content users see
page.getByText('Welcome back, John');
page.getByPlaceholder('Enter your message');

// ⚠️ OKAY - When semantic queries aren't possible
page.getByTestId('complex-widget');

// ❌ AVOID - Doesn't test accessibility
page.locator('#submit-btn');
page.locator('.email-input');
```

### ARIA Testing Patterns

```typescript
describe('Modal Accessibility', () => {
	test('should have proper ARIA roles and properties', async () => {
		render(Modal, { open: true, title: 'Settings' });

		const modal = page.getByRole('dialog');
		await expect.element(modal).toHaveAttribute('aria-labelledby');
		await expect.element(modal).toHaveAttribute('aria-modal', 'true');

		const title = page.getByRole('heading', { level: 2 });
		await expect.element(title).toHaveText('Settings');
	});

	test('should trap focus within modal', async () => {
		render(Modal, { open: true });

		// First focusable element should receive focus
		const close_button = page.getByRole('button', { name: 'Close' });
		await expect.element(close_button).toBeFocused();

		// Tab should cycle within modal
		await page.keyboard.press('Tab');
		const save_button = page.getByRole('button', { name: 'Save' });
		await expect.element(save_button).toBeFocused();

		// Shift+Tab should cycle backwards
		await page.keyboard.press('Shift+Tab');
		await expect.element(close_button).toBeFocused();
	});

	test('should announce changes to screen readers', async () => {
		render(Form);

		const input = page.getByLabelText('Email');
		await input.fill('invalid-email');

		const error_message = page.getByText(
			'Please enter a valid email address',
		);
		await expect
			.element(error_message)
			.toHaveAttribute('aria-live', 'polite');
		await expect
			.element(input)
			.toHaveAttribute('aria-invalid', 'true');
		await expect.element(input).toHaveAttribute('aria-describedby');
	});
});
```

## Performance Optimization

### Parallel Test Execution

```typescript
// Use concurrent tests for independent operations
describe('Independent Component Tests', () => {
	test.concurrent('button variants render correctly', async () => {
		render(Button, { variant: 'primary' });
		await expect
			.element(page.getByRole('button'))
			.toHaveClass('btn-primary');
	});

	test.concurrent('input validation works', async () => {
		render(Input, { type: 'email', error: 'Invalid email' });
		await expect
			.element(page.getByText('Invalid email'))
			.toBeInTheDocument();
	});

	test.concurrent('modal opens and closes', async () => {
		const close_handler = vi.fn();
		render(Modal, { open: true, onclose: close_handler });

		await page.keyboard.press('Escape');
		expect(close_handler).toHaveBeenCalled();
	});
});
```

### Smart Mocking Strategy

```typescript
// Mock heavy operations but keep business logic real
vi.mock('$lib/api/heavy-computation', () => ({
	compute_analytics: vi.fn(() =>
		Promise.resolve({
			users: 1000,
			revenue: 50000,
		}),
	),
	generate_report: vi.fn(() => Promise.resolve('report-data')),
}));

// Keep validation logic real to catch actual bugs
// Don't mock: validation functions, utilities, formatters

describe('Dashboard Performance', () => {
	test('should render quickly with mocked data', async () => {
		const start = performance.now();

		render(Dashboard);
		await expect
			.element(page.getByText('1000 users'))
			.toBeInTheDocument();

		const render_time = performance.now() - start;
		expect(render_time).toBeLessThan(100); // ms
	});
});
```

### Test Environment Optimization

```typescript
// vite.config.ts
export default defineConfig({
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			headless: true, // Faster execution
		},
		pool: 'threads',
		poolOptions: {
			threads: {
				// Use all CPU cores
				maxThreads: os.cpus().length,
				minThreads: 1,
			},
		},
		// Fail fast in CI
		bail: process.env.CI ? 1 : 0,
	},
});
```

## Component Testing Patterns

### Props Testing Strategy

```typescript
describe('Component Props', () => {
	// Test all prop combinations systematically
	const variants = ['primary', 'secondary', 'danger'] as const;
	const sizes = ['sm', 'md', 'lg'] as const;
	const states = [true, false] as const;

	variants.forEach((variant) => {
		sizes.forEach((size) => {
			states.forEach((disabled) => {
				test(`should render ${variant} ${size} ${disabled ? 'disabled' : 'enabled'}`, async () => {
					render(Button, { variant, size, disabled });

					const button = page.getByRole('button');
					await expect.element(button).toHaveClass(`btn-${variant}`);
					await expect.element(button).toHaveClass(`btn-${size}`);

					if (disabled) {
						await expect.element(button).toBeDisabled();
					} else {
						await expect.element(button).toBeEnabled();
					}
				});
			});
		});
	});
});
```

### Event Testing Patterns

```typescript
describe('Event Handling', () => {
	test('should handle multiple event types', async () => {
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
		await element.focus();
		expect(handlers.focus).toHaveBeenCalledOnce();

		await element.blur();
		expect(handlers.blur).toHaveBeenCalledOnce();

		// Test keyboard
		await element.focus();
		await element.press('Enter');
		expect(handlers.keydown).toHaveBeenCalledWith(
			expect.objectContaining({ key: 'Enter' }),
		);
	});
});
```

## Advanced Testing Patterns

### State Machine Testing

```typescript
describe('Form State Machine', () => {
	test('should transition through all states correctly', async () => {
		render(ContactForm);

		// Initial state: empty form
		await expect
			.element(page.getByRole('button', { name: 'Submit' }))
			.toBeDisabled();

		// Filling state: partially filled
		await page.getByLabelText('Name').fill('John Doe');
		await expect
			.element(page.getByRole('button', { name: 'Submit' }))
			.toBeDisabled();

		// Valid state: all required fields filled
		await page.getByLabelText('Email').fill('john@example.com');
		await expect
			.element(page.getByRole('button', { name: 'Submit' }))
			.toBeEnabled();

		// Submitting state: loading
		await page.getByRole('button', { name: 'Submit' }).click();
		await expect
			.element(page.getByText('Submitting...'))
			.toBeInTheDocument();

		// Success state: form submitted
		await expect
			.element(page.getByText('Thank you for your message!'))
			.toBeInTheDocument();
	});
});
```

### Error Boundary Testing

```typescript
describe('Error Handling', () => {
	test('should display error boundary for component failures', async () => {
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

	test('should recover from errors when retry is clicked', async () => {
		let should_error = true;

		render(ErrorBoundary, {
			children: createRawSnippet(() => ({
				render: () => {
					if (should_error) {
						throw new Error('Temporary error');
					}
					return '<div>Content loaded successfully</div>';
				},
			})),
		});

		// Initially shows error
		await expect
			.element(page.getByText('Something went wrong'))
			.toBeInTheDocument();

		// Fix the error condition
		should_error = false;

		// Click retry
		await page.getByRole('button', { name: 'Try again' }).click();

		// Should now show content
		await expect
			.element(page.getByText('Content loaded successfully'))
			.toBeInTheDocument();
	});
});
```

## Team Collaboration Patterns

### Shared Test Utilities

```typescript
// tests/utils/test-helpers.ts
export class TestHelpers {
	static async fill_login_form(email: string, password: string) {
		await page.getByLabelText('Email').fill(email);
		await page.getByLabelText('Password').fill(password);
	}

	static async wait_for_loading_to_complete() {
		await expect
			.element(page.getByTestId('loading-spinner'))
			.not.toBeInTheDocument();
	}

	static async expect_error_message(message: string) {
		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent(message);
	}

	static create_mock_user(overrides: Partial<User> = {}): User {
		return {
			id: '1',
			email: 'test@example.com',
			name: 'Test User',
			role: 'user',
			...overrides,
		};
	}
}
```

### Consistent Test Data

```typescript
// tests/fixtures/test-data.ts
export const TEST_USERS = {
	admin: {
		id: 'admin-1',
		email: 'admin@example.com',
		name: 'Admin User',
		role: 'admin' as const,
	},
	regular: {
		id: 'user-1',
		email: 'user@example.com',
		name: 'Regular User',
		role: 'user' as const,
	},
	guest: {
		id: 'guest-1',
		email: 'guest@example.com',
		name: 'Guest User',
		role: 'guest' as const,
	},
} as const;

export const TEST_TODOS = [
	{ id: '1', title: 'Buy groceries', completed: false },
	{ id: '2', title: 'Walk the dog', completed: true },
	{ id: '3', title: 'Write tests', completed: false },
] as const;
```

### Page Object Pattern

```typescript
// tests/page-objects/todo-page.ts
export class TodoPage {
	async add_todo(title: string) {
		await page.getByLabelText('New todo').fill(title);
		await page.getByRole('button', { name: 'Add Todo' }).click();
	}

	async complete_todo(title: string) {
		const todo_item = page
			.getByRole('listitem')
			.filter({ hasText: title });
		await todo_item.getByRole('checkbox').check();
	}

	async delete_todo(title: string) {
		const todo_item = page
			.getByRole('listitem')
			.filter({ hasText: title });
		await todo_item.getByRole('button', { name: 'Delete' }).click();
	}

	async expect_todo_count(count: number) {
		await expect
			.element(page.getByRole('listitem'))
			.toHaveCount(count);
	}

	async expect_todo_exists(title: string) {
		await expect.element(page.getByText(title)).toBeInTheDocument();
	}
}

// Usage in tests
describe('Todo Management', () => {
	const todo_page = new TodoPage();

	test('should manage todo lifecycle', async () => {
		render(TodoApp);

		await todo_page.add_todo('Buy milk');
		await todo_page.expect_todo_exists('Buy milk');

		await todo_page.complete_todo('Buy milk');
		await todo_page.delete_todo('Buy milk');

		await todo_page.expect_todo_count(0);
	});
});
```

## CI/CD Optimization

### Test Parallelization

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test --shard=${{ matrix.shard }}/4
```

### Test Result Artifacts

```typescript
// vite.config.ts
export default defineConfig({
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			// Capture screenshots and videos on failure
			screenshot: 'only-on-failure',
			video: 'retain-on-failure',
		},
		// Generate detailed reports
		reporters: ['default', 'junit', 'html'],
		outputFile: {
			junit: './test-results/junit.xml',
			html: './test-results/index.html',
		},
	},
});
```

## Security Testing

### XSS Prevention Testing

```typescript
describe('XSS Prevention', () => {
	test('should escape user input in templates', async () => {
		const malicious_input = '<script>alert("xss")</script>';

		render(UserComment, {
			comment: malicious_input,
			author: 'Test User',
		});

		// Should render as text, not execute script
		await expect
			.element(page.getByText(malicious_input))
			.toBeInTheDocument();

		// Should not create script element
		const script_elements = page
			.locator('script')
			.filter({ hasText: 'alert' });
		await expect.element(script_elements).toHaveCount(0);
	});
});
```

### CSP Testing

```typescript
describe('Content Security Policy', () => {
	test('should not execute inline scripts', async () => {
		render(App);

		// Check that CSP headers are set
		const response = await page.evaluate(() =>
			fetch(window.location.href).then((r) =>
				r.headers.get('content-security-policy'),
			),
		);

		expect(response).toContain("script-src 'self'");
		expect(response).not.toContain("'unsafe-inline'");
	});
});
```

## Quick Reference Checklist

### Before Writing Tests

- [ ] Plan complete test structure with `.skip`
- [ ] Choose semantic queries over test IDs
- [ ] Consider accessibility implications
- [ ] Design test data fixtures

### While Writing Tests

- [ ] Use `await expect.element()` for assertions
- [ ] Prefer `page.getByRole()` for interactive elements
- [ ] Test keyboard navigation and screen reader support
- [ ] Mock external services, keep business logic real

### Code Review Checklist

- [ ] Tests cover happy path, edge cases, and error states
- [ ] No flaky timing dependencies
- [ ] Proper use of mocks vs real implementations
- [ ] Accessibility testing included
- [ ] Performance considerations addressed

### Maintenance

- [ ] Remove `.skip` from implemented tests
- [ ] Update tests when requirements change
- [ ] Refactor common patterns into utilities
- [ ] Monitor test execution time and optimize slow tests
