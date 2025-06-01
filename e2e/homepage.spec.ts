import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display main heading and navigation', async ({
		page,
	}) => {
		// Check main heading exists (use role to be specific)
		await expect(
			page.getByRole('heading', { name: 'TestSuite Pro' }),
		).toBeVisible();

		// Check navigation buttons exist
		await expect(
			page.getByRole('link', { name: 'Explore Examples' }),
		).toBeVisible();
		await expect(
			page.getByRole('link', { name: 'Try Todo Manager' }),
		).toBeVisible();
	});

	test('should navigate to examples page', async ({ page }) => {
		await page
			.getByRole('link', { name: 'Explore Examples' })
			.click();
		await expect(page).toHaveURL('/examples');
	});

	test('should navigate to todos page', async ({ page }) => {
		await page
			.getByRole('link', { name: 'Try Todo Manager' })
			.click();
		await expect(page).toHaveURL('/todos');
	});

	test('should have correct page title', async ({ page }) => {
		await expect(page).toHaveTitle(
			'TestSuite Pro - Comprehensive Testing Suite for Svelte',
		);
	});
});
