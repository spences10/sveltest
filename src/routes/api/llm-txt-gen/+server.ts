import { ANTHROPIC_API_KEY, LLM_GEN_SECRET } from '$env/static/private';
import { VARIANT_PROMPTS, topics } from '$lib/server/llms';
import { Anthropic } from '@anthropic-ai/sdk';
import { json } from '@sveltejs/kit';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY,
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { variant, auth } = await request.json();

		// Security check
		if (auth !== LLM_GEN_SECRET) {
			return json({ error: 'Unauthorized' }, { status: 401 });
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

		// Generate content with Anthropic
		const prompt = `${VARIANT_PROMPTS[variant]}

Documentation to process:

${markdown_content}`;

		const message = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 8000,
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
		});

		const generated_content =
			message.content[0].type === 'text'
				? message.content[0].text
				: '';

		// Write to static directory for serving
		const filename = `${variant}.txt`;
		const filepath = join(process.cwd(), 'static', filename);
		await writeFile(filepath, generated_content, 'utf-8');

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
