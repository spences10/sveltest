#!/usr/bin/env tsx

import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANTHROPIC_CONFIG } from '../src/config/anthropic';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const STATIC_DIR = join(ROOT_DIR, 'static');
const PROMPTS_DIR = join(ROOT_DIR, 'prompts');

// Load prompts from markdown files (same as generation script)
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

// Load evaluation prompts from markdown files
async function load_eval_prompts(): Promise<Record<string, string>> {
	const variants = [
		'llms',
		'llms-medium',
		'llms-small',
		'llms-api',
		'llms-examples',
		'llms-ctx',
	];
	const eval_prompts: Record<string, string> = {};

	for (const variant of variants) {
		try {
			const eval_prompt_path = join(
				PROMPTS_DIR,
				`eval-${variant}.md`,
			);
			eval_prompts[variant] = await readFile(
				eval_prompt_path,
				'utf-8',
			);
		} catch (error) {
			console.warn(
				`Could not load eval prompt for ${variant}:`,
				error,
			);
		}
	}

	return eval_prompts;
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

async function evaluate_content(
	variant: string,
	content: string,
	original_prompt: string,
	eval_prompt: string,
): Promise<string> {
	const evaluation_prompt = `${eval_prompt}

ORIGINAL GENERATION PROMPT:
${original_prompt}

CONTENT TO EVALUATE:
${content}
`;

	console.log(`🔍 Evaluating ${variant}...`);

	// Use streaming API like the generation script
	const stream = await anthropic.messages.stream({
		model: ANTHROPIC_CONFIG.model,
		max_tokens: ANTHROPIC_CONFIG.evaluation.max_tokens,
		messages: [
			{
				role: 'user',
				content: evaluation_prompt,
			},
		],
	});

	let full_response = '';
	let char_count = 0;

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
		`\n📝 Generated ${char_count} characters of evaluation`,
	);
	return full_response;
}

async function main() {
	const args = process.argv.slice(2);
	const target_variant = args[0]; // Optional: evaluate specific variant

	try {
		console.log('📋 Starting LLM Documentation Evaluation\n');

		console.log('📝 Loading prompts...');
		const variant_prompts = await load_prompts();
		console.log(
			`✅ Loaded ${Object.keys(variant_prompts).length} generation prompts`,
		);

		console.log('📝 Loading evaluation prompts...');
		const eval_prompts = await load_eval_prompts();
		console.log(
			`✅ Loaded ${Object.keys(eval_prompts).length} evaluation prompts`,
		);

		const variants = target_variant
			? [target_variant]
			: Object.keys(variant_prompts).filter((v) => eval_prompts[v]); // Only variants with eval prompts

		console.log(
			`🎯 Evaluating ${variants.length} variant(s): ${variants.join(', ')}\n`,
		);

		for (let i = 0; i < variants.length; i++) {
			const variant = variants[i];
			console.log(
				`\n[${i + 1}/${variants.length}] Evaluating ${variant}:`,
			);

			try {
				const file_path = join(STATIC_DIR, `${variant}.txt`);
				const content = await readFile(file_path, 'utf-8');

				console.log(
					`📄 Loaded ${content.length} characters from ${variant}.txt`,
				);

				const original_prompt =
					variant_prompts[variant] || 'No generation prompt found';
				const eval_prompt = eval_prompts[variant];

				if (!eval_prompt) {
					console.error(
						`❌ No evaluation prompt found for ${variant} - skipping`,
					);
					continue;
				}

				const start_time = Date.now();
				const evaluation = await evaluate_content(
					variant,
					content,
					original_prompt,
					eval_prompt,
				);
				const duration = ((Date.now() - start_time) / 1000).toFixed(
					1,
				);

				console.log(
					`\n📊 EVALUATION RESULTS for ${variant.toUpperCase()}:`,
				);
				console.log('─'.repeat(50));
				console.log(evaluation);
				console.log('─'.repeat(50));
				console.log(`⏱️  Evaluation completed in ${duration}s\n`);
			} catch (error) {
				if (
					error instanceof Error &&
					error.message.includes('ENOENT')
				) {
					console.error(
						`❌ File not found: ${variant}.txt - run generation first`,
					);
				} else {
					console.error(`❌ Failed to evaluate ${variant}:`, error);
				}
			}
		}

		console.log('🎉 Evaluation complete!');
	} catch (error) {
		console.error('💥 Error:', error);
		process.exit(1);
	}
}

main();
