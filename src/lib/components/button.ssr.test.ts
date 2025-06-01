import { render } from 'svelte/server';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Button from './button.svelte';

describe('Button Component SSR', () => {
	describe('Basic Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(Button, {
					props: {
						children: createRawSnippet(() => ({
							render: () => 'Click me',
						})),
					},
				});
			}).not.toThrow();
		});

		test('should render button element', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'Click me',
					})),
				},
			});

			expect(body).toContain('<button');
			expect(body).toContain('Click me');
		});

		test('should render with default classes', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'Click me',
					})),
				},
			});

			expect(body).toContain('class="btn');
			expect(body).toContain('btn-primary');
		});
	});

	describe('Variants', () => {
		test('should render primary variant', () => {
			const { body } = render(Button, {
				props: {
					variant: 'primary',
					children: createRawSnippet(() => ({
						render: () => 'Primary',
					})),
				},
			});

			expect(body).toContain('btn-primary');
		});

		test('should render secondary variant', () => {
			const { body } = render(Button, {
				props: {
					variant: 'secondary',
					children: createRawSnippet(() => ({
						render: () => 'Secondary',
					})),
				},
			});

			expect(body).toContain('btn-secondary');
		});

		test('should render outline variant', () => {
			const { body } = render(Button, {
				props: {
					variant: 'outline',
					children: createRawSnippet(() => ({
						render: () => 'Outline',
					})),
				},
			});

			expect(body).toContain('btn-outline');
		});

		test('should render ghost variant', () => {
			const { body } = render(Button, {
				props: {
					variant: 'ghost',
					children: createRawSnippet(() => ({
						render: () => 'Ghost',
					})),
				},
			});

			expect(body).toContain('btn-ghost');
		});
	});

	describe('Sizes', () => {
		test('should render small size', () => {
			const { body } = render(Button, {
				props: {
					size: 'sm',
					children: createRawSnippet(() => ({
						render: () => 'Small',
					})),
				},
			});

			expect(body).toContain('btn-sm');
		});

		test('should render medium size (default)', () => {
			const { body } = render(Button, {
				props: {
					size: 'md',
					children: createRawSnippet(() => ({
						render: () => 'Medium',
					})),
				},
			});

			// Medium size has no additional class in DaisyUI
			expect(body).toContain('class="btn');
			expect(body).not.toContain('btn-sm');
			expect(body).not.toContain('btn-lg');
		});

		test('should render large size', () => {
			const { body } = render(Button, {
				props: {
					size: 'lg',
					children: createRawSnippet(() => ({
						render: () => 'Large',
					})),
				},
			});

			expect(body).toContain('btn-lg');
		});
	});

	describe('States', () => {
		test('should render disabled state', () => {
			const { body } = render(Button, {
				props: {
					disabled: true,
					children: createRawSnippet(() => ({
						render: () => 'Disabled',
					})),
				},
			});

			expect(body).toContain('disabled');
		});

		test('should render loading state', () => {
			const { body } = render(Button, {
				props: {
					loading: true,
					children: createRawSnippet(() => ({
						render: () => 'Loading',
					})),
				},
			});

			expect(body).toContain('loading-spinner');
			expect(body).toContain('Loading...');
		});

		test('should render loading spinner', () => {
			const { body } = render(Button, {
				props: {
					loading: true,
					children: createRawSnippet(() => ({
						render: () => 'Loading',
					})),
				},
			});

			expect(body).toContain('loading loading-spinner loading-sm');
		});
	});

	describe('Custom Attributes', () => {
		test('should render custom class via class_names prop', () => {
			const { body } = render(Button, {
				props: {
					class_names: 'custom-class',
					children: createRawSnippet(() => ({
						render: () => 'Custom',
					})),
				},
			});

			expect(body).toContain('custom-class');
		});

		test('should render button type', () => {
			const { body } = render(Button, {
				props: {
					type: 'submit',
					children: createRawSnippet(() => ({
						render: () => 'Submit',
					})),
				},
			});

			expect(body).toContain('type="submit"');
		});
	});

	describe('Accessibility', () => {
		test('should render proper button semantics', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'Accessible Button',
					})),
				},
			});

			expect(body).toContain('<button');
			expect(body).toContain('Accessible Button');
		});

		test('should handle aria-disabled for loading state', () => {
			const { body } = render(Button, {
				props: {
					loading: true,
					children: createRawSnippet(() => ({
						render: () => 'Loading',
					})),
				},
			});

			expect(body).toContain('aria-disabled="true"');
		});

		test('should handle aria-disabled for disabled state', () => {
			const { body } = render(Button, {
				props: {
					disabled: true,
					children: createRawSnippet(() => ({
						render: () => 'Disabled',
					})),
				},
			});

			expect(body).toContain('aria-disabled="true"');
		});
	});

	describe('Content Rendering', () => {
		test('should render text content', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'Simple Text',
					})),
				},
			});

			expect(body).toContain('Simple Text');
		});

		test('should handle empty children', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => '',
					})),
				},
			});

			expect(body).toContain('<button');
		});

		test('should render children with special characters', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'Save & Continue',
					})),
				},
			});

			expect(body).toContain('Save & Continue');
		});
	});

	describe('Combined Props', () => {
		test('should render multiple variants and sizes', () => {
			const { body } = render(Button, {
				props: {
					variant: 'secondary',
					size: 'lg',
					children: createRawSnippet(() => ({
						render: () => 'Large Secondary',
					})),
				},
			});

			expect(body).toContain('btn-secondary');
			expect(body).toContain('btn-lg');
		});

		test('should render disabled loading button', () => {
			const { body } = render(Button, {
				props: {
					disabled: true,
					loading: true,
					children: createRawSnippet(() => ({
						render: () => 'Disabled Loading',
					})),
				},
			});

			expect(body).toContain('disabled');
			expect(body).toContain('loading-spinner');
			expect(body).toContain('aria-disabled="true"');
		});

		test('should render complex button with all props', () => {
			const { body } = render(Button, {
				props: {
					variant: 'outline',
					size: 'sm',
					type: 'submit',
					class_names: 'my-custom-class',
					children: createRawSnippet(() => ({
						render: () => 'Complex Button',
					})),
				},
			});

			expect(body).toContain('btn-outline');
			expect(body).toContain('btn-sm');
			expect(body).toContain('type="submit"');
			expect(body).toContain('my-custom-class');
			expect(body).toContain('Complex Button');
		});
	});

	describe('SSR-Specific Tests', () => {
		test('should render without client-side JavaScript', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'SSR Button',
					})),
				},
			});

			expect(body).toContain('SSR Button');
			expect(body).toContain('<button');
		});

		test('should generate static HTML for SEO', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'SEO Friendly Button',
					})),
				},
			});

			expect(body).toContain('SEO Friendly Button');
		});

		test('should render consistent markup', () => {
			const result1 = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'Test',
					})),
				},
			});
			const result2 = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'Test',
					})),
				},
			});

			expect(result1.body).toBe(result2.body);
		});

		test('should include hydration markers', () => {
			const { body } = render(Button, {
				props: {
					children: createRawSnippet(() => ({
						render: () => 'Hydration Test',
					})),
				},
			});

			// Svelte 5 uses different hydration markers
			expect(body).toContain('<!--[-->');
		});

		test('should render DaisyUI classes (not custom Tailwind)', () => {
			const { body } = render(Button, {
				props: {
					variant: 'primary',
					children: createRawSnippet(() => ({
						render: () => 'DaisyUI Button',
					})),
				},
			});

			expect(body).toContain('btn-primary');
			expect(body).toContain('hover:scale-105');
		});
	});
});
