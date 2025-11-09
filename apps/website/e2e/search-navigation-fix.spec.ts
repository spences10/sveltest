import { expect, test } from '@playwright/test';

test.describe('Search Navigation Fix - Issue #522', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the docs page where search is available
		await page.goto('/docs');
	});

	test('should navigate to specific section when clicking form testing result', async ({
		page,
	}) => {
		// This test verifies the fix for issue #522
		// When searching for "form" and clicking "Form Testing", it should navigate to the specific section

		const searchInput = page.getByTestId('docs-search-input');
		await expect(searchInput).toBeVisible();

		// Search for "form" which should return "Form Testing (Quick Start)" result
		await searchInput.fill('form');

		// Wait for search results to appear
		const searchResults = page.getByTestId('search-results');
		await expect(searchResults).toBeVisible();

		// Look for the "Form Testing" result specifically using the actual test ID
		const formTestingResult = page.getByTestId(
			'search-result-example-quick-start-form_testing',
		);

		await expect(formTestingResult).toBeVisible();

		// Get the href attribute to verify it has a hash fragment
		const href = await formTestingResult.getAttribute('href');

		// Verify the URL contains a hash fragment (the fix)
		expect(href).toContain('#');
		expect(href).toBe('/docs/getting-started#testing-form-inputs');

		// Click the result
		await formTestingResult.click();

		// Verify navigation occurred to the specific section
		await expect(page).toHaveURL(
			/\/docs\/getting-started#testing-form-inputs$/,
		);

		// Verify the page title changed to indicate we're on the Getting Started page
		await expect(page).toHaveTitle('Getting Started - Sveltest Docs');
	});

	test('should provide specific URLs for all documentation examples', async ({
		page,
	}) => {
		// Test that the search index provides specific URLs with hash fragments
		// for documentation examples, not just generic page links

		const response = await page.request.get('/search-index.json');
		expect(response.status()).toBe(200);

		const searchIndex = await response.json();

		// Find documentation examples (Quick Start category)
		const quickStartExamples = searchIndex.items.filter(
			(item: any) => item.category === 'Quick Start',
		);

		expect(quickStartExamples.length).toBeGreaterThan(0);

		// Verify that Quick Start examples have specific URLs with hash fragments
		for (const example of quickStartExamples) {
			if (
				example.title.toLowerCase().includes('form') ||
				example.title.toLowerCase().includes('state') ||
				example.title.toLowerCase().includes('component')
			) {
				// These should have specific hash fragments, not just base URLs
				expect(example.url).toContain('#');
				expect(example.url).not.toBe('/docs/getting-started');
			}
		}
	});

	test('should handle search results with hash navigation correctly', async ({
		page,
	}) => {
		// Test that form search returns results with hash fragments
		const searchInput = page.getByTestId('docs-search-input');

		// Search for "form" which should return results with hash fragments
		await searchInput.fill('form');

		const searchResults = page.getByTestId('search-results');
		await expect(searchResults).toBeVisible();

		// Check if the Form Testing result has a hash fragment
		const formTestingResult = page.getByTestId(
			'search-result-example-quick-start-form_testing',
		);
		await expect(formTestingResult).toBeVisible();

		const href = await formTestingResult.getAttribute('href');
		expect(href).toContain('#');
		expect(href).toBe('/docs/getting-started#testing-form-inputs');

		// Test navigation to hash link
		await formTestingResult.click();

		// Verify URL contains hash
		await expect(page).toHaveURL(
			/\/docs\/getting-started#testing-form-inputs$/,
		);

		// Verify we can navigate back and search still works
		await page.goto('/docs');
		await searchInput.fill('component');

		// Should show results for component search
		await expect(searchResults).toBeVisible();
	});

	test('should maintain search functionality after navigation', async ({
		page,
	}) => {
		// Test that search still works after navigating via hash links

		const searchInput = page.getByTestId('docs-search-input');

		// Search for form
		await searchInput.fill('form');

		// Click on the Form Testing result
		const formResult = page.getByTestId(
			'search-result-example-quick-start-form_testing',
		);
		await expect(formResult).toBeVisible();
		await formResult.click();

		// Verify we navigated to the correct page
		await expect(page).toHaveURL(
			/\/docs\/getting-started#testing-form-inputs$/,
		);

		// Navigate back to docs page to test search functionality
		await page.goto('/docs');

		// Search should still be functional
		const searchInputAfterNav = page.getByTestId('docs-search-input');
		await expect(searchInputAfterNav).toBeVisible();

		// Try another search
		await searchInputAfterNav.fill('component');

		// Results should appear
		const newResults = page.getByTestId('search-results');
		await expect(newResults).toBeVisible();
	});

	test('should handle edge cases in search navigation', async ({
		page,
	}) => {
		// Test edge cases that might break navigation

		const searchInput = page.getByTestId('docs-search-input');

		// Test empty search
		await searchInput.fill('');

		const noResults = page.getByTestId('search-results');
		await expect(noResults).not.toBeVisible();

		// Test search with special characters
		await searchInput.fill('form#test');

		// Should handle gracefully without breaking
		// Test search with very long query
		await searchInput.fill('a'.repeat(100));

		// Should handle gracefully

		// Test rapid search changes
		await searchInput.fill('f');
		await searchInput.fill('fo');
		await searchInput.fill('for');
		await searchInput.fill('form');

		// Should show results for final query after debounce
		const searchResults = page.getByTestId('search-results');
		if (await searchResults.isVisible({ timeout: 1000 })) {
			await expect(searchResults).toBeVisible();
		}
	});
});

test.describe('Search Index API Validation', () => {
	test('should return search index with proper URL structure', async ({
		request,
	}) => {
		const response = await request.get('/search-index.json');
		expect(response.status()).toBe(200);

		const searchIndex = await response.json();
		expect(searchIndex).toHaveProperty('items');
		expect(searchIndex).toHaveProperty('total_items');
		expect(Array.isArray(searchIndex.items)).toBe(true);

		// Verify the fix: documentation examples should have specific URLs
		const documentationExamples = searchIndex.items.filter(
			(item: any) => item.category === 'Quick Start',
		);

		expect(documentationExamples.length).toBeGreaterThan(0);

		// Check that form testing example has specific URL with hash
		const formExample = documentationExamples.find((item: any) =>
			item.title.toLowerCase().includes('form'),
		);

		if (formExample) {
			expect(formExample.url).toContain('#');
			expect(formExample.url).toContain('getting-started');
			expect(formExample.url).toMatch(/form/i);
		}
	});

	test('should handle search API requests correctly', async ({
		request,
	}) => {
		// Test the search API endpoint
		const response = await request.get(
			'/api/search?q=form&filter=docs',
		);
		expect(response.status()).toBe(200);

		const searchData = await response.json();
		expect(searchData).toHaveProperty('results');
		expect(searchData).toHaveProperty('query', 'form');
		expect(searchData).toHaveProperty('filter', 'docs');

		// Verify results have proper structure
		if (searchData.results.length > 0) {
			const result = searchData.results[0];
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('title');
			expect(result).toHaveProperty('url');
			expect(result).toHaveProperty('type');
		}
	});
});
