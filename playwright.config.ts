import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
	},

	testDir: 'e2e',

	// Global test timeout - fail fast
	timeout: 5000, // 5 seconds max per test

	// Expect timeout for assertions
	expect: {
		timeout: 2000, // 2 seconds for assertions
	},

	use: {
		// Action timeout for page interactions
		actionTimeout: 1000, // 1 second for clicks, fills, etc.

		// Navigation timeout
		navigationTimeout: 2000, // 2 seconds for page loads
	},
});
