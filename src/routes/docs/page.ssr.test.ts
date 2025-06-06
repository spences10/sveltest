import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import DocsPage from './+page.svelte';

/**
 * SSR Testing for Documentation Page
 *
 * This test suite ensures the documentation page renders correctly on the server
 * for SEO, accessibility, and performance. We focus on:
 * 1. Core content delivery for search engines
 * 2. Navigation structure for crawling
 * 3. Semantic HTML for accessibility
 * 4. Meta information for SEO
 */

describe('Documentation Page SSR', () => {
	describe('Core Content Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(DocsPage);
			}).not.toThrow();
		});

		test('should render main heading and description', () => {
			const { body } = render(DocsPage);

			// Check main heading
			expect(body).toContain('Testing Documentation');
			expect(body).toContain(
				'Master modern testing with Svelte 5 and vitest-browser-svelte',
			);
		});

		test('should render documentation statistics', () => {
			const { body } = render(DocsPage);

			// Check stats content
			expect(body).toContain('6'); // Sections
			expect(body).toContain('50+'); // Examples
			expect(body).toContain('100%'); // Coverage
			expect(body).toContain('A11y'); // Accessibility
		});

		test('should render quick start section', () => {
			const { body } = render(DocsPage);

			// Check quick start content
			expect(body).toContain('Quick Start');
			expect(body).toContain('Essential Imports');
			expect(body).toContain('Your First Test');
			expect(body).toContain('Component Testing');
			expect(body).toContain('SSR Testing');
			expect(body).toContain('Server Testing');
		});

		test('should render testing principles', () => {
			const { body } = render(DocsPage);

			// Check testing principles section
			expect(body).toContain('Core Testing Principles');
			expect(body).toContain('Real Browser Testing');
			expect(body).toContain('Accessibility First');
			expect(body).toContain('Performance Focused');
		});
	});

	describe('Navigation Structure', () => {
		test('should render section navigation', () => {
			const { body } = render(DocsPage);

			// Check section navigation buttons
			expect(body).toContain('Getting Started');
			expect(body).toContain('Testing Patterns');
			expect(body).toContain('API Reference');
			expect(body).toContain('Migration Guide');
			expect(body).toContain('Troubleshooting');
			expect(body).toContain('Best Practices');
		});

		test('should render default section content', () => {
			const { body } = render(DocsPage);

			// Check default getting started content (rendered by default in SSR)
			expect(body).toContain('Installation &amp; Setup');
			expect(body).toContain('Project Structure');
			expect(body).toContain('Your First Test');
		});

		test('should render call to action links', () => {
			const { body } = render(DocsPage);

			// Check CTA section
			expect(body).toContain('Ready to Start Testing?');
			expect(body).toContain('href="/examples"');
			expect(body).toContain('href="/components"');
		});
	});

	describe('Code Examples', () => {
		test('should render code examples', () => {
			const { body } = render(DocsPage);

			// Check for code examples
			expect(body).toContain('import { render }');
			expect(body).toContain('vitest-browser-svelte');
			expect(body).toContain('expect.element');
		});

		test('should render installation commands', () => {
			const { body } = render(DocsPage);

			// Check installation commands
			expect(body).toContain('pnpm install');
			expect(body).toContain('pnpm test');
		});
	});

	describe('SEO and Accessibility', () => {
		test('should render proper heading structure', () => {
			const { body } = render(DocsPage);

			// Check heading hierarchy
			expect(body).toContain('<h1');
			expect(body).toContain('<h2');
			expect(body).toContain('<h3');
			expect(body).toContain('<h4');
		});

		test('should render semantic HTML elements', () => {
			const { body } = render(DocsPage);

			// Check semantic elements that we added
			expect(body).toContain('<section');
			expect(body).toContain('<nav');
			expect(body).toContain('<main');
		});

		test('should render meta information', () => {
			const { head } = render(DocsPage);

			// Check meta tags
			expect(head).toContain(
				'<title>Documentation - Sveltest</title>',
			);
			expect(head).toContain('name="description"');
			expect(head).toContain('name="keywords"');
			expect(head).toContain('svelte testing');
		});

		test('should render accessible button and link elements', () => {
			const { body } = render(DocsPage);

			// Check for accessible elements that we added
			expect(body).toContain('<button');
			expect(body).toContain('<a href=');
			expect(body).toContain('role="button"');
		});
	});

	describe('Content Structure', () => {
		test('should render documentation sections content', () => {
			const { body } = render(DocsPage);

			// Check that all section content is present for SEO
			expect(body).toContain('Documentation Sections');
			expect(body).toContain('Comprehensive guides');
		});

		test('should render interactive elements', () => {
			const { body } = render(DocsPage);

			// Check for interactive elements that will be hydrated
			expect(body).toContain('Copy code');
			expect(body).toContain('title="Copy code"');
		});

		test('should render proper list structures', () => {
			const { body } = render(DocsPage);

			// Check for proper list markup
			expect(body).toContain('<ul');
			expect(body).toContain('<li');
		});
	});
});
