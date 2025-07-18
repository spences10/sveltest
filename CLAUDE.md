# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when
working with code in this repository.

## Project Overview

**Sveltest** is a comprehensive testing example project for Svelte 5
applications using `vitest-browser-svelte`. It demonstrates real-world
testing patterns with client-side, server-side, and SSR testing
approaches.

## Essential Commands

### Development

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

### Testing

```bash
pnpm test           # Run all tests (unit + e2e)
pnpm test:unit      # Run all unit tests
pnpm test:client    # Client-side component tests (browser)
pnpm test:server    # Server-side tests (Node.js)
pnpm test:ssr       # SSR tests (server-side rendering)
pnpm test:e2e       # Playwright e2e tests
pnpm coverage       # Generate test coverage report
```

### Code Quality

```bash
pnpm lint                  # Check linting and formatting
pnpm lint:fix              # Fix linting and formatting issues
pnpm format                # Format code with Prettier
pnpm check                 # Run Svelte type checking
pnpm check:watch           # Watch mode for type checking
```

### Special Scripts

```bash
pnpm generate:llms         # Generate LLM context files
pnpm generate:ai-rules     # Generate AI assistant rules
pnpm test:ai-rules         # Test AI rules generation (dry run)
```

## Architecture & Testing Strategy

### Core Testing Philosophy

This project follows a **"Foundation First"** approach with
**Client-Server Alignment Strategy**:

- **Minimal Mocking**: Use real FormData/Request objects to catch
  client-server mismatches
- **Shared Validation**: Common validation logic between client and
  server
- **TypeScript Contracts**: Ensure data structures align across layers
- **Multi-layer Testing**: Client, server, and SSR tests with E2E
  safety net

### Test Organization

```
src/
├── lib/components/          # Component files with co-located tests
│   ├── button.svelte
│   ├── button.svelte.test.ts      # Client-side browser tests
│   └── button.ssr.test.ts         # Server-side rendering tests
├── routes/
│   ├── api/*/+server.ts           # API route handlers
│   ├── api/*/server.test.ts       # Server-side API tests
│   ├── +page.svelte
│   ├── page.svelte.test.ts        # Component tests
│   └── page.ssr.test.ts           # SSR tests
```

### Test Types

- **`.svelte.test.ts`**: Component tests in real browser environment
  (vitest-browser-svelte)
- **`.ssr.test.ts`**: Server-side rendering validation
- **`.test.ts`**: Server-side logic, API routes, utilities
- **`e2e/*.spec.ts`**: End-to-end tests with Playwright

## Key Technologies

- **Framework**: Svelte 5 + SvelteKit
- **Testing**: vitest-browser-svelte with Playwright
- **Styling**: TailwindCSS v4 + DaisyUI
- **Language**: TypeScript
- **Package Manager**: pnpm

## Critical Testing Patterns

### vitest-browser-svelte Essentials

```typescript
// Always use locators, never containers
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';

render(Component);
const button = page.getByRole('button', { name: 'Submit' });
await button.click();
await expect.element(button).toBeInTheDocument();
```

### Svelte 5 Runes Testing

```typescript
// Use untrack() for $derived values
expect(untrack(() => derivedValue)).toBe(expected);
```

### Form Validation Lifecycle

```typescript
// Test: valid → validate → invalid → fix
const form = createFormState({
	email: { value: '', rules: { required: true } },
});
expect(untrack(() => form.isFormValid())).toBe(true); // Initially valid
form.validateAllFields();
expect(untrack(() => form.isFormValid())).toBe(false); // Now invalid
```

## Personas for Development

### 1. **Testing Specialist**

When working on test files or testing-related tasks:

- Follow the comprehensive testing patterns from
  `.cursor/rules/testing.mdc`
- Use the "Foundation First" approach with `.skip` blocks for planning
- Prioritize real browser testing over mocking
- Test client-server alignment with real FormData objects
- Focus on user-visible behavior over implementation details

### 2. **Component Developer**

When creating or modifying Svelte components:

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Follow TailwindCSS + DaisyUI patterns
- Co-locate tests with components
- Ensure accessibility (ARIA roles, semantic HTML)
- Test all variants and edge cases

### 3. **API Developer**

When working on server-side code:

- Use SvelteKit conventions (+server.ts, +page.server.ts)
- Test with real Request/FormData objects
- Mock only external services (database, APIs)
- Validate input/output with shared validation logic
- Follow security best practices (CSP, validation)

### 4. **Full-Stack Developer**

When working across client and server:

- Maintain client-server contracts with TypeScript
- Use shared validation between client and server
- Test form submission flows end-to-end
- Ensure SSR compatibility for SEO
- Test Progressive Enhancement patterns

## Project Structure Notes

### Key Directories

- `src/lib/components/`: Reusable UI components with tests
- `src/lib/state/`: Svelte 5 state management (runes)
- `src/lib/utils/`: Utility functions and validation
- `src/routes/`: SvelteKit pages and API routes
- `src/copy/`: Markdown content for documentation
- `e2e/`: Playwright end-to-end tests
- `scripts/`: Build and generation scripts

### Special Files

- `src/hooks.server.ts`: Server-side hooks (CSP, security)
- `src/app.html`: Main HTML template
- `src/app.css`: Global styles
- `vite.config.ts`: Multi-project test configuration
- `playwright.config.ts`: E2E test configuration

## Testing Configuration

The project uses a multi-project Vitest setup:

- **client**: Browser tests with Playwright
- **server**: Node.js tests for server-side logic
- **ssr**: Server-side rendering tests

## Quality Standards

- Maintain high test coverage (576+ tests across all layers)
- Follow naming conventions: kebab-case files, snake_case variables
- Use TypeScript contracts for client-server alignment
- Prioritize accessibility and semantic HTML
- Test real user interactions over implementation details

## Common Commands for Different Tasks

**Adding new component:**

```bash
# 1. Create component file
# 2. Create .svelte.test.ts for client tests
# 3. Create .ssr.test.ts for SSR tests
# 4. Run specific test suites
pnpm test:client
pnpm test:ssr
```

**Working on API routes:**

```bash
# 1. Create +server.ts
# 2. Create server.test.ts
# 3. Test server-side logic
pnpm test:server
```

**Full development cycle:**

```bash
pnpm dev                   # Start development
pnpm test:unit            # Run tests during development
pnpm lint                 # Check code quality
pnpm build                # Build for production
pnpm test:e2e             # Run end-to-end tests
```
