import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import CodeBlock from './code-block.svelte';

// Mock the $app/environment module for SSR testing
vi.mock('$app/environment', () => ({
	browser: false,
	building: false,
	dev: true,
	version: '1.0.0',
}));

describe('CodeBlock SSR', () => {
	test('should render without errors', () => {
		expect(() => {
			render(CodeBlock, {
				props: {
					code: 'const hello = "world";',
				},
			});
		}).not.toThrow();
	});

	test('should render fallback code content for SEO', () => {
		const { body } = render(CodeBlock, {
			props: {
				code: 'console.log("Hello, World!");',
				lang: 'javascript',
			},
		});

		// Should render the actual code content in fallback format
		expect(body).toContain('console.log("Hello, World!");');
		// Check for fallback class (may have scoped CSS suffix)
		expect(body).toMatch(/class="code-fallback[^"]*"/);
		// Should contain pre and code elements
		expect(body).toContain('<pre');
		expect(body).toContain('<code');
	});

	test('should handle different languages in SSR', () => {
		const { body } = render(CodeBlock, {
			props: {
				code: 'function test() { return true; }',
				lang: 'typescript',
			},
		});

		// Should render the actual code content regardless of language
		expect(body).toContain('function test() { return true; }');
		expect(body).toMatch(/class="code-fallback[^"]*"/);
	});

	test('should handle empty code in SSR', () => {
		const { body } = render(CodeBlock, {
			props: {
				code: '',
			},
		});

		// Should still render fallback structure even with empty code
		expect(body).toMatch(/class="code-fallback[^"]*"/);
		expect(body).toContain('<pre');
		expect(body).toContain('<code');
	});

	test('should handle custom theme in SSR', () => {
		const { body } = render(CodeBlock, {
			props: {
				code: 'const test = true;',
				theme: 'night-owl',
			},
		});

		// Should render fallback with any theme (theme doesn't affect SSR fallback)
		expect(body).toContain('const test = true;');
		expect(body).toMatch(/class="code-fallback[^"]*"/);
	});
});
