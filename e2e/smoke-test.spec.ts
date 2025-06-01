import { expect, test } from '@playwright/test';

test.describe('Smoke Tests', () => {
	test('should load homepage successfully', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'TestSuite Pro' }),
		).toBeVisible();
	});

	test('should navigate to examples page', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('link', { name: 'Explore Examples' })
			.click();
		await expect(page).toHaveURL('/examples');
	});

	test('should navigate to todos page', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('link', { name: 'Try Todo Manager' })
			.click();
		await expect(page).toHaveURL('/todos');
	});

	test('should load docs page', async ({ page }) => {
		await page.goto('/docs');
		await expect(
			page.getByText('Testing Documentation'),
		).toBeVisible();
	});

	test('should handle 404 correctly', async ({ page }) => {
		const response = await page.goto('/non-existent-page');
		expect(response?.status()).toBe(404);
	});
});
