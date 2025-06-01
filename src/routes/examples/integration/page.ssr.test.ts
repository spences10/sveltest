import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import IntegrationPage from './+page.svelte';

describe('Integration Testing Page SSR', () => {
	describe('Core Content Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(IntegrationPage);
			}).not.toThrow();
		});

		test('should render essential content for SEO', () => {
			const { body } = render(IntegrationPage);

			// Primary heading - critical for SEO and page structure
			expect(body).toContain('Integration Testing');

			// Page description - helps search engines understand page purpose
			// Check for key parts of the description that should be present
			expect(body).toContain(
				'Learn how to test component interactions',
			);
			expect(body).toContain('API integration');
			expect(body).toContain('state management');
			expect(body).toContain('complex user workflows');

			// Key content categories - important for search discoverability
			expect(body).toContain('Component Integration');
			expect(body).toContain('API Integration');
			expect(body).toContain('State Management');
			expect(body).toContain('Form Workflows');
		});

		test('should render functional navigation links', () => {
			const { body } = render(IntegrationPage);

			// Essential navigation - actual href attributes matter for SEO crawling
			expect(body).toContain('href="/examples/todos"');
			expect(body).toContain('href="/todos"');
			expect(body).toContain('href="/components"');
			expect(body).toContain('href="/examples/unit"');
			expect(body).toContain('href="/examples/e2e"');
			expect(body).toContain('href="/docs"');
		});
	});

	describe('SEO and Accessibility', () => {
		test('should render meta information', () => {
			const { head } = render(IntegrationPage);

			// Title tag is critical for SEO and browser tabs
			expect(head).toContain('<title>');
			expect(head).toContain('Integration Testing - TestSuite Pro');

			// Meta description helps search engines show relevant snippets
			expect(head).toContain('meta name="description"');
			expect(head).toContain(
				'Learn integration testing patterns for Svelte applications',
			);
		});

		test('should include hydration markers', () => {
			const { body } = render(IntegrationPage);

			// Svelte 5 hydration markers - essential for proper client-side takeover
			expect(body).toContain('<!--[-->');
			expect(body).toContain('<!--]-->');
		});

		test('should render without client-side JavaScript dependencies', () => {
			const { body } = render(IntegrationPage);

			// Core content should be present without JS
			expect(body).toContain('Integration Testing');

			// Should not contain inline JS that would break SSR or cause security issues
			expect(body).not.toContain('javascript:');
			expect(body).not.toContain('onclick=');
		});
	});

	describe('Content Structure', () => {
		test('should render main sections', () => {
			const { body } = render(IntegrationPage);

			// Key sections that users expect to see immediately
			expect(body).toContain('Integration Testing Categories');
			expect(body).toContain('Interactive Examples');
			expect(body).toContain('Integration Testing Best Practices');
			expect(body).toContain('Real-World Examples');
		});

		test('should render code examples', () => {
			const { body } = render(IntegrationPage);

			// Check for code examples
			expect(body).toContain('import { render }');
			expect(body).toContain('vitest-browser-svelte');
			expect(body).toContain('expect.element');
		});

		test('should render category information', () => {
			const { body } = render(IntegrationPage);

			// Check for integration testing categories
			expect(body).toContain('Component Integration');
			expect(body).toContain('API Integration');
			expect(body).toContain('State Management');
			expect(body).toContain('Form Workflows');
		});
	});

	describe('Performance and Consistency', () => {
		test('should render consistent markup for hydration', () => {
			// Multiple renders should produce identical output for hydration safety
			const result1 = render(IntegrationPage);
			const result2 = render(IntegrationPage);

			expect(result1.body).toBe(result2.body);
			expect(result1.head).toBe(result2.head);
		});

		test('should render without throwing errors under load', () => {
			// Test multiple rapid renders to simulate server load
			for (let i = 0; i < 10; i++) {
				expect(() => {
					render(IntegrationPage);
				}).not.toThrow();
			}
		});

		test('should handle multiple renders efficiently', () => {
			const results = [];

			// Render multiple times and verify consistent output
			for (let i = 0; i < 5; i++) {
				const result = render(IntegrationPage);
				results.push(result.body.length);
			}

			// All renders should produce the same output length
			const firstLength = results[0];
			results.forEach((length) => {
				expect(length).toBe(firstLength);
			});
		});
	});
});
