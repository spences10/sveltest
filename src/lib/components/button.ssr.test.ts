import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Button from './button.svelte';

describe('Button Component SSR', () => {
	describe('Basic Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(Button, { props: { label: 'Click me' } });
			}).not.toThrow();
		});

		test('should render button element', () => {
			const { body } = render(Button, {
				props: { label: 'Click me' },
			});

			expect(body).toContain('<button');
			expect(body).toContain('Click me');
		});

		test('should render with default classes', () => {
			const { body } = render(Button, {
				props: { label: 'Click me' },
			});

			expect(body).toContain('class="btn');
			expect(body).toContain('font-medium');
			expect(body).toContain('rounded-lg');
		});
	});

	describe('Variants', () => {
		test('should render primary variant', () => {
			const { body } = render(Button, {
				props: {
					variant: 'primary',
					label: 'Primary',
				},
			});

			expect(body).toContain('bg-blue-600');
			expect(body).toContain('hover:bg-blue-700');
			expect(body).toContain('text-white');
		});

		test('should render secondary variant', () => {
			const { body } = render(Button, {
				props: {
					variant: 'secondary',
					label: 'Secondary',
				},
			});

			expect(body).toContain('bg-gray-200');
			expect(body).toContain('hover:bg-gray-300');
			expect(body).toContain('text-gray-900');
		});

		test('should render danger variant', () => {
			const { body } = render(Button, {
				props: {
					variant: 'danger',
					label: 'Danger',
				},
			});

			expect(body).toContain('bg-red-600');
			expect(body).toContain('hover:bg-red-700');
			expect(body).toContain('text-white');
		});
	});

	describe('Sizes', () => {
		test('should render small size', () => {
			const { body } = render(Button, {
				props: {
					size: 'sm',
					label: 'Small',
				},
			});

			expect(body).toContain('px-3 py-1.5');
			expect(body).toContain('text-sm');
		});

		test('should render medium size (default)', () => {
			const { body } = render(Button, {
				props: {
					size: 'md',
					label: 'Medium',
				},
			});

			expect(body).toContain('px-4 py-2');
			expect(body).toContain('text-base');
		});

		test('should render large size', () => {
			const { body } = render(Button, {
				props: {
					size: 'lg',
					label: 'Large',
				},
			});

			expect(body).toContain('px-6 py-3');
			expect(body).toContain('text-lg');
		});
	});

	describe('States', () => {
		test('should render disabled state', () => {
			const { body } = render(Button, {
				props: {
					disabled: true,
					label: 'Disabled',
				},
			});

			expect(body).toContain('disabled');
			expect(body).toContain('opacity-50');
			expect(body).toContain('cursor-not-allowed');
		});

		test('should render loading state', () => {
			const { body } = render(Button, {
				props: {
					loading: true,
					label: 'Loading',
				},
			});

			expect(body).toContain('opacity-50');
			expect(body).toContain('cursor-not-allowed');
			expect(body).toContain('disabled');
		});

		test('should render loading spinner', () => {
			const { body } = render(Button, {
				props: {
					loading: true,
					label: 'Loading',
				},
			});

			expect(body).toContain('data-testid="loading-spinner"');
			expect(body).toContain('animate-spin');
		});
	});

	describe('Custom Attributes', () => {
		test('should render custom class via rest props', () => {
			const { body } = render(Button, {
				props: {
					label: 'Custom',
					// @ts-expect-error - Testing rest props spread
					class: 'custom-class',
				},
			});

			expect(body).toContain('custom-class');
		});

		test('should render button type', () => {
			const { body } = render(Button, {
				props: {
					type: 'submit',
					label: 'Submit',
				},
			});

			expect(body).toContain('type="submit"');
		});

		test('should render data attributes via rest props', () => {
			const { body } = render(Button, {
				props: {
					label: 'Test',
					// @ts-expect-error - Testing rest props spread
					'data-custom': 'test-value',
				},
			});

			expect(body).toContain('data-custom="test-value"');
		});
	});

	describe('Accessibility', () => {
		test('should render proper button semantics', () => {
			const { body } = render(Button, {
				props: {
					label: 'Accessible Button',
				},
			});

			expect(body).toContain('<button');
			expect(body).toContain('Accessible Button');
		});

		test('should handle aria-label via rest props', () => {
			const { body } = render(Button, {
				props: {
					label: 'X',
					// @ts-expect-error - Testing rest props spread
					'aria-label': 'Close dialog',
				},
			});

			expect(body).toContain('aria-label="Close dialog"');
		});

		test('should handle aria-describedby via rest props', () => {
			const { body } = render(Button, {
				props: {
					label: 'Help',
					// @ts-expect-error - Testing rest props spread
					'aria-describedby': 'help-text',
				},
			});

			expect(body).toContain('aria-describedby="help-text"');
		});
	});

	describe('Content Rendering', () => {
		test('should render text content', () => {
			const { body } = render(Button, {
				props: {
					label: 'Simple Text',
				},
			});

			expect(body).toContain('Simple Text');
		});

		test('should handle empty label', () => {
			const { body } = render(Button, {
				props: {
					label: '',
				},
			});

			expect(body).toContain('<button');
			expect(body).toContain('</button>');
		});

		test('should render label with special characters', () => {
			const { body } = render(Button, {
				props: {
					label: 'Save & Continue',
				},
			});

			expect(body).toContain('Save &amp; Continue');
		});
	});

	describe('Combined Props', () => {
		test('should render multiple variants and sizes', () => {
			const { body } = render(Button, {
				props: {
					variant: 'primary',
					size: 'lg',
					label: 'Large Primary',
				},
			});

			expect(body).toContain('bg-blue-600');
			expect(body).toContain('px-6 py-3');
			expect(body).toContain('text-lg');
		});

		test('should render disabled loading button', () => {
			const { body } = render(Button, {
				props: {
					disabled: true,
					loading: true,
					label: 'Processing',
				},
			});

			expect(body).toContain('disabled');
			expect(body).toContain('opacity-50');
			expect(body).toContain('cursor-not-allowed');
			expect(body).toContain('data-testid="loading-spinner"');
		});

		test('should render complex button with all props', () => {
			const { body } = render(Button, {
				props: {
					variant: 'secondary',
					size: 'sm',
					type: 'button',
					label: 'Complex',
					// @ts-expect-error - Testing rest props spread
					'data-custom': 'test-value',
					'aria-label': 'Complex action',
				},
			});

			expect(body).toContain('bg-gray-200');
			expect(body).toContain('px-3 py-1.5');
			expect(body).toContain('text-sm');
			expect(body).toContain('type="button"');
			expect(body).toContain('data-custom="test-value"');
			expect(body).toContain('aria-label="Complex action"');
			expect(body).toContain('Complex');
		});
	});

	describe('SSR-Specific Tests', () => {
		test('should render without client-side JavaScript', () => {
			const { body } = render(Button, {
				props: {
					label: 'SSR Button',
				},
			});

			// Should render complete button without any client dependencies
			expect(body).toContain('<button');
			expect(body).toContain('class="btn');
			expect(body).toContain('SSR Button');
			expect(body).toContain('</button>');
		});

		test('should generate static HTML for SEO', () => {
			const { body } = render(Button, {
				props: {
					label: 'SEO Friendly Button',
				},
			});

			// Should be crawlable by search engines
			expect(body).toContain('SEO Friendly Button');
			expect(body).not.toContain('javascript:');
			expect(body).not.toContain('onclick=');
		});

		test('should render consistent markup', () => {
			const props = {
				variant: 'primary' as const,
				label: 'Consistent',
			};

			const result1 = render(Button, { props });
			const result2 = render(Button, { props });

			// Should render identical markup
			expect(result1.body).toBe(result2.body);
		});

		test('should include hydration markers', () => {
			const { body } = render(Button, {
				props: {
					label: 'Hydration Test',
				},
			});

			// Should include Svelte hydration markers
			expect(body).toContain('<!--[-->');
			expect(body).toContain('<!--]-->');
		});

		test('should render custom Tailwind classes (not DaisyUI)', () => {
			const { body } = render(Button, {
				props: {
					label: 'Custom Tailwind',
				},
			});

			// Should use custom Tailwind classes, not DaisyUI btn-* classes
			expect(body).toContain('bg-blue-600'); // Custom primary color
			expect(body).toContain('font-medium'); // Custom font weight
			expect(body).toContain('rounded-lg'); // Custom border radius
			expect(body).not.toContain('btn-primary'); // Not DaisyUI
		});
	});
});
