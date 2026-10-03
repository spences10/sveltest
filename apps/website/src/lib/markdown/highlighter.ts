import { language as bash } from '@twinkleplop/bash';
import { language as javascript } from '@twinkleplop/javascript';
import { language as json } from '@twinkleplop/json';
import { create_renderer } from '@twinkleplop/markdown-core';
import { language as svelte } from '@twinkleplop/svelte';
import { language as typescript } from '@twinkleplop/typescript';
import { language as yaml } from '@twinkleplop/yaml';
import {
	language_icon as icon_for,
	language_label as label_for,
} from './language-icons.js';

const renderer = create_renderer({
	languages: {
		bash: bash(),
		javascript: javascript(),
		json: json(),
		svelte: svelte(),
		typescript: typescript(),
		yaml: yaml(),
		js: 'javascript',
		sh: 'bash',
		shell: 'bash',
		ts: 'typescript',
		yml: 'yaml',
		zsh: 'bash',
	},
	on_unknown_language: 'plain',
	line_numbers: true,
	render: { attributes: { tabindex: 0 } },
});

function normalise_language(language?: string | null) {
	const value = language?.toLowerCase().split(':', 1)[0];
	return value?.replaceAll(/[^a-z0-9_-]/g, '-') || 'text';
}

export function language_icon(language?: string | null) {
	return icon_for(normalise_language(language));
}

export function language_label(language?: string | null) {
	const normalised = normalise_language(language);
	return normalised === 'text' ? undefined : label_for(normalised);
}

export function render_code(
	code: string,
	language?: string | null,
	meta?: string | null,
) {
	return (
		renderer.fence(
			normalise_language(language),
			meta ?? undefined,
			code,
		) ?? ''
	);
}

/**
 * mdsvex highlighter supporting Shiki, VitePress, and
 * rehype-pretty-code fence metadata such as `{1,3-4}`, `/word/`,
 * `:line-numbers=10`, and `title="file.ts"`.
 */
export function highlight_code(
	code: string,
	language?: string | null,
	meta?: string | null,
) {
	const html = render_code(code, language, meta);
	const label = language_label(language);
	const icon = language_icon(language);
	const last_line = html.match(/class="ln">(\d+)</g)?.at(-1) ?? '';
	const digits = Math.max(1, last_line.replace(/\D/g, '').length);
	const props = [
		`html={${JSON.stringify(html)}}`,
		`digits={${digits}}`,
		label && `label={${JSON.stringify(label)}}`,
		icon && `icon={${JSON.stringify(icon)}}`,
	];

	return `<CodeBlock ${props.filter(Boolean).join(' ')} />`;
}
