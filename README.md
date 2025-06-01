# Sveltest

[![CI/CD](https://github.com/spences10/sveltest/actions/workflows/unit-tests.yaml/badge.svg)](https://github.com/spences10/sveltest/actions/workflows/unit-tests.yaml)
[![E2E Tests](https://github.com/spences10/sveltest/actions/workflows/e2e.yaml/badge.svg)](https://github.com/spences10/sveltest/actions/workflows/e2e.yaml)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?style=flat&logo=svelte&logoColor=white)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?style=flat&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.52-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)

A comprehensive example project demonstrating
**vitest-browser-svelte** testing patterns for modern Svelte 5
applications.

## 🎯 What is Sveltest?

Sveltest showcases real-world testing patterns using
`vitest-browser-svelte` - the modern testing solution for Svelte
applications. This project demonstrates:

- **Client-side component testing** with real browser environments
- **Server-side testing** for SvelteKit API routes and hooks
- **SSR testing** for server-side rendering validation
- **Full-stack integration patterns** for modern web applications

## 🚀 Features Demonstrated

### Component Testing (Client-Side)

- **Button Component**: Variants, sizes, loading states, accessibility
- **Input Component**: Validation, error states, form integration
- **Modal Component**: Focus management, keyboard navigation, portal
  rendering
- **Card Component**: Slot testing, conditional rendering, click
  handlers
- **LoginForm Component**: Complex form interactions, async operations

### Server-Side Testing

- **API Routes**: Authentication, authorization, error handling
- **Server Hooks**: Security headers, middleware, request processing
- **Form Actions**: CRUD operations, validation, user feedback
- **Utility Functions**: Validation logic, formatting, performance
  utilities

### SSR Testing

- **Component SSR**: Server-side rendering validation
- **Layout SSR**: Navigation, responsive design, meta tags
- **Page SSR**: Multi-page server-side rendering
- **Hydration Testing**: Client-server state synchronization

## 🛠️ Technology Stack

- **Framework**: Svelte 5 with SvelteKit
- **Testing**: vitest-browser-svelte with Playwright
- **Styling**: TailwindCSS + DaisyUI
- **Language**: TypeScript
- **Package Manager**: pnpm

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/spences10/sveltest.git
cd sveltest

# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Run tests
pnpm test

# Run specific test suites
pnpm test:client    # Component tests in browser
pnpm test:server    # Server-side tests
pnpm test:ssr       # SSR tests
```

## 🧪 Testing Patterns

### Client-Side Component Testing

```typescript
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import { expect, test } from 'vitest';
import Button from './button.svelte';

test('button renders with correct variant', async () => {
	render(Button, { variant: 'primary', children: 'Click me' });

	const button = page.getByRole('button', { name: 'Click me' });
	await expect.element(button).toBeInTheDocument();
	await expect.element(button).toHaveClass('btn-primary');
});
```

### Server-Side API Testing

```typescript
import { describe, it, expect } from 'vitest';
import { GET } from './+server.ts';

describe('API Route', () => {
	it('should authenticate valid requests', async () => {
		const request = new Request('http://localhost/api/secure-data', {
			headers: { Authorization: 'Bearer valid-token' },
		});

		const response = await GET({ request });
		expect(response.status).toBe(200);
	});
});
```

### SSR Testing

```typescript
import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import Layout from './+layout.svelte';

test('layout renders navigation on server', () => {
	const { html } = render(Layout);

	expect(html).toContain('<nav');
	expect(html).toContain('aria-label="Main navigation"');
});
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/           # Reusable components with tests
│   │   ├── button.svelte
│   │   ├── button.svelte.test.ts
│   │   ├── input.svelte
│   │   ├── input.svelte.test.ts
│   │   ├── modal.svelte
│   │   ├── modal.svelte.test.ts
│   │   ├── card.svelte
│   │   ├── card.svelte.test.ts
│   │   ├── login-form.svelte
│   │   └── login-form.svelte.test.ts
│   └── utils/               # Utility functions with tests
│       ├── validation.ts
│       ├── validation.test.ts
│       ├── formatting.ts
│       └── formatting.test.ts
├── routes/
│   ├── api/
│   │   └── secure-data/
│   │       ├── +server.ts
│   │       └── +server.test.ts
│   ├── +layout.svelte
│   ├── +layout.ssr.test.ts
│   ├── +page.svelte
│   └── +page.ssr.test.ts
├── hooks.server.ts
└── hooks.server.test.ts
```

## 🎨 Testing Conventions

### Naming Conventions

- **Files**: kebab-case (e.g., `login-form.svelte.test.ts`)
- **Variables**: snake_case (e.g., `submit_button`, `error_message`)
- **Test IDs**: kebab-case (e.g., `data-testid="submit-button"`)

### Test Organization

- **Descriptive test groups** with `describe()`
- **Comprehensive edge case coverage**
- **Real-world interaction patterns**
- **Accessibility testing integration**

## 📊 Test Coverage

- **252 total test cases** across client, server, and SSR
- **93% success rate** on client-side functionality
- **100% coverage** on server-side and SSR functionality
- **1,800+ lines** of comprehensive test code

## 🔧 Configuration

### Vitest Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Browser mode for component tests
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
		},
		// Multiple test environments
		workspace: [
			{
				test: {
					include: ['**/*.svelte.test.ts'],
					name: 'client',
					browser: { enabled: true },
				},
			},
			{
				test: {
					include: ['**/*.ssr.test.ts'],
					name: 'ssr',
					environment: 'node',
				},
			},
			{
				test: {
					include: ['**/*.server.test.ts'],
					name: 'server',
					environment: 'node',
				},
			},
		],
	},
});
```

## 🚀 CI/CD

This project includes automated CI/CD with GitHub Actions that:

- **Runs in Playwright Docker container** (v1.52.0) for consistent
  browser testing
- **Automatically verifies Playwright version sync** between
  package.json and container
- **Executes comprehensive test suite** including unit tests, E2E
  tests, and type checking
- **Performs code quality checks** with linting and Svelte-specific
  validation
- **Triggers on PRs and pushes** to main branch with daily scheduled
  runs

The workflow uses the official Microsoft Playwright container to
ensure consistent browser environments and includes intelligent
version checking to prevent mismatches between your local Playwright
version and the CI environment.

## 🚀 Migration from @testing-library/svelte

If you're migrating from `@testing-library/svelte`, see our
comprehensive [Migration Guide](./MIGRATION_GUIDE.md) which documents:

- Step-by-step migration process
- Before/after code examples
- Common patterns and transformations
- Performance improvements
- Troubleshooting guide

## 📚 Key Benefits

### Developer Experience

- ✅ Real browser environment testing
- ✅ Better debugging with browser DevTools
- ✅ More accurate user interaction simulation
- ✅ Improved async operation testing

### Testing Capabilities

- ✅ True DOM manipulation testing
- ✅ CSS-in-JS and style testing
- ✅ File upload and download testing
- ✅ Network request interception

### Maintenance

- ✅ Reduced test flakiness
- ✅ Better alignment with production environment
- ✅ Simplified test setup and configuration
- ✅ Future-proof testing approach

## 🤝 Contributing

This project serves as a reference implementation. Feel free to:

- Open issues for questions about testing patterns
- Submit PRs to improve examples
- Share your own testing patterns
- Report bugs or suggest improvements

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Related Resources

- [vitest-browser-svelte Documentation](https://github.com/vitest-dev/vitest-browser-svelte)
- [Vitest Browser Mode](https://vitest.dev/guide/browser.html)
- [SvelteKit Testing](https://kit.svelte.dev/docs/testing)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)

---

**Sveltest** - Comprehensive vitest-browser-svelte testing patterns
for modern Svelte applications.
