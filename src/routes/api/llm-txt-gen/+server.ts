import { dev } from '$app/environment';
import {
	ANTHROPIC_API_KEY,
	LLM_GEN_SECRET,
} from '$env/static/private';
import {
	ANTHROPIC_CONFIG,
	VARIANT_PROMPTS,
	topics,
} from '$lib/server/llms';
import { Anthropic } from '@anthropic-ai/sdk';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Only allow this route in development or when explicitly enabled
const is_llm_api_enabled =
	dev || process.env.ENABLE_LLM_API === 'true';

// Use dynamic imports only when needed (avoids Node.js modules in production)
const write_file = is_llm_api_enabled
	? (await import('node:fs/promises')).writeFile
	: null;
const join = is_llm_api_enabled
	? (await import('node:path')).join
	: null;

const anthropic = ANTHROPIC_API_KEY
	? new Anthropic({
			apiKey: ANTHROPIC_API_KEY,
		})
	: null;

export const POST: RequestHandler = async ({ request }) => {
	// Block in production unless explicitly enabled
	if (!is_llm_api_enabled) {
		return json(
			{
				error: 'LLM generation API is disabled in production',
				message:
					'The generated files are served statically from /static/',
			},
			{ status: 404 },
		);
	}

	// Ensure we have the required dependencies
	if (!write_file || !join || !anthropic) {
		return json(
			{ error: 'LLM API dependencies not available' },
			{ status: 500 },
		);
	}

	try {
		const { variant, auth } = await request.json();

		// Security check
		if (auth !== LLM_GEN_SECRET) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Handle llms-full separately (no LLM needed - just concatenate markdown)
		if (variant === 'llms-full') {
			let generated_content = '# Sveltest Testing Documentation\n\n';
			generated_content +=
				'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

			for (const topic of topics) {
				try {
					const markdown_module = await import(
						`../../../copy/${topic.slug}.md?raw`
					);
					generated_content += `\n# ${topic.title}\n\n`;
					generated_content += markdown_module.default;
					generated_content += '\n';
				} catch (error) {
					console.warn(
						`Could not load content for ${topic.slug}:`,
						error,
					);
				}
			}

			// Write to static directory for serving
			const filename = `${variant}.txt`;
			const filepath = join(process.cwd(), 'static', filename);
			await write_file(filepath, generated_content, 'utf-8');

			return json({
				success: true,
				variant,
				filename,
				length: generated_content.length,
			});
		}

		// Validate variant
		if (!VARIANT_PROMPTS[variant]) {
			return json(
				{ error: `Unknown variant: ${variant}` },
				{ status: 400 },
			);
		}

		// Load all markdown content
		const markdown_content = await load_all_markdown();

		// Generate content with Anthropic using centralized config
		const prompt = `${VARIANT_PROMPTS[variant]}

Documentation to process:

${markdown_content}`;

		const stream = await anthropic.messages.create({
			model: ANTHROPIC_CONFIG.model,
			max_tokens: ANTHROPIC_CONFIG.generation.max_tokens,
			stream: ANTHROPIC_CONFIG.generation.stream,
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
		});

		let generated_content = '';
		for await (const chunk of stream) {
			if (
				chunk.type === 'content_block_delta' &&
				chunk.delta.type === 'text_delta'
			) {
				generated_content += chunk.delta.text;
			}
		}

		// Write to static directory for serving
		const filename = `${variant}.txt`;
		const filepath = join(process.cwd(), 'static', filename);
		await write_file(filepath, generated_content, 'utf-8');

		return json({
			success: true,
			variant,
			filename,
			length: generated_content.length,
		});
	} catch (error) {
		console.error('Generation error:', error);
		return json(
			{
				error: 'Generation failed',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
};

async function load_all_markdown(): Promise<string> {
	let content = '';

	for (const topic of topics) {
		try {
			const markdown_module = await import(
				`../../../copy/${topic.slug}.md?raw`
			);
			content += `\n# ${topic.title}\n\n`;
			content += markdown_module.default;
			content += '\n\n---\n\n';
		} catch (error) {
			console.warn(
				`Could not load content for ${topic.slug}:`,
				error,
			);
		}
	}

	return content;
}
