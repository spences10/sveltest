# E2E Testing

## The Final Safety Net

E2E testing completes the **Client-Server Alignment Strategy** by
testing the full user journey from browser to server and back.

## Quick Overview

E2E tests validate:

- Complete form submission flows
- Client-server integration
- Real network requests
- Full user workflows

## Basic Pattern

```typescript
// e2e/registration.spec.ts
import { test, expect } from '@playwright/test';

test('user registration flow', async ({ page }) => {
	await page.goto('/register');

	await page.getByLabelText('Email').fill('user@example.com');
	await page.getByLabelText('Password').fill('secure123');
	await page.getByRole('button', { name: 'Register' }).click();

	// Tests the complete client-server integration
	await expect(page.getByText('Welcome!')).toBeVisible();
});
```

## Why E2E Matters

- Catches client-server contract mismatches that unit tests miss
- Validates real form submissions with actual FormData
- Tests complete user workflows
- Provides confidence in production deployments

## Hydration Assertion Pattern

SvelteKit server-side renders your pages, meaning the HTML is visible
in the browser before JavaScript has finished loading and hydrating
the components. This creates a subtle but dangerous gap: Playwright
can interact with SSR-rendered elements before they are interactive.

### The Problem

A button rendered by SSR looks clickable, but its event handlers
aren't attached until hydration completes. Playwright doesn't know
about this — it sees a visible button and clicks it. Sometimes
hydration finishes in time and the test passes. Sometimes it doesn't
and the test fails. This is a classic source of **flaky E2E tests**.

```typescript
// ❌ Flaky — may click before hydration completes
test('submit form', async ({ page }) => {
	await page.goto('/contact');
	await page.getByRole('button', { name: 'Send' }).click();
	// Sometimes works, sometimes doesn't
});
```

The real issue is masked: you see a timeout or missing element error,
not "hydration wasn't complete." This makes debugging painful.

### The Solution: Hydration Signal

Set a `hydrated` attribute on `<html>` when hydration completes, then
assert it in tests before interacting with the page.

**Step 1: Add the signal in your root layout**

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		document.documentElement.toggleAttribute('hydrated', true);
	});
</script>

{@render children?.()}
```

`onMount` only runs in the browser after hydration, making it the
perfect hook for this signal.

**Step 2: Assert hydration in your tests**

```typescript
// e2e/contact.spec.ts
import { test, expect } from '@playwright/test';

test('submit form after hydration', async ({ page }) => {
	await page.goto('/contact');

	// Wait for hydration to complete
	await expect(page.locator(':root')).toHaveAttribute('hydrated');

	// Now interactions are safe
	await page.getByRole('button', { name: 'Send' }).click();
	await expect(page.getByText('Message sent')).toBeVisible();
});
```

### Page Object Model Abstraction

Extract the hydration check into a base Page Object Model class so
every test gets it for free:

```typescript
// e2e/models/base-page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class BasePage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto(path: string) {
		await this.page.goto(path);
		await this.hydrated();
	}

	async hydrated() {
		await expect(this.page.locator(':root')).toHaveAttribute(
			'hydrated',
		);
	}
}
```

```typescript
// e2e/models/contact-page.ts
import { BasePage } from './base-page';

export class ContactPage extends BasePage {
	async submitForm(message: string) {
		await this.page
			.getByRole('textbox', { name: 'Message' })
			.fill(message);
		await this.page.getByRole('button', { name: 'Send' }).click();
	}
}
```

```typescript
// e2e/contact.spec.ts
import { test, expect } from '@playwright/test';
import { ContactPage } from './models/contact-page';

test('submit contact form', async ({ page }) => {
	const contact = new ContactPage(page);
	await contact.goto('/contact');

	await contact.submitForm('Hello!');
	await expect(page.getByText('Message sent')).toBeVisible();
});
```

Every page object that extends `BasePage` automatically waits for
hydration on navigation — no boilerplate in individual tests.

### Early Defect Detection

The hydration assertion pattern shifts debugging from symptoms to root
causes:

| Without hydration assertion          | With hydration assertion |
| ------------------------------------ | ------------------------ |
| "Button click did nothing"           | "Hydration not complete" |
| "Element not found after navigation" | "Hydration not complete" |
| "Form submission lost data"          | "Hydration not complete" |
| Flaky test — passes on retry         | Deterministic failure    |

When a test fails at the hydration assertion, you know immediately
that the issue is hydration timing — not your test logic, not a
backend bug, not a selector problem. This is especially valuable with
progressive enhancement, where SSR forms may work differently before
and after hydration.

### When to Use This Pattern

- **Always** for tests that interact with JavaScript-dependent
  elements (buttons with handlers, dynamic forms, client-side
  navigation)
- **Not needed** for tests that only assert static content rendered by
  SSR (checking text, headings, links that work without JS)

## Best Practices

- Use `test.step()` to organize complex workflows into readable
  sections
- Handle pages that may fail to load with `try/catch` and
  `test.skip()` rather than letting the whole suite fail
- Use `.first()` when locators might match multiple elements to avoid
  strict mode violations
- Prefer semantic locators (`getByRole`, `getByLabel`) over test IDs
  for accessibility coverage

---

_Credit: The hydration assertion pattern is based on
[Hydration Assertion in Tests with SvelteKit & Playwright](https://www.sveltevietnam.dev/en/blog/20260322-hydration-assertion-in-tests-with-sveltekit-playwright)
by [@vnphanquang](https://github.com/vnphanquang)._
