import type { Topic } from '$lib/data/topics';
import { topics } from '$lib/data/topics';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface GenerateLlmContentOptions {
	topics: Topic[];
	variant?: string;
}

export { topics };

// Prompts for each variant
const VARIANT_PROMPTS: Record<string, string> = {
	llms: `
		Create an index/navigation file for this testing documentation.
		
		Format as markdown with:
		- H1 title
		- Brief description in blockquote
		- H2 sections with bullet lists of links and descriptions
		- Include "Available LLM Documentation Formats" section listing all variants
		
		Keep it concise but comprehensive for navigation.
	`,

	'llms-full': `
		Combine all the provided documentation into a single comprehensive file.
		
		Format:
		- Start with main title and description
		- Include all content from each topic
		- Maintain original structure and examples
		- Keep all code blocks and technical details
		
		This is the complete reference version.
	`,

	'llms-medium': `
		Create a compressed version for medium context windows by processing the provided documentation.
		
		IMPORTANT: Return the actual compressed documentation content, NOT a description of what you did.
		
		Context: This works alongside llms-small.txt (essentials) and llms-api.txt (API only).
		
		Your role: Provide comprehensive but compressed content.
		
		Processing requirements:
		- Remove legacy sections and detailed notes
		- Keep core concepts and patterns
		- Maintain important examples (but shorten verbose ones)
		- Remove playground links and note blocks
		- Normalize excessive whitespace
		- Combine related sections where appropriate
		
		Target: ~50% of full content while keeping essential information.
		
		Start with the title "# Sveltest Testing Documentation" and provide the actual markdown content.
	`,

	'llms-small': `
		Create ultra-compressed essentials for small context windows.
		
		IMPORTANT: Return the actual compressed documentation content, NOT a description of what you did.
		
		Context: Other formats available are llms-medium.txt (detailed) and llms-api.txt (complete API).
		
		Your role: Absolute essentials only.
		
		Include ONLY:
		- Core imports and basic setup
		- Essential testing patterns (locators vs containers)
		- Critical gotchas and common errors
		- Basic code examples
		- Links to other formats
		
		Target: <10% of full content, maximum utility.
		
		Start with "# Sveltest Testing Documentation" and provide the actual markdown content.
	`,

	'llms-api': `
		Extract only API reference content from the provided documentation.
		
		IMPORTANT: Return the actual API reference content, NOT a description of what you did.
		
		Focus on:
		- Essential imports and functions
		- Locator methods and queries
		- Assertion patterns
		- User interaction methods
		- Mocking patterns
		- Code examples for each API
		
		Format as API reference with clear sections and code blocks.
		Remove conceptual explanations, keep technical reference.
		
		Start with "# Sveltest API Reference" and provide the actual markdown content.
	`,

	'llms-examples': `
		Extract and curate code examples only from the provided documentation.
		
		IMPORTANT: Return the actual code examples content, NOT a description of what you did.
		
		Create sections:
		- Basic component tests
		- Form testing patterns
		- State testing with runes
		- SSR testing examples
		- Mocking examples
		
		Each example should be complete and runnable.
		Include brief context but focus on the code.
		
		Start with "# Sveltest Code Examples" and provide the actual markdown content.
	`,

	'llms-ctx': `
		Create XML-structured content for Claude and similar models.
		
		Format as XML with:
		- <documentation> root
		- <core_concepts> with principles and examples
		- <code_examples> with working patterns
		- <common_errors> with solutions
		
		Do NOT include <references> section (that's for llms-ctx-full).
		Keep content concise but structured for AI consumption.
	`,

	'llms-ctx-full': `
		Create complete XML-structured content for Claude and similar models.
		
		Same as llms-ctx but include:
		- <references> section with links to other formats
		- More comprehensive examples
		- Additional context and details
		
		This is the full XML version for maximum AI utility.
	`,
};

export async function generate_llm_content(
	options: GenerateLlmContentOptions,
): Promise<string> {
	const variant = options.variant || 'llms';

	// Check for pre-generated static file first
	try {
		const static_path = join(
			process.cwd(),
			'static',
			`${variant}.txt`,
		);
		const static_content = await readFile(static_path, 'utf-8');
		return static_content;
	} catch {
		// File doesn't exist, continue with dynamic generation
	}

	if (variant === 'llms-full') {
		// For full version, combine all markdown files
		return await generate_full_content_from_markdown(options.topics);
	}

	// For other variants, return a placeholder that indicates generation is needed
	return `# ${variant.toUpperCase()} - Generation Required

> This content needs to be generated using the AI generation endpoint.

To generate this content:

1. Set LLM_GEN_SECRET environment variable
2. POST to /api/llm-txt-gen with:
   \`\`\`json
   {
     "variant": "${variant}",
     "auth": "your-secret-here"
   }
   \`\`\`

Variant: ${variant}
Available prompts: ${Object.keys(VARIANT_PROMPTS).join(', ')}
`;
}

async function generate_full_content_from_markdown(
	topics: Topic[],
): Promise<string> {
	let content = '# Sveltest Testing Documentation\n\n';
	content +=
		'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

	for (const topic of topics) {
		try {
			const markdown_module = await import(
				`../../copy/${topic.slug}.md?raw`
			);
			content += `\n# ${topic.title}\n\n`;
			content += markdown_module.default;
			content += '\n';
		} catch (error) {
			console.warn(
				`Could not load content for ${topic.slug}:`,
				error,
			);
		}
	}

	return content;
}

// Export prompts for the generation endpoint
export { VARIANT_PROMPTS };
