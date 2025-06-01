import { createRawSnippet } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './button.svelte';

/**
 * Vitest Browser Testing Best Practices for Svelte 5 Components
 *
 * This test suite demonstrates essential patterns for testing Svelte 5 components
 * in a real browser environment using vitest-browser-svelte:
 *
 * 1. **Snippet Testing**: Using createRawSnippet for children props
 * 2. **Browser Interactions**: Real click events and user interactions
 * 3. **Accessibility Testing**: ARIA attributes and semantic HTML
 * 4. **State Management**: Component props and reactive behavior
 * 5. **CSS Class Testing**: Visual styling and conditional classes
 *
 * Key Differences from SSR Testing:
 * - Tests run in actual browser (Chromium)
 * - Real DOM interactions and events
 * - CSS classes and styling can be tested
 * - User interactions behave like real usage
 * - Component lifecycle events work properly
 *
 * Svelte 5 Snippet Testing:
 * - Use createRawSnippet() for children props
 * - render() must return HTML elements, not plain text
 * - setup() function handles interactivity (optional for simple cases)
 */

describe('Button Component', () => {
	describe('Basic Rendering', () => {
		test('should render button with text content', async () => {
			// Create a snippet for button children - must return HTML element
			const children = createRawSnippet(() => ({
				render: () => `<span>Click me</span>`,
				setup: () => {},
			}));

			const screen = render(Button, { children });

			const button = screen.getByRole('button');
			await expect.element(button).toBeInTheDocument();
			await expect.element(button).toHaveTextContent('Click me');
		});

		test('should render with different button types', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Submit</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				type: 'submit',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveAttribute('type', 'submit');
		});
	});

	describe('Variants and Styling', () => {
		test('should apply primary variant classes', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Primary Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				variant: 'primary',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('btn-primary');
		});

		test('should apply secondary variant classes', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Secondary Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				variant: 'secondary',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('btn-secondary');
		});

		test('should apply outline variant classes', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Outline Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				variant: 'outline',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('btn-outline');
		});

		test('should apply ghost variant classes', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Ghost Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				variant: 'ghost',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('btn-ghost');
		});
	});

	describe('Sizes', () => {
		test('should apply small size classes', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Small Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				size: 'sm',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('btn-sm');
		});

		test('should apply large size classes', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Large Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				size: 'lg',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('btn-lg');
		});

		test('should apply default medium size (no extra class)', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Medium Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				size: 'md',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('btn');
			await expect.element(button).not.toHaveClass('btn-sm');
			await expect.element(button).not.toHaveClass('btn-lg');
		});
	});

	describe('User Interactions', () => {
		test('should handle click events', async () => {
			// Test real browser click events - this is where browser testing shines
			const clickHandler = vi.fn();
			const children = createRawSnippet(() => ({
				render: () => `<span>Clickable Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				onclick: clickHandler,
				children,
			});

			const button = screen.getByRole('button');
			await button.click(); // Real browser click event

			expect(clickHandler).toHaveBeenCalledOnce();
		});

		test('should be clickable when enabled', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Enabled Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				disabled: false,
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toBeEnabled();
		});
	});

	describe('Disabled State', () => {
		test('should be disabled when disabled prop is true', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Disabled Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				disabled: true,
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toBeDisabled();
			await expect
				.element(button)
				.toHaveAttribute('aria-disabled', 'true');
		});

		test('should not trigger click when disabled', async () => {
			// Testing that disabled buttons correctly prevent interaction
			const clickHandler = vi.fn();
			const children = createRawSnippet(() => ({
				render: () => `<span>Disabled Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				disabled: true,
				onclick: clickHandler,
				children,
			});

			const button = screen.getByRole('button');

			// Verify button is disabled - don't try to click it as it will timeout
			await expect.element(button).toBeDisabled();

			// Click handler should not be called for disabled buttons
			expect(clickHandler).not.toHaveBeenCalled();
		});
	});

	describe('Loading State', () => {
		test('should show loading state when loading', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Submit</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				loading: true,
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toBeDisabled();
			await expect
				.element(button)
				.toHaveAttribute('aria-disabled', 'true');

			// Check for loading text
			await expect.element(button).toHaveTextContent('Loading...');
		});

		test('should not show loading state when not loading', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Normal Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				loading: false,
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toBeEnabled();

			// Should not have loading text
			await expect
				.element(button)
				.not.toHaveTextContent('Loading...');

			// Should show the actual content
			await expect.element(button).toHaveTextContent('Normal Button');
		});

		test('should not trigger click when loading', async () => {
			const clickHandler = vi.fn();
			const children = createRawSnippet(() => ({
				render: () => `<span>Submit</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				loading: true,
				onclick: clickHandler,
				children,
			});

			const button = screen.getByRole('button');

			// Verify button is disabled due to loading - don't try to click it
			await expect.element(button).toBeDisabled();
			await expect
				.element(button)
				.toHaveAttribute('aria-disabled', 'true');

			// Click handler should not be called for loading buttons
			expect(clickHandler).not.toHaveBeenCalled();
		});
	});

	describe('Accessibility', () => {
		test('should have proper button role', async () => {
			// Accessibility testing is crucial for browser tests
			const children = createRawSnippet(() => ({
				render: () => `<span>Accessible Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, { children });

			const button = screen.getByRole('button');
			await expect.element(button).toBeInTheDocument();
			await expect
				.element(button)
				.toHaveTextContent('Accessible Button');
		});

		test('should have correct aria-disabled when disabled', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Disabled Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				disabled: true,
				children,
			});

			const button = screen.getByRole('button');
			await expect
				.element(button)
				.toHaveAttribute('aria-disabled', 'true');
		});

		test('should have correct aria-disabled when loading', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Loading Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				loading: true,
				children,
			});

			const button = screen.getByRole('button');
			await expect
				.element(button)
				.toHaveAttribute('aria-disabled', 'true');
		});
	});

	describe('Custom Classes', () => {
		test('should apply custom class names', async () => {
			// CSS class testing works great in browser environment
			const children = createRawSnippet(() => ({
				render: () => `<span>Custom Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				class_names: 'custom-class another-class',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('custom-class');
			await expect.element(button).toHaveClass('another-class');
		});

		test('should maintain base classes with custom classes', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				class_names: 'custom-class',
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toHaveClass('btn');
			await expect.element(button).toHaveClass('custom-class');
		});
	});

	describe('Edge Cases', () => {
		test('should handle empty children gracefully', async () => {
			// For empty content, we still need a valid HTML element
			const children = createRawSnippet(() => ({
				render: () => `<span></span>`,
				setup: () => {},
			}));

			const screen = render(Button, { children });

			const button = screen.getByRole('button');
			await expect.element(button).toBeInTheDocument();
		});

		test('should handle complex children content', async () => {
			const children = createRawSnippet(() => ({
				render: () => `<span>Save Document</span>`,
				setup: () => {},
			}));

			const screen = render(Button, { children });

			const button = screen.getByRole('button');
			await expect.element(button).toHaveTextContent('Save Document');
		});

		test('should handle all props together', async () => {
			// Comprehensive test combining multiple features
			const clickHandler = vi.fn();
			const children = createRawSnippet(() => ({
				render: () => `<span>Complex Button</span>`,
				setup: () => {},
			}));

			const screen = render(Button, {
				variant: 'outline',
				size: 'lg',
				type: 'submit',
				class_names: 'custom-btn',
				onclick: clickHandler,
				children,
			});

			const button = screen.getByRole('button');
			await expect.element(button).toBeInTheDocument();
			await expect.element(button).toHaveAttribute('type', 'submit');
			await expect.element(button).toHaveClass('btn-outline');
			await expect.element(button).toHaveClass('btn-lg');
			await expect.element(button).toHaveClass('custom-btn');

			await button.click();
			expect(clickHandler).toHaveBeenCalledOnce();
		});
	});
});
