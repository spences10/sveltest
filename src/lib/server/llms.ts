import type { Topic } from '$lib/data/topics';
import { topics } from '$lib/data/topics';

interface GenerateLlmContentOptions {
	topics: Topic[];
	include_full_content?: boolean;
	minimize?: boolean;
}

export { topics };

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
