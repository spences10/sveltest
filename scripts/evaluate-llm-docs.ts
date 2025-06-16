#!/usr/bin/env tsx

import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	ANTHROPIC_CONFIG,
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

const EVALUATION_CRITERIA = {
	llms: {
		name: 'Navigation Index',
		criteria: [
			'Has clear H1 title "# Sveltest Testing Documentation"',
			'Contains blockquote description about vitest-browser-svelte',
			'Has "Core Testing Documentation" section with bullet lists',
			'Has "Additional Resources" section',
			'Has "Available LLM Documentation Formats" section',
			'Includes cross-references and links',
			'Is concise but comprehensive for navigation',
		],
	},
	'llms-full': {
		name: 'Complete Documentation',
		criteria: [
			'Combines all provided documentation',
			'Maintains original structure and examples',
			'Keeps all code blocks and technical details',
			'Has proper title and description',
			'Is comprehensive and complete',
		],
	},
	'llms-medium': {
		name: 'Compressed Medium Format',
		criteria: [
			'Approximately 50% of full content',
			'Includes complete setup instructions',
			"Has core testing patterns with DO/DON'T examples",
			'Contains essential imports and test structure',
			'Includes form testing patterns and pitfalls',
			'Has SSR testing basics',
			'Contains error handling and troubleshooting',
			'No meta-commentary, just content',
		],
	},
	'llms-small': {
		name: 'Ultra-compressed Essentials',
		criteria: [
			'Less than 10% of full content',
			'Core imports and basic setup only',
			'Essential testing patterns (locators vs containers)',
			'Critical gotchas and solutions',
			'Basic code examples for first component test',
			'Form testing warnings',
			'Basic assertions (expect.element syntax)',
			'Links to other formats',
		],
	},
	'llms-api': {
		name: 'API Reference',
		criteria: [
			'Focus on API reference content only',
			'Essential imports and functions with exact syntax',
			'Locator methods and queries documentation',
			'Assertion patterns with examples',
			'User interaction methods',
			'Mocking patterns and setup',
			'SSR testing methods',
			'No conceptual explanations, technical reference only',
		],
	},
	'llms-examples': {
		name: 'Code Examples Collection',
		criteria: [
			'Complete, runnable examples only',
			'Basic component tests with render/click/assertions',
			'Form testing patterns',
			'State testing with runes',
			'SSR testing examples',
			'Mocking examples',
			'Each example has necessary imports',
			'Clear test structure (describe/test blocks)',
		],
	},
	'llms-ctx': {
		name: 'XML Structured Format',
		criteria: [
			'Proper XML structure with <documentation> root',
			'<core_concepts> section with principles',
			'<code_examples> section with working patterns',
			'<common_errors> section with solutions',
			'<references> section with links',
			'Well-formed XML for AI consumption',
		],
	},
};

async function evaluate_content(
	variant: string,
	content: string,
): Promise<string> {
	const criteria =
		EVALUATION_CRITERIA[variant as keyof typeof EVALUATION_CRITERIA];
	if (!criteria) {
		throw new Error(`No evaluation criteria for variant: ${variant}`);
	}

	const evaluation_prompt = `
You are evaluating generated documentation for quality and adherence to requirements.

VARIANT: ${criteria.name}
ORIGINAL PROMPT: ${VARIANT_PROMPTS[variant]}

EVALUATION CRITERIA:
${criteria.criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Please evaluate the following content and provide:
1. SCORE: Rate 1-10 for overall quality and requirement adherence
2. STRENGTHS: What the content does well
3. ISSUES: What needs improvement
4. MISSING: Required elements that are missing
5. RECOMMENDATIONS: Specific suggestions for improvement

Be specific and constructive in your feedback.

CONTENT TO EVALUATE:
${content}
`;

	console.log(`🔍 Evaluating ${variant}...`);

	const message = await anthropic.messages.create({
		model: ANTHROPIC_CONFIG.model,
		max_tokens: ANTHROPIC_CONFIG.evaluation.max_tokens,
		messages: [
			{
				role: 'user',
				content: evaluation_prompt,
			},
		],
	});

	return message.content[0].type === 'text'
		? message.content[0].text
		: '';
}

async function main() {
	const args = process.argv.slice(2);
	const target_variant = args[0]; // Optional: evaluate specific variant

	try {
		console.log('📋 Starting LLM Documentation Evaluation\n');

		const variants = target_variant
			? [target_variant]
			: Object.keys(EVALUATION_CRITERIA);

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

				const start_time = Date.now();
				const evaluation = await evaluate_content(variant, content);
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
