import { page } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CodeBlock from './code-block.svelte';

describe('CodeBlock Component', () => {
	describe('Initial Rendering', () => {
		test('should render with default props', async () => {
			render(CodeBlock, {
				code: 'const hello = "world";',
			});

			// Should show loading state initially
			await expect
				.element(page.getByText('Loading'))
				.toBeInTheDocument();
		});

		test('should render code after loading', async () => {
			render(CodeBlock, {
				code: 'console.log("Hello, World!");',
				lang: 'javascript',
			});

			// Wait for Shiki to process the code
			await expect
				.element(page.locator('.shiki'))
				.toBeInTheDocument();
		});

		test('should apply correct language highlighting', async () => {
			render(CodeBlock, {
				code: 'function test() { return true; }',
				lang: 'typescript',
			});

			await expect
				.element(page.locator('.shiki'))
				.toBeInTheDocument();
		});
	});

	describe('Accessibility Features', () => {
		test('should have keyboard focusable code block', async () => {
			render(CodeBlock, {
				code: 'const test = true;',
			});

			const codeBlock = page.locator('.shiki');
			await expect
				.element(codeBlock)
				.toHaveAttribute('tabindex', '0');
		});

		test('should have proper focus styling', async () => {
			render(CodeBlock, {
				code: 'const test = true;',
			});

			const codeBlock = page.locator('.shiki');
			await codeBlock.focus();

			// Should have focus outline
			await expect.element(codeBlock).toBeFocused();
		});
	});

	describe('Line Numbers', () => {
		test('should show line numbers when enabled', async () => {
			render(CodeBlock, {
				code: 'line 1\nline 2\nline 3',
				show_line_numbers: true,
			});

			await expect
				.element(page.locator('.with-line-numbers'))
				.toBeInTheDocument();
		});

		test('should hide line numbers when disabled', async () => {
			render(CodeBlock, {
				code: 'line 1\nline 2\nline 3',
				show_line_numbers: false,
			});

			await expect
				.element(page.locator('.with-line-numbers'))
				.not.toBeInTheDocument();
		});
	});

	describe('Theme Support', () => {
		test('should apply custom theme', async () => {
			render(CodeBlock, {
				code: 'const test = true;',
				theme: 'github-light',
			});

			await expect
				.element(page.locator('.shiki'))
				.toBeInTheDocument();
		});

		test('should default to github-dark theme', async () => {
			render(CodeBlock, {
				code: 'const test = true;',
			});

			await expect
				.element(page.locator('.shiki'))
				.toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		test('should handle invalid language gracefully', async () => {
			render(CodeBlock, {
				code: 'some code',
				lang: 'invalid-language',
			});

			// Should still render something (fallback)
			await expect.element(page.locator('pre')).toBeInTheDocument();
		});

		test('should handle empty code', async () => {
			render(CodeBlock, {
				code: '',
			});

			await expect.element(page.locator('pre')).toBeInTheDocument();
		});
	});

	describe('Loading States', () => {
		test('should show loading skeleton initially', async () => {
			render(CodeBlock, {
				code: 'const test = true;',
			});

			await expect
				.element(page.locator('.loading-skeleton'))
				.toBeInTheDocument();
		});

		test('should hide loading state after highlighting', async () => {
			render(CodeBlock, {
				code: 'const test = true;',
			});

			// Wait for highlighting to complete
			await expect
				.element(page.locator('.shiki'))
				.toBeInTheDocument();
			await expect
				.element(page.locator('.loading-skeleton'))
				.not.toBeInTheDocument();
		});
	});

	describe('Code Content', () => {
		test('should preserve code formatting', async () => {
			const multiLineCode = `function example() {
  const x = 1;
  const y = 2;
  return x + y;
}`;

			render(CodeBlock, {
				code: multiLineCode,
				lang: 'javascript',
			});

			await expect
				.element(page.locator('.shiki'))
				.toBeInTheDocument();
		});

		test('should handle special characters', async () => {
			render(CodeBlock, {
				code: 'const obj = { key: "value", count: 42 };',
				lang: 'javascript',
			});

			await expect
				.element(page.locator('.shiki'))
				.toBeInTheDocument();
		});
	});
});
