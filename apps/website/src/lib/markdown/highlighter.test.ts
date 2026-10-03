import { compile as compile_markdown } from 'mdsvex';
import { compile } from 'svelte/compiler';
import { describe, expect, test } from 'vite-plus/test';
import mdsvex_config from '../../../mdsvex.config.js';
import { highlight_code, render_code } from './highlighter.js';

describe('Twinkleplop highlighter', () => {
	test('highlights supported language aliases', () => {
		const output = highlight_code('const value = 42;', 'ts');

		expect(output).toContain('<CodeBlock ');
		expect(output).toContain('language-ts');
		expect(output).toContain('keyword');
		expect(output).toContain('label={"TypeScript"}');
		expect(output).toContain('icon={"M');
		expect(output).toContain('digits={1}');
	});

	test('highlights every language used by the docs', () => {
		for (const language of [
			'bash',
			'json',
			'svelte',
			'typescript',
			'yaml',
		]) {
			expect(highlight_code('a: "b"', language)).toContain(
				`language-${language}`,
			);
		}
	});

	test('falls back to escaped plain text for unknown languages', () => {
		const output = highlight_code(
			'<script>alert("no")</script>',
			'powershell',
		);

		expect(output).toContain('language-powershell');
		expect(output).toContain('&lt;script&gt;');
		expect(output).not.toContain('<script>');
		expect(output).toContain('label={"powershell"}');
	});

	test('supports line, word, number, and title metadata', () => {
		const output = render_code(
			'const total = 1;\nconst other = total;',
			'ts',
			'{2} /total/ :line-numbers=10 title="math.ts"',
		);

		expect(output).toContain('l highlight');
		expect(output).toContain('highlighted-word');
		expect(output).toContain('class="ln">10<');
		expect(output).toContain('twinkleplop-title">math.ts<');
	});
});

describe('mdsvex pipeline', () => {
	test('imports CodeBlock and compiles highlighted markdown', async () => {
		const source = [
			'# Example',
			'',
			'```svelte {1}',
			'<script>let { x } = $props();</script>',
			'{#if x}<p>{x}</p>{/if}',
			'```',
		].join('\n');
		const markdown = await compile_markdown(source, {
			...mdsvex_config,
			filename: 'example.md',
		});
		const code = markdown!.code;

		expect(code).toContain(
			"import CodeBlock from '#lib/components/code-block.svelte';",
		);
		expect(code).toContain('<CodeBlock ');
		expect(code).toContain('l highlight');

		const { warnings } = compile(code, {
			filename: 'example.svelte',
			runes: true,
		});
		expect(warnings).toEqual([]);
	});
});
