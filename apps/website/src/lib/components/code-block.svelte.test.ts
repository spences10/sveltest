import {
	afterEach,
	describe,
	expect,
	test,
	vi,
} from 'vite-plus/test';
import { page } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-svelte';
import CodeBlock from './code-block.svelte';

const html =
	'<pre class="twinkleplop language-ts"><code><span class="l"><span class="keyword">const</span> answer = 42;</span></code></pre>';

function code_text() {
	const clone = document
		.querySelector('pre code')
		?.cloneNode(true) as HTMLElement;
	clone
		?.querySelectorAll('.ln')
		.forEach((line_number) => line_number.remove());
	return clone?.textContent ?? '';
}

describe('CodeBlock', () => {
	afterEach(() => {
		vi.restoreAllMocks();
		document.documentElement.removeAttribute('data-line-numbers');
		document.cookie = 'line_numbers=; max-age=0; path=/';
	});

	test('highlights code and shows its language', async () => {
		await render(CodeBlock, {
			code: 'const answer = 42;',
			lang: 'typescript',
		});

		await expect
			.element(page.getByRole('img', { name: 'TypeScript' }))
			.toBeVisible();
		await expect.element(page.getByRole('code')).toBeInTheDocument();
		expect(code_text()).toBe('const answer = 42;');
		expect(document.querySelector('.keyword')).not.toBeNull();
	});

	test('renders pre-highlighted markdown without a default label', async () => {
		await render(CodeBlock, { html });

		await expect
			.element(page.getByRole('code'))
			.toHaveTextContent('const answer = 42;');
		await expect
			.element(page.getByText('JavaScript', { exact: true }))
			.not.toBeInTheDocument();
	});

	test('supports highlighted lines through fence metadata', async () => {
		await render(CodeBlock, {
			code: 'const first = 1;\nconst second = 2;',
			lang: 'typescript',
			meta: '{2}',
		});

		expect(
			document.querySelector('.l.highlight')?.textContent,
		).toContain('const second = 2;');
	});

	test('toggles line numbers and remembers the preference', async () => {
		await render(CodeBlock, {
			code: 'const first = 1;\nconst second = 2;',
			lang: 'typescript',
		});

		const toggle = page.getByRole('button', { name: 'Line numbers' });
		await expect
			.element(toggle)
			.toHaveAttribute('aria-pressed', 'false');
		expect(
			getComputedStyle(document.querySelector('.ln')!).display,
		).toBe('none');

		await toggle.click();

		await expect
			.element(toggle)
			.toHaveAttribute('aria-pressed', 'true');
		expect(
			document.documentElement.hasAttribute('data-line-numbers'),
		).toBe(true);
		expect(document.cookie).toContain('line_numbers=1');
		expect(
			getComputedStyle(document.querySelector('.ln')!).display,
		).toBe('inline-block');
	});

	test('copies code and announces success', async () => {
		const write_text = vi
			.spyOn(navigator.clipboard, 'writeText')
			.mockResolvedValue();
		await render(CodeBlock, { html, label: 'TypeScript' });

		await page.getByRole('button', { name: 'Copy code' }).click();

		expect(write_text).toHaveBeenCalledWith('const answer = 42;');
		await expect
			.element(page.getByRole('status'))
			.toHaveTextContent('Copied');
	});

	test('copies code without line numbers', async () => {
		const write_text = vi
			.spyOn(navigator.clipboard, 'writeText')
			.mockResolvedValue();
		await render(CodeBlock, {
			code: 'const first = 1;\nconst second = 2;',
			lang: 'typescript',
		});

		await page.getByRole('button', { name: 'Copy code' }).click();

		expect(write_text).toHaveBeenCalledWith(
			'const first = 1;\nconst second = 2;',
		);
	});

	test('announces a failed copy', async () => {
		vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(
			new DOMException('Denied', 'NotAllowedError'),
		);
		await render(CodeBlock, { html });

		await page.getByRole('button', { name: 'Copy code' }).click();

		await expect
			.element(page.getByRole('status'))
			.toHaveTextContent('Copy failed');
	});

	test('escapes unsupported languages as plain text', async () => {
		await render(CodeBlock, {
			code: '<script>alert("no")</script>',
			lang: 'powershell',
		});

		await expect.element(page.getByRole('code')).toBeInTheDocument();
		expect(code_text()).toBe('<script>alert("no")</script>');
		expect(document.querySelector('.code-block script')).toBeNull();
	});

	test('handles empty code', async () => {
		await render(CodeBlock, { code: '' });

		await expect.element(page.getByRole('code')).toBeInTheDocument();
		expect(code_text()).toBe('');
	});
});
