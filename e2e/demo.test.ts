import { expect, test } from '@playwright/test';

test.describe('Basic Functionality', () => {
	test('home page has expected h1', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'Svelte Testing Examples' }),
		).toBeVisible();
	});

	test('page loads with basic structure', async ({ page }) => {
		await page.goto('/');

		// Check that page loads without major errors
		await expect(page.locator('body')).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Svelte Testing Examples' }),
		).toBeVisible();
	});

	test('CSS framework is loaded correctly', async ({ page }) => {
		await page.goto('/');

		// Check that DaisyUI/Tailwind classes are applied
		const heroSection = page.locator('.hero');
		await expect(heroSection).toBeVisible();

		// Check that cards are styled
		const cards = page.locator('.card');
		await expect(cards.first()).toBeVisible();
	});

	test('all main sections are present', async ({ page }) => {
		await page.goto('/');

		// Hero section
		await expect(page.locator('.hero')).toBeVisible();

		// Feature cards section
		await expect(page.locator('.card')).toHaveCount(3);

		// Main CTA button (be specific to avoid multiple matches)
		await expect(
			page.getByRole('link', { name: 'View Examples' }),
		).toBeVisible();
	});
});
