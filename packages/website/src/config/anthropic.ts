// Shared Anthropic configuration for all scripts and server code
export const ANTHROPIC_CONFIG = {
	model: 'claude-sonnet-4-20250514',
	generation: {
		max_tokens: 32000,
		stream: true,
	},
	evaluation: {
		max_tokens: 32000,
		stream: true,
	},
} as const;
