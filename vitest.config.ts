import {
	coverageConfigDefaults,
	defineConfig,
	mergeConfig,
} from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ['src/**/*.test.{js,ts,svelte}'],
			environment: 'jsdom',
			coverage: {
				all: true,
				exclude: [
					...coverageConfigDefaults.exclude,
					'**/config.{js,ts,cjs}',
					'**/*.config.{js,ts,cjs}',
					'**/config.{js,ts,cjs}',
					'**/*.config.{js,ts,cjs}',
					'**/+page.svelte',
					'.svelte-kit/**',
					'build/**',
					'static/**',
				],
				thresholds: {
					statements: 14,
					branches: 20,
					functions: 9,
					lines: 14,
				},
			},
		},
	}),
);
