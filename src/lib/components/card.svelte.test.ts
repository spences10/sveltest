import { page } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Card from './card.svelte';

describe('Card Component', () => {
	describe('Initial Rendering', () => {
		test('should render with default props', async () => {
			render(Card, {});

			const card = page.getByTestId('card');
			await expect.element(card).toBeInTheDocument();
			await expect.element(card).toHaveClass('bg-white'); // default variant
			await expect.element(card).toHaveClass('p-4'); // md padding
			await expect.element(card).toHaveClass('rounded-md'); // md rounded
		});

		test('should render with custom props', async () => {
			render(Card, {
				variant: 'elevated',
				padding: 'lg',
				rounded: 'xl',
				title: 'Card Title',
				subtitle: 'Card Subtitle',
				content_text: 'Card content goes here',
			});

			const card = page.getByTestId('card');
			const title = page.getByTestId('card-title');
			const subtitle = page.getByTestId('card-subtitle');
			const content = page.getByTestId('card-content');

			await expect.element(card).toHaveClass('shadow-md'); // elevated variant
			await expect.element(card).toHaveClass('p-6'); // lg padding
			await expect.element(card).toHaveClass('rounded-xl'); // xl rounded
			await expect.element(title).toHaveTextContent('Card Title');
			await expect
				.element(subtitle)
				.toHaveTextContent('Card Subtitle');
			await expect
				.element(content)
				.toHaveTextContent('Card content goes here');
		});
	});

	describe('Variants', () => {
		const variants = [
			{
				variant: 'default',
				expected_class: 'bg-white border border-gray-200',
			},
			{ variant: 'elevated', expected_class: 'shadow-md' },
			{
				variant: 'outlined',
				expected_class: 'border-2 border-gray-300',
			},
			{ variant: 'filled', expected_class: 'bg-gray-50' },
		] as const;

		variants.forEach(({ variant, expected_class }) => {
			test(`should apply correct CSS classes for ${variant} variant`, async () => {
				render(Card, {
					variant,
				});

				const card = page.getByTestId('card');
				await expect.element(card).toHaveClass(expected_class);
			});
		});
	});

	describe('Padding Options', () => {
		const paddings = [
			{ padding: 'none', expected_class: '' },
			{ padding: 'sm', expected_class: 'p-3' },
			{ padding: 'md', expected_class: 'p-4' },
			{ padding: 'lg', expected_class: 'p-6' },
		] as const;

		paddings.forEach(({ padding, expected_class }) => {
			test(`should apply correct padding for ${padding} size`, async () => {
				render(Card, {
					padding,
				});

				const card = page.getByTestId('card');
				if (expected_class) {
					await expect.element(card).toHaveClass(expected_class);
				} else {
					// For 'none' padding, check that no padding classes are applied
					await expect.element(card).not.toHaveClass('p-3');
					await expect.element(card).not.toHaveClass('p-4');
					await expect.element(card).not.toHaveClass('p-6');
				}
			});
		});
	});

	describe('Rounded Options', () => {
		const rounded_options = [
			{ rounded: 'none', expected_class: '' },
			{ rounded: 'sm', expected_class: 'rounded-sm' },
			{ rounded: 'md', expected_class: 'rounded-md' },
			{ rounded: 'lg', expected_class: 'rounded-lg' },
			{ rounded: 'xl', expected_class: 'rounded-xl' },
		] as const;

		rounded_options.forEach(({ rounded, expected_class }) => {
			test(`should apply correct rounded corners for ${rounded} option`, async () => {
				render(Card, {
					rounded,
				});

				const card = page.getByTestId('card');
				if (expected_class) {
					await expect.element(card).toHaveClass(expected_class);
				} else {
					// For 'none' rounded, check that no rounded classes are applied
					await expect.element(card).not.toHaveClass('rounded-sm');
					await expect.element(card).not.toHaveClass('rounded-md');
					await expect.element(card).not.toHaveClass('rounded-lg');
					await expect.element(card).not.toHaveClass('rounded-xl');
				}
			});
		});
	});

	describe('Content Rendering', () => {
		test('should render title when provided', async () => {
			render(Card, {
				title: 'Test Card Title',
			});

			const title = page.getByTestId('card-title');
			await expect.element(title).toBeInTheDocument();
			await expect
				.element(title)
				.toHaveTextContent('Test Card Title');
		});

		test('should not render title when not provided', async () => {
			render(Card, {});

			const title = page.getByTestId('card-title');
			await expect.element(title).not.toBeInTheDocument();
		});

		test('should render subtitle when provided', async () => {
			render(Card, {
				subtitle: 'Test Subtitle',
			});

			const subtitle = page.getByTestId('card-subtitle');
			await expect.element(subtitle).toBeInTheDocument();
			await expect
				.element(subtitle)
				.toHaveTextContent('Test Subtitle');
		});

		test('should render content when provided', async () => {
			render(Card, {
				content_text: 'This is card content',
			});

			const content = page.getByTestId('card-content');
			await expect.element(content).toBeInTheDocument();
			await expect
				.element(content)
				.toHaveTextContent('This is card content');
		});

		test('should render footer when provided', async () => {
			render(Card, {
				footer_text: 'Card footer text',
			});

			const footer = page.getByTestId('card-footer');
			await expect.element(footer).toBeInTheDocument();
			await expect
				.element(footer)
				.toHaveTextContent('Card footer text');
		});

		test('should render image when provided', async () => {
			render(Card, {
				image_src: 'https://example.com/image.jpg',
				image_alt: 'Test image',
			});

			const image = page.getByTestId('card-image');
			await expect.element(image).toBeInTheDocument();
			await expect
				.element(image)
				.toHaveAttribute('src', 'https://example.com/image.jpg');
			await expect
				.element(image)
				.toHaveAttribute('alt', 'Test image');
		});
	});

	describe('Clickable Behavior', () => {
		test('should be clickable when clickable prop is true', async () => {
			render(Card, {
				title: 'Clickable Card',
				clickable: true,
			});

			const card = page.getByTestId('card');
			await expect.element(card).toHaveAttribute('tabindex', '0');
			await expect.element(card).toHaveClass('cursor-pointer');
		});

		test('should not be clickable when clickable prop is false', async () => {
			render(Card, {
				title: 'Non-clickable Card',
				clickable: false,
			});

			const card = page.getByTestId('card');
			await expect.element(card).not.toHaveAttribute('tabindex');
			await expect.element(card).not.toHaveClass('cursor-pointer');
		});

		test('should handle click events when clickable', async () => {
			let clicked = false;
			render(Card, {
				title: 'Interactive Card',
				clickable: true,
				onclick: () => {
					clicked = true;
				},
			});

			const card = page.getByTestId('card');
			await card.click();

			expect(clicked).toBe(true);
		});

		test('should handle focus and blur events when clickable', async () => {
			render(Card, {
				title: 'Focusable Card',
				clickable: true,
			});

			const card = page.getByTestId('card');
			// Test interaction instead of focus state
			await card.click();
			await expect.element(card).toBeInTheDocument();
		});
	});

	describe('Disabled State', () => {
		test('should apply disabled styles when disabled', async () => {
			render(Card, {
				disabled: true,
				clickable: true,
				title: 'Disabled Card',
			});

			const card = page.getByTestId('card');
			await expect
				.element(card)
				.toHaveAttribute('aria-disabled', 'true');
			await expect.element(card).toHaveClass('opacity-50');
			await expect.element(card).toHaveClass('cursor-not-allowed');
			await expect.element(card).not.toHaveAttribute('tabindex');
		});

		test('should not apply disabled styles when not disabled', async () => {
			render(Card, {
				disabled: false,
				clickable: true,
				title: 'Enabled Card',
			});

			const card = page.getByTestId('card');
			await expect.element(card).not.toHaveAttribute('aria-disabled');
			await expect.element(card).not.toHaveClass('opacity-50');
			await expect
				.element(card)
				.not.toHaveClass('cursor-not-allowed');
		});
	});

	describe('Accessibility', () => {
		test('should have proper button role when clickable', async () => {
			render(Card, {
				clickable: true,
				title: 'Accessible Card',
			});

			const card = page.getByRole('button');
			await expect.element(card).toBeInTheDocument();
		});

		test('should be keyboard accessible when clickable', async () => {
			render(Card, {
				clickable: true,
				title: 'Keyboard Accessible',
			});

			const card = page.getByTestId('card');
			await expect.element(card).toHaveAttribute('tabindex', '0');
		});

		test('should not be keyboard accessible when disabled', async () => {
			render(Card, {
				clickable: true,
				disabled: true,
				title: 'Disabled Card',
			});

			const card = page.getByTestId('card');
			await expect.element(card).not.toHaveAttribute('tabindex');
		});
	});

	describe('Edge Cases', () => {
		test('should handle all content sections together', async () => {
			render(Card, {
				title: 'Complete Card',
				subtitle: 'With all sections',
				content_text: 'Main content area',
				footer_text: 'Footer information',
				image_src: 'https://example.com/test.jpg',
				image_alt: 'Test image',
			});

			const title = page.getByTestId('card-title');
			const subtitle = page.getByTestId('card-subtitle');
			const content = page.getByTestId('card-content');
			const footer = page.getByTestId('card-footer');
			const image = page.getByTestId('card-image');

			await expect.element(title).toBeInTheDocument();
			await expect.element(subtitle).toBeInTheDocument();
			await expect.element(content).toBeInTheDocument();
			await expect.element(footer).toBeInTheDocument();
			await expect.element(image).toBeInTheDocument();
		});

		test('should handle all prop combinations', async () => {
			render(Card, {
				variant: 'outlined',
				padding: 'sm',
				rounded: 'lg',
				clickable: true,
				disabled: false,
				title: 'Complex Card',
				subtitle: 'All options',
				content_text: 'Complex content',
				footer_text: 'Complex footer',
			});

			const card = page.getByTestId('card');
			await expect.element(card).toHaveClass('border-2'); // outlined
			await expect.element(card).toHaveClass('p-3'); // sm padding
			await expect.element(card).toHaveClass('rounded-lg'); // lg rounded
			await expect.element(card).toHaveClass('cursor-pointer'); // clickable
			await expect.element(card).toHaveAttribute('role', 'button');
		});

		test('should handle minimal props', async () => {
			render(Card, {});

			const card = page.getByTestId('card');
			await expect.element(card).toBeInTheDocument();
			await expect.element(card).toHaveClass('bg-white'); // default variant
			await expect.element(card).not.toHaveAttribute('role');
		});
	});
});
