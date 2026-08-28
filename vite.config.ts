import { defineConfig } from 'vite-plus';

export default defineConfig({
	fmt: {
		useTabs: true,
		singleQuote: true,
		printWidth: 70,
		trailingComma: 'all',
		proseWrap: 'always',
		svelte: true,
		sortTailwindcss: {
			stylesheet: './apps/website/src/app.css',
		},
		ignorePatterns: [
			'**/.svelte-kit/**',
			'**/build/**',
			'**/coverage/**',
			'**/dist/**',
			'**/playwright-report/**',
			'**/test-results/**',
			'package-lock.json',
			'pnpm-lock.yaml',
			'yarn.lock',
			'.claude/settings.local.json',
		],
	},
	lint: {
		ignorePatterns: [
			'**/.svelte-kit/**',
			'**/build/**',
			'**/coverage/**',
			'**/dist/**',
			'**/playwright-report/**',
			'**/test-results/**',
		],
		options: {
			typeAware: true,
			typeCheck: true,
		},
	},
});
