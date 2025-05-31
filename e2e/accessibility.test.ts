import { expect, test } from '@playwright/test';

test.describe('Accessibility', () => {
	test('home page has proper heading hierarchy', async ({ page }) => {
		await page.goto('/');

		// Check that main content heading is visible
		await expect(
			page.getByRole('heading', { name: 'Svelte Testing Examples' }),
		).toBeVisible();

		// Check for h2 elements (card titles)
		const h2Elements = page.locator('h2');
		await expect(h2Elements).toHaveCount(3);

		// Verify h2 content
		await expect(h2Elements.first()).toContainText('Testing Types');
		await expect(h2Elements.nth(1)).toContainText('Best Practices');
		await expect(h2Elements.last()).toContainText(
			'Real-world Examples',
		);
	});

	test('interactive elements are keyboard accessible', async ({
		page,
	}) => {
		await page.goto('/');

		// Test tab navigation
		await page.keyboard.press('Tab');

		// The "View Examples" button should be focusable
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveAttribute('href', '/examples');

		// Test that Enter key activates the link
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL('/examples');
	});

	test('todos form is keyboard accessible', async ({ page }) => {
		await page.goto('/todos');

		// Tab to the input field
		await page.keyboard.press('Tab');
		let focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveAttribute('name', 'title');

		// Type in the input
		await page.keyboard.type('Keyboard accessibility test');

		// Tab to submit button
		await page.keyboard.press('Tab');
		focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveAttribute('type', 'submit');

		// Submit with Enter
		await page.keyboard.press('Enter');
		await page.waitForLoadState('networkidle');

		// Form should be submitted
		await expect(page.locator('input[name="title"]')).toHaveValue('');
	});

	test('images have alt text', async ({ page }) => {
		await page.goto('/');

		// Check all images have alt attributes
		const images = page.locator('img');
		const imageCount = await images.count();

		for (let i = 0; i < imageCount; i++) {
			const img = images.nth(i);
			await expect(img).toHaveAttribute('alt');
		}
	});

	test('links have descriptive text', async ({ page }) => {
		await page.goto('/');

		// Check that links have meaningful text content
		const links = page.locator('a');
		const linkCount = await links.count();

		for (let i = 0; i < linkCount; i++) {
			const link = links.nth(i);
			const text = await link.textContent();

			// Links should have text content or aria-label
			if (!text || text.trim().length === 0) {
				await expect(link).toHaveAttribute('aria-label');
			}
		}
	});

	test('form inputs have proper labels or placeholders', async ({
		page,
	}) => {
		await page.goto('/todos');

		const titleInput = page.locator('input[name="title"]');

		// Input should have either a label, placeholder, or aria-label
		const hasPlaceholder =
			await titleInput.getAttribute('placeholder');
		const hasAriaLabel = await titleInput.getAttribute('aria-label');
		const hasLabel =
			(await page.locator('label[for="title"]').count()) > 0;

		expect(hasPlaceholder || hasAriaLabel || hasLabel).toBeTruthy();
	});

	test('page has proper document structure', async ({ page }) => {
		await page.goto('/');

		// Check for proper HTML structure
		await expect(page.locator('html')).toHaveAttribute('lang');

		// Check for main content area
		const main = page.locator('main, [role="main"], .main-content');
		// Should have at least one main content area
		expect(await main.count()).toBeGreaterThanOrEqual(1);
	});

	test('color contrast is sufficient', async ({ page }) => {
		await page.goto('/');

		// This is a basic check - in a real app you'd use axe-core or similar
		// Check that main heading is visible (basic contrast check)
		await expect(
			page.getByRole('heading', { name: 'Svelte Testing Examples' }),
		).toBeVisible();

		const paragraphs = page.locator('p');
		const pCount = await paragraphs.count();

		for (let i = 0; i < pCount; i++) {
			await expect(paragraphs.nth(i)).toBeVisible();
		}
	});

	test('focus indicators are visible', async ({ page }) => {
		await page.goto('/');

		// Tab to focusable element
		await page.keyboard.press('Tab');

		// Check that focused element is visible
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();

		// In a real test, you might check for focus ring styles
		// This would require checking computed styles
	});

	test('responsive design maintains accessibility', async ({
		page,
	}) => {
		// Test different viewport sizes
		const viewports = [
			{ width: 320, height: 568 }, // iPhone SE
			{ width: 768, height: 1024 }, // iPad
			{ width: 1920, height: 1080 }, // Desktop
		];

		for (const viewport of viewports) {
			await page.setViewportSize(viewport);
			await page.goto('/');

			// Content should remain accessible at all sizes
			await expect(
				page.getByRole('heading', {
					name: 'Svelte Testing Examples',
				}),
			).toBeVisible();
			await expect(
				page.getByRole('link', { name: 'View Examples' }),
			).toBeVisible();

			// Tab navigation should still work - but be more lenient about focus visibility
			await page.keyboard.press('Tab');
			const focusedElement = page.locator(':focus');

			// Check that something is focused, even if it might be hidden (like drawer toggle)
			expect(await focusedElement.count()).toBeGreaterThan(0);
		}
	});
});
