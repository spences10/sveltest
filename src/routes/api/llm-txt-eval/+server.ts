import { ANTHROPIC_API_KEY, LLM_GEN_SECRET } from '$env/static/private';
import { VARIANT_PROMPTS } from '$lib/server/llms';
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
				results = await evaluateCompleteness(variants);
				break;
			case 'consistency':
				results = await evaluateConsistency(variants);
				break;
			case 'usability':
				results = await evaluateUsability(variants);
				break;
			case 'compression':
				results = await evaluateCompression(variants);
				break;
			case 'full_suite':
				results = await runFullEvalSuite(variants);
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

async function evaluateCompleteness(variants: string[]) {
	const results = {};

	for (const variant of variants) {
		try {
			const content = await readVariantFile(variant);
			const originalPrompt =
				VARIANT_PROMPTS[variant] || 'No prompt found';

			const prompt = EVAL_PROMPTS.completeness
				.replace('{variant}', variant)
				.replace('{originalPrompt}', originalPrompt)
				.replace('{content}', content);

			const evaluation = await runEvaluation(prompt);
			results[variant] = evaluation;
		} catch (error) {
			results[variant] = {
				error: `Failed to evaluate ${variant}: ${error.message}`,
			};
		}
	}

	return results;
}

async function evaluateConsistency(variants: string[]) {
	const results = {};

	// Compare each pair of variants
	for (let i = 0; i < variants.length; i++) {
		for (let j = i + 1; j < variants.length; j++) {
			const variantA = variants[i];
			const variantB = variants[j];
			const pairKey = `${variantA}_vs_${variantB}`;

			try {
				const contentA = await readVariantFile(variantA);
				const contentB = await readVariantFile(variantB);

				const prompt = EVAL_PROMPTS.consistency
					.replace('{variantA}', variantA)
					.replace('{variantB}', variantB)
					.replace('{contentA}', contentA)
					.replace('{contentB}', contentB);

				const evaluation = await runEvaluation(prompt);
				results[pairKey] = evaluation;
			} catch (error) {
				results[pairKey] = {
					error: `Failed to compare: ${error.message}`,
				};
			}
		}
	}

	return results;
}

async function evaluateUsability(variants: string[]) {
	const results = {};

	for (const variant of variants) {
		try {
			const content = await readVariantFile(variant);

			const prompt = EVAL_PROMPTS.usability
				.replace('{variant}', variant)
				.replace('{content}', content);

			const evaluation = await runEvaluation(prompt);
			results[variant] = evaluation;
		} catch (error) {
			results[variant] = {
				error: `Failed to evaluate ${variant}: ${error.message}`,
			};
		}
	}

	return results;
}

async function evaluateCompression(variants: string[]) {
	const results = {};

	// Get full content for comparison
	let fullContent = '';
	try {
		fullContent = await readVariantFile('llms-full');
	} catch {
		return {
			error:
				'llms-full.txt not found - needed for compression evaluation',
		};
	}

	const fullLength = fullContent.length;

	for (const variant of variants) {
		if (variant === 'llms-full') continue; // Skip the full version

		try {
			const content = await readVariantFile(variant);
			const compressedLength = content.length;
			const ratio = Math.round((compressedLength / fullLength) * 100);

			const prompt = EVAL_PROMPTS.compression_quality
				.replace('{fullLength}', fullLength.toString())
				.replace('{compressedLength}', compressedLength.toString())
				.replace('{ratio}', ratio.toString())
				.replace('{variant}', variant)
				.replace('{content}', content);

			const evaluation = await runEvaluation(prompt);
			results[variant] = {
				...evaluation,
				stats: { fullLength, compressedLength, ratio },
			};
		} catch (error) {
			results[variant] = {
				error: `Failed to evaluate ${variant}: ${error.message}`,
			};
		}
	}

	return results;
}

async function runFullEvalSuite(variants?: string[]) {
	const defaultVariants = [
		'llms',
		'llms-full',
		'llms-medium',
		'llms-small',
		'llms-api',
		'llms-examples',
	];
	const targetVariants = variants || defaultVariants;

	const results = {
		completeness: await evaluateCompleteness(targetVariants),
		consistency: await evaluateConsistency(targetVariants),
		usability: await evaluateUsability(targetVariants),
		compression: await evaluateCompression(targetVariants),
		summary: {
			evaluated_variants: targetVariants,
			timestamp: new Date().toISOString(),
		},
	};

	return results;
}

async function readVariantFile(variant: string): Promise<string> {
	const filePath = join(process.cwd(), 'static', `${variant}.txt`);
	return await readFile(filePath, 'utf-8');
}

async function runEvaluation(prompt: string): Promise<any> {
	const message = await anthropic.messages.create({
		model: 'claude-3-5-sonnet-20241022',
		max_tokens: 2000,
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
	const scoreMatch = evaluation.match(/Score:\s*(\d+(?:\.\d+)?)/i);
	const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

	return {
		evaluation,
		score,
		timestamp: new Date().toISOString(),
	};
}
