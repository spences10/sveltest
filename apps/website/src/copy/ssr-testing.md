# SSR Testing Patterns

## Overview

SSR (Server-Side Rendering) tests ensure server-rendered HTML matches
client expectations and prevent hydration mismatches. This guide
covers when to add SSR tests and the essential patterns for testing
server-rendered components.

For component testing patterns, see
[Testing Patterns](./testing-patterns). For best practices, see
[Best Practices](./best-practices).

## When to Add SSR Tests

### Always Add SSR Tests For:

- **Form components** - Inputs, selects, textareas (progressive
  enhancement critical)
- **Navigation components** - Links, menus, breadcrumbs (SEO +
  accessibility)
- **Content components** - Cards, articles, headers (SEO critical)
- **Layout components** - Page shells, grids (hydration mismatch
  prone)

### Usually Add SSR Tests For:

- **Components with complex CSS logic** - Conditional classes,
  variants
- **Components with ARIA attributes** - Screen reader compatibility
- **Components that render different content server vs client**
- **Components used in `+page.svelte` files** (always SSR'd)

### Rarely Need SSR Tests For:

- **Pure interaction components** - Modals, dropdowns, tooltips
- **Client-only components** - Charts, maps, rich editors
- **Simple presentational components** - Icons, badges, dividers

### Red Flags That Require SSR Tests:

- Hydration mismatches in browser console
- Different appearance on first load vs after hydration
- SEO issues with missing content
- Accessibility tools can't find elements
- Form doesn't work without JavaScript

### Quick Decision Framework:

```
Does it render different HTML server vs client? → SSR test
Is it SEO critical? → SSR test
Does it need to work without JS? → SSR test
Is it just interactive behavior? → Skip SSR test
```

**Start with browser tests only, add SSR tests when you hit problems
or have specific SSR requirements.**

## Basic SSR Pattern

```typescript
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';

describe('Component SSR', () => {
	it('should render without errors', () => {
		expect(() => {
			render(ComponentName);
		}).not.toThrow();
	});

	it('should render essential content for SEO', () => {
		const { body } = render(ComponentName, {
			props: { title: 'Page Title', description: 'Page description' },
		});

		expect(body).toContain('<h1>Page Title</h1>');
		expect(body).toContain('Page description');
		expect(body).toContain('href="/important-link"');
	});

	it('should render meta information', () => {
		const { head } = render(ComponentName, {
			props: { title: 'Page Title' },
		});

		expect(head).toContain('<title>Page Title</title>');
		expect(head).toContain('meta name="description"');
	});
});
```

## Layout SSR Pattern

```typescript
describe('Layout SSR', () => {
	it('should render navigation structure', () => {
		const { body } = render(Layout);

		expect(body).toContain('<nav');
		expect(body).toContain('aria-label="Main navigation"');
		expect(body).toContain('href="/docs"');
		expect(body).toContain('href="/examples"');
	});

	it('should include accessibility features', () => {
		const { body } = render(Layout);

		expect(body).toContain('role="main"');
		expect(body).toContain('aria-label');
		expect(body).toContain('skip-to-content');
	});

	it('should render footer information', () => {
		const { body } = render(Layout);

		expect(body).toContain('<footer');
		expect(body).toContain('© 2024');
		expect(body).toContain('Privacy Policy');
	});
});
```

## Head and Body Testing

SSR tests use `svelte/server`'s `render` function which returns both
`head` and `body` content:

```typescript
import { render } from 'svelte/server';

describe('SEO Component SSR', () => {
	it('should render head content for SEO', () => {
		const { head, body } = render(SEOComponent, {
			props: {
				title: 'My Page',
				description: 'A description',
				og_image: '/images/og.png',
			},
		});

		// Test head content (meta tags, title, etc.)
		expect(head).toContain('<title>My Page</title>');
		expect(head).toContain('meta name="description"');
		expect(head).toContain('og:image');

		// Test body content
		expect(body).toContain('<main');
	});

	it('should render structured data', () => {
		const { head } = render(ArticlePage, {
			props: { article: mock_article },
		});

		expect(head).toContain('application/ld+json');
		expect(head).toContain('"@type":"Article"');
	});
});
```

## Form SSR Pattern

Forms require SSR tests to ensure progressive enhancement works:

```typescript
describe('ContactForm SSR', () => {
	it('should render form elements for no-JS fallback', () => {
		const { body } = render(ContactForm);

		// Form should have action for no-JS submission
		expect(body).toContain('action="/api/contact"');
		expect(body).toContain('method="POST"');

		// All inputs should be present
		expect(body).toContain('name="email"');
		expect(body).toContain('name="message"');
		expect(body).toContain('type="submit"');
	});

	it('should render labels for accessibility', () => {
		const { body } = render(ContactForm);

		expect(body).toContain('<label');
		expect(body).toContain('for="email"');
		expect(body).toContain('for="message"');
	});
});
```

## SSR Test File Organization

SSR tests are co-located with components using `.ssr.test.ts` suffix:

```
src/lib/components/
├── button.svelte
├── button.svelte.test.ts      # Client-side browser tests
└── button.ssr.test.ts         # Server-side rendering tests

src/routes/
├── +page.svelte
├── page.svelte.test.ts        # Component tests
└── page.ssr.test.ts           # SSR tests
```

## Quick Reference

### SSR Test Essentials

- ✅ Use `import { render } from 'svelte/server'`
- ✅ Test both `head` and `body` when relevant
- ✅ Verify SEO-critical content renders
- ✅ Check accessibility attributes are present
- ✅ Ensure forms work without JavaScript
- ✅ Use `.ssr.test.ts` suffix for SSR test files

### Common SSR Checks

```typescript
// SEO content
expect(body).toContain('<h1>');
expect(head).toContain('<title>');
expect(head).toContain('meta name="description"');

// Accessibility
expect(body).toContain('aria-label');
expect(body).toContain('role="main"');

// Progressive enhancement
expect(body).toContain('action="/api/');
expect(body).toContain('method="POST"');
```
