export interface Topic {
	slug: string;
	title: string;
	description: string;
}

export const topics: Topic[] = [
	{
		slug: 'getting-started',
		title: 'Getting Started',
		description: 'Setup, installation, and your first test',
	},
	{
		slug: 'testing-patterns',
		title: 'Testing Patterns',
		description: 'Component, SSR, and server testing patterns',
	},
	{
		slug: 'e2e-testing',
		title: 'E2E Testing',
		description:
			'End-to-end testing patterns and integration validation',
	},
	{
		slug: 'api-reference',
		title: 'API Reference',
		description: 'Complete testing utilities and helper functions',
	},
	{
		slug: 'migration-guide',
		title: 'Migration Guide',
		description: 'Migrating from @testing-library/svelte',
	},
	{
		slug: 'best-practices',
		title: 'Best Practices',
		description: 'Advanced patterns and optimization techniques',
	},
	{
		slug: 'ci-cd',
		title: 'CI/CD',
		description: 'Production-ready testing pipelines and automation',
	},
	{
		slug: 'troubleshooting',
		title: 'Troubleshooting',
		description: 'Common issues and solutions',
	},
	{
		slug: 'about',
		title: 'About',
		description: 'About this project and its goals',
	},
];
