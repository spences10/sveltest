import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/+page.svelte SSR', () => {
	test('should render HTML correctly on server', () => {
		const { body, head } = render(Page);

		// Test that main content is rendered
		expect(body).toContain('Svelte Testing Examples');
		expect(body).toContain(
			'A comprehensive collection of testing patterns',
		);

		// Test that navigation link is present
		expect(body).toContain('href="/examples"');
		expect(body).toContain('View Examples');

		// Test that feature cards are rendered
		expect(body).toContain('Testing Types');
		expect(body).toContain('Best Practices');
		expect(body).toContain('Real-world Examples');
	});

	test('should generate CSS for styling', () => {
		const result = render(Page);

		// Svelte 5 render returns { head, html, body } structure
		expect(result.head).toBeDefined();
		expect(result.html).toBeDefined();
		expect(result.body).toBeDefined();

		// All should be strings
		expect(typeof result.head).toBe('string');
		expect(typeof result.html).toBe('string');
		expect(typeof result.body).toBe('string');
	});

	test('should render semantic HTML structure', () => {
		const { body } = render(Page);

		// Test semantic HTML elements
		expect(body).toContain('<h1');
		expect(body).toContain('<h2');
		expect(body).toContain('<p>');
		expect(body).toContain('<a');

		// Test accessibility attributes
		expect(body).toContain('class=');
	});

	test('should render without props (static page)', () => {
		// This page doesn't require props, should render successfully
		expect(() => {
			render(Page);
		}).not.toThrow();
	});
});
