import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { content_map, topics } from './content';

export { topics };

// Function to load full content from preloaded markdown (no async needed!)
export function load_full_content(): string {
	let content = '# Sveltest Testing Documentation\n\n';
	content +=
		'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

	for (const topic of topics) {
		const md_content = content_map[topic.slug];
		if (md_content) {
			content += `\n# ${topic.title}\n\n`;
			content += md_content;
			content += '\n';
		} else {
			console.warn(`No content found for topic: ${topic.slug}`);
		}
	}

	return content;
}

// Load prompts from markdown files (for server-side use)
async function loadPrompts(): Promise<Record<string, string>> {
	const variants = [
		'llms',
		'llms-medium',
		'llms-small',
		'llms-api',
		'llms-examples',
		'llms-ctx',
	];
	const prompts: Record<string, string> = {};

	for (const variant of variants) {
		try {
			const promptPath = join(
				process.cwd(),
				'prompts',
				`${variant}.md`,
			);
			prompts[variant] = await readFile(promptPath, 'utf-8');
		} catch (error) {
			console.warn(`Could not load prompt for ${variant}:`, error);
		}
	}

	return prompts;
}

// Export the function for runtime loading
export async function getVariantPrompts() {
	return await loadPrompts();
}
