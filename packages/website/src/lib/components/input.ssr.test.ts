import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Input from './input.svelte';

describe('Input Component SSR', () => {
	describe('Server-Side Rendering', () => {
		test('should render without errors', () => {
			expect(() => {
				render(Input, {
					props: {
						label: 'Test Input',
					},
				});
			}).not.toThrow();
		});

		test('should render essential form elements for SEO', () => {
			const { body } = render(Input, {
				props: {
					label: 'Email Address',
					type: 'email',
					name: 'email',
					required: true,
				},
			});

			// Essential HTML structure
			expect(body).toContain('<input');
			expect(body).toContain('type="email"');
			expect(body).toContain('name="email"');
			expect(body).toContain('required');
			expect(body).toContain('<label');
			expect(body).toContain('Email Address');
		});

		test('should render error state for accessibility', () => {
			const { body } = render(Input, {
				props: {
					label: 'Email',
					error: 'This field is required',
				},
			});

			expect(body).toContain('This field is required');
			expect(body).toContain('aria-invalid="true"');
			expect(body).toContain('role="alert"');
		});

		test('should render without label when not provided', () => {
			const { body } = render(Input, {
				props: {},
			});

			expect(body).toContain('<input');
			expect(body).not.toContain('<label');
		});

		test('should render with initial value', () => {
			const { body } = render(Input, {
				props: {
					label: 'Username',
					value: 'john_doe',
				},
			});

			expect(body).toContain('value="john_doe"');
		});

		test('should handle complex prop combinations', () => {
			expect(() => {
				render(Input, {
					props: {
						type: 'email',
						label: 'Email',
						placeholder: 'Enter email',
						error: 'Invalid email',
						required: true,
						name: 'user_email',
						value: 'test@example.com',
					},
				});
			}).not.toThrow();
		});
	});
});
