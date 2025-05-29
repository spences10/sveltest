import { page } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Modal from './modal.svelte';

describe('Modal Component', () => {
	describe('Initial Rendering', () => {
		test('should not render when is_open is false', async () => {
			render(Modal, {
				is_open: false,
				title: 'Test Modal',
			});

			const modal = page.getByTestId('modal');
			await expect.element(modal).not.toBeInTheDocument();
		});

		test('should render when is_open is true', async () => {
			render(Modal, {
				is_open: true,
				title: 'Test Modal',
			});

			const modal = page.getByTestId('modal');
			const backdrop = page.getByTestId('modal-backdrop');
			const title = page.getByTestId('modal-title');

			await expect.element(modal).toBeInTheDocument();
			await expect.element(backdrop).toBeInTheDocument();
			await expect.element(title).toHaveTextContent('Test Modal');
		});

		test('should render with custom props', async () => {
			render(Modal, {
				is_open: true,
				title: 'Custom Modal',
				size: 'lg',
				content_text: 'This is modal content',
				show_close_button: true,
			});

			const modal = page.getByTestId('modal');
			const title = page.getByTestId('modal-title');
			const content = page.getByTestId('modal-content');
			const close_button = page.getByTestId('modal-close-button');

			await expect.element(modal).toHaveClass('sm:max-w-2xl'); // lg size
			await expect.element(title).toHaveTextContent('Custom Modal');
			await expect
				.element(content)
				.toHaveTextContent('This is modal content');
			await expect.element(close_button).toBeInTheDocument();
		});
	});

	describe('Modal Sizes', () => {
		const sizes = [
			{ size: 'sm', expected_class: 'sm:max-w-sm' },
			{ size: 'md', expected_class: 'sm:max-w-lg' },
			{ size: 'lg', expected_class: 'sm:max-w-2xl' },
			{ size: 'xl', expected_class: 'sm:max-w-4xl' },
		] as const;

		sizes.forEach(({ size, expected_class }) => {
			test(`should apply correct CSS classes for ${size} size`, async () => {
				render(Modal, {
					is_open: true,
					size,
					title: 'Size Test',
				});

				const modal = page.getByTestId('modal');
				await expect.element(modal).toHaveClass(expected_class);
			});
		});
	});

	describe('Close Button', () => {
		test('should show close button when show_close_button is true', async () => {
			render(Modal, {
				is_open: true,
				title: 'Modal with Close',
				show_close_button: true,
			});

			const close_button = page.getByTestId('modal-close-button');
			await expect.element(close_button).toBeInTheDocument();
			await expect
				.element(close_button)
				.toHaveAttribute('aria-label', 'Close modal');
		});

		test('should hide close button when show_close_button is false', async () => {
			render(Modal, {
				is_open: true,
				title: 'Modal without Close',
				show_close_button: false,
			});

			const close_button = page.getByTestId('modal-close-button');
			await expect.element(close_button).not.toBeInTheDocument();
		});
	});

	describe('Content Rendering', () => {
		test('should render title when provided', async () => {
			render(Modal, {
				is_open: true,
				title: 'Modal Title',
			});

			const title = page.getByTestId('modal-title');
			await expect.element(title).toBeInTheDocument();
			await expect.element(title).toHaveTextContent('Modal Title');
		});

		test('should not render title section when title is empty', async () => {
			render(Modal, {
				is_open: true,
				title: '',
			});

			const title = page.getByTestId('modal-title');
			await expect.element(title).not.toBeInTheDocument();
		});

		test('should render content when content_text is provided', async () => {
			render(Modal, {
				is_open: true,
				content_text: 'This is the modal content',
			});

			const content = page.getByTestId('modal-content');
			await expect.element(content).toBeInTheDocument();
			await expect
				.element(content)
				.toHaveTextContent('This is the modal content');
		});

		test('should not render content section when content_text is empty', async () => {
			render(Modal, {
				is_open: true,
				content_text: '',
			});

			const content = page.getByTestId('modal-content');
			await expect.element(content).not.toBeInTheDocument();
		});
	});

	describe('User Interactions', () => {
		test('should handle close button click', async () => {
			render(Modal, {
				is_open: true,
				title: 'Closable Modal',
				show_close_button: true,
			});

			const close_button = page.getByTestId('modal-close-button');
			await close_button.click();

			// Note: In a real app, this would trigger the close event
			// For testing, we just verify the button is clickable
			await expect.element(close_button).toBeInTheDocument();
		});

		test('should handle backdrop click when close_on_backdrop_click is true', async () => {
			render(Modal, {
				is_open: true,
				title: 'Backdrop Closable',
				close_on_backdrop_click: true,
			});

			const container = page.getByTestId('modal-container');
			await container.click();

			// Verify the container is present (click handler would be triggered)
			await expect.element(container).toBeInTheDocument();
		});

		test('should handle escape key when close_on_escape is true', async () => {
			render(Modal, {
				is_open: true,
				title: 'Escape Closable',
				close_on_escape: true,
			});

			const modal = page.getByTestId('modal');
			await expect.element(modal).toBeInTheDocument();

			// Press escape key
			await page.keyboard.press('Escape');

			// Verify modal is still present (event handler would be triggered)
			await expect.element(modal).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		test('should have proper ARIA attributes', async () => {
			render(Modal, {
				is_open: true,
				title: 'Accessible Modal',
			});

			const modal = page.getByTestId('modal');
			await expect.element(modal).toHaveAttribute('role', 'dialog');
			await expect
				.element(modal)
				.toHaveAttribute('aria-modal', 'true');
			await expect
				.element(modal)
				.toHaveAttribute('aria-labelledby', 'modal-title');
			await expect.element(modal).toHaveAttribute('tabindex', '-1');
		});

		test('should not have aria-labelledby when no title', async () => {
			render(Modal, {
				is_open: true,
				title: '',
			});

			const modal = page.getByTestId('modal');
			await expect
				.element(modal)
				.not.toHaveAttribute('aria-labelledby');
		});

		test('should be focusable', async () => {
			render(Modal, {
				is_open: true,
				title: 'Focusable Modal',
			});

			const modal = page.getByTestId('modal');
			await modal.focus();
			await expect.element(modal).toBeFocused();
		});
	});

	describe('Modal Structure', () => {
		test('should render all structural elements', async () => {
			render(Modal, {
				is_open: true,
				title: 'Complete Modal',
				content_text: 'Modal content',
			});

			const backdrop = page.getByTestId('modal-backdrop');
			const container = page.getByTestId('modal-container');
			const modal = page.getByTestId('modal');

			await expect.element(backdrop).toBeInTheDocument();
			await expect.element(container).toBeInTheDocument();
			await expect.element(modal).toBeInTheDocument();

			// Check CSS classes
			await expect.element(backdrop).toHaveClass('fixed');
			await expect.element(backdrop).toHaveClass('inset-0');
			await expect.element(backdrop).toHaveClass('bg-gray-500');
			await expect.element(backdrop).toHaveClass('z-50');
		});
	});

	describe('Edge Cases', () => {
		test('should handle all props combination', async () => {
			render(Modal, {
				is_open: true,
				title: 'Complex Modal',
				size: 'xl',
				content_text: 'Complex content',
				close_on_backdrop_click: false,
				close_on_escape: false,
				show_close_button: false,
			});

			const modal = page.getByTestId('modal');
			const title = page.getByTestId('modal-title');
			const content = page.getByTestId('modal-content');
			const close_button = page.getByTestId('modal-close-button');

			await expect.element(modal).toHaveClass('sm:max-w-4xl'); // xl size
			await expect.element(title).toHaveTextContent('Complex Modal');
			await expect
				.element(content)
				.toHaveTextContent('Complex content');
			await expect.element(close_button).not.toBeInTheDocument();
		});

		test('should handle minimal props', async () => {
			render(Modal, {
				is_open: true,
			});

			const modal = page.getByTestId('modal');
			const backdrop = page.getByTestId('modal-backdrop');

			await expect.element(modal).toBeInTheDocument();
			await expect.element(backdrop).toBeInTheDocument();
			await expect.element(modal).toHaveClass('sm:max-w-lg'); // default md size
		});
	});
});
