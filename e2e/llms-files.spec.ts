import { expect, test } from '@playwright/test';

test.describe('LLMs Files Accessibility', () => {
	test('should serve llms.txt with correct content type', async ({
		page,
	}) => {
		const response = await page.goto('/llms.txt');

		expect(response?.status()).toBe(200);
		expect(response?.headers()['content-type']).toContain(
			'text/plain',
		);

		const content = await response?.text();
		expect(content).toContain('# Sveltest Testing Documentation');
		expect(content).toContain('vitest-browser-svelte');
	});

	test('should serve llms-full.txt with complete documentation', async ({
		page,
	}) => {
		const response = await page.goto('/llms-full.txt');

		expect(response?.status()).toBe(200);
		expect(response?.headers()['content-type']).toContain(
			'text/plain',
		);

		const content = await response?.text();
		expect(content).toContain('# Sveltest Testing Documentation');
		expect(content).toContain('# Getting Started');
		expect(content).toContain('# Testing Patterns');
		expect(content).toContain('# Best Practices');
		// Verify it's the full content, not just the index
		expect(content?.length).toBeGreaterThan(10000);
	});

	test('should have working links to llms files in documentation', async ({
		page,
	}) => {
		await page.goto('/docs');

		// Find the LLMs section links
		const llmsIndexLink = page.getByRole('link', {
			name: 'LLMs Index',
		});
		const llmsFullLink = page.getByRole('link', {
			name: 'Full Documentation',
		});

		await expect(llmsIndexLink).toBeVisible();
		await expect(llmsFullLink).toBeVisible();

		// Verify links have correct hrefs
		await expect(llmsIndexLink).toHaveAttribute('href', '/llms.txt');
		await expect(llmsFullLink).toHaveAttribute(
			'href',
			'/llms-full.txt',
		);
	});

	test('should open llms files in new tab/window', async ({
		page,
		context,
	}) => {
		await page.goto('/docs');

		// Test that clicking opens in new tab (target="_blank")
		const llmsIndexLink = page.getByRole('link', {
			name: 'LLMs Index',
		});
		await expect(llmsIndexLink).toHaveAttribute('target', '_blank');

		// Test actual navigation by intercepting the request
		const [newPage] = await Promise.all([
			context.waitForEvent('page'),
			llmsIndexLink.click(),
		]);

		await newPage.waitForLoadState();
		expect(newPage.url()).toBe(
			page.url().replace('/docs', '/llms.txt'),
		);

		const content = await newPage.content();
		expect(content).toContain('# Sveltest Testing Documentation');
	});

	test('should serve static files with appropriate headers', async ({
		page,
	}) => {
		const response = await page.goto('/llms.txt');

		expect(response?.status()).toBe(200);

		// Check basic headers are present
		const headers = response?.headers();
		expect(headers).toBeDefined();

		// At minimum should have content-type
		expect(headers?.['content-type']).toContain('text/plain');

		// Cache control may or may not be set (depends on server config)
		// But if present, should be reasonable
		const cacheControl = headers?.['cache-control'];
		if (cacheControl) {
			expect(cacheControl).toMatch(/max-age|public|private|no-cache/);
		}
	});
});
