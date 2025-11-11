#!/usr/bin/env tsx

import 'dotenv/config';

/**
 * Shared Anthropic API configuration for all scripts
 *
 * Model Strategy:
 * - Haiku 4.5: Fast operations (parsing, simple analysis)
 * - Sonnet 4.5: Deep analysis (validation, code review)
 * - Agent SDK: Complex multi-step tasks
 */

export const ANTHROPIC_CONFIG = {
	// Fast, cost-effective operations
	haiku: {
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 8000,
		temperature: 0.2, // Focused
	},

	// Balanced, high-quality analysis
	sonnet: {
		model: 'claude-sonnet-4-5-20250929',
		max_tokens: 16000,
		temperature: 0.3, // Balanced
	},

	// Agent SDK for complex tasks
	agent: {
		model: 'claude-sonnet-4-5-20250929',
		max_tokens: 32000,
		temperature: 0.4, // Creative problem-solving
	},
} as const;

export function get_api_key(): string {
	const api_key = process.env.ANTHROPIC_API_KEY;

	if (!api_key) {
		throw new Error(
			'ANTHROPIC_API_KEY environment variable is required.\n' +
				'Get your API key from: https://console.anthropic.com/',
		);
	}

	return api_key;
}
