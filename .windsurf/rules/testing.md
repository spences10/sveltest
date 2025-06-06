---
trigger: glob
globs: **/*.test.ts,**/*.svelte.test.ts,**/*.ssr.test.ts
---

# Testing Rules & Best Practices for Windsurf

You are an expert in Svelte 5, SvelteKit, TypeScript, and modern
testing with vitest-browser-svelte.

## Code Style Requirements

1. **Always use snake_case for variable names and function names**
2. **Use kebab-case for file names**
3. **Prefer arrow functions over regular functions where possible**
4. **Keep interfaces in TitleCase**

## Core Testing Principles

### 1. Testing Coverage Strategy

- **Aim for 100% test coverage** using the "Foundation First" approach
- Start with complete test structure - write all describe blocks and
  test stubs first
- Use `.skip` for unimplemented tests to create comprehensive test
  plan
- Implement tests incrementally - remove `.skip` as you write each
  test
- Test all code paths - every branch, condition, and edge case

### 2. Test File Organization

- **Component Tests**: `*.svelte.test.ts` - Real browser testing
- **SSR Tests**: `*.ssr.test.ts` - Server-side rendering validation
- **Server Tests**: `*.test.ts` - API routes, utilities, business
  logic

## CRITICAL: vitest-browser-svelte Patterns

### Always Use Locators, Never Containers

```typescript
// ❌ NEVER use containers
const { container } = render(MyComponent);

// ✅ ALWAYS use locators with auto-retry
render(MyComponent);
const button = page.getByTestId('submit');
await button.click();
```

### Handle Strict Mode Violations

```typescript
// ❌ FAILS: Multiple elements match
page.getByRole('link', { name: 'Home' });

// ✅ CORRECT: Use .first(), .nth(), .last()
page.getByRole('link', { name: 'Home' }).first();
```

### Svelte 5 Runes Testing

```typescript
// ✅ Always use untrack() for $derived
expect(untrack(() => derived_value)).toBe(expected);

// ✅ For getters: get function first, then untrack
const derived_fn = state_object.derived_value;
expect(untrack(() => derived_fn())).toBe(expected);
```

### Form Validation Lifecycle

```typescript
// ✅ Test the full lifecycle: valid → validate → invalid → fix → valid
const form = create_form_state({
	email: { value: '', validation_rules: { required: true } },
});
expect(untrack(() => form.is_form_valid())).toBe(true); // Initially valid
form.validate_all_fields();
expect(untrack(() => form.is_form_valid())).toBe(false); // Now invalid
```

## SSR Testing Essentials

```typescript
import { render } from 'svelte/server';

test('should render without errors', () => {
	expect(() => render(ComponentName)).not.toThrow();
});

test('should render essential content', () => {
	const { body } = render(ComponentName);
	expect(body).toContain('expected-content');
});
```

## CRITICAL: Avoid Testing Implementation Details

**Anti-Pattern**: Don't test exact implementation details that provide
no user value.

```typescript
// ❌ BRITTLE - Tests exact SVG path data
expect(body).toContain(
	'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
);

// ✅ ROBUST - Tests semantic styling and structure
expect(body).toContain('text-success');
expect(body).toContain('h-4 w-4');
expect(body).toContain('<svg');

// ✅ BEST - Tests user-visible behavior
await expect
	.element(page.getByRole('img', { name: /success/i }))
	.toBeInTheDocument();
```

**Why**: SVG paths change when icon libraries update. Test CSS
classes, semantic structure, and user experience instead.

## Quick Reference

### ✅ DO:

- Use locators (`page.getBy*()`) - never containers
- Always await locator assertions: `await expect.element()`
- Use `.first()`, `.nth()`, `.last()` for multiple elements
- Use `untrack()` for `$derived` values
- Use `force: true` for animations:
  `await element.click({ force: true })`
- Use snake_case for variables/functions, kebab-case for files
- Test form validation lifecycle: initial (valid) → validate → fix
- Use smoke tests for complex reactive components

### ❌ DON'T:

- Never click SvelteKit form submits - test state directly
- Don't ignore strict mode violations - use `.first()` instead
- Don't expect forms to be invalid initially
- Don't use camelCase for variables/functions
- Don't assume element roles - verify with browser dev tools
- Don't test implementation details (SVG paths, internal markup) -
  test user value
- Don't write brittle tests that break when libraries update without
  user impact

## Common Fixes

- **"strict mode violation"**: Use `.first()`, `.nth()`, `.last()`
- **Role confusion**: Links with `role="button"` are buttons, use
  `getByRole('button')`
- **Input elements**: Use `getByRole('textbox')`, not
  `getByRole('input')`
