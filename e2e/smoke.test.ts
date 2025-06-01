import { expect, test } from '@playwright/test';

const API_SECRET = 'test_secret_123';

test.describe('Smoke Tests', () => {
	test('application starts and all critical pages load', async ({
		page,
	}) => {
		const pages = [
			{ path: '/', expectedTitle: 'TestSuite Pro' },
			{ path: '/examples', expectedTitle: 'Testing Examples' },
			{ path: '/todos', expectedTitle: 'Todo Manager' },
		];

		for (const pageInfo of pages) {
			const response = await page.goto(pageInfo.path);

			// Should return 200 status
			expect(response?.status()).toBe(200);

			// Page should have basic content
			await expect(page.locator('body')).toBeVisible();

			// Check page title
			const title = await page.title();
			expect(title).toContain(pageInfo.expectedTitle);
		}
	});

	test('application loads with proper styling', async ({ page }) => {
		await page.goto('/');

		// Check that the main heading is present
		await expect(
			page.getByRole('heading', { name: 'TestSuite Pro' }),
		).toBeVisible();

		// Check that CSS is loaded (DaisyUI classes should be applied)
		const heroSection = page.locator('.hero');
		await expect(heroSection).toBeVisible();

		// Check that interactive elements are styled
		const buttons = page.locator('button, .btn');
		const buttonCount = await buttons.count();
		expect(buttonCount).toBeGreaterThan(0);
	});

	test('basic navigation workflow', async ({ page }) => {
		await page.goto('/');

		// Navigate to examples page
		await page.click('text=Explore Examples');
		await expect(page).toHaveURL('/examples');
		await expect(
			page.getByRole('heading', { name: 'Testing Patterns' }),
		).toBeVisible();

		// Navigate to todos page directly (avoid potential navigation issues)
		await page.goto('/todos');
		await page.waitForLoadState('domcontentloaded');
		await expect(page).toHaveURL('/todos');
		await expect(
			page.getByRole('heading', { name: 'Todo Manager' }),
		).toBeVisible();
	});

	test('API endpoints are functional', async ({ request }) => {
		// Test authenticated API endpoint
		const authResponse = await request.get('/api/secure-data', {
			headers: {
				authorization: `Bearer ${API_SECRET}`,
			},
		});

		expect(authResponse.status()).toBe(200);

		const authData = await authResponse.json();
		expect(authData).toHaveProperty('message');
		expect(authData).toHaveProperty('data');
		expect(authData.data).toHaveProperty('items');
		expect(Array.isArray(authData.data.items)).toBe(true);

		// Test unauthenticated request returns 401
		const unauthResponse = await request.get('/api/secure-data');
		expect(unauthResponse.status()).toBe(401);

		// Test non-existent endpoint returns 404
		const notFoundResponse = await request.get('/api/non-existent');
		expect(notFoundResponse.status()).toBe(404);
	});
});
