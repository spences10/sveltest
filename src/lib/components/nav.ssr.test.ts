import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import Nav from './nav.svelte';

// Mock the $app/state module for SSR testing
vi.mock('$app/state', () => ({
	page: {
		url: {
			pathname: '/',
		},
	},
}));

// Mock all icon components for SSR
vi.mock('$lib/icons', () => ({
	Arrow: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	BarChart: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	Calculator: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	CheckCircle: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	Clipboard: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	Document: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	ExternalLink: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	GitHub: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	Home: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	Menu: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	MoreVertical: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
	Settings: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn(),
	})),
}));

describe('Nav Component SSR', () => {
	describe('Basic SSR Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(Nav);
			}).not.toThrow();
		});

		test('should render essential navigation structure', () => {
			const { body } = render(Nav);

			// Test core navigation structure
			expect(body).toContain('<nav');
			expect(body).toContain('navbar');
			expect(body).toContain('Sveltest');
		});

		test('should render all main navigation links', () => {
			const { body } = render(Nav);

			// Test main navigation links for SEO
			expect(body).toContain('href="/"');
			expect(body).toContain('href="/docs"');
			expect(body).toContain('href="/components"');
			expect(body).toContain('href="/examples"');
			expect(body).toContain('href="/todos"');
			expect(body).toContain('Home');
			expect(body).toContain('Docs');
			expect(body).toContain('Components');
			expect(body).toContain('Examples');
			expect(body).toContain('Todo Manager');
		});

		test('should render testing section links', () => {
			const { body } = render(Nav);

			// Test testing dropdown links
			expect(body).toContain('href="/examples/unit"');
			expect(body).toContain('href="/examples/todos"');
			expect(body).toContain('Unit Tests');
			expect(body).toContain('Form Actions');
		});

		test('should render GitHub repository link', () => {
			const { body } = render(Nav);

			// Test GitHub link
			expect(body).toContain(
				'href="https://github.com/spences10/sveltest"',
			);
			expect(body).toContain('GitHub Repository');
		});
	});

	describe('SEO and Accessibility', () => {
		test('should render semantic HTML structure', () => {
			const { body } = render(Nav);

			// Test semantic HTML elements
			expect(body).toContain('<nav');
			expect(body).toContain('role="button"');
			expect(body).toContain('aria-label');
		});

		test('should render proper navigation landmarks', () => {
			const { body } = render(Nav);

			// Test navigation landmark
			expect(body).toContain('<nav');
			expect(body).toContain('navbar');
		});

		test('should render accessibility attributes', () => {
			const { body } = render(Nav);

			// Test ARIA labels for interactive elements
			expect(body).toContain('aria-label="Open navigation menu"');
		});

		test('should render proper link structure for crawlers', () => {
			const { body } = render(Nav);

			// Test that all important links are present for SEO
			const important_links = [
				'href="/"',
				'href="/docs"',
				'href="/components"',
				'href="/examples"',
				'href="/todos"',
				'href="/examples/unit"',
				'href="/examples/todos"',
				'href="https://github.com/spences10/sveltest"',
			];

			important_links.forEach((link) => {
				expect(body).toContain(link);
			});
		});
	});

	describe('Brand and Identity', () => {
		test('should render brand logo and title', () => {
			const { body } = render(Nav);

			expect(body).toContain('Sveltest');
			expect(body).toContain('href="/"'); // Brand link to home
		});

		test('should render status indicator', () => {
			const { body } = render(Nav);

			// Look for the Status section in the dropdown menu
			expect(body).toContain('Status');
		});
	});

	describe('Mobile Navigation', () => {
		test('should render mobile menu structure', () => {
			const { body } = render(Nav);

			// Test mobile menu button
			expect(body).toContain('Open navigation menu');
			expect(body).toContain('dropdown');
		});

		test('should render mobile dock navigation', () => {
			const { body } = render(Nav);

			// Test mobile dock structure
			expect(body).toContain('dock');
			expect(body).toContain('fixed');
		});

		test('should render mobile navigation links', () => {
			const { body } = render(Nav);

			// Test that mobile dock contains main navigation
			expect(body).toContain('Home');
			expect(body).toContain('Docs');
		});
	});

	describe('External Links', () => {
		test('should render external links with proper attributes', () => {
			const { body } = render(Nav);

			// Test external link attributes for security
			expect(body).toContain('target="_blank"');
			expect(body).toContain('rel="noopener noreferrer"');
		});

		test('should render GitHub repository link', () => {
			const { body } = render(Nav);

			expect(body).toContain(
				'href="https://github.com/spences10/sveltest"',
			);
			expect(body).toContain('GitHub Repository');
		});
	});

	describe('Responsive Design', () => {
		test('should render responsive classes', () => {
			const { body } = render(Nav);

			// Test responsive utility classes
			expect(body).toContain('lg:flex');
			expect(body).toContain('lg:hidden');
			expect(body).toContain('hidden');
		});

		test('should render mobile-specific elements', () => {
			const { body } = render(Nav);

			// Test mobile dock
			expect(body).toContain('dock');
			expect(body).toContain('fixed');
			expect(body).toContain('bottom-0');
		});
	});

	describe('Status and Indicators', () => {
		test('should render test status indicator', () => {
			const { body } = render(Nav);

			// Look for the Status section in the dropdown menu
			expect(body).toContain('Status');
		});

		test('should render status with proper styling', () => {
			const { body } = render(Nav);

			// Test status section structure
			expect(body).toContain('Status');
			expect(body).toContain('menu-title');
		});
	});

	describe('CSS Classes and Styling', () => {
		test('should render correct navbar classes', () => {
			const { body } = render(Nav);

			expect(body).toContain('navbar');
			expect(body).toContain('bg-base-100/60');
			expect(body).toContain('sticky');
			expect(body).toContain('top-0');
		});

		test('should render dropdown classes', () => {
			const { body } = render(Nav);

			expect(body).toContain('dropdown');
			expect(body).toContain('dropdown-end');
			expect(body).toContain('dropdown-content');
		});
	});

	describe('Active State Handling', () => {
		test('should handle home page active state in SSR', () => {
			const { body } = render(Nav);

			// With mocked pathname '/', home should be active
			expect(body).toContain('text-primary'); // Active state class
		});

		test('should render without errors when page context is available', () => {
			expect(() => {
				const { body } = render(Nav);
				expect(body).toContain('Sveltest');
			}).not.toThrow();
		});
	});

	describe('Content Structure', () => {
		test('should render all navigation sections', () => {
			const { body } = render(Nav);

			// Test that all major sections are present
			expect(body).toContain('navbar-start'); // Brand section
			expect(body).toContain('navbar-center'); // Main navigation
			expect(body).toContain('navbar-end'); // Status and actions
		});

		test('should render navigation dropdown structure', () => {
			const { body } = render(Nav);

			expect(body).toContain('dropdown');
			expect(body).toContain('menu');
			expect(body).toContain('Unit Tests');
			expect(body).toContain('Form Actions');
		});

		test('should render proper menu structure', () => {
			const { body } = render(Nav);

			expect(body).toContain('menu');
			expect(body).toContain('menu-horizontal');
			expect(body).toContain('menu-title');
		});
	});

	describe('Error Handling', () => {
		test('should handle missing page context gracefully', () => {
			// Test with undefined page context
			vi.doMock('$app/state', () => ({
				page: undefined,
			}));

			expect(() => {
				render(Nav);
			}).not.toThrow();
		});

		test('should handle missing URL context gracefully', () => {
			// Test with page but no URL
			vi.doMock('$app/state', () => ({
				page: {
					url: undefined,
				},
			}));

			expect(() => {
				render(Nav);
			}).not.toThrow();
		});
	});

	describe('Performance', () => {
		test('should render efficiently without complex computations', () => {
			const startTime = performance.now();
			render(Nav);
			const endTime = performance.now();

			// SSR should be fast (arbitrary threshold for this test)
			expect(endTime - startTime).toBeLessThan(100);
		});

		test('should not include client-side only features in SSR', () => {
			const { body } = render(Nav);

			// Should not contain client-side specific attributes
			expect(body).not.toContain('onclick');
			expect(body).not.toContain('addEventListener');
		});
	});
});
