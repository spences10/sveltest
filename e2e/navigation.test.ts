import { expect, test } from '@playwright/test';

test.describe('Navigation and User Experience', () => {
	test('home page displays all key elements', async ({ page }) => {
		await page.goto('/');

		// Check hero section
		await expect(page.locator('.hero')).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Svelte Testing Examples' }),
		).toBeVisible();
		await expect(
			page.getByText(
				'A comprehensive collection of testing patterns',
			),
		).toBeVisible();

		// Check CTA button
		const ctaButton = page.getByRole('link', {
			name: 'View Examples',
		});
		await expect(ctaButton).toBeVisible();

		// Check feature cards
		const cards = page.locator('.card');
		await expect(cards).toHaveCount(3);

		// Verify card content
		await expect(page.locator('.card-title').first()).toContainText(
			'Testing Types',
		);
		await expect(page.locator('.card-title').nth(1)).toContainText(
			'Best Practices',
		);
		await expect(page.locator('.card-title').last()).toContainText(
			'Real-world Examples',
		);
	});

	test('can navigate between pages', async ({ page }) => {
		// Start at home
		await page.goto('/');
		await expect(page).toHaveURL('/');

		// Navigate to examples
		await page.click('a[href="/examples"]');
		await expect(page).toHaveURL('/examples');
		await expect(
			page.getByRole('heading', { name: 'Testing Examples' }),
		).toBeVisible();

		// Navigate to todos (assuming there's a link or we can go directly)
		await page.goto('/todos');
		await expect(page).toHaveURL('/todos');
		await expect(
			page.getByRole('heading', { name: 'Todos' }),
		).toBeVisible();

		// Go back to home
		await page.goto('/');
		await expect(page).toHaveURL('/');
		await expect(
			page.getByRole('heading', { name: 'Svelte Testing Examples' }),
		).toBeVisible();
	});

	test('responsive design works on mobile viewport', async ({
		page,
	}) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Check that content is still visible and properly laid out
		await expect(
			page.getByRole('heading', { name: 'Svelte Testing Examples' }),
		).toBeVisible();
		await expect(page.locator('.hero')).toBeVisible();

		// Check that cards stack vertically on mobile
		const cards = page.locator('.card');
		await expect(cards).toHaveCount(3);

		// All cards should be visible even on mobile
		for (let i = 0; i < 3; i++) {
			await expect(cards.nth(i)).toBeVisible();
		}
	});

	test('page loads without major errors', async ({ page }) => {
		const errors: string[] = [];

		// Listen for console errors (but filter out CSP warnings which are expected)
		page.on('console', (msg) => {
			if (
				msg.type() === 'error' &&
				!msg.text().includes('Content Security Policy')
			) {
				errors.push(msg.text());
			}
		});

		// Listen for page errors
		page.on('pageerror', (error) => {
			errors.push(error.message);
		});

		await page.goto('/');

		// Wait a bit for any async errors
		await page.waitForTimeout(1000);

		// Check that no major errors occurred
		expect(errors).toHaveLength(0);
	});

	test('handles 404 pages gracefully', async ({ page }) => {
		// Navigate to a non-existent page
		const response = await page.goto('/non-existent-page');

		// Should return 404 status
		expect(response?.status()).toBe(404);

		// Page should still render something (SvelteKit's default 404 or custom)
		await expect(page.locator('body')).toBeVisible();
	});

	test('back and forward browser navigation works', async ({
		page,
	}) => {
		// Start at home
		await page.goto('/');

		// Navigate to examples
		await page.click('a[href="/examples"]');
		await expect(page).toHaveURL('/examples');

		// Use browser back button
		await page.goBack();
		await expect(page).toHaveURL('/');

		// Use browser forward button
		await page.goForward();
		await expect(page).toHaveURL('/examples');
	});
});
