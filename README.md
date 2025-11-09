# Sveltest

[![CI/CD](https://github.com/spences10/sveltest/actions/workflows/unit-tests.yaml/badge.svg)](https://github.com/spences10/sveltest/actions/workflows/unit-tests.yaml)
[![E2E Tests](https://github.com/spences10/sveltest/actions/workflows/e2e.yaml/badge.svg)](https://github.com/spences10/sveltest/actions/workflows/e2e.yaml)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?style=flat&logo=svelte&logoColor=white)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?style=flat&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.52-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)

A comprehensive example project demonstrating
**vitest-browser-svelte** testing patterns for modern Svelte 5
applications. Built over a weekend as a companion piece to my blog
post:
[Migrating from @testing-library/svelte to vitest-browser-svelte](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte).

## 🎯 What is Sveltest?

Sveltest is both a comprehensive reference project and a CLI tool for
`vitest-browser-svelte` - the modern testing solution for Svelte
applications. Use it as:

- **📚 A reference project** showcasing real-world testing patterns
- **🤖 A CLI tool** for AI assistants to quickly access testing
  examples
- **📖 A learning resource** with comprehensive documentation

This project demonstrates my opinionated approach to testing with:

- **Client-side component testing** with real browser environments
- **Server-side testing** for SvelteKit API routes and hooks
- **SSR testing** for server-side rendering validation
- **Full-stack integration patterns** for modern web applications

## 🔄 Client-Server Alignment Strategy

**The Problem**: Server unit tests with heavy mocking can pass while
production breaks due to client-server mismatches. Forms send data in
one format, servers expect another, and mocked tests miss the
disconnect.

**My Solution**: This project demonstrates a multi-layer testing
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

## 🤖 CLI for AI Assistants

Sveltest includes a CLI tool designed specifically for LLMs to access
testing patterns and examples. When working with your AI assistant
(Claude, ChatGPT, etc.), you can get instant help with testing
patterns:

```bash
# Your AI assistant can use this to fetch testing patterns
pnpx sveltest list              # List all available patterns
pnpx sveltest get button        # Get button testing examples
pnpx sveltest search form       # Search for form testing patterns
```

**Usage Example**: Tell your AI assistant:

> "I need to test a login form with validation. Use
> `pnpx sveltest search form` to get the testing patterns."

Your AI can then fetch relevant examples and adapt them to your
specific needs. The CLI provides access to all the testing patterns in
this repository, making it easy to integrate proven testing approaches
into your workflow.

## 🚀 Features Demonstrated

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

## 🛠️ Technology Stack

- **Framework**: Svelte 5 with SvelteKit
- **Testing**: vitest-browser-svelte with Playwright
- **Styling**: TailwindCSS + DaisyUI
- **Language**: TypeScript
- **Package Manager**: pnpm

## 📦 Installation

### Option 1: Use the CLI (Recommended for AI Assistants)

```bash
# No installation needed - use with npx/pnpx
pnpx sveltest list              # List all patterns
pnpx sveltest get <component>   # Get specific examples
pnpx sveltest search <keyword>  # Search patterns
```

Perfect for quickly accessing testing patterns while working with AI
assistants.

### Option 2: Clone the Repository

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

## 🧪 Testing Patterns

### Client-Side Component Testing

```typescript
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
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

This is a monorepo project with multiple packages:

```
sveltest/
├── apps/
│   └── website/              # Main Sveltest website and examples
│       └── src/
│           ├── lib/
│           │   ├── components/     # Reusable components with tests
│           │   │   ├── button.svelte
│           │   │   ├── button.svelte.test.ts
│           │   │   ├── button.ssr.test.ts
│           │   │   ├── input.svelte
│           │   │   ├── modal.svelte
│           │   │   ├── card.svelte
│           │   │   ├── login-form.svelte
│           │   │   ├── todo-manager.svelte
│           │   │   ├── calculator.svelte
│           │   │   └── nav.svelte
│           │   └── utils/          # Utility functions with tests
│           └── routes/
│               ├── api/            # API routes with tests
│               ├── components/     # Component showcase pages
│               ├── docs/           # Documentation pages
│               └── examples/       # Example pages
│
└── packages/
    └── cli/                  # Sveltest CLI for AI Assistants
        ├── src/
        │   ├── index.ts      # CLI entry point
        │   └── commands/     # List, get, search commands
        └── README.md         # CLI documentation
```

Each component is co-located with its tests (`.svelte.test.ts` for
client tests, `.ssr.test.ts` for SSR tests).

## 🤖 AI Assistant Rules for Teams

One of the key outcomes of this project was creating comprehensive AI
assistant rules and tools that help teams adopt this testing
methodology more easily. I'm onboarding my team to use this approach!

### CLI Tool for Any AI Assistant

The `pnpx sveltest` CLI works with any AI assistant (Claude, ChatGPT,
Cursor, Windsurf, etc.):

- **Universal access** - No project setup required
- **Instant patterns** - Get testing examples in seconds
- **Always up-to-date** - Pulls latest patterns from the repository
- **Context-aware** - Search and filter for your specific needs

### Cursor Rules (`.cursor/rules/testing.mdc`)

- Comprehensive testing patterns for Cursor AI
- Complete vitest-browser-svelte best practices
- Code style enforcement (snake_case, kebab-case conventions)
- Common error solutions and troubleshooting

### Windsurf Rules (`.windsurf/rules/testing.md`)

- Adapted for Windsurf's modern rule system
- Trigger-based activation for test files
- Same comprehensive patterns as Cursor rules
- Team-ready configuration

These rules files contain:

- **Foundation First** testing approach guidelines
- Complete vitest-browser-svelte patterns and anti-patterns
- Svelte 5 runes testing strategies
- SSR testing methodologies
- Form validation lifecycle patterns
- Quick reference DO's and DON'Ts

**For Teams**: Use the CLI for on-demand access, or copy the rule
files to your projects to ensure consistent testing patterns across
your team. The AI assistants will automatically follow the established
patterns when writing or reviewing tests.

## 🎨 Testing Conventions

### My Opinionated Naming Conventions

I use specific naming conventions to help me identify code I've
written versus external libraries:

- **Files**: kebab-case (e.g., `login-form.svelte.test.ts`)
- **Variables & Functions**: snake_case (e.g., `submit_button`,
  `error_message`) - This helps me instantly recognize my own code
- **Test IDs**: kebab-case (e.g., `data-testid="submit-button"`)
- **Interfaces**: TitleCase (following TypeScript conventions)

### Test Organization

- **Descriptive test groups** with `describe()`
- **Comprehensive edge case coverage**
- **Real-world interaction patterns**
- **Accessibility testing integration**

## 📊 Test Coverage

- **32 test files** across client, server, and SSR
- **576 passing tests** with comprehensive component coverage
- **Full server-side testing** for API routes and hooks
- **SSR validation** for critical rendering paths

## 🚀 Migration from @testing-library/svelte

This project was inspired by my experience migrating from
`@testing-library/svelte` to `vitest-browser-svelte`. Read the full
story in my blog post:
[Migrating from @testing-library/svelte to vitest-browser-svelte](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte).

You can also check the comprehensive
[Migration Guide](./MIGRATION_GUIDE.md) which documents:

- Step-by-step migration process
- Before/after code examples
- Common patterns and transformations
- Performance improvements
- Troubleshooting guide

## 🤝 Contributing

This project serves as a reference implementation of my testing
methodology. Feel free to:

- Open issues for questions about testing patterns
- Submit PRs to improve examples
- Share your own testing patterns
- Report bugs or suggest improvements

Keep in mind that the conventions used here are opinionated and
reflect my personal coding style preferences.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Related Resources

- [My Blog Post: Migrating from @testing-library/svelte to vitest-browser-svelte](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte)
- [vitest-browser-svelte Documentation](https://github.com/vitest-dev/vitest-browser-svelte)
- [Vitest Browser Mode](https://vitest.dev/guide/browser.html)
- [SvelteKit Testing](https://kit.svelte.dev/docs/testing)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)

---

**Sveltest** - My comprehensive vitest-browser-svelte testing patterns
for modern Svelte applications.
