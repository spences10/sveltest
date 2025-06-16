#!/usr/bin/env tsx

import Anthropic from '@anthropic-ai/sdk';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	ANTHROPIC_CONFIG,
	topics,
	VARIANT_PROMPTS,
} from '../src/lib/server/llms.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const STATIC_DIR = join(ROOT_DIR, 'static');

// Initialize Anthropic client
const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

if (!process.env.ANTHROPIC_API_KEY) {
	console.error(
		'Error: ANTHROPIC_API_KEY environment variable is required',
	);
	process.exit(1);
}

interface Topic {
	title: string;
	slug: string;
}

async function load_markdown_content(
	topics: Topic[],
): Promise<string> {
	let content = '# Sveltest Testing Documentation\n\n';
	content +=
		'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

	for (const topic of topics) {
		try {
			const md_path = join(
				ROOT_DIR,
				'src',
				'copy',
				`${topic.slug}.md`,
			);
			const md_content = await readFile(md_path, 'utf-8');
			content += `\n# ${topic.title}\n\n`;
			content += md_content;
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

async function call_anthropic_streaming(
	prompt: string,
	content: string,
	variant: string,
): Promise<string> {
	console.log(`🚀 Starting generation for ${variant}...`);

	const stream = await anthropic.messages.stream({
		model: ANTHROPIC_CONFIG.model,
		max_tokens: ANTHROPIC_CONFIG.generation.max_tokens,
		messages: [
			{
				role: 'user',
				content: `${prompt}\n\nDocumentation content:\n\n${content}`,
			},
		],
	});

	let full_response = '';
	let char_count = 0;

	console.log(`📝 Generating ${variant} content:`);

	stream.on('text', (text) => {
		full_response += text;
		char_count += text.length;

		// Show progress every 100 characters
		if (char_count % 100 === 0 || text.includes('\n')) {
			process.stdout.write('.');
		}
	});

	await stream.finalMessage();

	console.log(
		`\n✅ Generated ${char_count} characters for ${variant}`,
	);
	return full_response;
}

async function generate_variant(
	variant: string,
	source_content: string,
): Promise<string> {
	if (variant === 'llms-full') {
		// Full version is just the complete source content
		console.log(
			`📄 Using full source content for ${variant} (${source_content.length} chars)`,
		);
		return source_content;
	}

	const prompt = VARIANT_PROMPTS[variant];
	if (!prompt) {
		throw new Error(`Unknown variant: ${variant}`);
	}

	return await call_anthropic_streaming(
		prompt,
		source_content,
		variant,
	);
}

async function main() {
	try {
		console.log('🔧 Setting up directories...');
		await mkdir(STATIC_DIR, { recursive: true });

		console.log('📚 Loading markdown content...');
		const source_content = await load_markdown_content(topics);
		console.log(
			`✅ Loaded ${source_content.length} characters from ${topics.length} topics`,
		);

		// Generate all variants
		const variants = Object.keys(VARIANT_PROMPTS);
		console.log(
			`\n🎯 Generating ${variants.length} variants: ${variants.join(', ')}\n`,
		);

		for (let i = 0; i < variants.length; i++) {
			const variant = variants[i];
			console.log(
				`\n[${i + 1}/${variants.length}] Processing ${variant}:`,
			);

			try {
				const start_time = Date.now();
				const generated_content = await generate_variant(
					variant,
					source_content,
				);
				const duration = ((Date.now() - start_time) / 1000).toFixed(
					1,
				);

				const output_path = join(STATIC_DIR, `${variant}.txt`);
				await writeFile(output_path, generated_content, 'utf-8');

				console.log(
					`✅ Saved ${variant}.txt (${generated_content.length} chars, ${duration}s)`,
				);
			} catch (error) {
				console.error(`❌ Failed to generate ${variant}:`, error);
			}
		}

		console.log(`\n🎉 All variants generated successfully!`);
		console.log(`📁 Files saved to: ${STATIC_DIR}`);
	} catch (error) {
		console.error('💥 Error:', error);
		process.exit(1);
	}
}

main();
