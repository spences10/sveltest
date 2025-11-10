#!/usr/bin/env tsx

import Anthropic from '@anthropic-ai/sdk';
import {
	ANTHROPIC_CONFIG,
	get_api_key,
} from '../config/anthropic.js';
import { logger } from '../utils/logger.js';

/**
 * Fetch official documentation for validation sources
 *
 * Uses Haiku 4.5 for fast, cost-effective web searches
 */

const anthropic = new Anthropic({
	apiKey: get_api_key(),
});

interface DocSource {
	name: string;
	search_query: string;
	key_topics: string[];
}

const DOC_SOURCES: DocSource[] = [
	{
		name: 'Vitest Browser Mode',
		search_query:
			'vitest browser mode testing locators page.getBy official docs',
		key_topics: [
			'browser mode setup',
			'locator patterns',
			'assertions',
			'page.getBy* methods',
		],
	},
	{
		name: 'vitest-browser-svelte',
		search_query:
			'vitest-browser-svelte render component testing official',
		key_topics: [
			'render function',
			'component testing',
			'best practices',
		],
	},
	{
		name: 'Playwright Locators',
		search_query:
			'playwright locators getByRole getByTestId best practices official docs',
		key_topics: [
			'locator strategies',
			'strict mode',
			'first() nth() last()',
			'accessibility',
		],
	},
	{
		name: 'Svelte 5 Testing',
		search_query:
			'svelte 5 testing runes $state $derived untrack official',
		key_topics: ['runes testing', 'untrack()', '$derived', '$state'],
	},
	{
		name: 'SvelteKit Testing',
		search_query:
			'sveltekit testing server routes FormData Request official',
		key_topics: [
			'server route testing',
			'FormData',
			'Request/Response',
		],
	},
];

async function fetch_doc_content(source: DocSource): Promise<string> {
	logger.progress(`Fetching ${source.name}`);

	try {
		// Use web search to find official documentation
		const response = await anthropic.messages.create({
			model: ANTHROPIC_CONFIG.haiku.model,
			max_tokens: ANTHROPIC_CONFIG.haiku.max_tokens,
			temperature: ANTHROPIC_CONFIG.haiku.temperature,
			messages: [
				{
					role: 'user',
					content: `Find and summarize official documentation for: ${source.search_query}

Focus on these topics:
${source.key_topics.map((topic) => `- ${topic}`).join('\n')}

Provide:
1. Official documentation URL(s)
2. Key best practices
3. Common anti-patterns to avoid
4. Current API recommendations (not deprecated)

Format as markdown. Be concise but comprehensive.`,
				},
			],
		});

		logger.progress_done();

		const content =
			response.content[0].type === 'text'
				? response.content[0].text
				: '';

		return `# ${source.name}\n\n${content}`;
	} catch (error) {
		logger.error(
			`Failed to fetch ${source.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
		return `# ${source.name}\n\n_Failed to fetch documentation_`;
	}
}

export async function fetch_all_official_docs(): Promise<string> {
	logger.header('Fetching Official Documentation');

	const doc_contents: string[] = [];

	for (const source of DOC_SOURCES) {
		const content = await fetch_doc_content(source);
		doc_contents.push(content);

		// Small delay to avoid rate limiting
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	logger.success(
		`Fetched ${DOC_SOURCES.length} documentation sources`,
	);

	return doc_contents.join('\n\n---\n\n');
}

// Export for standalone usage
if (import.meta.url === `file://${process.argv[1]}`) {
	fetch_all_official_docs()
		.then((docs) => {
			console.log(docs);
		})
		.catch((error) => {
			logger.error(`Failed: ${error.message}`);
			process.exit(1);
		});
}
