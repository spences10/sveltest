---
name: sveltest-helper
description:
  Testing assistant for Svelte 5 with vitest-browser-svelte. Creates
  client/server/SSR tests using locators, untrack, and real FormData
  patterns. Use for SvelteKit testing.
---

# Sveltest Helper

## Quick Start

```typescript
// Client-side component test (.svelte.test.ts)
import { render } from 'vitest-browser-svelte';
import { expect } from 'vitest';
import Button from './button.svelte';

test('button click increments counter', async () => {
	const { page } = render(Button);
	const button = page.getByRole('button', { name: /click me/i });

	await button.click();
	await expect.element(button).toHaveTextContent('Clicked: 1');
});
```

## Core Principles

- **Always use locators**: `page.getBy*()` methods, never containers
- **Use untrack()**: When accessing `$derived` values in tests
- **Real API objects**: Test with FormData/Request, minimal mocking
- **Foundation First**: Plan with `.skip` blocks before implementing

## Common Patterns

### Multiple Elements Handling

Use `.first()`, `.nth()`, `.last()` to avoid strict mode violations
when multiple elements match a locator.

## Reference Files

For detailed documentation, see:

- [references/detailed-guide.md](references/detailed-guide.md) -
  Complete guide with examples

## Test Types

- `.svelte.test.ts` - Client-side browser tests
- `.ssr.test.ts` - Server-side rendering tests
- `server.test.ts` - API route/server logic tests

## Notes

- Never click SvelteKit form submit buttons - test state directly
- Always use `await expect.element()` for locator assertions
- Co-locate tests with components for maintainability
- Run `pnpm lint` after making changes

<!--
PROGRESSIVE DISCLOSURE GUIDELINES:
- Keep this file ~50 lines total (max ~150 lines)
- Use 1-2 code blocks only (recommend 1)
- Keep description <200 chars for Level 1 efficiency
- Move detailed docs to references/ for Level 3 loading
- This is Level 2 - quick reference ONLY, not a manual
-->
