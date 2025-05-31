import { page } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Input from './input.svelte';

describe('Input Component', () => {
	describe('Initial Rendering', () => {
		test('should render with default props', async () => {
			render(Input, {
				label: 'Test Input',
			});

			const input = page.getByTestId('input');
			const label = page.getByTestId('input-label');

			await expect.element(input).toBeInTheDocument();
			await expect.element(label).toBeInTheDocument();
			await expect.element(input).toHaveAttribute('type', 'text');
			await expect.element(label).toHaveTextContent('Test Input');
		});

		test('should render with custom props', async () => {
			render(Input, {
				type: 'email',
				placeholder: 'Enter email',
				label: 'Email Address',
				size: 'lg',
				variant: 'success',
				required: true,
			});

			const input = page.getByTestId('input');
			const label = page.getByTestId('input-label');
			const required_indicator = page.getByTestId(
				'required-indicator',
			);

			await expect.element(input).toHaveAttribute('type', 'email');
			await expect
				.element(input)
				.toHaveAttribute('placeholder', 'Enter email');
			await expect.element(input).toHaveAttribute('required');
			await expect.element(label).toHaveTextContent('Email Address');
			await expect.element(required_indicator).toBeInTheDocument();
			await expect.element(input).toHaveClass('px-4'); // lg size
			await expect.element(input).toHaveClass('ring-green-300'); // success variant
		});
	});

	describe('CSS Classes and Styling', () => {
		const sizes = [
			{ size: 'sm', expected_class: 'px-2.5' },
			{ size: 'md', expected_class: 'px-3' },
			{ size: 'lg', expected_class: 'px-4' },
		] as const;

		sizes.forEach(({ size, expected_class }) => {
			test(`should apply correct CSS classes for ${size} size`, async () => {
				render(Input, {
					size,
					label: 'Test',
				});

				const input = page.getByTestId('input');
				await expect.element(input).toHaveClass(expected_class);
			});
		});

		const variants = [
			{ variant: 'default', expected_class: 'ring-gray-300' },
			{ variant: 'success', expected_class: 'ring-green-300' },
			{ variant: 'error', expected_class: 'ring-red-300' },
		] as const;

		variants.forEach(({ variant, expected_class }) => {
			test(`should apply correct CSS classes for ${variant} variant`, async () => {
				render(Input, {
					variant,
					label: 'Test',
				});

				const input = page.getByTestId('input');
				await expect.element(input).toHaveClass(expected_class);
			});
		});
	});

	describe('Input Types', () => {
		const input_types = [
			'text',
			'email',
			'password',
			'number',
			'tel',
			'url',
		] as const;

		input_types.forEach((type) => {
			test(`should render with ${type} input type`, async () => {
				render(Input, {
					type,
					label: `${type} input`,
				});

				const input = page.getByTestId('input');
				await expect.element(input).toHaveAttribute('type', type);
			});
		});
	});

	describe('Validation and Error States', () => {
		test('should show error message when error prop is provided', async () => {
			render(Input, {
				label: 'Test Input',
				error: 'This field is required',
			});

			const input = page.getByTestId('input');
			const error_message = page.getByTestId('input-error');

			await expect.element(error_message).toBeInTheDocument();
			await expect
				.element(error_message)
				.toHaveTextContent('This field is required');
			await expect
				.element(input)
				.toHaveAttribute('aria-invalid', 'true');
			await expect.element(input).toHaveClass('ring-red-300'); // error styling
		});

		test('should not show error message when no error', async () => {
			render(Input, {
				label: 'Test Input',
			});

			const input = page.getByTestId('input');
			const error_message = page.getByTestId('input-error');

			await expect.element(error_message).not.toBeInTheDocument();
			await expect
				.element(input)
				.toHaveAttribute('aria-invalid', 'false');
		});

		test('should show required indicator when required', async () => {
			render(Input, {
				label: 'Required Field',
				required: true,
			});

			const required_indicator = page.getByTestId(
				'required-indicator',
			);
			await expect.element(required_indicator).toBeInTheDocument();
			await expect.element(required_indicator).toHaveTextContent('*');
		});
	});

	describe('Disabled and Readonly States', () => {
		test('should apply disabled styles when disabled', async () => {
			render(Input, {
				label: 'Disabled Input',
				disabled: true,
			});

			const input = page.getByTestId('input');
			await expect.element(input).toBeDisabled();
			await expect.element(input).toHaveClass('bg-gray-50');
			await expect.element(input).toHaveClass('cursor-not-allowed');
		});

		test('should apply readonly styles when readonly', async () => {
			render(Input, {
				label: 'Readonly Input',
				readonly: true,
			});

			const input = page.getByTestId('input');
			await expect.element(input).toHaveAttribute('readonly');
			await expect.element(input).toHaveClass('bg-gray-50');
		});
	});

	describe('User Interactions', () => {
		test('should handle input events', async () => {
			render(Input, {
				label: 'Interactive Input',
			});

			const input = page.getByTestId('input');
			await input.fill('test value');

			await expect.element(input).toHaveValue('test value');
		});

		test('should handle focus and blur events', async () => {
			render(Input, {
				label: 'Focus Test',
			});

			const input = page.getByTestId('input');
			await input.click();
			await input.fill('focused');
			await expect.element(input).toHaveValue('focused');
		});
	});

	describe('Accessibility', () => {
		test('should have proper label association', async () => {
			render(Input, {
				label: 'Accessible Input',
			});

			const input = page.getByLabelText('Accessible Input');
			await expect.element(input).toBeInTheDocument();
		});

		test('should have proper ARIA attributes for errors', async () => {
			render(Input, {
				label: 'Error Input',
				error: 'Invalid input',
			});

			const input = page.getByTestId('input');
			await expect
				.element(input)
				.toHaveAttribute('aria-invalid', 'true');
			await expect.element(input).toHaveAttribute('aria-describedby');
		});

		test('should generate unique IDs when not provided', async () => {
			render(Input, {
				label: 'Auto ID Input',
			});

			const input = page.getByTestId('input');
			await expect.element(input).toHaveAttribute('id');
			const element = input.element();
			const id = element.id;
			expect(id).toMatch(/^input-[a-z0-9]+$/);
		});
	});

	describe('Edge Cases', () => {
		test('should handle empty label gracefully', async () => {
			render(Input, {});

			const input = page.getByTestId('input');
			const label = page.getByTestId('input-label');

			await expect.element(input).toBeInTheDocument();
			await expect.element(label).not.toBeInTheDocument();
		});

		test('should handle number input type', async () => {
			render(Input, {
				type: 'number',
				label: 'Number Input',
			});

			const input = page.getByTestId('input');
			await input.fill('123');

			await expect.element(input).toHaveValue(123);
		});

		test('should handle all prop combinations', async () => {
			render(Input, {
				type: 'email',
				label: 'Complex Input',
				placeholder: 'Enter email',
				error: 'Invalid email',
				size: 'sm',
				variant: 'error',
				required: true,
				maxlength: 50,
				pattern: '[a-z]+@[a-z]+\\.[a-z]+',
			});

			const input = page.getByTestId('input');
			const error_message = page.getByTestId('input-error');
			const required_indicator = page.getByTestId(
				'required-indicator',
			);

			await expect.element(input).toHaveAttribute('type', 'email');
			await expect.element(input).toHaveAttribute('maxlength', '50');
			await expect
				.element(input)
				.toHaveAttribute('pattern', '[a-z]+@[a-z]+\\.[a-z]+');
			await expect.element(input).toHaveAttribute('required');
			await expect.element(error_message).toBeInTheDocument();
			await expect.element(required_indicator).toBeInTheDocument();
			await expect.element(input).toHaveClass('px-2.5'); // sm size
		});
	});
});
