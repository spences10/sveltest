# Server Testing Patterns

## Overview

Server tests follow the **Client-Server Alignment Strategy** by using
real `FormData` and `Request` objects instead of heavy mocking. This
catches client-server contract mismatches that mocked tests miss.

For component testing patterns, see
[Testing Patterns](./testing-patterns). For setup and configuration,
see [Getting Started](./getting-started).

## Essential Setup Pattern

```typescript
import { describe, expect, it, vi } from 'vitest';

// Import your server handlers
import { GET, POST } from './+server';
import { actions } from './+page.server';
```

## Client-Server Alignment Strategy

The key principle: **use real web APIs instead of mocking data
structures**.

### Why Real Objects Matter

```typescript
// ❌ WRONG: Mocked objects miss field name mismatches
const mock_form_data = {
	get: (key: string) => mock_values[key],
};

// ✅ CORRECT: Real FormData catches field name issues
const form_data = new FormData();
form_data.append('email', 'user@example.com');
form_data.append('password', 'secure123');
```

Real objects catch:

- Field name typos (`email` vs `e-mail`)
- Missing required fields
- Type mismatches (string vs number)
- Content-Type header issues
- URL parameter encoding problems

## API Route Pattern

### GET Requests

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
});
```

### POST Requests with JSON

```typescript
describe('API Route', () => {
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
});
```

### Validation Errors

```typescript
describe('API Route', () => {
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
});
```

### Authentication

```typescript
describe('API Route', () => {
	it('should handle authentication', async () => {
		const request = new Request('http://localhost/api/secure-data', {
			headers: { Authorization: 'Bearer valid-token' },
		});

		const response = await GET({ request });
		expect(response.status).toBe(200);
	});
});
```

### FormData Submissions

```typescript
describe('API Route', () => {
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

## Server Hook Pattern

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

## Form Actions Pattern

SvelteKit form actions use the same real-object approach:

```typescript
describe('Form Actions', () => {
	it('should handle login action', async () => {
		const form_data = new FormData();
		form_data.append('email', 'user@example.com');
		form_data.append('password', 'password123');

		const request = new Request('http://localhost/login', {
			method: 'POST',
			body: form_data,
		});

		const result = await actions.login({
			request,
			cookies: mock_cookies,
			locals: {},
		});

		expect(result).not.toHaveProperty('error');
	});

	it('should return validation errors', async () => {
		const form_data = new FormData();
		form_data.append('email', 'invalid-email');
		form_data.append('password', '');

		const request = new Request('http://localhost/login', {
			method: 'POST',
			body: form_data,
		});

		const result = await actions.login({
			request,
			cookies: mock_cookies,
			locals: {},
		});

		expect(result).toHaveProperty('error');
		expect(result.errors.email).toBe('Invalid email format');
		expect(result.errors.password).toBe('Password is required');
	});
});
```

## Mocking Strategy

### What to Mock

- External APIs and services
- Database calls
- Authentication providers
- Email services
- File system operations

### What NOT to Mock

- `FormData` objects
- `Request` objects
- `Response` objects
- URL parsing
- Headers

### Example: Minimal Mocking

```typescript
describe('User Registration', () => {
	it('should register new user', async () => {
		// ✅ Real FormData
		const form_data = new FormData();
		form_data.append('email', 'new@example.com');
		form_data.append('password', 'SecurePass123');
		form_data.append('name', 'New User');

		// ✅ Real Request
		const request = new Request('http://localhost/api/register', {
			method: 'POST',
			body: form_data,
		});

		// ✅ Only mock external service
		vi.mocked(database.users.create).mockResolvedValue({
			id: 'user-123',
			email: 'new@example.com',
			name: 'New User',
		});

		vi.mocked(email_service.send_welcome).mockResolvedValue(true);

		const response = await POST({ request });
		expect(response.status).toBe(201);
	});
});
```

## Helper Functions

### Creating Mock Events

```typescript
function create_mock_event(
	method: string,
	path: string,
	options?: {
		cookies?: Record<string, string>;
		headers?: Record<string, string>;
		body?: FormData | string;
	},
) {
	const url = new URL(path, 'http://localhost');

	return {
		request: new Request(url, {
			method,
			headers: options?.headers,
			body: options?.body,
		}),
		cookies: {
			get: (name: string) => options?.cookies?.[name],
			set: vi.fn(),
			delete: vi.fn(),
		},
		locals: {},
		url,
		params: {},
	};
}
```

### Mock Resolve Function

```typescript
const mock_resolve = async (event: any) => {
	return new Response('OK', { status: 200 });
};
```

## Quick Reference

### Essential Patterns Checklist

- ✅ Use real `FormData` objects - never mock data access
- ✅ Use real `Request` objects - catches URL/header issues
- ✅ Only mock external services (database, email, APIs)
- ✅ Test validation errors with invalid data
- ✅ Test authentication with valid and invalid tokens
- ✅ Verify response status codes
- ✅ Check response body structure

### Common Fixes

- **Field not found**: Check field names match between client and
  server
- **Parsing errors**: Verify Content-Type header matches body format
- **Auth failures**: Ensure Authorization header format is correct
- **Status code wrong**: Check error handling returns proper codes
