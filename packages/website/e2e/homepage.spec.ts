import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display main heading and navigation', async ({
		page,
	}) => {
		await test.step('Check main heading', async () => {
			// Be specific about which heading we want - the main title
			await expect(
				page.getByRole('heading', { name: 'Sveltest' }),
			).toBeVisible();
		});

		await test.step('Check navigation elements', async () => {
			// ✅ Use .first() to handle multiple "Explore Examples" links
			await expect(
				page.getByRole('link', { name: 'Explore Examples' }).first(),
			).toBeVisible();
			await expect(
				page.getByRole('link', { name: 'Try Todo Manager' }),
			).toBeVisible();
		});

		await test.step('Verify page structure', async () => {
			// Check for main content using semantic query
			await expect(page.getByRole('main').first()).toBeVisible();
		});
	});

	test('should navigate to examples page', async ({ page }) => {
		await test.step('Click examples link', async () => {
			// ✅ Use .first() to handle multiple "Explore Examples" links
			await page
				.getByRole('link', { name: 'Explore Examples' })
				.first()
				.click();
		});

		await test.step('Verify navigation to examples page', async () => {
			await expect(page).toHaveURL('/examples');
			// Be specific about the examples page main heading
			await expect(
				page.getByRole('heading', { name: 'Testing Patterns' }),
			).toBeVisible();
		});
	});

	test('should navigate to todos page', async ({ page }) => {
		await test.step('Click todos link', async () => {
			await page
				.getByRole('link', { name: 'Try Todo Manager' })
				.click();
		});

		await test.step('Verify navigation to todos page', async () => {
			await expect(page).toHaveURL('/todos');
			// Be specific about the todos page main heading
			await expect(
				page.getByRole('heading', { name: 'Todo Manager' }),
			).toBeVisible();
		});
	});

	test('should have correct page title and meta information', async ({
		page,
	}) => {
		await test.step('Check page title', async () => {
			await expect(page).toHaveTitle(/Sveltest/);
		});

		await test.step('Check meta description', async () => {
			const metaDescription = page.locator(
				'meta[name="description"]',
			);
			await expect(metaDescription).toHaveAttribute(
				'content',
				/testing patterns/i,
			);
		});
	});

	test('should be responsive and mobile-friendly', async ({
		page,
	}) => {
		await test.step('Test mobile viewport', async () => {
			await page.setViewportSize({ width: 375, height: 667 });
			await expect(
				page.getByRole('heading', { name: 'Sveltest' }),
			).toBeVisible();
		});

		await test.step('Test tablet viewport', async () => {
			await page.setViewportSize({ width: 768, height: 1024 });
			await expect(
				page.getByRole('heading', { name: 'Sveltest' }),
			).toBeVisible();
		});
	});
});
