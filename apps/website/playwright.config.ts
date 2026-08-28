import { defineConfig } from '@playwright/test';
import { env } from 'node:process';

const port = Number(env.PLAYWRIGHT_PORT ?? 4173);

export default defineConfig({
	webServer: {
		command: `npm run build && npm run preview -- --port ${port}`,
		port,
	},

	testDir: 'e2e',
});
