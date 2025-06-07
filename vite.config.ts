import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],

	test: {
		projects: [
			{
				// Client-side tests (Svelte components)
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					// Timeout for browser tests - prevent hanging on element lookups
					testTimeout: 2000,
					browser: {
						enabled: true,
						provider: 'playwright',
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
					setupFiles: ['./vitest-setup-client.ts'],
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
			all: true,
			reporter: ['text-summary', 'html'],
			provider: 'v8',
			exclude: [
				...coverageConfigDefaults.exclude,
				'**/config.{js,ts,cjs}',
				'**/*.config.{js,ts,cjs}',
				'**/+page.svelte',
				'**/+layout.svelte',
				'**/+error.svelte',
				'.svelte-kit/**',
				'build/**',
				'static/**',
				'dist/**',
				'coverage/**',
				'**/*.d.ts',
				'**/types/**',
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
