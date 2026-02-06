export interface Topic {
	slug: string;
	title: string;
	description: string;
	category: string;
}

export interface TopicCategory {
	name: string;
	topics: Topic[];
}

// Fundamentals
const fundamentals: Topic[] = [
	{
		slug: 'getting-started',
		title: 'Getting Started',
		description: 'Setup, installation, and your first test',
		category: 'Fundamentals',
	},
	{
		slug: 'api-reference',
		title: 'API Reference',
		description: 'Complete testing utilities and helper functions',
		category: 'Fundamentals',
	},
];

// Test Types
const test_types: Topic[] = [
	{
		slug: 'component-testing',
		title: 'Component Testing',
		description: 'Browser-based component testing patterns',
		category: 'Test Types',
	},
	{
		slug: 'ssr-testing',
		title: 'SSR Testing',
		description: 'Server-side rendering test patterns',
		category: 'Test Types',
	},
	{
		slug: 'server-testing',
		title: 'Server Testing',
		description: 'API routes and server function testing',
		category: 'Test Types',
	},
	{
		slug: 'e2e-testing',
		title: 'E2E Testing',
		description:
			'End-to-end testing patterns and integration validation',
		category: 'Test Types',
	},
];

// Advanced Patterns
const advanced_patterns: Topic[] = [
	{
		slug: 'context-testing',
		title: 'Context Testing',
		description: 'Testing Svelte context and stores',
		category: 'Advanced Patterns',
	},
	{
		slug: 'remote-functions-testing',
		title: 'Remote Functions Testing',
		description: 'Testing SvelteKit remote functions',
		category: 'Advanced Patterns',
	},
	{
		slug: 'runes-testing',
		title: 'Runes Testing',
		description: 'Testing Svelte 5 runes and reactivity',
		category: 'Advanced Patterns',
	},
	{
		slug: 'testing-patterns',
		title: 'Testing Patterns',
		description:
			'Integration, error handling, and performance testing patterns',
		category: 'Advanced Patterns',
	},
];

// Migration & Troubleshooting
const migration_troubleshooting: Topic[] = [
	{
		slug: 'migration-guide',
		title: 'Migration Guide',
		description: 'Migrating from @testing-library/svelte',
		category: 'Migration & Troubleshooting',
	},
	{
		slug: 'troubleshooting',
		title: 'Troubleshooting',
		description: 'Common issues and solutions',
		category: 'Migration & Troubleshooting',
	},
];

// DevOps
const devops: Topic[] = [
	{
		slug: 'ci-cd',
		title: 'CI/CD',
		description: 'Production-ready testing pipelines and automation',
		category: 'DevOps',
	},
	{
		slug: 'best-practices',
		title: 'Best Practices',
		description: 'Advanced patterns and optimization techniques',
		category: 'DevOps',
	},
];

// Grouped categories for navigation
export const topic_categories: TopicCategory[] = [
	{ name: 'Fundamentals', topics: fundamentals },
	{ name: 'Test Types', topics: test_types },
	{ name: 'Advanced Patterns', topics: advanced_patterns },
	{
		name: 'Migration & Troubleshooting',
		topics: migration_troubleshooting,
	},
	{ name: 'DevOps', topics: devops },
];

// Flat list for backward compatibility
export const topics: Topic[] = [
	...fundamentals,
	...test_types,
	...advanced_patterns,
	...migration_troubleshooting,
	...devops,
];
