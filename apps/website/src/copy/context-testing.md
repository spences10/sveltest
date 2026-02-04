# Context Testing

## Overview

Testing Svelte components that use `setContext`/`getContext` requires
a wrapper component pattern. Unlike `@testing-library/svelte`,
`vitest-browser-svelte` does not support passing a context map directly
to the render function.

This guide covers the wrapper component pattern for testing components
that depend on Svelte context.

## The Problem

When migrating from `@testing-library/svelte`, you may have tests like:

```typescript
// This pattern does NOT work in vitest-browser-svelte
import { render } from '@testing-library/svelte';

const context = new Map();
context.set('apiClient', apiClient);
context.set('authUserState', { user: { firstname: 'John' } });

render(MyComponent, {
	props: { children: callback },
	context, // vitest-browser-svelte doesn't support this
});
```

The `render` function from `vitest-browser-svelte` does not accept a
`context` option. You need a different approach.

## Nested Component Pattern (Recommended)

For testing a specific component with context, create a dedicated test
wrapper. This is the recommended approach.

### Test Wrapper for Specific Component

```svelte
<!-- user-profile.test-wrapper.svelte -->
<script lang="ts">
	import { setContext } from 'svelte';
	import UserProfile from './user-profile.svelte';

	interface Props {
		api_client: unknown;
		user_id?: string;
	}

	let { api_client, user_id = '1' }: Props = $props();

	setContext('apiClient', api_client);
</script>

<UserProfile {user_id} />
```

### Test File

```typescript
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';

import UserProfileTestWrapper from './user-profile.test-wrapper.svelte';

describe('UserProfile', () => {
	const create_mock_api = (overrides = {}) => ({
		get: vi.fn().mockResolvedValue({
			id: '1',
			email: 'john@example.com',
			firstname: 'John',
			lastname: 'Doe',
		}),
		...overrides,
	});

	it('should display user information', async () => {
		const mock_api = create_mock_api();

		render(UserProfileTestWrapper, {
			api_client: mock_api,
			user_id: '1',
		});

		await expect
			.element(page.getByText('John Doe'))
			.toBeInTheDocument();
	});

	it('should show loading state', async () => {
		const mock_api = create_mock_api({
			get: vi.fn().mockImplementation(
				() => new Promise(() => {}), // Never resolves
			),
		});

		render(UserProfileTestWrapper, {
			api_client: mock_api,
		});

		await expect
			.element(page.getByTestId('loading'))
			.toBeInTheDocument();
	});

	it('should handle API errors', async () => {
		const mock_api = create_mock_api({
			get: vi.fn().mockRejectedValue(new Error('Network error')),
		});

		render(UserProfileTestWrapper, {
			api_client: mock_api,
		});

		await expect
			.element(page.getByText('Failed to load user'))
			.toBeInTheDocument();
	});
});
```

## Layout Context Pattern

For testing page components that depend on layout context:

### Layout Test Wrapper

```svelte
<!-- test-utils/layout-wrapper.svelte -->
<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		api_client: unknown;
		auth_state?: { user: unknown; is_authenticated: boolean };
		theme?: 'light' | 'dark';
		children: Snippet;
	}

	let {
		api_client,
		auth_state = { user: null, is_authenticated: false },
		theme = 'light',
		children,
	}: Props = $props();

	setContext('apiClient', api_client);
	setContext('authState', auth_state);
	setContext('theme', theme);
</script>

<div class="layout-wrapper" data-theme={theme}>
	{@render children()}
</div>
```

### Page Component Test

```typescript
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';

import DashboardTestWrapper from './dashboard-page.test-wrapper.svelte';

describe('Dashboard Page', () => {
	it('should display authenticated user dashboard', async () => {
		const mock_api = { get: vi.fn().mockResolvedValue({ stats: [] }) };
		const mock_auth = {
			user: { firstname: 'John', role: 'admin' },
			is_authenticated: true,
		};

		render(DashboardTestWrapper, {
			api_client: mock_api,
			auth_state: mock_auth,
		});

		await expect
			.element(page.getByText('Welcome back, John'))
			.toBeInTheDocument();
	});
});
```

## Factory Function Pattern

Create reusable test utilities with factory functions:

```typescript
// test-utils/context-factories.ts
import { vi } from 'vitest';

export const create_mock_api_client = (overrides = {}) => ({
	get: vi.fn().mockResolvedValue({}),
	post: vi.fn().mockResolvedValue({}),
	put: vi.fn().mockResolvedValue({}),
	delete: vi.fn().mockResolvedValue({}),
	...overrides,
});

export const create_mock_auth_state = (overrides = {}) => ({
	user: null,
	is_authenticated: false,
	login: vi.fn(),
	logout: vi.fn(),
	...overrides,
});
```

## Quick Reference

### Key Differences from @testing-library/svelte

| Feature    | @testing-library/svelte     | vitest-browser-svelte |
| ---------- | --------------------------- | --------------------- |
| Context    | `render(Comp, { context })` | Not supported         |
| Solution   | Direct context map          | Wrapper component     |

### Wrapper Component Checklist

- Create wrapper component with `setContext` calls
- Accept context values as props
- Use `{@render children()}` for child content
- Create component-specific test wrappers when needed

### Anti-Patterns to Avoid

- Trying to pass context map to render function
- Creating overly complex generic wrappers
- Not mocking API clients properly
- Forgetting to await async operations
