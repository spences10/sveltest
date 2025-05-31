import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import ExamplesPage from './+page.svelte';

// Mock data that would come from +page.server.ts
const mock_data = {
	examples: [
		{
			id: 1,
			title: 'Unit Testing',
			description: 'Test utility functions',
		},
		{
			id: 2,
			title: 'Component Testing',
			description: 'Test Svelte components',
		},
	],
};

describe('/examples/+page.svelte SSR', () => {
	describe('Basic Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(ExamplesPage, { props: { data: mock_data } });
			}).not.toThrow();
		});

		test('should render page title', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			expect(body).toContain('<h1>Testing Examples</h1>');
		});

		test('should render with prose styling', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			expect(body).toContain('class="prose max-w-none"');
		});
	});

	describe('Card Grid Layout', () => {
		test('should render responsive grid container', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			expect(body).toContain(
				'class="grid grid-cols-1 gap-6 md:grid-cols-2"',
			);
		});

		test('should render unit testing card', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test unit testing card content
			expect(body).toContain('class="card bg-base-100 shadow-xl"');
			expect(body).toContain(
				'<h2 class="card-title">Unit Testing</h2>',
			);
			expect(body).toContain(
				'Examples of testing utility functions and business logic',
			);
			expect(body).toContain('href="/examples/unit"');
			expect(body).toContain('View Examples');
		});

		test('should render form actions card', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test form actions card content
			expect(body).toContain(
				'<h2 class="card-title">Form Actions</h2>',
			);
			expect(body).toContain(
				'Testing form actions and server-side validation with Todos',
			);
			expect(body).toContain('href="/examples/todos"');
		});

		test('should render component testing card', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test component testing card content
			expect(body).toContain(
				'<h2 class="card-title">Component Testing</h2>',
			);
			expect(body).toContain(
				'Testing Svelte components with Vitest and Testing Library',
			);
			expect(body).toContain('href="/examples/component"');
		});
	});

	describe('Navigation Links', () => {
		test('should render all navigation links', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test that all expected links are present
			const unit_link = body.includes('href="/examples/unit"');
			const todos_link = body.includes('href="/examples/todos"');
			const component_link = body.includes(
				'href="/examples/component"',
			);

			expect(unit_link).toBe(true);
			expect(todos_link).toBe(true);
			expect(component_link).toBe(true);
		});

		test('should render proper button styling for links', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test button classes
			expect(body).toContain('class="btn btn-primary"');

			// Count button instances (should be 3)
			const button_count = (
				body.match(/class="btn btn-primary"/g) || []
			).length;
			expect(button_count).toBe(3);
		});
	});

	describe('Card Structure', () => {
		test('should render proper card structure', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test card structure elements
			expect(body).toContain('class="card-body"');
			expect(body).toContain('class="card-actions"');

			// Count card instances (should be 3)
			const card_count = (
				body.match(/class="card bg-base-100 shadow-xl"/g) || []
			).length;
			expect(card_count).toBe(3);
		});

		test('should render card titles and descriptions', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test all card titles are present
			expect(body).toContain('Unit Testing');
			expect(body).toContain('Form Actions');
			expect(body).toContain('Component Testing');

			// Test descriptions are present
			expect(body).toContain('utility functions and business logic');
			expect(body).toContain('server-side validation');
			expect(body).toContain('Vitest and Testing Library');
		});
	});

	describe('Data Handling', () => {
		test('should handle undefined data gracefully', () => {
			const { body } = render(ExamplesPage, {
				props: { data: {} },
			});

			// Should still render the static content
			expect(body).toContain('<h1>Testing Examples</h1>');
			expect(body).toContain(
				'class="grid grid-cols-1 gap-6 md:grid-cols-2"',
			);
		});

		test('should handle empty data object', () => {
			const { body } = render(ExamplesPage, { props: { data: {} } });

			// Should still render the static content
			expect(body).toContain('Unit Testing');
			expect(body).toContain('Form Actions');
			expect(body).toContain('Component Testing');
		});

		test('should access data prop correctly', () => {
			const custom_data = { custom_field: 'test' };
			const { body } = render(ExamplesPage, {
				props: { data: custom_data },
			});

			// Should render without errors even with custom data structure
			expect(body).toContain('<h1>Testing Examples</h1>');
		});
	});

	describe('Responsive Design', () => {
		test('should include responsive grid classes', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test responsive breakpoints
			expect(body).toContain('grid-cols-1');
			expect(body).toContain('md:grid-cols-2');
		});

		test('should include responsive spacing', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test gap spacing
			expect(body).toContain('gap-6');
		});
	});

	describe('Accessibility', () => {
		test('should render semantic HTML structure', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test semantic elements
			expect(body).toContain('<h1>');
			expect(body).toContain('<h2');
			expect(body).toContain('<p>');
		});

		test('should render proper heading hierarchy', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test that h1 comes before h2 elements
			const h1_index = body.indexOf('<h1>');
			const h2_index = body.indexOf('<h2');

			expect(h1_index).toBeGreaterThan(-1);
			expect(h2_index).toBeGreaterThan(-1);
			expect(h1_index).toBeLessThan(h2_index);
		});

		test('should render descriptive link text', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test that links have descriptive text
			expect(body).toContain('>View Examples<');

			// Count descriptive link text instances
			const link_text_count = (body.match(/>View Examples</g) || [])
				.length;
			expect(link_text_count).toBe(3);
		});
	});

	describe('DaisyUI Integration', () => {
		test('should use DaisyUI component classes', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test DaisyUI classes
			expect(body).toContain('card');
			expect(body).toContain('card-body');
			expect(body).toContain('card-title');
			expect(body).toContain('card-actions');
			expect(body).toContain('btn');
			expect(body).toContain('prose');
		});

		test('should use proper color scheme', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Test color classes
			expect(body).toContain('bg-base-100');
			expect(body).toContain('btn-primary');
		});
	});

	describe('SSR-Specific Tests', () => {
		test('should include hydration markers', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Should include Svelte hydration markers
			expect(body).toContain('<!--[-->');
			expect(body).toContain('<!--]-->');
		});

		test('should render without client-side JavaScript', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Should render complete page without any client dependencies
			expect(body).toContain('<h1>Testing Examples</h1>');
			expect(body).not.toContain('javascript:');
			expect(body).not.toContain('onclick=');
		});

		test('should generate static HTML for SEO', () => {
			const { body } = render(ExamplesPage, {
				props: { data: mock_data },
			});

			// Should be crawlable by search engines
			expect(body).toContain('Testing Examples');
			expect(body).toContain('Unit Testing');
			expect(body).toContain('Form Actions');
			expect(body).toContain('Component Testing');
		});
	});
});
