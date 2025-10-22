import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import Layout from './+layout.svelte';

// Mock the $app/environment module for SSR testing
vi.mock('$app/environment', () => ({
	browser: false,
	building: false,
	dev: true,
	version: '1.0.0',
}));

// Mock the $app/state module for SSR testing
vi.mock('$app/state', () => ({
	page: {
		url: {
			pathname: '/',
		},
	},
}));

// Create proper snippets for SSR testing using createRawSnippet
const mock_children = createRawSnippet(() => ({
	render: () => '<main><h1>Test Content</h1></main>',
}));

const custom_children = createRawSnippet(() => ({
	render: () => '<div class="custom">Custom Content</div>',
}));

const empty_children = createRawSnippet(() => ({
	render: () => '',
}));

describe('+layout.svelte SSR', () => {
	describe('Basic Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(Layout, { props: { children: mock_children } });
			}).not.toThrow();
		});

		test('should render core layout structure', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain(
				'from-primary/5 via-secondary/3 to-accent/5',
			);
			expect(body).toContain('Test Content');
		});

		test('should render main element structure', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('<main');
			expect(body).toContain('Test Content');
		});
	});

	describe('Navigation Structure', () => {
		test('should render navbar', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('navbar');
		});

		test('should render mobile menu dropdown', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('dropdown');
		});

		test('should render brand link in navbar', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('Sveltest');
		});

		test('should render mobile dock navigation', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('dock');
		});

		test('should render navigation links', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('href="/"');
			expect(body).toContain('href="/examples"');
		});
	});

	describe('Responsive Design', () => {
		test('should include responsive classes', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('lg:hidden');
		});

		test('should render mobile-first navigation', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('navbar');
			expect(body).toContain('dock');
		});
	});

	describe('Accessibility', () => {
		test('should include proper ARIA attributes', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('role="button"');
		});

		test('should render semantic HTML elements', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('<nav');
			expect(body).toContain('<main');
		});

		test('should include proper heading hierarchy', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// The test content includes h1
			expect(body).toContain('<h1>');
		});
	});

	describe('Svelte 5 Snippet Rendering', () => {
		test('should handle children prop without errors', () => {
			expect(() => {
				render(Layout, { props: { children: custom_children } });
			}).not.toThrow();
		});

		test('should handle undefined children gracefully', () => {
			const { body } = render(Layout, {
				props: { children: empty_children },
			});

			expect(body).toContain('navbar');
		});

		test('should handle empty children', () => {
			const { body } = render(Layout, {
				props: { children: empty_children },
			});

			expect(body).toContain('navbar');
		});
	});

	describe('CSS and Styling', () => {
		test('should include gradient background', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('bg-linear-to-br');
		});

		test('should include Tailwind utility classes', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('min-h-screen');
		});
	});

	describe('Layout Structure Integrity', () => {
		test('should maintain proper nesting structure', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Check for proper layout structure
			expect(body).toContain('bg-linear-to-br');
			expect(body).toContain('navbar');
			expect(body).toContain('<main');
		});

		test('should render complete HTML structure', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('<div');
			expect(body).toContain('<nav');
			expect(body).toContain('<main');
		});
	});

	describe('Interactive Elements', () => {
		test('should render interactive dropdown toggles', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('dropdown');
		});

		test('should render clickable navigation links', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('<a');
			expect(body).toContain('href=');
		});
	});

	describe('SSR-Specific Tests', () => {
		test('should include hydration markers', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('<!--[-->');
		});

		test('should render without client-side JavaScript', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('navbar');
			expect(body).toContain('Test Content');
		});

		test('should generate static HTML for SEO', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			expect(body).toContain('Sveltest');
			expect(body).toContain('Test Content');
		});
	});
});
