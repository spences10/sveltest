# LLMs.txt Implementation Plan for Sveltest

## Overview

Based on the research into the `llms.txt` convention, this plan
outlines how to implement **llms.txt** and **llms-full.txt** files for
the Sveltest project to make our comprehensive testing documentation
easily accessible to AI systems.

## What is llms.txt?

The `llms.txt` convention is a proposed standard that helps AI models
better understand and interact with website content. Unlike
`robots.txt` or `sitemap.xml`, it's specifically designed to:

- Provide structured content overviews for AI systems
- Help AI navigate documentation efficiently within context window
  limitations
- Offer LLM-friendly content in markdown format
- Enable better AI assistance for developers using the documentation

## Current Content Analysis

### Available Documentation Content

Our project has rich testing documentation across multiple formats:

1. **README.md** (326 lines) - Project overview, features, testing
   patterns
2. **MIGRATION_GUIDE.md** (657 lines) - Comprehensive migration guide
   from @testing-library/svelte
3. **src/routes/docs/+page.svelte** (756 lines) - Interactive
   documentation page
4. **Testing Rules** - Comprehensive AI assistant rules in
   `.cursorrules`
5. **Live Examples** - Component tests, SSR tests, server tests
   throughout the codebase
6. **Package Configuration** - Vite/Vitest configuration examples

### Key Testing Topics Covered

- Svelte 5 + vitest-browser-svelte patterns
- Component testing in real browsers
- SSR (Server-Side Rendering) testing
- API route and server testing
- Migration from @testing-library/svelte
- Advanced testing patterns and best practices
- AI assistant rules for consistent testing

## Implementation Strategy

### Phase 1: Create Markdown Documentation Pages

Create standalone markdown files that can be served as routes and used
for llms.txt:

1. **src/routes/docs/getting-started.md** - Setup and first test
2. **src/routes/docs/testing-patterns.md** - Component, SSR, server
   patterns
3. **src/routes/docs/api-reference.md** - All utilities and helpers
4. **src/routes/docs/migration-guide.md** - Link to existing
   MIGRATION_GUIDE.md
5. **src/routes/docs/best-practices.md** - Advanced patterns and
   optimization
6. **src/routes/docs/troubleshooting.md** - Common issues and
   solutions

### Phase 2: Create SvelteKit Routes for Documentation

Use SvelteKit's file-based routing to serve documentation:

```
src/routes/docs/
├── getting-started/
│   └── +page.md
├── testing-patterns/
│   └── +page.md
├── api-reference/
│   └── +page.md
├── migration-guide/
│   └── +page.md
├── best-practices/
│   └── +page.md
└── troubleshooting/
    └── +page.md
```

### Phase 3: Implement llms.txt Routes

Create SvelteKit server routes to generate llms.txt files:

#### 3.1 Create llms.txt Route

**src/routes/llms.txt/+server.ts**

```typescript
import { generate_llm_content, topics } from '$lib/server/llms';

export const prerender = true;

export function GET() {
	const content = generate_llm_content({ topics });

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
			'X-Robots-Tag': 'llms-txt',
		},
	});
}
```

#### 3.2 Create llms-full.txt Route

**src/routes/llms-full.txt/+server.ts**

```typescript
import { generate_llm_content, topics } from '$lib/server/llms';

export const prerender = true;

export function GET() {
	const content = `<SYSTEM>This is the comprehensive testing documentation for Sveltest - vitest-browser-svelte patterns for Svelte 5.</SYSTEM>\n\n${generate_llm_content({ topics, include_full_content: true })}`;

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
```

### Phase 4: Create LLM Content Generator

**src/lib/server/llms.ts**

```typescript
interface Topic {
	slug: string;
	title: string;
	description: string;
}

interface GenerateLlmContentOptions {
	topics: Topic[];
	include_full_content?: boolean;
	minimize?: boolean;
}

export const topics: Topic[] = [
	{
		slug: 'getting-started',
		title: 'Getting Started',
		description: 'Setup, installation, and your first test',
	},
	{
		slug: 'testing-patterns',
		title: 'Testing Patterns',
		description: 'Component, SSR, and server testing patterns',
	},
	{
		slug: 'api-reference',
		title: 'API Reference',
		description: 'Complete testing utilities and helper functions',
	},
	{
		slug: 'migration-guide',
		title: 'Migration Guide',
		description: 'Migrating from @testing-library/svelte',
	},
	{
		slug: 'best-practices',
		title: 'Best Practices',
		description: 'Advanced patterns and performance optimization',
	},
	{
		slug: 'troubleshooting',
		title: 'Troubleshooting',
		description: 'Common issues and solutions',
	},
];

export function generate_llm_content(
	options: GenerateLlmContentOptions,
): string {
	// Implementation will read markdown files and generate structured content
}
```

## Expected File Structure

```
# Sveltest Testing Documentation

> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.

## Getting Started

- [Installation & Setup](/docs/getting-started): Initial project setup, dependencies, and configuration
- [Your First Test](/docs/getting-started#first-test): Writing your first component test
- [Project Structure](/docs/getting-started#structure): Recommended file organization

## Testing Patterns

- [Component Testing](/docs/testing-patterns#component): Real browser testing with vitest-browser-svelte
- [SSR Testing](/docs/testing-patterns#ssr): Server-side rendering validation
- [Server Testing](/docs/testing-patterns#server): API routes, hooks, and server functions
- [Integration Testing](/docs/testing-patterns#integration): End-to-end testing patterns

## API Reference

- [Essential Imports](/docs/api-reference#imports): Core testing utilities and functions
- [Locators & Queries](/docs/api-reference#locators): Finding elements with semantic queries
- [Assertions](/docs/api-reference#assertions): Testing element states and properties
- [User Interactions](/docs/api-reference#interactions): Simulating user events

## Migration Guide

- [From @testing-library/svelte](/docs/migration-guide): Complete step-by-step migration process
- [Common Patterns](/docs/migration-guide#patterns): Before/after code examples
- [Troubleshooting Migration](/docs/migration-guide#troubleshooting): Solving common migration issues

## Best Practices

- [Foundation First Approach](/docs/best-practices#foundation-first): 100% test coverage strategy
- [Accessibility Testing](/docs/best-practices#accessibility): Semantic queries and ARIA testing
- [Performance Optimization](/docs/best-practices#performance): Fast test execution patterns
- [Team Collaboration](/docs/best-practices#team): AI assistant rules and conventions

## Troubleshooting

- [Common Errors](/docs/troubleshooting#errors): Solutions for frequent issues
- [Environment Setup](/docs/troubleshooting#environment): Configuration problems
- [Browser Issues](/docs/troubleshooting#browser): Playwright and browser-specific fixes

## Optional

- [Example Components](/examples): Live component implementations
- [GitHub Repository](https://github.com/spences10/sveltest): Full source code
- [Blog Post](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte): Migration story
```

## Implementation Steps

### Step 1: Extract Documentation Content

1. **Extract key sections from README.md** into individual markdown
   files
2. **Convert MIGRATION_GUIDE.md** content into structured
   documentation
3. **Extract testing patterns** from the Svelte documentation page
4. **Document API reference** from actual test files and utilities

### Step 2: Create Markdown Documentation Files

Use mdsvex to create `.md` files that can be rendered as SvelteKit
pages:

```typescript
// svelte.config.js
import { mdsvex } from 'mdsvex';

const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
		}),
	],
};
```

### Step 3: Create Server Routes

1. Implement `src/routes/llms.txt/+server.ts`
2. Implement `src/routes/llms-full.txt/+server.ts`
3. Create the content generation library
4. Add proper caching and headers

### Step 4: Test and Validate

1. **Test llms.txt accessibility** at `/llms.txt`
2. **Test llms-full.txt accessibility** at `/llms-full.txt`
3. **Validate markdown structure** follows llms.txt specification
4. **Test with AI systems** (ChatGPT, Claude, Cursor)

## Benefits for Users

### For Developers

- **Quick AI assistance** when implementing tests
- **Context-aware code suggestions** in AI coding assistants
- **Instant access** to best practices and patterns
- **Troubleshooting help** from AI systems

### For AI Tools

- **Structured documentation** that fits within context windows
- **Semantic navigation** of testing concepts
- **Real-world examples** for better code generation
- **Up-to-date patterns** for Svelte 5 testing

## Future Enhancements

1. **Auto-generation** from test files and comments
2. **Interactive examples** embedded in documentation
3. **Video content** integration for complex patterns
4. **Community contributions** for additional patterns

## Success Metrics

- **AI system compatibility** - Test with ChatGPT, Claude, Cursor
- **Documentation discoverability** - Track llms.txt usage
- **Developer feedback** - Improved testing adoption
- **Community adoption** - Other projects using our patterns

## Timeline

- **Week 1**: Extract and structure markdown content
- **Week 2**: Implement SvelteKit routes and content generation
- **Week 3**: Test with AI systems and refine content
- **Week 4**: Documentation polish and community feedback

This implementation will make Sveltest's comprehensive testing
knowledge easily accessible to AI systems, helping developers adopt
modern testing patterns more efficiently.
