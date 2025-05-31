import { expect, test } from '@playwright/test';

const API_SECRET = 'test_secret_123';

test.describe('Smoke Tests', () => {
	test('API returns data when properly authenticated', async ({
		request,
	}) => {
		// Test the secure-data API endpoint
		const response = await request.get('/api/secure-data', {
			headers: {
				authorization: `Bearer ${API_SECRET}`,
			},
		});

		expect(response.status()).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty('message');
		expect(data).toHaveProperty('data');
		expect(data.data).toHaveProperty('items');
		expect(Array.isArray(data.data.items)).toBe(true);
	});

	test('API returns 401 when not authenticated', async ({
		request,
	}) => {
		const response = await request.get('/api/secure-data');
		expect(response.status()).toBe(401);
	});

	test('Application loads successfully', async ({ page }) => {
		await page.goto('/');

		// Check that the main page content loads
		await expect(
			page.getByRole('heading', { name: 'Svelte Testing Examples' }),
		).toBeVisible();

		// Check that CSS is loaded (DaisyUI classes should be applied)
		const heroSection = page.locator('.hero');
		await expect(heroSection).toBeVisible();
	});

	test('Navigation works correctly', async ({ page }) => {
		await page.goto('/');

		// Test navigation to examples page
		await page.click('a[href="/examples"]');
		await expect(page).toHaveURL('/examples');

		// Verify examples page loads
		await expect(
			page.getByRole('heading', { name: 'Testing Examples' }),
		).toBeVisible();
	});
});
