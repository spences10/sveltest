# Getting Started

## Overview

Sveltest showcases real-world testing patterns using
`vitest-browser-svelte` - the modern testing solution for Svelte
applications. This project demonstrates comprehensive testing with:

- **Client-side component testing** with real browser environments
- **Server-side testing** for SvelteKit API routes and hooks
- **SSR testing** for server-side rendering validation
- **Full-stack integration patterns** for modern web applications

## Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/spences10/sveltest.git
cd sveltest

# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Run tests
pnpm test:unit

# Run specific test suites
pnpm test:client    # Component tests in browser
pnpm test:server    # Server-side tests
pnpm test:ssr       # SSR tests
```

## Technology Stack

- **Framework**: Svelte 5 with SvelteKit
- **Testing**: vitest-browser-svelte with Playwright
- **Styling**: TailwindCSS + DaisyUI
- **Language**: TypeScript
- **Package Manager**: pnpm

## Your First Test

Here's a simple example of testing a Svelte component with
vitest-browser-svelte:

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

## Testing Philosophy: User Value Over Implementation

**Key Principle**: Test what users see and experience, not internal
implementation details.

```typescript
// ❌ AVOID: Testing exact SVG paths (breaks when icon libraries update)
expect(body).toContain(
	'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
);

// ✅ PREFER: Testing semantic classes and user experience
expect(body).toContain('text-success'); // User sees green color
await expect
	.element(page.getByRole('img', { name: /success/i }))
	.toBeInTheDocument();
```

This approach keeps tests robust through library updates and
refactoring while ensuring they validate real user value.

## Project Structure

```
src/
├── lib/
│   ├── components/           # Reusable components with tests
│   │   ├── button.svelte
│   │   ├── button.svelte.test.ts
│   │   ├── button.ssr.test.ts
│   │   ├── input.svelte
│   │   ├── input.svelte.test.ts
│   │   ├── modal.svelte
│   │   ├── modal.svelte.test.ts
│   │   └── ...
│   ├── utils/               # Utility functions with tests
│   │   ├── validation.ts
│   │   └── validation.test.ts
│   ├── state/               # State management
│   └── icons/               # Icon components
├── routes/
│   ├── api/
│   │   ├── secure-data/
│   │   │   ├── +server.ts
│   │   │   └── server.test.ts
│   │   └── ...
│   ├── components/          # Component showcase pages
│   ├── docs/                # Documentation pages
│   ├── examples/            # Example pages
│   ├── todos/               # Todo application
│   │   └── page.server.test.ts
│   ├── +layout.svelte
│   ├── layout.ssr.test.ts
│   ├── +page.svelte
│   ├── page.svelte.test.ts
│   └── page.ssr.test.ts
├── hooks.server.ts
└── hooks.server.test.ts
```

## Testing Conventions

### Naming Conventions

- **Files**: kebab-case (e.g., `login-form.svelte.test.ts`)
- **Variables & Functions**: snake_case (e.g., `submit_button`,
  `error_message`)
- **Test IDs**: kebab-case (e.g., `data-testid="submit-button"`)
- **Interfaces**: TitleCase (following TypeScript conventions)

### Test File Types

- **Component Tests**: `*.svelte.test.ts` - Real browser testing with
  vitest-browser-svelte
- **SSR Tests**: `*.ssr.test.ts` - Server-side rendering validation
- **Server Tests**: `*.test.ts` - API routes, utilities, business
  logic

## Key Features Demonstrated

### Component Testing (Client-Side)

- **Button Component**: Variants, sizes, loading states, accessibility
- **Input Component**: Validation, error states, form integration
- **Modal Component**: Focus management, keyboard navigation, portal
  rendering
- **Card Component**: Slot testing, conditional rendering, click
  handlers
- **LoginForm Component**: Complex form interactions, async operations
- **TodoManager Component**: State management, CRUD operations, list
  interactions
- **Calculator Component**: Interactive calculations, input validation
- **Nav Component**: Navigation, responsive design, accessibility

### Server-Side Testing

- **API Routes**: Authentication, authorization, error handling
- **Server Hooks**: Security headers, middleware, request processing
- **Form Actions**: CRUD operations, validation, user feedback
- **Utility Functions**: Validation logic, data processing

### SSR Testing

- **Component SSR**: Server-side rendering validation
- **Layout SSR**: Navigation, responsive design, meta tags
- **Page SSR**: Multi-page server-side rendering
- **Hydration Testing**: Client-server state synchronization

## Client-Server Alignment Strategy

**The Problem**: Server unit tests with heavy mocking can pass while
production breaks due to client-server mismatches. Forms send data in
one format, servers expect another, and mocked tests miss the
disconnect.

**The Solution**: This project demonstrates a multi-layer testing
approach with minimal mocking:

- **Shared validation logic** between client and server prevents
  contract mismatches
- **Real FormData/Request objects** in server tests (only external
  services like databases are mocked)
- **TypeScript contracts** ensure data structures align between client
  and server
- **E2E tests** provide the final safety net to catch any integration
  gaps

This methodology gives you **fast unit test feedback** while
maintaining **confidence that client and server actually work
together** in production.

## Next Steps

1. Explore the [Testing Patterns](/docs/testing-patterns) to learn
   specific testing techniques
2. Check out the [API Reference](/docs/api-reference) for complete
   documentation of testing utilities
3. Review the [Migration Guide](/docs/migration-guide) if you're
   coming from @testing-library/svelte
4. Study the [Best Practices](/docs/best-practices) for advanced
   patterns and optimization
5. Visit the [Troubleshooting](/docs/troubleshooting) guide if you
   encounter issues
