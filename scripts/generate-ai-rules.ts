#!/usr/bin/env tsx

import Anthropic from '@anthropic-ai/sdk';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANTHROPIC_CONFIG } from '../src/config/anthropic';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const STATIC_DIR = join(ROOT_DIR, 'static');
const PROMPTS_DIR = join(ROOT_DIR, 'prompts');

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

const is_dry_run = process.argv.includes('--dry-run');

async function load_prompt(variant: string): Promise<string> {
	try {
		const prompt_path = join(PROMPTS_DIR, `${variant}.md`);
		return await readFile(prompt_path, 'utf-8');
	} catch (error) {
		throw new Error(`Could not load prompt for ${variant}: ${error}`);
	}
}

async function load_documentation(): Promise<string> {
	try {
		const doc_path = join(STATIC_DIR, 'llms-full.txt');
		return await readFile(doc_path, 'utf-8');
	} catch (error) {
		throw new Error(`Could not load documentation: ${error}`);
	}
}

async function call_anthropic_streaming(
	prompt: string,
	variant: string,
): Promise<string> {
	console.log(`🚀 Starting generation for ${variant}...`);

	const stream = await anthropic.messages.stream({
		model: ANTHROPIC_CONFIG.model,
		max_tokens: ANTHROPIC_CONFIG.generation.max_tokens,
		messages: [{ role: 'user', content: prompt }],
	});

	let full_response = '';
	let char_count = 0;

	console.log(`📝 Generating ${variant}:`);

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

async function save_rules(
	content: string,
	filename: string,
): Promise<void> {
	if (is_dry_run) {
		console.log(
			`[DRY RUN] Would write ${content.length} characters to ${filename}`,
		);
		return;
	}

	const file_path = join(ROOT_DIR, filename);
	await writeFile(file_path, content);
	console.log(
		`✅ Generated ${filename} (${content.length} characters)`,
	);
}

async function main() {
	try {
		console.log('🤖 Sveltest AI Rules Generator\n');

		console.log('📖 Loading documentation...');
		const documentation = await load_documentation();
		console.log(`✅ Loaded ${documentation.length} characters`);

		console.log('📝 Loading prompts...');
		const rules_prompt = await load_prompt('ai-rules');
		const eval_prompt = await load_prompt('eval-ai-rules');
		console.log('✅ Prompts loaded');

		console.log('\n🔮 Generating AI rules...');
		const combined_prompt = `${rules_prompt}\n\n## Documentation to Process:\n\n${documentation}`;

		const start_time = Date.now();
		const generated_rules = await call_anthropic_streaming(
			combined_prompt,
			'ai-rules',
		);
		const duration = ((Date.now() - start_time) / 1000).toFixed(1);

		const char_count = generated_rules.length;
		console.log(
			`✅ Generated ${char_count} characters in ${duration}s`,
		);

		// Check character limit - fail immediately if exceeded
		if (char_count > 6000) {
			console.error(
				`❌ Rules exceed 6000 character limit (${char_count} chars)`,
			);
			console.error(
				'❌ Manual compression required or regenerate with stricter prompt',
			);
			process.exit(1);
		}

		console.log('\n🔍 Evaluating rules quality...');
		const evaluation_prompt = `${eval_prompt}\n\n${generated_rules}`;
		const evaluation = await call_anthropic_streaming(
			evaluation_prompt,
			'evaluation',
		);

		// Save files
		console.log('\n💾 Saving files...');

		// For Cursor: Use generated rules as-is (should include frontmatter)
		await save_rules(generated_rules, '.cursorrules');

		// For Windsurf: Strip frontmatter if present (6000 char limit)
		const windsurf_rules = generated_rules.startsWith('---')
			? generated_rules.replace(/^---[\s\S]*?---\s*/, '')
			: generated_rules;
		await save_rules(windsurf_rules, '.windsurfrules');

		if (!is_dry_run) {
			await save_rules(evaluation, 'scripts/last-evaluation.md');
		}

		// Display results
		console.log('\n📊 Evaluation Results:');
		console.log('─'.repeat(50));
		console.log(evaluation);

		if (char_count > 6000) {
			console.log(
				'\n❌ Rules exceed character limit - manual editing required',
			);
			process.exit(1);
		}

		console.log('\n✅ AI rules generation complete!');
	} catch (error) {
		console.error('❌ Error:', error.message);
		process.exit(1);
	}
}

main().catch(console.error);
