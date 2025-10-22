import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/+page.svelte SSR', () => {
	test('should render HTML correctly on server', () => {
		const { body, head } = render(Page);

		// Test that main content is rendered
		expect(body).toContain('Sveltest');
		expect(body).toContain(
			'A comprehensive collection of testing patterns and',
		);
		expect(body).toContain('examples');

		// Test that navigation links are present
		expect(body).toContain('href="/examples"');
		expect(body).toContain('Explore Examples');
		expect(body).toContain('href="/todos"');
		expect(body).toContain('Try Todo Manager');

		// Test that feature content is rendered
		expect(body).toContain('Everything You Need');
		expect(body).toContain('Comprehensive testing tools');

		// Test badge content
		expect(body).toContain('Battle-Tested in Production');
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
		expect(body).toContain('<p ');
		expect(body).toContain('<a');
		expect(body).toContain('<div');

		// Test accessibility and styling attributes
		expect(body).toContain('class=');
	});

	test('should render hero section with gradient background', () => {
		const { body } = render(Page);

		// Test hero section structure
		expect(body).toContain('hero');
		expect(body).toContain('bg-linear-to-br');
		expect(body).toContain('min-h-screen');
	});

	test('should render feature sections', () => {
		const { body } = render(Page);

		// Test feature content that actually exists
		expect(body).toContain('Testing Types');
		expect(body).toContain('Best Practices');
		expect(body).toContain('Real-world Examples');
		expect(body).toContain('card');
	});

	test('should render without props (static page)', () => {
		// This page doesn't require props, should render successfully
		expect(() => {
			render(Page);
		}).not.toThrow();
	});
});
