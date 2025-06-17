#!/usr/bin/env tsx

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const STATIC_DIR = join(ROOT_DIR, 'static');
const COPY_DIR = join(ROOT_DIR, 'src', 'copy');

// Topics list (local copy to avoid import issues)
const topics = [
	{ title: 'Getting Started', slug: 'getting-started' },
	{ title: 'Testing Patterns', slug: 'testing-patterns' },
	{ title: 'Best Practices', slug: 'best-practices' },
	{ title: 'API Reference', slug: 'api-reference' },
	{ title: 'Migration Guide', slug: 'migration-guide' },
	{ title: 'E2E Testing', slug: 'e2e-testing' },
	{ title: 'CI/CD', slug: 'ci-cd' },
	{ title: 'Troubleshooting', slug: 'troubleshooting' },
	{ title: 'About', slug: 'about' },
];

// Function to load full content from markdown files (Node.js version)
async function load_full_content(): Promise<string> {
	let content = '# Sveltest Testing Documentation\n\n';
	content +=
		'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

	for (const topic of topics) {
		try {
			const md_path = join(COPY_DIR, `${topic.slug}.md`);
			const md_content = await readFile(md_path, 'utf-8');
			content += `\n# ${topic.title}\n\n`;
			content += md_content;
			content += '\n';
		} catch (error) {
			console.warn(`No content found for topic: ${topic.slug}`);
		}
	}

	return content;
}

// Generate standard llms.txt (index file)
function generate_llms_index(): string {
	return `# Sveltest Testing Documentation

> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.

## Core Testing Documentation

### Getting Started
- **Setup & Installation** - Configure vitest-browser-svelte with multi-project setup supporting the Client-Server Alignment Strategy
- **First Component Test** - Write your first test with locators, event handling, and proper assertions
- **Essential Patterns** - Foundation First approach, always use locators (never containers), handle strict mode violations
- **Common Issues** - Resolve "strict mode violation" errors, role confusion, and form submission hangs

### Testing Patterns
- **Component Testing** - Button, input, modal, dropdown patterns with Svelte 5 runes support
- **Locator Strategies** - Semantic queries (preferred), handling multiple elements, role confusion fixes
- **Form Validation** - Complete lifecycle testing (valid → validate → invalid → fix → valid)
- **Integration Testing** - Form submission flows, todo lists, navigation patterns
- **Svelte 5 Runes** - Testing $state, $derived with untrack(), effect patterns
- **SSR Testing** - When to add SSR tests, basic patterns, layout and content validation
- **Server Testing** - API routes with real FormData/Request objects (Client-Server Alignment)

### Best Practices  
- **Foundation First Approach** - Strategic test planning with describe/it.skip structure
- **Client-Server Alignment Strategy** - Four-layer testing approach minimizing mocking for reliable integration
- **Accessibility Testing** - Semantic queries priority, ARIA testing, keyboard navigation
- **Error Handling** - Robust error testing, edge cases, performance patterns
- **Mocking Strategy** - Smart mocking (external services) vs keeping data contracts real

## Additional Resources

### Migration & Setup
- **Migration Guide** - Step-by-step migration from @testing-library/svelte with common pitfalls and solutions
- **API Reference** - Complete reference for locators, assertions, interactions, and configuration
- **Troubleshooting** - Common errors, browser issues, mocking problems, and debugging strategies

### Advanced Topics
- **E2E Testing** - Complete user journey validation as final safety net for Client-Server Alignment
- **CI/CD** - Production-ready pipelines with Playwright containers, caching, and environment configuration

### Project Information
- **About** - Community-driven development, battle-tested production patterns, AI assistant rules

## Available LLM Documentation Formats

### Primary Documentation
- **Markdown Documentation** - Complete human-readable guides with examples and best practices
- **Testing Rules (MDC)** - Comprehensive AI assistant rules for consistent team adoption across Cursor, Windsurf, and other AI editors

### Code Examples
- **Live Component Examples** - Working Svelte components with accompanying test files demonstrating real-world patterns
- **Reference Implementations** - Production-ready code patterns you can copy and adapt

### Configuration Templates  
- **Vitest Configuration** - Multi-project setup supporting client, server, and SSR testing strategies
- **CI/CD Workflows** - GitHub Actions workflows with Playwright containers and proper caching

Cross-references: [Getting Started](./getting-started.md) → [Testing Patterns](./testing-patterns.md) → [Best Practices](./best-practices.md) → [Migration Guide](./migration-guide.md) → [API Reference](./api-reference.md)`;
}

async function main() {
	try {
		console.log('🔧 Generating simplified llms.txt files...\n');

		// Generate llms.txt (index)
		console.log('📄 Generating llms.txt (index)...');
		const index_content = generate_llms_index();
		const index_path = join(STATIC_DIR, 'llms.txt');
		await writeFile(index_path, index_content, 'utf-8');
		console.log(
			`✅ Generated llms.txt (${index_content.length} characters)`,
		);

		// Generate llms-full.txt (complete documentation)
		console.log('📄 Generating llms-full.txt (complete)...');
		const full_content = await load_full_content();
		const full_path = join(STATIC_DIR, 'llms-full.txt');
		await writeFile(full_path, full_content, 'utf-8');
		console.log(
			`✅ Generated llms-full.txt (${full_content.length} characters)`,
		);

		console.log('\n🎉 LLMs files generated successfully!');
		console.log(`📁 Files saved to: ${STATIC_DIR}`);
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

main().catch(console.error);
