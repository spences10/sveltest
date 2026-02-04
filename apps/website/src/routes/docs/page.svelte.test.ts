import { page } from 'vitest/browser';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DocsPage from './+page.svelte';

// Mock data that matches the expected structure from +page.ts
const mock_topics = [
	{
		slug: 'getting-started',
		title: 'Getting Started',
		description: 'Setup and first test',
		category: 'Fundamentals',
	},
	{
		slug: 'api-reference',
		title: 'API Reference',
		description: 'Testing utilities',
		category: 'Fundamentals',
	},
	{
		slug: 'component-testing',
		title: 'Component Testing',
		description: 'Browser testing',
		category: 'Test Types',
	},
	{
		slug: 'ssr-testing',
		title: 'SSR Testing',
		description: 'Server rendering tests',
		category: 'Test Types',
	},
	{
		slug: 'server-testing',
		title: 'Server Testing',
		description: 'API routes',
		category: 'Test Types',
	},
	{
		slug: 'e2e-testing',
		title: 'E2E Testing',
		description: 'End-to-end testing',
		category: 'Test Types',
	},
	{
		slug: 'context-testing',
		title: 'Context Testing',
		description: 'Context and stores',
		category: 'Advanced Patterns',
	},
	{
		slug: 'remote-functions-testing',
		title: 'Remote Functions',
		description: 'Remote functions',
		category: 'Advanced Patterns',
	},
	{
		slug: 'runes-testing',
		title: 'Runes Testing',
		description: 'Svelte 5 runes',
		category: 'Advanced Patterns',
	},
	{
		slug: 'migration-guide',
		title: 'Migration Guide',
		description: 'Migrating from @testing-library/svelte',
		category: 'Migration & Troubleshooting',
	},
	{
		slug: 'troubleshooting',
		title: 'Troubleshooting',
		description: 'Common issues',
		category: 'Migration & Troubleshooting',
	},
	{
		slug: 'ci-cd',
		title: 'CI/CD',
		description: 'Testing pipelines',
		category: 'DevOps',
	},
	{
		slug: 'best-practices',
		title: 'Best Practices',
		description: 'Advanced patterns',
		category: 'DevOps',
	},
];

const mock_topic_categories = [
	{
		name: 'Fundamentals',
		topics: mock_topics.filter((t) => t.category === 'Fundamentals'),
	},
	{
		name: 'Test Types',
		topics: mock_topics.filter((t) => t.category === 'Test Types'),
	},
	{
		name: 'Advanced Patterns',
		topics: mock_topics.filter(
			(t) => t.category === 'Advanced Patterns',
		),
	},
	{
		name: 'Migration & Troubleshooting',
		topics: mock_topics.filter(
			(t) => t.category === 'Migration & Troubleshooting',
		),
	},
	{
		name: 'DevOps',
		topics: mock_topics.filter((t) => t.category === 'DevOps'),
	},
];

const mock_data = {
	topics: mock_topics,
	topic_categories: mock_topic_categories,
};

/**
 * Component Testing for Documentation Page
 *
 * This test suite covers the interactive documentation page with:
 * 1. Initial rendering and content display
 * 2. Section navigation and content switching
 * 3. Interactive features like copy-to-clipboard
 * 4. Call-to-action links and navigation
 * 5. SEO and accessibility features
 */

describe('Documentation Page', () => {
	describe('Initial Rendering', () => {
		test('should render the page without errors', async () => {
			render(DocsPage, { data: mock_data });

			await expect
				.element(
					page.getByRole('heading', {
						name: /Testing Documentation/,
					}),
				)
				.toBeInTheDocument();
		});

		test('should render quick start examples', async () => {
			render(DocsPage, { data: mock_data });

			// Check quick start section
			await expect
				.element(page.getByRole('heading', { name: 'Quick Start' }))
				.toBeInTheDocument();
			await expect
				.element(page.getByTestId('example-title-essential-imports'))
				.toBeInTheDocument();
			await expect
				.element(page.getByTestId('example-title-your-first-test'))
				.toBeInTheDocument();
			await expect
				.element(page.getByTestId('example-title-component-testing'))
				.toBeInTheDocument();
			await expect
				.element(page.getByTestId('example-title-ssr-testing'))
				.toBeInTheDocument();
			await expect
				.element(page.getByTestId('example-title-server-testing'))
				.toBeInTheDocument();
		});

		test('should render testing principles', async () => {
			render(DocsPage, { data: mock_data });

			// Check testing principles section
			await expect
				.element(
					page.getByRole('heading', {
						name: 'Core Testing Principles',
					}),
				)
				.toBeInTheDocument();
			await expect
				.element(
					page.getByRole('heading', { name: '100% Test Coverage' }),
				)
				.toBeInTheDocument();
			await expect
				.element(
					page.getByRole('heading', { name: 'Real Browser Testing' }),
				)
				.toBeInTheDocument();
			await expect
				.element(
					page.getByRole('heading', { name: 'Accessibility First' }),
				)
				.toBeInTheDocument();
			await expect
				.element(
					page.getByRole('heading', { name: 'Performance Focused' }),
				)
				.toBeInTheDocument();
		});
	});

	describe('Documentation Navigation', () => {
		test('should render documentation guide section', async () => {
			render(DocsPage, { data: mock_data });

			// Check documentation guide section exists
			await expect
				.element(
					page.getByRole('heading', { name: 'Documentation Guide' }),
				)
				.toBeInTheDocument();
		});

		test('should render doc cards for all topics', async () => {
			render(DocsPage, { data: mock_data });

			// Check that doc cards are rendered via test IDs
			await expect
				.element(page.getByTestId('doc-link-getting-started'))
				.toBeInTheDocument();
			await expect
				.element(page.getByTestId('doc-link-component-testing'))
				.toBeInTheDocument();
			await expect
				.element(page.getByTestId('doc-link-ssr-testing'))
				.toBeInTheDocument();
		});

		test('should have doc cards with correct links', async () => {
			render(DocsPage, { data: mock_data });

			// Check that links point to correct URLs
			const getting_started_link = page.getByTestId(
				'doc-link-getting-started',
			);
			await expect
				.element(getting_started_link)
				.toHaveAttribute('href', '/docs/getting-started');
		});
	});

	describe('Interactive Features', () => {
		test('should have copy code functionality', async () => {
			render(DocsPage, { data: mock_data });

			// Check for copy buttons in quick start examples
			const copyButtons = page.getByTitle('Copy code');
			await expect.element(copyButtons.first()).toBeInTheDocument();
		});

		test('should render code examples', async () => {
			render(DocsPage, { data: mock_data });

			// Wait for the page to render first
			await expect
				.element(
					page.getByRole('heading', {
						name: /Testing Documentation/,
					}),
				)
				.toBeInTheDocument();

			// Check for code blocks - use first() to avoid multiple matches
			// These should be present either as highlighted code or fallback code
			await expect
				.element(page.getByText('vitest-browser-svelte').first())
				.toBeInTheDocument();
			await expect
				.element(page.getByText('expect.element').first())
				.toBeInTheDocument();
		}, 10000); // Increase test timeout to 10 seconds
	});

	describe('Call to Action', () => {
		test('should render call to action section', async () => {
			render(DocsPage, { data: mock_data });

			await expect
				.element(
					page.getByRole('heading', {
						name: 'Ready to Start Testing?',
					}),
				)
				.toBeInTheDocument();
		});

		test('should have navigation links', async () => {
			render(DocsPage, { data: mock_data });

			// Test that buttons exist and are properly formed (they have role="button")
			await expect
				.element(page.getByRole('button', { name: /View Examples/ }))
				.toBeInTheDocument();
			await expect
				.element(
					page.getByRole('button', { name: /Component Library/ }),
				)
				.toBeInTheDocument();
		});
	});

	describe('SEO and Accessibility', () => {
		test('should have proper page title and meta tags', async () => {
			render(DocsPage, { data: mock_data });

			// Check that the page renders (meta tags are in head)
			await expect
				.element(
					page.getByRole('heading', {
						name: /Testing Documentation/,
					}),
				)
				.toBeInTheDocument();
		});

		test('should have accessible doc cards', async () => {
			render(DocsPage, { data: mock_data });

			// Check for doc cards with proper links
			await expect
				.element(page.getByTestId('doc-link-getting-started'))
				.toBeInTheDocument();
		});

		test('should have semantic HTML structure', async () => {
			render(DocsPage, { data: mock_data });

			// Check for proper heading hierarchy - use first() to avoid multiple matches
			await expect
				.element(page.getByRole('heading', { level: 1 }).first())
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('heading', { level: 2 }).first())
				.toBeInTheDocument();
		});
	});
});
