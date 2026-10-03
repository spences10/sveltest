import { render } from 'svelte/server';
import { describe, expect, test } from 'vite-plus/test';
import CodeBlock from './code-block.svelte';

describe('CodeBlock SSR', () => {
	test('renders highlighted code without client-side enhancement', () => {
		const { body } = render(CodeBlock, {
			props: {
				code: 'const hello = "world";',
				lang: 'typescript',
			},
		});

		expect(body).toContain('class="twinkleplop language-typescript');
		expect(body).toContain('class="tok keyword"');
		expect(body).toContain('TypeScript');
	});

	test('renders line highlights from metadata', () => {
		const { body } = render(CodeBlock, {
			props: {
				code: 'const first = 1;\nconst second = 2;',
				lang: 'typescript',
				meta: '{2}',
			},
		});

		expect(body).toContain('class="l highlight"');
	});

	test('escapes unknown languages', () => {
		const { body } = render(CodeBlock, {
			props: {
				code: '<script>alert("no")</script>',
				lang: 'powershell',
			},
		});

		expect(body).toContain('&lt;script&gt;');
		expect(body).not.toContain('<script>alert');
	});

	test('handles empty code', () => {
		const { body } = render(CodeBlock, { props: { code: '' } });

		expect(body).toContain('<pre');
		expect(body).toContain('<code>');
	});
});
