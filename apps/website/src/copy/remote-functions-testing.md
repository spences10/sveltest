# Testing Components with Remote Functions

## Overview

SvelteKit remote functions (`command()`, `query()`, `form()`) run on
the server and are called from the client. This creates a testing
challenge: how do you test components that depend on remote functions
without running full e2e tests?

This guide covers patterns for testing components that use remote
functions, focusing on speed and TDD-friendliness while maintaining
confidence in the integration.

## The Challenge

Remote functions in `.remote.ts` files are:

- Server-side code that requires SvelteKit runtime
- Difficult to mock due to reactive properties like `.result` and
  `.pending`
- Tightly coupled to form enhancement behavior

E2E tests work but are slow. Unit tests with mocks miss integration
issues. This guide bridges that gap.

## Pattern 1: Functional Core / Imperative Shell

Extract pure business logic into testable helper functions. Keep
framework-specific code thin.

### The Helper File Pattern

```typescript
// src/lib/items/items.helpers.ts
// Pure functions - no SvelteKit dependencies

export type ItemValidation = {
	is_valid: boolean;
	errors: Record<string, string>;
};

export const validate_item = (data: {
	name: string;
	quantity: number;
}): ItemValidation => {
	const errors: Record<string, string> = {};

	if (!data.name.trim()) {
		errors.name = 'Name is required';
	}

	if (data.quantity < 1) {
		errors.quantity = 'Quantity must be at least 1';
	}

	return {
		is_valid: Object.keys(errors).length === 0,
		errors,
	};
};

export const format_item_display = (item: {
	name: string;
	quantity: number;
}): string => {
	return `${item.name} (x${item.quantity})`;
};

export const calculate_total = (
	items: { price: number; quantity: number }[],
): number => {
	return items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
};
```

```typescript
// src/lib/items/items.helpers.test.ts
import { describe, expect, it } from 'vitest';
import {
	calculate_total,
	format_item_display,
	validate_item,
} from './items.helpers';

describe('validate_item', () => {
	it('should validate valid item', () => {
		const result = validate_item({ name: 'Widget', quantity: 5 });

		expect(result.is_valid).toBe(true);
		expect(result.errors).toEqual({});
	});

	it('should reject empty name', () => {
		const result = validate_item({ name: '', quantity: 5 });

		expect(result.is_valid).toBe(false);
		expect(result.errors.name).toBe('Name is required');
	});

	it('should reject zero quantity', () => {
		const result = validate_item({ name: 'Widget', quantity: 0 });

		expect(result.is_valid).toBe(false);
		expect(result.errors.quantity).toBe(
			'Quantity must be at least 1',
		);
	});
});

describe('calculate_total', () => {
	it('should sum prices correctly', () => {
		const items = [
			{ price: 10, quantity: 2 },
			{ price: 5, quantity: 3 },
		];

		expect(calculate_total(items)).toBe(35);
	});

	it('should return 0 for empty array', () => {
		expect(calculate_total([])).toBe(0);
	});
});
```

### Thin Remote Function Wrapper

```typescript
// src/lib/items/items.remote.ts
import { form } from '@sveltejs/kit';
import { validate_item } from './items.helpers';
import { db } from '$lib/db';

export const createItem = form(async ({ request }) => {
	const data = await request.formData();
	const name = data.get('name') as string;
	const quantity = Number(data.get('quantity'));

	// Use helper for validation
	const validation = validate_item({ name, quantity });
	if (!validation.is_valid) {
		return { success: false, errors: validation.errors };
	}

	// Thin imperative shell - just DB call
	const item = await db.items.create({ name, quantity });
	return { success: true, item };
});
```

This pattern means 80%+ of logic is tested without SvelteKit.

## Pattern 2: Dependency Injection for Components

Inject remote functions as props to enable mocking in tests.

### Component with Injected Remote Function

```svelte
<!-- src/lib/components/item-form.svelte -->
<script lang="ts">
	import { createItem as defaultCreateItem } from '$lib/items.remote';

	let {
		form = defaultCreateItem,
		onSuccess = () => {},
		onError = () => {},
	}: {
		form?: typeof defaultCreateItem;
		onSuccess?: () => void;
		onError?: () => void;
	} = $props();

	let name = $state('');
	let quantity = $state(1);
</script>

<form
	{...form.enhance(async ({ submit }) => {
		await submit();

		if (form.result?.success) {
			name = '';
			quantity = 1;
			onSuccess();
		} else {
			onError();
		}
	})}
>
	<label>
		Name
		<input type="text" name="name" bind:value={name} />
	</label>

	<label>
		Quantity
		<input type="number" name="quantity" bind:value={quantity} />
	</label>

	<button type="submit" disabled={form.pending}>
		{form.pending ? 'Creating...' : 'Create Item'}
	</button>

	{#if form.result && !form.result.success}
		<div class="error">
			{#each Object.values(form.result.errors) as error}
				<p>{error}</p>
			{/each}
		</div>
	{/if}
</form>
```

### Testing with a Mock Remote Function

```typescript
// src/lib/components/item-form.svelte.test.ts
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import ItemForm from './item-form.svelte';

// Create a mock that mimics remote function shape
const create_mock_form = (
	options: {
		result?: { success: boolean; errors?: Record<string, string> };
		pending?: boolean;
	} = {},
) => {
	const { result = null, pending = false } = options;

	return {
		result,
		pending,
		enhance: vi.fn((callback) => ({
			action: '?/createItem',
			method: 'POST',
			onsubmit: async (event: Event) => {
				event.preventDefault();
				await callback({
					submit: vi.fn().mockResolvedValue(undefined),
				});
			},
		})),
	};
};

describe('ItemForm', () => {
	it('should render form fields', async () => {
		const mock_form = create_mock_form();
		render(ItemForm, { form: mock_form as any });

		const name_input = page.getByLabelText('Name');
		const quantity_input = page.getByLabelText('Quantity');
		const submit_button = page.getByRole('button', {
			name: 'Create Item',
		});

		await expect.element(name_input).toBeInTheDocument();
		await expect.element(quantity_input).toBeInTheDocument();
		await expect.element(submit_button).toBeInTheDocument();
	});

	it('should show pending state', async () => {
		const mock_form = create_mock_form({ pending: true });
		render(ItemForm, { form: mock_form as any });

		const submit_button = page.getByRole('button', {
			name: 'Creating...',
		});
		await expect.element(submit_button).toBeDisabled();
	});

	it('should display errors from result', async () => {
		const mock_form = create_mock_form({
			result: {
				success: false,
				errors: { name: 'Name is required' },
			},
		});
		render(ItemForm, { form: mock_form as any });

		await expect
			.element(page.getByText('Name is required'))
			.toBeInTheDocument();
	});

	it('should call onSuccess when result is successful', async () => {
		const on_success = vi.fn();
		const mock_form = create_mock_form({
			result: { success: true },
		});

		render(ItemForm, {
			form: mock_form as any,
			onSuccess: on_success,
		});

		// Trigger form submit
		const submit_button = page.getByRole('button', {
			name: 'Create Item',
		});
		await submit_button.click();

		expect(on_success).toHaveBeenCalledOnce();
	});

	it('should call onError when result is failure', async () => {
		const on_error = vi.fn();
		const mock_form = create_mock_form({
			result: { success: false, errors: { name: 'Invalid' } },
		});

		render(ItemForm, {
			form: mock_form as any,
			onError: on_error,
		});

		const submit_button = page.getByRole('button', {
			name: 'Create Item',
		});
		await submit_button.click();

		expect(on_error).toHaveBeenCalledOnce();
	});
});
```

## Pattern 3: Network-Layer Mocking

Mock at the fetch level to test more of the integration without a
running server.

### Using msw (Mock Service Worker)

```typescript
// src/lib/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
	http.post('/api/items', async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const quantity = Number(data.get('quantity'));

		if (!name) {
			return HttpResponse.json(
				{
					success: false,
					errors: { name: 'Name is required' },
				},
				{ status: 400 },
			);
		}

		return HttpResponse.json({
			success: true,
			item: { id: '123', name, quantity },
		});
	}),
];
```

```typescript
// src/lib/components/item-form.integration.test.ts
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
} from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { setupServer } from 'msw/node';
import { handlers } from '$lib/mocks/handlers';
import ItemForm from './item-form.svelte';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ItemForm Integration', () => {
	it('should submit and receive success response', async () => {
		render(ItemForm);

		const name_input = page.getByLabelText('Name');
		const quantity_input = page.getByLabelText('Quantity');
		const submit_button = page.getByRole('button', {
			name: 'Create Item',
		});

		await name_input.fill('New Widget');
		await quantity_input.fill('5');
		await submit_button.click();

		// Wait for success state
		await expect
			.element(page.getByText('Item created'))
			.toBeInTheDocument();
	});
});
```

## Pattern 4: Request Event Extraction

Extract request handling into testable functions, similar to the
helper file pattern.

### Real-World Example: Analytics Metadata

```typescript
// src/lib/analytics/analytics.helpers.ts
import type { RequestEvent } from '@sveltejs/kit';

export type SessionMetadata = {
	country?: string;
	browser?: string;
	device_type?: string;
};

// Pure function - easy to test
export const extract_session_metadata = (
	user_agent: string | null,
	country_header: string | null,
): SessionMetadata => {
	const { browser, device_type } = parse_user_agent(user_agent);

	return {
		country: country_header || undefined,
		browser: browser || undefined,
		device_type: device_type || undefined,
	};
};

// Thin wrapper for SvelteKit integration
export const extract_metadata_from_event = (
	event: RequestEvent | undefined,
): SessionMetadata => {
	if (!event) {
		return {};
	}

	const user_agent = event.request.headers.get('user-agent');
	const country = event.request.headers.get('cf-ipcountry');

	return extract_session_metadata(user_agent, country);
};
```

```typescript
// src/lib/analytics/analytics.helpers.test.ts
import { describe, expect, it } from 'vitest';
import { extract_session_metadata } from './analytics.helpers';

describe('extract_session_metadata', () => {
	it('should parse Chrome user agent', () => {
		const ua =
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0';

		const result = extract_session_metadata(ua, 'US');

		expect(result.browser).toBe('Chrome');
		expect(result.device_type).toBe('desktop');
		expect(result.country).toBe('US');
	});

	it('should handle null user agent', () => {
		const result = extract_session_metadata(null, 'GB');

		expect(result.browser).toBeUndefined();
		expect(result.device_type).toBeUndefined();
		expect(result.country).toBe('GB');
	});

	it('should handle null country header', () => {
		const ua = 'Mozilla/5.0 iPhone';

		const result = extract_session_metadata(ua, null);

		expect(result.country).toBeUndefined();
	});
});
```

## Testing Strategy Summary

| Layer                    | Test Type        | Speed | Coverage             |
| ------------------------ | ---------------- | ----- | -------------------- |
| Pure helpers             | Unit             | Fast  | Business logic       |
| Components with DI mocks | Component        | Fast  | UI behavior          |
| Network-layer mocks      | Integration      | Med   | Client-server flow   |
| Full remote functions    | E2E (Playwright) | Slow  | Complete integration |

### Recommended Approach

1. **Extract pure logic** into `.helpers.ts` files - test these
   thoroughly
2. **Inject remote functions** into components - test UI behavior with
   mocks
3. **Use E2E for critical paths** - login, checkout, data mutations
4. **Skip E2E for variants** - test those with component tests

### What Each Layer Catches

- **Unit tests (helpers)**: Validation bugs, calculation errors,
  business logic issues
- **Component tests (DI mocks)**: UI state management, error display,
  loading states
- **Integration tests (network mocks)**: Request/response format
  issues, serialization
- **E2E tests**: Framework bugs, hydration issues, real network
  behavior

## Common Pitfalls

### Mocking Too Much

```typescript
// Avoid: Mocking everything
const mock_form = {
	result: $state({ success: true }),
	pending: $state(false),
	enhance: vi.fn(),
	// ...50 more properties
};
```

The more you mock, the less confidence you have. Keep mocks minimal.

### Not Testing the Helpers

```typescript
// Bad: All logic in remote function
export const createItem = form(async ({ request }) => {
	const data = await request.formData();
	// 100 lines of validation and business logic...
});

// Good: Extract to helpers
export const createItem = form(async ({ request }) => {
	const data = await request.formData();
	const validated = validate_and_process(data); // <- Test this separately
	return await save_item(validated);
});
```

### Ignoring E2E Entirely

Remote function integration is complex. Have at least a few E2E tests
for critical flows even if most testing is unit/component level.

## Quick Reference

### File Organization

```
src/lib/items/
├── items.remote.ts        # Remote function (thin)
├── items.helpers.ts       # Pure business logic
├── items.helpers.test.ts  # Unit tests for helpers
└── components/
    ├── item-form.svelte
    ├── item-form.svelte.test.ts    # Component tests with DI mocks
    └── item-form.integration.test.ts # Network-layer mock tests
```

### Mock Shape for Remote Functions

```typescript
const create_mock_form = (options = {}) => ({
	result: options.result ?? null,
	pending: options.pending ?? false,
	enhance: vi.fn((callback) => ({
		action: '?/action',
		method: 'POST',
		onsubmit: async (e) => {
			e.preventDefault();
			await callback({ submit: vi.fn() });
		},
	})),
});
```

### Testing Checklist

- [ ] Business logic extracted to helpers and unit tested
- [ ] Component accepts remote function as prop
- [ ] UI states tested with mock remote function
- [ ] Error states tested
- [ ] Loading states tested
- [ ] Critical paths covered by E2E tests
