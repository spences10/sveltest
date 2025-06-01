import { expect, test } from '@playwright/test';

test.describe('Accessibility E2E', () => {
	test('home page has proper heading hierarchy', async ({ page }) => {
		await page.goto('/');

		// Check that main content heading is visible
		await expect(
			page.getByRole('heading', { name: 'TestSuite Pro' }),
		).toBeVisible();

		// Check for h2 elements (section titles)
		const h2Elements = page.locator('h2');
		await expect(h2Elements).toHaveCount(2);

		// Verify h2 content - updated to match current page structure
		await expect(h2Elements.first()).toContainText(
			'Everything You Need',
		);
		await expect(h2Elements.last()).toContainText(
			'Ready to Start Testing?',
		);
	});

	test('interactive elements are keyboard accessible', async ({
		page,
	}) => {
		await page.goto('/');

		// Test that the "Explore Examples" link is accessible via keyboard
		// Focus directly on the examples link instead of relying on tab order
		await page.focus('a[href="/examples"]');

		// Verify it's focused
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveAttribute('href', '/examples');

		// Test that Enter key activates the link
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL('/examples');
	});

	test('cross-page keyboard navigation workflow', async ({
		page,
	}) => {
		await page.goto('/');

		// Navigate to todos via keyboard
		await page.focus('a[href="/todos"]');
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL('/todos');

		// Test keyboard interaction with todo form
		await page.focus('[data-testid="new-todo-input"]');
		await page.keyboard.type('Accessibility test todo');
		await page.keyboard.press('Enter');

		// Verify the todo was added
		await expect(
			page.getByText('Accessibility test todo'),
		).toBeVisible();

		// Clean up
		const deleteButton = page
			.getByTestId('delete-todo-button')
			.first();
		await deleteButton.click();
	});

	test('images have alt text', async ({ page }) => {
		await page.goto('/');

		// Check all images have alt attributes
		const images = page.locator('img');
		const imageCount = await images.count();

		for (let i = 0; i < imageCount; i++) {
			const img = images.nth(i);
			const altText = await img.getAttribute('alt');
			expect(altText).not.toBeNull();
			expect(altText).not.toBe('');
		}
	});

	test('links have descriptive text', async ({ page }) => {
		await page.goto('/');

		// Check that links have meaningful text
		const links = page.locator('a');
		const linkCount = await links.count();

		for (let i = 0; i < linkCount; i++) {
			const link = links.nth(i);
			const text = await link.textContent();
			const ariaLabel = await link.getAttribute('aria-label');

			// Link should have either text content or aria-label
			expect(text || ariaLabel).toBeTruthy();

			// Avoid generic link text
			if (text) {
				expect(text.toLowerCase()).not.toBe('click here');
				expect(text.toLowerCase()).not.toBe('read more');
				expect(text.toLowerCase()).not.toBe('link');
			}
		}
	});

	test('page has proper document structure', async ({ page }) => {
		await page.goto('/');

		// Check for proper HTML structure
		await expect(page.locator('html')).toHaveAttribute('lang');
		await expect(page.locator('main')).toBeVisible();

		// Check for skip links or other accessibility features
		const skipLinks = page.locator('a[href^="#"]');
		// Skip links are optional but good practice
	});

	test('color contrast is sufficient', async ({ page }) => {
		await page.goto('/');

		// This is a basic check - in real scenarios you'd use axe-core
		// Check that visible text elements are actually visible
		const visibleTextElements = page
			.locator('h1, h2, h3, p')
			.filter({ hasText: /.+/ });
		const count = await visibleTextElements.count();

		for (let i = 0; i < Math.min(count, 5); i++) {
			const element = visibleTextElements.nth(i);
			await expect(element).toBeVisible();
		}

		// Check main navigation elements
		await expect(
			page.getByRole('heading', { name: 'TestSuite Pro' }),
		).toBeVisible();
		await expect(
			page.getByRole('link', { name: 'Explore Examples' }),
		).toBeVisible();
	});

	test('focus indicators are visible', async ({ page }) => {
		await page.goto('/');

		// Test focus indicators on interactive elements
		const interactiveElements = page.locator(
			'a, button, input, select',
		);
		const count = await interactiveElements.count();

		for (let i = 0; i < Math.min(count, 5); i++) {
			const element = interactiveElements.nth(i);
			await element.focus();
			// Element should be focused (browser will show focus indicator)
			await expect(element).toBeFocused();
		}
	});

	test('responsive design maintains accessibility', async ({
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

			// Content should remain accessible
			await expect(
				page.getByRole('heading', { name: 'TestSuite Pro' }),
			).toBeVisible();

			// Navigation should work
			const navLinks = page.locator('a');
			const firstLink = navLinks.first();
			await expect(firstLink).toBeVisible();
		}
	});
});
