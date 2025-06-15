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
		
		CRITICAL: You must return ONLY the actual navigation documentation content as markdown. Do NOT include any meta-commentary or explanations.
		
		Format as markdown with:
		- H1 title: "# Sveltest Testing Documentation"
		- Brief description in blockquote explaining this is for vitest-browser-svelte testing
		- H2 "Core Testing Documentation" section with bullet lists of main topics and descriptions
		- H2 "Additional Resources" section with supplementary topics
		- H2 "Available LLM Documentation Formats" section listing all variants with brief descriptions of each format's purpose
		- Include cross-references and links where appropriate
		
		Keep it concise but comprehensive for navigation. Focus on being a useful index that helps users find what they need.
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
		
		CRITICAL: You must return ONLY the actual compressed documentation content as markdown. Do NOT include any meta-commentary, explanations of what you did, or descriptions of the process.
		
		Context: This works alongside llms-small.txt (essentials) and llms-api.txt (API only).
		
		Your role: Provide comprehensive but compressed content that includes:
		- Complete setup and installation instructions
		- Core testing patterns with DO/DON'T examples
		- Essential imports and basic test structure
		- Form testing patterns and common pitfalls
		- SSR testing basics
		- Error handling and troubleshooting
		- Cross-references to other documentation formats
		
		Processing requirements:
		- Remove legacy sections and detailed notes
		- Keep core concepts and patterns
		- Maintain important examples (but shorten verbose ones)
		- Remove playground links and note blocks
		- Normalize excessive whitespace
		- Combine related sections where appropriate
		- Include async/await patterns and loading states
		- Add brief mocking examples
		
		Target: ~50% of full content while keeping essential information.
		
		Start with the title "# Sveltest Testing Documentation" and provide the actual markdown content.
	`,

	'llms-small': `
		Create ultra-compressed essentials for small context windows.
		
		CRITICAL: You must return ONLY the actual compressed documentation content as markdown. Do NOT include any meta-commentary, explanations of what you did, or descriptions of the process.
		
		Context: Other formats available are llms-medium.txt (detailed) and llms-api.txt (complete API).
		
		Your role: Absolute essentials only.
		
		Include ONLY:
		- Core imports and basic setup (describe/test structure)
		- Essential testing patterns (locators vs containers with clear examples)
		- Critical gotchas and common errors with solutions
		- Basic code examples for first component test
		- Form testing warnings and patterns
		- Basic assertions (expect.element syntax)
		- Links to other formats
		
		Target: <10% of full content, maximum utility.
		
		Start with "# Sveltest Testing Documentation" and provide the actual markdown content.
	`,

	'llms-api': `
		Extract only API reference content from the provided documentation.
		
		CRITICAL: You must return ONLY the actual API reference content as markdown. Do NOT include any meta-commentary or explanations of what you did.
		
		Focus on:
		- Essential imports and functions with exact syntax
		- Locator methods and queries (getByRole, getByText, etc.)
		- Assertion patterns (expect.element syntax)
		- User interaction methods (click, fill, etc.)
		- Mocking patterns and setup
		- SSR testing methods
		- Code examples for each API method
		- Common error handling patterns
		- Setup and teardown patterns
		
		Format as API reference with clear sections and code blocks.
		Remove conceptual explanations, keep technical reference.
		Include parameter types and return values where relevant.
		
		Start with "# Sveltest API Reference" and provide the actual markdown content.
	`,

	'llms-examples': `
		Extract and curate code examples only from the provided documentation.
		
		CRITICAL: You must return ONLY the actual code examples content as markdown. Do NOT include any meta-commentary or explanations of what you did.
		
		Create sections with complete, runnable examples:
		- Basic component tests (render, click, assertions)
		- Form testing patterns (input filling, validation, submission)
		- State testing with runes ($state, $derived, untrack)
		- SSR testing examples (server-side rendering)
		- Mocking examples (utilities, components, context)
		- Error handling and troubleshooting examples
		- Async testing patterns
		
		Each example should be complete and runnable with:
		- Necessary imports
		- Full test structure (describe/test blocks)
		- Clear assertions
		- Brief context explaining the scenario
		
		Focus on practical, copy-paste ready code examples.
		
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
