import {
	ANTHROPIC_API_KEY,
	LLM_GEN_SECRET,
} from '$env/static/private';
import { ANTHROPIC_CONFIG, VARIANT_PROMPTS } from '$lib/server/llms';
import { Anthropic } from '@anthropic-ai/sdk';
import { json } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { RequestHandler } from './$types';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY,
});

const EVAL_PROMPTS = {
	completeness: `
		Rate how well this llms.txt variant covers the essential information for its intended use case.
		
		Variant: {variant}
		Original prompt: {originalPrompt}
		
		Content to evaluate:
		{content}
		
		Score 1-10 and provide specific feedback on:
		1. Coverage of essential topics
		2. Missing critical information
		3. Appropriate level of detail for the variant
		4. Overall usefulness
		
		Format: Score: X/10, Feedback: [detailed feedback]
	`,

	consistency: `
		Compare these two llms.txt variants for consistency in terminology, examples, and approach.
		
		Variant A ({variantA}):
		{contentA}
		
		Variant B ({variantB}):
		{contentB}
		
		Evaluate:
		1. Consistent terminology and naming
		2. Compatible examples and patterns
		3. Coherent cross-references
		4. No contradictory information
		
		Score 1-10 and explain any inconsistencies found.
	`,

	usability: `
		You are an AI assistant helping a developer use this testing documentation.
		
		Test these questions against the content:
		1. How do I write my first component test?
		2. What's the difference between locators and containers?
		3. How do I test SSR?
		4. How do I handle form testing?
		5. What are common testing errors to avoid?
		
		Content ({variant}):
		{content}
		
		For each question, rate how well you can answer it from the content (1-10).
		Provide overall usability score and specific gaps.
	`,

	compression_quality: `
		Evaluate how well this compressed variant maintains essential information.
		
		Original full content length: {fullLength} characters
		Compressed variant ({variant}) length: {compressedLength} characters
		Compression ratio: {ratio}%
		
		Compressed content:
		{content}
		
		Evaluate:
		1. Are the most important concepts preserved?
		2. Are examples still useful and complete?
		3. Is the compression appropriate for the target use case?
		4. What critical information was lost?
		
		Score 1-10 and provide compression quality feedback.
	`,
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { type, variants, auth } = await request.json();

		// Security check
		if (auth !== LLM_GEN_SECRET) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		let results = {};

		switch (type) {
			case 'completeness':
				results = await evaluate_completeness(variants);
				break;
			case 'consistency':
				results = await evaluate_consistency(variants);
				break;
			case 'usability':
				results = await evaluate_usability(variants);
				break;
			case 'compression':
				results = await evaluate_compression(variants);
				break;
			case 'full_suite':
				results = await run_full_eval_suite(variants);
				break;
			default:
				return json(
					{ error: `Unknown eval type: ${type}` },
					{ status: 400 },
				);
		}

		return json({ success: true, type, results });
	} catch (error) {
		console.error('Eval error:', error);
		return json(
			{
				error: 'Evaluation failed',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
};

async function evaluate_completeness(variants: string[]) {
	const results: Record<string, any> = {};

	for (const variant of variants) {
		try {
			const content = await read_variant_file(variant);
			const original_prompt =
				VARIANT_PROMPTS[variant] || 'No prompt found';

			const prompt = EVAL_PROMPTS.completeness
				.replace('{variant}', variant)
				.replace('{originalPrompt}', original_prompt)
				.replace('{content}', content);

			const evaluation = await run_evaluation(prompt);
			results[variant] = evaluation;
		} catch (error) {
			results[variant] = {
				error: `Failed to evaluate ${variant}: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	}

	return results;
}

async function evaluate_consistency(variants: string[]) {
	const results: Record<string, any> = {};

	// Compare each pair of variants
	for (let i = 0; i < variants.length; i++) {
		for (let j = i + 1; j < variants.length; j++) {
			const variant_a = variants[i];
			const variant_b = variants[j];
			const pair_key = `${variant_a}_vs_${variant_b}`;

			try {
				const content_a = await read_variant_file(variant_a);
				const content_b = await read_variant_file(variant_b);

				const prompt = EVAL_PROMPTS.consistency
					.replace('{variantA}', variant_a)
					.replace('{variantB}', variant_b)
					.replace('{contentA}', content_a)
					.replace('{contentB}', content_b);

				const evaluation = await run_evaluation(prompt);
				results[pair_key] = evaluation;
			} catch (error) {
				results[pair_key] = {
					error: `Failed to compare: ${error instanceof Error ? error.message : 'Unknown error'}`,
				};
			}
		}
	}

	return results;
}

async function evaluate_usability(variants: string[]) {
	const results: Record<string, any> = {};

	for (const variant of variants) {
		try {
			const content = await read_variant_file(variant);

			const prompt = EVAL_PROMPTS.usability
				.replace('{variant}', variant)
				.replace('{content}', content);

			const evaluation = await run_evaluation(prompt);
			results[variant] = evaluation;
		} catch (error) {
			results[variant] = {
				error: `Failed to evaluate ${variant}: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	}

	return results;
}

async function evaluate_compression(variants: string[]) {
	const results: Record<string, any> = {};

	// Get full content for comparison
	let full_content = '';
	try {
		full_content = await read_variant_file('llms-full');
	} catch {
		return {
			error:
				'llms-full.txt not found - needed for compression evaluation',
		};
	}

	const full_length = full_content.length;

	for (const variant of variants) {
		if (variant === 'llms-full') continue; // Skip the full version

		try {
			const content = await read_variant_file(variant);
			const compressed_length = content.length;
			const ratio = Math.round(
				(compressed_length / full_length) * 100,
			);

			const prompt = EVAL_PROMPTS.compression_quality
				.replace('{fullLength}', full_length.toString())
				.replace('{compressedLength}', compressed_length.toString())
				.replace('{ratio}', ratio.toString())
				.replace('{variant}', variant)
				.replace('{content}', content);

			const evaluation = await run_evaluation(prompt);
			results[variant] = {
				...evaluation,
				stats: {
					fullLength: full_length,
					compressedLength: compressed_length,
					ratio,
				},
			};
		} catch (error) {
			results[variant] = {
				error: `Failed to evaluate ${variant}: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	}

	return results;
}

async function run_full_eval_suite(variants?: string[]) {
	const default_variants = [
		'llms',
		'llms-full',
		'llms-medium',
		'llms-small',
		'llms-api',
		'llms-examples',
	];
	const target_variants = variants || default_variants;

	const results = {
		completeness: await evaluate_completeness(target_variants),
		consistency: await evaluate_consistency(target_variants),
		usability: await evaluate_usability(target_variants),
		compression: await evaluate_compression(target_variants),
		summary: {
			evaluated_variants: target_variants,
			timestamp: new Date().toISOString(),
		},
	};

	return results;
}

async function read_variant_file(variant: string): Promise<string> {
	const file_path = join(process.cwd(), 'static', `${variant}.txt`);
	return await readFile(file_path, 'utf-8');
}

async function run_evaluation(prompt: string): Promise<any> {
	const message = await anthropic.messages.create({
		model: ANTHROPIC_CONFIG.model,
		max_tokens: ANTHROPIC_CONFIG.evaluation.max_tokens,
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
	});

	const evaluation =
		message.content[0].type === 'text'
			? message.content[0].text
			: 'No evaluation returned';

	// Try to parse score if it follows the expected format
	const score_match = evaluation.match(/Score:\s*(\d+(?:\.\d+)?)/i);
	const score = score_match ? parseFloat(score_match[1]) : null;

	return {
		evaluation,
		score,
		timestamp: new Date().toISOString(),
	};
}
