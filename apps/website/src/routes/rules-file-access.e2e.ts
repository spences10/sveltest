import { expect, test } from '@playwright/test';

test.describe('Shared Skill Access via Deployed Project', () => {
	test('offers Devin setup without JavaScript', async ({
		browser,
		baseURL,
	}) => {
		const context = await browser.newContext({
			javaScriptEnabled: false,
			baseURL,
		});
		try {
			const page = await context.newPage();
			await page.goto('/');
			await expect(
				page.getByRole('heading', { name: 'Devin Desktop' }),
			).toBeVisible();
			await expect(
				page.getByRole('link', { name: /View Devin Setup/ }),
			).toHaveAttribute(
				'href',
				'https://github.com/spences10/sveltest/blob/main/.agents/skills/svelte-testing/README.md',
			);
		} finally {
			await context.close();
		}
	});

	test('serves Devin guidance through the documentation API', async ({
		request,
	}) => {
		const response = await request.get('/api/docs/about');
		expect(response.ok()).toBe(true);
		const content = await response.text();
		expect(content).toContain('Devin Desktop (formerly Windsurf)');
		expect(content).toContain('.agents/skills/svelte-testing/');
		expect(content).toContain('references/');
	});

	test('includes shared skill setup in both LLM documentation formats', async ({
		request,
	}) => {
		for (const path of ['/llms.txt', '/llms-full.txt']) {
			const response = await request.get(path);
			expect(response.ok()).toBe(true);
			const content = await response.text();
			expect(content).toContain('Devin Desktop (formerly Windsurf)');
			expect(content).toContain('.agents/skills/svelte-testing/');
		}
	});
});
