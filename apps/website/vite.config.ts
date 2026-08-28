const vitest_browser_runner = globalThis as typeof globalThis & {
	__vitest_browser_runner__?: {
		wrapDynamicImport: <T>(factory: () => Promise<T>) => Promise<T>;
	};
};

vitest_browser_runner.__vitest_browser_runner__ ??= {
	wrapDynamicImport: (factory) => factory(),
};

import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],

	test: {
		projects: [
			{
				// Client-side tests (Svelte components)
				extends: './vite.config.ts',
				test: {
					name: 'client',
					// Timeout for browser tests - prevent hanging on element lookups
					testTimeout: 2000,
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [
							{ browser: 'chromium' },
							// { browser: 'firefox' },
							// { browser: 'webkit' },
						],
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: [
						'src/lib/server/**',
						'src/**/*.ssr.{test,spec}.{js,ts}',
					],
					setupFiles: ['vitest-browser-svelte'],
				},
			},
			{
				// SSR tests (Server-side rendering)
				extends: './vite.config.ts',
				test: {
					name: 'ssr',
					environment: 'node',
					include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
				},
			},
			{
				// Server-side tests (Node.js utilities)
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'src/**/*.ssr.{test,spec}.{js,ts}',
					],
				},
			},
		],
		coverage: {
			reporter: ['text-summary', 'html'],
			provider: 'v8',
			include: ['src/**/*'],
			exclude: [
				...coverageConfigDefaults.exclude,
				'**/+page.svelte',
				'**/+layout.svelte',
				'**/+error.svelte',
			],
			thresholds: {
				statements: 50,
				branches: 50,
				functions: 50,
				lines: 50,
			},
		},
	},
});
