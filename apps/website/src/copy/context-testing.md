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

## The Wrapper Component Pattern

Create a wrapper component that sets the context, then render your
component as a child.

### Step 1: Create a Context Wrapper Component

```svelte
<!-- test-utils/context-wrapper.svelte -->
<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { ApiClient } from '$lib/api';

	interface Props {
		api_client: ApiClient;
		auth_user?: { firstname: string; lastname?: string };
		children: Snippet;
	}

	let { api_client, auth_user, children }: Props = $props();

	// Set all required context values
	setContext('apiClient', api_client);
	setContext('authUserState', { user: auth_user });
</script>

{@render children()}
```

### Step 2: Use the Wrapper in Tests

```typescript
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import { createRawSnippet } from 'svelte';

import ContextWrapper from './test-utils/context-wrapper.svelte';
import MyComponent from './my-component.svelte';

describe('Component with Context', () => {
	const mock_api_client = {
		get: vi.fn(),
		post: vi.fn(),
	};

	const mock_auth_user = {
		firstname: 'John',
		lastname: 'Doe',
	};

	it('should render with context', async () => {
		// Create a snippet that renders your component
		const children = createRawSnippet(() => ({
			render: () => `<div data-testid="child-wrapper"></div>`,
			setup: (node: Element) => {
				// Mount your actual component here
				new MyComponent({ target: node });
			},
		}));

		render(ContextWrapper, {
			api_client: mock_api_client,
			auth_user: mock_auth_user,
			children,
		});

		// Now test your component
		await expect
			.element(page.getByText('Welcome, John'))
			.toBeInTheDocument();
	});
});
```

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
import { describe, expect, it, vi, beforeEach } from 'vitest';
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
		await expect
			.element(page.getByText('john@example.com'))
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

	// Set all layout-level context
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

// Create a test wrapper for the specific page
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
		await expect
			.element(page.getByRole('heading', { name: 'Dashboard' }))
			.toBeInTheDocument();
	});

	it('should redirect unauthenticated users', async () => {
		const mock_api = { get: vi.fn() };
		const mock_auth = {
			user: null,
			is_authenticated: false,
		};

		render(DashboardTestWrapper, {
			api_client: mock_api,
			auth_state: mock_auth,
		});

		await expect
			.element(page.getByText('Please log in'))
			.toBeInTheDocument();
	});
});
```

## Multiple Context Values Pattern

For components needing many context values:

### Multi-Context Wrapper

```svelte
<!-- test-utils/full-context-wrapper.svelte -->
<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';

	interface ContextConfig {
		api_client?: unknown;
		auth_state?: unknown;
		theme?: string;
		feature_flags?: Record<string, boolean>;
		i18n?: { locale: string; t: (key: string) => string };
	}

	interface Props {
		context: ContextConfig;
		children: Snippet;
	}

	let { context, children }: Props = $props();

	// Set each context value if provided
	if (context.api_client) setContext('apiClient', context.api_client);
	if (context.auth_state) setContext('authState', context.auth_state);
	if (context.theme) setContext('theme', context.theme);
	if (context.feature_flags) setContext('featureFlags', context.feature_flags);
	if (context.i18n) setContext('i18n', context.i18n);
</script>

{@render children()}
```

### Test with Multiple Contexts

```typescript
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';

// Component-specific test wrapper
import FeatureTestWrapper from './feature-component.test-wrapper.svelte';

describe('Feature Component', () => {
	const default_context = {
		api_client: { get: vi.fn(), post: vi.fn() },
		auth_state: { user: { id: '1' }, is_authenticated: true },
		theme: 'dark',
		feature_flags: { new_feature: true },
		i18n: { locale: 'en', t: (key: string) => key },
	};

	it('should render with feature flag enabled', async () => {
		render(FeatureTestWrapper, {
			context: {
				...default_context,
				feature_flags: { new_feature: true },
			},
		});

		await expect
			.element(page.getByTestId('new-feature'))
			.toBeInTheDocument();
	});

	it('should hide feature when flag is disabled', async () => {
		render(FeatureTestWrapper, {
			context: {
				...default_context,
				feature_flags: { new_feature: false },
			},
		});

		await expect
			.element(page.getByTestId('new-feature'))
			.not.toBeInTheDocument();
	});
});
```

## Factory Function Pattern

Create reusable test utilities with factory functions:

### Test Factory

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

export const create_authenticated_user = (overrides = {}) => ({
	id: '1',
	email: 'test@example.com',
	firstname: 'Test',
	lastname: 'User',
	role: 'user',
	...overrides,
});

export const create_default_context = (overrides = {}) => ({
	api_client: create_mock_api_client(),
	auth_state: create_mock_auth_state(),
	theme: 'light',
	...overrides,
});
```

### Using Factories in Tests

```typescript
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';

import {
	create_mock_api_client,
	create_authenticated_user,
	create_default_context,
} from './test-utils/context-factories';
import ProfileTestWrapper from './profile.test-wrapper.svelte';

describe('Profile Component', () => {
	it('should display user profile', async () => {
		const user = create_authenticated_user({ firstname: 'Jane' });
		const api = create_mock_api_client({
			get: vi.fn().mockResolvedValue(user),
		});

		render(ProfileTestWrapper, {
			context: create_default_context({
				api_client: api,
				auth_state: { user, is_authenticated: true },
			}),
		});

		await expect.element(page.getByText('Jane')).toBeInTheDocument();
	});
});
```

## Quick Reference

### Key Differences from @testing-library/svelte

| Feature             | @testing-library/svelte      | vitest-browser-svelte |
| ------------------- | ---------------------------- | --------------------- |
| Context map         | `render(Comp, { context })`  | Not supported         |
| Solution            | Direct context map           | Wrapper component     |
| Complexity          | Simple                       | Requires wrapper      |

### Wrapper Component Checklist

- Create wrapper component with `setContext` calls
- Accept context values as props
- Use `{@render children()}` for child content
- Create component-specific test wrappers when needed
- Use factory functions for reusable mock data

### Common Patterns

```typescript
// Component-specific test wrapper (recommended)
render(MyComponentTestWrapper, { api_client: mock_api });

// Multi-context wrapper
render(FullContextWrapper, {
	context: { api_client, auth_state, theme },
});
```

### Anti-Patterns to Avoid

- Trying to pass context map to render function
- Creating overly complex generic wrappers
- Not mocking API clients properly
- Forgetting to await async operations
