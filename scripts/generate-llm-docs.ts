#!/usr/bin/env tsx

import Anthropic from '@anthropic-ai/sdk';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANTHROPIC_CONFIG } from '../src/config/anthropic';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const STATIC_DIR = join(ROOT_DIR, 'static');
const PROMPTS_DIR = join(ROOT_DIR, 'prompts');

// Topics list (avoiding Vite imports)
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

// Load prompts from markdown files
async function load_prompts(): Promise<Record<string, string>> {
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
			const prompt_path = join(PROMPTS_DIR, `${variant}.md`);
			prompts[variant] = await readFile(prompt_path, 'utf-8');
		} catch (error) {
			console.warn(`Could not load prompt for ${variant}:`, error);
		}
	}

	return prompts;
}

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
	prompts: Record<string, string>,
): Promise<string> {
	if (variant === 'llms-full') {
		// Full version is just the complete source content - NO API CALL
		console.log(
			`📄 Using full source content for ${variant} (${source_content.length} chars)`,
		);
		return source_content;
	}

	const prompt = prompts[variant];
	if (!prompt) {
		throw new Error(
			`Unknown variant: ${variant} - available: ${Object.keys(prompts).join(', ')}`,
		);
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

		console.log('📝 Loading prompts...');
		const prompts = await load_prompts();
		console.log(`✅ Loaded ${Object.keys(prompts).length} prompts`);

		console.log('📚 Loading markdown content...');
		const source_content = await load_markdown_content(topics);
		console.log(
			`✅ Loaded ${source_content.length} characters from ${topics.length} topics`,
		);

		// Generate all variants (including llms-full which needs no API call)
		const variants = [...Object.keys(prompts), 'llms-full'];
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
					prompts,
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
