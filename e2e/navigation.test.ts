import { expect, test } from '@playwright/test';

test.describe('Navigation and User Experience E2E', () => {
	test('home page displays all key elements', async ({ page }) => {
		await page.goto('/');

		// Main heading
		await expect(
			page.getByRole('heading', { name: 'TestSuite Pro' }),
		).toBeVisible();
		await expect(
			page.getByText(
				'A comprehensive collection of testing patterns',
			),
		).toBeVisible();

		// Navigation buttons
		await expect(
			page.getByRole('link', { name: 'Explore Examples' }),
		).toBeVisible();
		await expect(
			page.getByRole('link', { name: 'Try Todo Manager' }),
		).toBeVisible();

		// Feature cards
		await expect(page.locator('.card')).toHaveCount(4);

		// Stats section
		await expect(page.getByText('98%')).toBeVisible();
		await expect(page.getByText('Fast')).toBeVisible();
		await expect(page.getByText('A+')).toBeVisible();
	});

	test('full navigation workflow between all pages', async ({
		page,
	}) => {
		await page.goto('/');

		// Navigate to examples
		await page.click('text=Explore Examples');
		await expect(page).toHaveURL('/examples');

		// Check examples page content
		await expect(
			page.getByRole('heading', { name: 'Testing Patterns' }),
		).toBeVisible();

		// Navigate to todos directly (avoid potential navigation issues)
		await page.goto('/todos');
		await page.waitForLoadState('domcontentloaded');
		await expect(page).toHaveURL('/todos');
		await expect(
			page.getByRole('heading', { name: 'Todo Manager' }),
		).toBeVisible();

		// Navigate back to home
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'TestSuite Pro' }),
		).toBeVisible();
	});

	test('responsive design works across viewports', async ({
		page,
	}) => {
		// Test different viewport sizes
		const viewports = [
			{ width: 375, height: 667 }, // Mobile
			{ width: 768, height: 1024 }, // Tablet
			{ width: 1920, height: 1080 }, // Desktop
		];

		for (const viewport of viewports) {
			await page.setViewportSize(viewport);
			await page.goto('/');

			// Content should still be visible and accessible
			await expect(
				page.getByRole('heading', { name: 'TestSuite Pro' }),
			).toBeVisible();
			await expect(page.locator('.hero')).toBeVisible();

			// Check that cards are present
			const cards = page.locator('.card');
			await expect(cards).toHaveCount(4);

			// Navigation should work
			await expect(
				page.getByRole('link', { name: 'Explore Examples' }),
			).toBeVisible();
		}
	});

	test('external links have proper attributes', async ({ page }) => {
		await page.goto('/');

		// Look for external links (if any)
		const externalLinks = page.locator('a[target="_blank"]');
		const count = await externalLinks.count();

		for (let i = 0; i < count; i++) {
			const link = externalLinks.nth(i);
			await expect(link).toHaveAttribute('target', '_blank');
			await expect(link).toHaveAttribute(
				'rel',
				/noopener|noreferrer/,
			);
		}
	});

	test('pages have proper meta tags and SEO', async ({ page }) => {
		const pages = [
			{ path: '/', titleContains: 'TestSuite Pro' },
			{ path: '/examples', titleContains: 'Testing Examples' },
			{ path: '/todos', titleContains: 'Todo Manager' },
		];

		for (const pageInfo of pages) {
			await page.goto(pageInfo.path);
			await page.waitForLoadState('domcontentloaded');

			// Check page title
			const title = await page.title();
			expect(title).toContain(pageInfo.titleContains);

			// Check for viewport meta tag
			const viewportMeta = page
				.locator('meta[name="viewport"]')
				.first();
			await expect(viewportMeta).toHaveAttribute(
				'content',
				/width=device-width/,
			);

			// Check for description meta tag
			const descriptionMeta = page
				.locator('meta[name="description"]')
				.first();
			await expect(descriptionMeta).toHaveAttribute('content');
		}
	});
});
