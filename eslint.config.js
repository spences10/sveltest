import svelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';

// Svelte-only ESLint config — JS/TS linting handled by vite-plus (oxlint)
export default [
	...svelte.configs.recommended,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				svelteConfig,
			},
		},
	},
	{
		ignores: [
			'**/node_modules/**',
			'**/.svelte-kit/**',
			'**/build/**',
			'**/dist/**',
		],
	},
];
