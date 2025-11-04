# Sveltest - GitHub Copilot Instructions

Sveltest is a comprehensive testing example project for Svelte 5
applications using `vitest-browser-svelte`. It demonstrates real-world
testing patterns with client-side, server-side, and SSR testing
approaches.

## Build and Test Procedures

**Before committing:**

- Run `pnpm check` to validate TypeScript types
- Tests run automatically via CI (no pre-commit linting per user
  preference)

**Development workflow:**

```bash
pnpm dev              # Start dev server (localhost:5173)
pnpm build            # Build for production
pnpm preview          # Preview production build
```

**Testing workflow:**

```bash
pnpm test             # Run all tests (unit + e2e)
pnpm test:unit        # All unit tests (client/server/ssr)
pnpm test:client      # Client-side browser tests
pnpm test:server      # Server-side Node tests
pnpm test:ssr         # SSR tests
pnpm test:e2e         # Playwright e2e tests
pnpm coverage         # Generate coverage report
```

**Validation Requirements:**

ALWAYS run these before submitting changes:

1. `pnpm run format` - Auto-format all code
2. `pnpm run build` - Check for build issues

**Add changeset once you're done:**

Run `pnpm changeset` then follow the prompts. Use this after having
finished the task. Most of the time this is a patch release for
`sveltest`. Use a short and descriptive message. Always prefix the
message with either `fix`, `feat`, `breaking`, or `chore` (most likely
`fix` since you're mostly working on bugfixes).

## Repository Structure

```
src/
├── lib/
│   ├── components/              # Reusable Svelte components
│   │   ├── *.svelte            # Component implementation
│   │   ├── *.svelte.test.ts    # Client-side browser tests
│   │   └── *.ssr.test.ts       # SSR tests
│   ├── stores/                  # Svelte stores
│   └── utils/                   # Shared utilities
├── routes/
│   ├── +page.svelte            # Route components
│   ├── page.svelte.test.ts     # Page component tests
│   ├── page.ssr.test.ts        # Page SSR tests
│   ├── +page.server.ts         # Server-side page logic
│   └── api/*/+server.ts        # API endpoints with server.test.ts
tests/
└── e2e/                         # Playwright e2e tests
```

## Code Standards and Conventions

### Naming Conventions

- **Files**: `kebab-case` (e.g., `user-profile.svelte`,
  `form-validator.test.ts`)
- **Variables/Functions**: `snake_case` (e.g., `user_data`,
  `validate_form`)
- **Components**: PascalCase in usage (e.g., `<UserProfile />`)
- **Test files**: Co-locate with source files using `.test.ts` or
  `.ssr.test.ts` suffix

### Svelte 5 Runes (Required)

- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Use `$props()` for component props
- **Never** use legacy Svelte syntax (stores, `let` reactivity, `$:`
  statements)

### Styling

- **TailwindCSS v4** for utility classes
- **DaisyUI** for component styling
- Follow existing component patterns for consistency

## Testing Guidelines (Critical)

### Unbreakable Rules

1. **Always use locators** - Never use containers in
   vitest-browser-svelte:

   ```typescript
   // ✅ Correct
   const button = page.getByRole('button', { name: 'Submit' });

   // ❌ Wrong
   const { container } = render(Component);
   ```

2. **Handle multiple elements** - Use `.first()`, `.nth()`, or
   `.last()` to avoid strict mode violations:

   ```typescript
   await page.getByRole('listitem').first().click();
   ```

3. **Untrack $derived values** - Always use `untrack()` when accessing
   `$derived` in tests:

   ```typescript
   import { untrack } from 'svelte';
   expect(untrack(() => component.computed_value)).toBe(expected);
   ```

4. **Use await expect.element()** - For all locator assertions:

   ```typescript
   await expect.element(page.getByText('Success')).toBeVisible();
   ```

5. **Never click form submit buttons** - Test state directly, don't
   trigger SvelteKit form actions in component tests

6. **Use real FormData/Request objects** - Minimal mocking in server
   tests to catch client-server mismatches

### Foundation First Approach

When creating tests, start with `.skip` blocks to plan comprehensive
coverage:

```typescript
describe('Component tests', () => {
	test.skip('renders initial state', () => {});
	test.skip('handles user interaction', () => {});
	test.skip('validates input', () => {});
	test.skip('displays error states', () => {});
	// ... plan all cases first
});
```

Then implement tests one by one, removing `.skip` as you complete
each.

### Test Types

- **`.svelte.test.ts`** - Client-side browser tests using
  vitest-browser-svelte + Playwright
- **`.ssr.test.ts`** - Server-side rendering tests (Node.js
  environment)
- **`server.test.ts`** - API endpoint tests with real Request/FormData
  objects
- **`e2e/*.test.ts`** - End-to-end Playwright tests

## Security and Best Practices

- **Input validation**: Use shared validation logic between client and
  server
- **CSP headers**: Follow existing security header patterns
- **TypeScript contracts**: Maintain interfaces between client and
  server to prevent mismatches
- **Progressive enhancement**: Ensure forms work without JavaScript
- **Accessibility**: Use semantic HTML and proper ARIA roles

## Common Patterns

### Form Validation

```typescript
// Shared validation (use in both client and server)
function validate_email(email: string): string | null {
	if (!email) return 'Email required';
	if (!email.includes('@')) return 'Invalid email';
	return null;
}
```

### Component Testing

```typescript
import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';

test('component behavior', async () => {
	const { page } = render(Component, { props: { value: 'test' } });

	const button = page.getByRole('button');
	await button.click();

	await expect.element(page.getByText('Updated')).toBeVisible();
});
```

### Server Testing

```typescript
test('POST endpoint', async () => {
	const form_data = new FormData();
	form_data.set('field', 'value');

	const request = new Request('http://localhost', {
		method: 'POST',
		body: form_data,
	});

	const response = await POST({ request });
	expect(response.status).toBe(200);
});
```

## Key Technologies

- **Framework**: Svelte 5 + SvelteKit 2
- **Testing**: vitest-browser-svelte with Playwright provider
- **Styling**: TailwindCSS v4 + DaisyUI
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm (required)

## What to Work On

**Good tasks for Copilot:**

- Adding test coverage for existing components
- Creating new components following existing patterns
- Fixing TypeScript type errors
- Improving accessibility (ARIA labels, semantic HTML)
- Adding form validation logic
- Documentation improvements

**Avoid:**

- Major architectural refactoring
- Changing test framework configuration
- Modifying build/deployment pipelines
- Security-critical authentication logic
