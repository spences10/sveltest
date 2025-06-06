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

## Implementation Strategy (Updated)

### Phase 1: Create Centralized Markdown Content

Create a centralized content directory that both documentation pages
and llms.txt generation can use:

```
src/copy/
├── getting-started.md
├── testing-patterns.md
├── api-reference.md
├── migration-guide.md
├── best-practices.md
└── troubleshooting.md
```

This approach provides:

- **Single source of truth** for all documentation content
- **Easy maintenance** - update content in one place
- **Reusability** - same content used by web pages and llms.txt
- **Version control** - track content changes separately from styling

### Phase 2: Create SvelteKit Documentation Routes

Use your proven pattern from `/test` for documentation pages:

```
src/routes/docs/
├── getting-started/
│   ├── +page.svelte  (styling + layout)
│   └── +page.ts      (loads from src/copy/getting-started.md)
├── testing-patterns/
│   ├── +page.svelte
│   └── +page.ts      (loads from src/copy/testing-patterns.md)
├── api-reference/
│   ├── +page.svelte
│   └── +page.ts      (loads from src/copy/api-reference.md)
├── migration-guide/
│   ├── +page.svelte
│   └── +page.ts      (loads from src/copy/migration-guide.md)
├── best-practices/
│   ├── +page.svelte
│   └── +page.ts      (loads from src/copy/best-practices.md)
└── troubleshooting/
    ├── +page.svelte
    └── +page.ts      (loads from src/copy/troubleshooting.md)
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

export async function generate_llm_content(
	options: GenerateLlmContentOptions,
): Promise<string> {
	if (options.include_full_content) {
		// Generate llms-full.txt with all content
		let content = '# Sveltest Testing Documentation\n\n';
		content +=
			'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

		for (const topic of options.topics) {
			try {
				// Import the markdown file and extract its content
				const markdownModule = await import(
					`../../copy/${topic.slug}.md?raw`
				);
				content += `\n# ${topic.title}\n\n`;
				content += markdownModule.default;
				content += '\n';
			} catch (error) {
				console.warn(
					`Could not load content for ${topic.slug}:`,
					error,
				);
			}
		}

		return content;
	} else {
		// Generate llms.txt index with links
		return generate_llms_index(options.topics);
	}
}

function generate_llms_index(topics: Topic[]): string {
	let content = '# Sveltest Testing Documentation\n\n';
	content +=
		'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

	content += '## Getting Started\n\n';
	content +=
		'- [Installation & Setup](/docs/getting-started): Initial project setup, dependencies, and configuration\n';
	content +=
		'- [Your First Test](/docs/getting-started#first-test): Writing your first component test\n';
	content +=
		'- [Project Structure](/docs/getting-started#structure): Recommended file organization\n\n';

	content += '## Testing Patterns\n\n';
	content +=
		'- [Component Testing](/docs/testing-patterns#component): Real browser testing with vitest-browser-svelte\n';
	content +=
		'- [SSR Testing](/docs/testing-patterns#ssr): Server-side rendering validation\n';
	content +=
		'- [Server Testing](/docs/testing-patterns#server): API routes, hooks, and server functions\n';
	content +=
		'- [Integration Testing](/docs/testing-patterns#integration): End-to-end testing patterns\n\n';

	content += '## API Reference\n\n';
	content +=
		'- [Essential Imports](/docs/api-reference#imports): Core testing utilities and functions\n';
	content +=
		'- [Locators & Queries](/docs/api-reference#locators): Finding elements with semantic queries\n';
	content +=
		'- [Assertions](/docs/api-reference#assertions): Testing element states and properties\n';
	content +=
		'- [User Interactions](/docs/api-reference#interactions): Simulating user events\n\n';

	content += '## Migration Guide\n\n';
	content +=
		'- [From @testing-library/svelte](/docs/migration-guide): Complete step-by-step migration process\n';
	content +=
		'- [Common Patterns](/docs/migration-guide#patterns): Before/after code examples\n';
	content +=
		'- [Troubleshooting Migration](/docs/migration-guide#troubleshooting): Solving common migration issues\n\n';

	content += '## Best Practices\n\n';
	content +=
		'- [Foundation First Approach](/docs/best-practices#foundation-first): 100% test coverage strategy\n';
	content +=
		'- [Accessibility Testing](/docs/best-practices#accessibility): Semantic queries and ARIA testing\n';
	content +=
		'- [Performance Optimization](/docs/best-practices#performance): Fast test execution patterns\n';
	content +=
		'- [Team Collaboration](/docs/best-practices#team): AI assistant rules and conventions\n\n';

	content += '## Troubleshooting\n\n';
	content +=
		'- [Common Errors](/docs/troubleshooting#errors): Solutions for frequent issues\n';
	content +=
		'- [Environment Setup](/docs/troubleshooting#environment): Configuration problems\n';
	content +=
		'- [Browser Issues](/docs/troubleshooting#browser): Playwright and browser-specific fixes\n\n';

	content += '## Optional\n\n';
	content +=
		'- [Example Components](/examples): Live component implementations\n';
	content +=
		'- [GitHub Repository](https://github.com/spences10/sveltest): Full source code\n';
	content +=
		'- [Blog Post](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte): Migration story\n';

	return content;
}
```

## Page Load Function Pattern

Based on your test implementation, each documentation page will use
this pattern:

**src/routes/docs/[topic]/+page.ts**

```typescript
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const slug = params.topic || 'getting-started';
	try {
		const Copy = await import(`../../../copy/${slug}.md`);
		return {
			Copy: Copy.default,
			slug,
		};
	} catch (e) {
		error(404, `Documentation for "${slug}" not found`);
	}
};
```

**src/routes/docs/[topic]/+page.svelte**

```svelte
<script lang="ts">
	const { data } = $props();
	const { Copy, slug } = data;
</script>

<svelte:head>
	<title
		>{slug.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
		- Sveltest Docs</title
	>
</svelte:head>

<div class="prose prose-lg mx-auto max-w-4xl p-6">
	<Copy />
</div>

<style>
	/* Custom styling for your documentation */
	:global(.prose) {
		/* Your documentation styling */
	}
</style>
```

## Implementation Steps (Revised)

### Step 1: Create Central Content Directory

1. **Create `src/copy/` directory** for all markdown content
2. **Extract content from README.md** into topic-specific files
3. **Convert MIGRATION_GUIDE.md** content for migration-guide.md
4. **Extract patterns from docs page** into testing-patterns.md
5. **Document API patterns** from test files into api-reference.md

### Step 2: Create Documentation Routes

1. **Set up dynamic route** at `src/routes/docs/[topic]/`
2. **Create load function** that imports from `src/copy/`
3. **Style the documentation pages** with consistent design
4. **Add navigation** between documentation sections

### Step 3: Implement LLMs.txt Generation

1. **Create llms.txt server route** that generates index
2. **Create llms-full.txt server route** that includes all content
3. **Implement content aggregation** from centralized markdown files
4. **Add proper caching and headers**

### Step 4: Test and Validate

1. **Test llms.txt accessibility** at `/llms.txt`
2. **Test llms-full.txt accessibility** at `/llms-full.txt`
3. **Validate markdown structure** follows llms.txt specification
4. **Test with AI systems** (ChatGPT, Claude, Cursor)

## Benefits of This Approach

### Content Management

- **Single source of truth** - All content in `src/copy/`
- **Easy updates** - Change content once, updates everywhere
- **Version control** - Track content changes independently
- **Reusability** - Same content for web and AI consumption

### Developer Experience

- **Consistent styling** - Svelte components handle presentation
- **Type safety** - TypeScript for load functions
- **Hot reloading** - Changes to markdown files update immediately
- **SEO friendly** - Proper meta tags and semantic HTML

### AI Integration

- **Structured content** - Markdown format perfect for AI parsing
- **Context-aware** - Full content available in llms-full.txt
- **Discoverable** - Index in llms.txt for navigation
- **Standards compliant** - Follows llms.txt specification

## Next Immediate Steps

1. **Create `src/copy/` directory**
2. **Extract getting-started.md** from README content
3. **Set up first documentation route** to test the pattern
4. **Implement basic llms.txt generation**

This revised approach leverages your excellent separation of concerns
pattern and will be much more maintainable long-term!
