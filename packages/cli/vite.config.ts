import { defineConfig } from 'vite-plus';

export default defineConfig({
	pack: {
		deps: { resolveDepSubpath: true },
		entry: ['src/index.ts'],
		format: ['esm'],
		sourcemap: true,
		dts: false,
		outExtensions: () => ({ js: '.js' }),
	},
	test: {
		expect: { requireAssertions: true },
		include: ['src/**/*.test.ts'],
		testTimeout: 15000,
		exclude: ['dist/**', 'node_modules/**'],
	},
});
