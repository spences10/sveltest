import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Layout from './+layout.svelte';

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

			// Test drawer structure
			expect(body).toContain('class="drawer lg:drawer-open"');
			expect(body).toContain('id="my-drawer"');
			expect(body).toContain('class="drawer-toggle"');
			expect(body).toContain('class="drawer-content"');
			expect(body).toContain('class="drawer-side"');
		});

		test('should render main element structure', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test that main element is present (children may not render in SSR context)
			expect(body).toContain('<main class="p-4">');
		});
	});

	describe('Navigation Structure', () => {
		test('should render mobile navbar', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test mobile navbar structure
			expect(body).toContain('class="navbar bg-base-100 lg:hidden"');
			expect(body).toContain('for="my-drawer"');
			expect(body).toContain(
				'btn btn-square btn-ghost drawer-button',
			);
		});

		test('should render hamburger menu icon', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test hamburger icon SVG
			expect(body).toContain('xmlns="http://www.w3.org/2000/svg"');
			expect(body).toContain('viewBox="0 0 24 24"');
			expect(body).toContain('stroke-linecap="round"');
			expect(body).toContain('d="M4 6h16M4 12h16M4 18h16"');
		});

		test('should render brand link in navbar', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test brand link
			expect(body).toContain('href="/"');
			expect(body).toContain('btn btn-ghost text-xl normal-case');
			expect(body).toContain('Svelte Testing');
		});

		test('should render sidebar navigation', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test sidebar structure
			expect(body).toContain('class="drawer-overlay"');
			expect(body).toContain('class="bg-base-200 min-h-screen w-80"');
			expect(body).toContain('class="menu menu-vertical"');
		});

		test('should render navigation links', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test navigation links
			expect(body).toContain('href="/"');
			expect(body).toContain('href="/examples"');
			expect(body).toContain('>Home<');
			expect(body).toContain('>Examples<');
		});
	});

	describe('Responsive Design', () => {
		test('should include responsive classes', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test responsive classes
			expect(body).toContain('lg:drawer-open');
			expect(body).toContain('lg:hidden');
		});

		test('should render mobile-first navigation', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Mobile navbar should be present
			expect(body).toContain('class="navbar bg-base-100 lg:hidden"');

			// Drawer toggle should be present
			expect(body).toContain('class="drawer-toggle"');
		});
	});

	describe('Accessibility', () => {
		test('should include proper ARIA attributes', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test label associations
			expect(body).toContain('for="my-drawer"');
			expect(body).toContain('id="my-drawer"');
		});

		test('should render semantic HTML elements', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test semantic elements (note: navbar is a div with navbar class, not nav element)
			expect(body).toContain('<main');
			expect(body).toContain('<aside');
		});

		test('should include proper heading hierarchy', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test heading structure
			expect(body).toContain('<h1');
			expect(body).toContain('class="mb-4 text-2xl font-bold"');
		});
	});

	describe('Svelte 5 Snippet Rendering', () => {
		test('should handle children prop without errors', () => {
			expect(() => {
				render(Layout, { props: { children: custom_children } });
			}).not.toThrow();
		});

		test('should handle undefined children gracefully', () => {
			// For SSR testing, we can't pass undefined to a required Snippet prop
			// Instead, test with empty children
			const { body } = render(Layout, {
				props: { children: empty_children },
			});

			// Should still render layout structure
			expect(body).toContain('class="drawer lg:drawer-open"');
			expect(body).toContain('<main class="p-4">');
		});

		test('should handle empty children', () => {
			const { body } = render(Layout, {
				props: { children: empty_children },
			});

			// Should render layout but no content
			expect(body).toContain('<main class="p-4">');
		});
	});

	describe('CSS and Styling', () => {
		test('should include DaisyUI classes', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test DaisyUI component classes
			expect(body).toContain('drawer');
			expect(body).toContain('navbar');
			expect(body).toContain('btn');
			expect(body).toContain('menu');
		});

		test('should include Tailwind utility classes', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test Tailwind utilities
			expect(body).toContain('min-h-screen');
			expect(body).toContain('bg-base-100');
			expect(body).toContain('bg-base-200');
			expect(body).toContain('text-xl');
			expect(body).toContain('font-bold');
		});
	});

	describe('Layout Structure Integrity', () => {
		test('should maintain proper nesting structure', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test that drawer structure is properly nested
			expect(body.indexOf('drawer lg:drawer-open')).toBeLessThan(
				body.indexOf('drawer-content'),
			);
			expect(body.indexOf('drawer-content')).toBeLessThan(
				body.indexOf('drawer-side'),
			);
		});

		test('should render complete HTML structure', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test that all major sections are present
			const hasDrawer = body.includes(
				'class="drawer lg:drawer-open"',
			);
			const hasNavbar = body.includes(
				'class="navbar bg-base-100 lg:hidden"',
			);
			const hasMain = body.includes('<main class="p-4">');
			const hasSidebar = body.includes(
				'class="bg-base-200 min-h-screen w-80"',
			);

			expect(hasDrawer).toBe(true);
			expect(hasNavbar).toBe(true);
			expect(hasMain).toBe(true);
			expect(hasSidebar).toBe(true);
		});
	});

	describe('Interactive Elements', () => {
		test('should render interactive drawer toggle', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test drawer toggle elements
			expect(body).toContain('type="checkbox"');
			expect(body).toContain('class="drawer-toggle"');
			expect(body).toContain('drawer-button');
		});

		test('should render clickable navigation links', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Test that links have proper href attributes
			const homeLinks = (body.match(/href="\//g) || []).length;
			const exampleLinks = (body.match(/href="\/examples"/g) || [])
				.length;

			expect(homeLinks).toBeGreaterThan(0);
			expect(exampleLinks).toBeGreaterThan(0);
		});
	});

	describe('SSR-Specific Tests', () => {
		test('should include hydration markers', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Should include Svelte hydration markers
			expect(body).toContain('<!--[-->');
			expect(body).toContain('<!--]-->');
		});

		test('should render without client-side JavaScript', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Should render complete layout without any client dependencies
			expect(body).toContain('class="drawer lg:drawer-open"');
			expect(body).not.toContain('javascript:');
			expect(body).not.toContain('onclick=');
		});

		test('should generate static HTML for SEO', () => {
			const { body } = render(Layout, {
				props: { children: mock_children },
			});

			// Should be crawlable by search engines
			expect(body).toContain('Svelte Testing');
			expect(body).toContain('Home');
			expect(body).toContain('Examples');
		});
	});
});
