import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import E2EPage from './+page.svelte';

describe('E2E Testing Page SSR', () => {
	describe('Core Content Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(E2EPage);
			}).not.toThrow();
		});

		test('should render essential content for SEO', () => {
			const { body } = render(E2EPage);

			// Primary heading - critical for SEO and page structure
			expect(body).toContain('E2E Testing');

			// Page description - helps search engines understand page purpose
			// Check for key parts of the description that should be present
			expect(body).toContain(
				'Master end-to-end testing with Playwright',
			);
			expect(body).toContain('user journeys');
			expect(body).toContain('performance monitoring');
			expect(body).toContain('accessibility validation');

			// Key content categories - important for search discoverability
			expect(body).toContain('User Journey Testing');
			expect(body).toContain('Cross-Browser Testing');
			expect(body).toContain('Performance Testing');
			expect(body).toContain('Accessibility Testing');
		});

		test('should render functional navigation links', () => {
			const { body } = render(E2EPage);

			// Essential navigation - actual href attributes matter for SEO crawling
			expect(body).toContain('href="/docs"');
			expect(body).toContain('href="/components"');
		});
	});

	describe('SEO and Accessibility', () => {
		test('should render meta information', () => {
			const { head } = render(E2EPage);

			// Title tag is critical for SEO and browser tabs
			expect(head).toContain('<title>');
			expect(head).toContain('E2E Testing - Sveltest');

			// Meta description helps search engines show relevant snippets
			expect(head).toContain('meta name="description"');
			expect(head).toContain(
				'Learn end-to-end testing patterns with Playwright',
			);
		});

		test('should include hydration markers', () => {
			const { body } = render(E2EPage);

			// Svelte 5 hydration markers - essential for proper client-side takeover
			expect(body).toContain('<!--[-->');
			expect(body).toContain('<!--]-->');
		});

		test('should render without client-side JavaScript dependencies', () => {
			const { body } = render(E2EPage);

			// Core content should be present without JS
			expect(body).toContain('E2E Testing');

			// Should not contain inline JS that would break SSR or cause security issues
			expect(body).not.toContain('javascript:');
			expect(body).not.toContain('onclick=');
		});
	});

	describe('Content Structure', () => {
		test('should render main sections', () => {
			const { body } = render(E2EPage);

			// Key sections that users expect to see immediately
			expect(body).toContain('E2E Testing Categories');
			expect(body).toContain('Interactive Examples');
			expect(body).toContain('Live E2E Test Examples');
			expect(body).toContain('E2E Testing Best Practices');
			expect(body).toContain('Running E2E Tests');
		});

		test('should render code examples', () => {
			const { body } = render(E2EPage);

			// Check for code examples
			expect(body).toContain('import { expect, test }');
			expect(body).toContain('@playwright/test');
			expect(body).toContain('page.goto');
		});

		test('should render category information', () => {
			const { body } = render(E2EPage);

			// Check for E2E testing categories
			expect(body).toContain('User Journey Testing');
			expect(body).toContain('Cross-Browser Testing');
			expect(body).toContain('Performance Testing');
			expect(body).toContain('Accessibility Testing');
		});

		test('should render existing test files information', () => {
			const { body } = render(E2EPage);

			// Check for existing test files
			expect(body).toContain('Homepage Tests');
			expect(body).toContain('Smoke Tests');
			expect(body).toContain('API Integration');
			expect(body).toContain('Performance Tests');
			expect(body).toContain('Accessibility Tests');
			expect(body).toContain('Advanced Scenarios');
		});
	});

	describe('Performance and Consistency', () => {
		test('should render consistent markup for hydration', () => {
			// Multiple renders should produce identical output for hydration safety
			const result1 = render(E2EPage);
			const result2 = render(E2EPage);

			expect(result1.body).toBe(result2.body);
			expect(result1.head).toBe(result2.head);
		});

		test('should render without throwing errors under load', () => {
			// Test multiple rapid renders to simulate server load
			for (let i = 0; i < 10; i++) {
				expect(() => {
					render(E2EPage);
				}).not.toThrow();
			}
		});

		test('should handle multiple renders efficiently', () => {
			const results = [];

			// Render multiple times and verify consistent output
			for (let i = 0; i < 5; i++) {
				const result = render(E2EPage);
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
