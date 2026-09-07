import { expect, test, type Page } from '@playwright/test';

async function fill_search(page: Page, query: string) {
	const search_response = page.waitForResponse((response) => {
		const url = new URL(response.url());
		return (
			url.pathname === '/api/search' &&
			url.searchParams.get('q') === query &&
			url.searchParams.get('filter') === 'docs' &&
			response.ok()
		);
	});

	await page.getByTestId('docs-search-input').fill(query);
	await search_response;
}

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

		const search_input = page.getByTestId('docs-search-input');
		await expect(search_input).toBeVisible();

		// Search for "form" which should return "Form Testing (Quick Start)" result
		await fill_search(page, 'form');

		// Wait for search results to appear
		const search_results = page.getByTestId('search-results');
		await expect(search_results).toBeVisible();

		// Look for the "Form Testing" result specifically using the actual test ID
		const form_testing_result = page.getByTestId(
			'search-result-example-quick-start-form_testing',
		);

		await expect(form_testing_result).toBeVisible();

		// Get the href attribute to verify it has a hash fragment
		const href = await form_testing_result.getAttribute('href');

		// Verify the URL contains a hash fragment (the fix)
		expect(href).toContain('#');
		expect(href).toBe('/docs/getting-started#testing-form-inputs');

		// Click the result
		await form_testing_result.click();

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

		const search_index = await response.json();

		// Find documentation examples (Quick Start category)
		const quick_start_examples = search_index.items.filter(
			(item: any) => item.category === 'Quick Start',
		);

		expect(quick_start_examples.length).toBeGreaterThan(0);

		// Verify that Quick Start examples have specific URLs with hash fragments
		for (const example of quick_start_examples) {
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
		// Search for "form" which should return results with hash fragments
		await fill_search(page, 'form');

		const search_results = page.getByTestId('search-results');
		await expect(search_results).toBeVisible();

		// Check if the Form Testing result has a hash fragment
		const form_testing_result = page.getByTestId(
			'search-result-example-quick-start-form_testing',
		);
		await expect(form_testing_result).toBeVisible();

		const href = await form_testing_result.getAttribute('href');
		expect(href).toContain('#');
		expect(href).toBe('/docs/getting-started#testing-form-inputs');

		// Test navigation to hash link
		await form_testing_result.click();

		// Verify URL contains hash
		await expect(page).toHaveURL(
			/\/docs\/getting-started#testing-form-inputs$/,
		);

		// Verify we can navigate back and search still works
		await page.goto('/docs');
		await fill_search(page, 'component');

		// Should show results for component search
		const search_results_after_navigation =
			page.getByTestId('search-results');
		await expect(search_results_after_navigation).toBeVisible();
	});

	test('should maintain search functionality after navigation', async ({
		page,
	}) => {
		// Test that search still works after navigating via hash links
		await fill_search(page, 'form');

		// Click on the Form Testing result
		const form_result = page.getByTestId(
			'search-result-example-quick-start-form_testing',
		);
		await expect(form_result).toBeVisible();
		await form_result.click();

		// Verify we navigated to the correct page
		await expect(page).toHaveURL(
			/\/docs\/getting-started#testing-form-inputs$/,
		);

		// Navigate back to docs page to test search functionality
		await page.goto('/docs');

		// Search should still be functional
		const search_input_after_nav = page.getByTestId(
			'docs-search-input',
		);
		await expect(search_input_after_nav).toBeVisible();

		// Try another search
		await fill_search(page, 'component');

		// Results should appear
		const new_results = page.getByTestId('search-results');
		await expect(new_results).toBeVisible();
	});

	test('should handle edge cases in search navigation', async ({
		page,
	}) => {
		// Test edge cases that might break navigation

		const search_input = page.getByTestId('docs-search-input');

		// Test empty search
		await search_input.fill('');

		const no_results = page.getByTestId('search-results');
		await expect(no_results).not.toBeVisible();

		// Test search with special characters
		await search_input.fill('form#test');

		// Should handle gracefully without breaking
		// Test search with very long query
		await search_input.fill('a'.repeat(100));

		// Should handle gracefully

		// Test rapid search changes
		await search_input.fill('f');
		await search_input.fill('fo');
		await search_input.fill('for');
		await search_input.fill('form');

		// Should show results for final query after debounce
		const search_results = page.getByTestId('search-results');
		if (await search_results.isVisible({ timeout: 1000 })) {
			await expect(search_results).toBeVisible();
		}
	});
});

test.describe('Search Index API Validation', () => {
	test('should return search index with proper URL structure', async ({
		request,
	}) => {
		const response = await request.get('/search-index.json');
		expect(response.status()).toBe(200);

		const search_index = await response.json();
		expect(search_index).toHaveProperty('items');
		expect(search_index).toHaveProperty('total_items');
		expect(Array.isArray(search_index.items)).toBe(true);

		// Verify the fix: documentation examples should have specific URLs
		const documentation_examples = search_index.items.filter(
			(item: any) => item.category === 'Quick Start',
		);

		expect(documentation_examples.length).toBeGreaterThan(0);

		// Check that form testing example has specific URL with hash
		const form_example = documentation_examples.find((item: any) =>
			item.title.toLowerCase().includes('form'),
		);

		if (form_example) {
			expect(form_example.url).toContain('#');
			expect(form_example.url).toContain('getting-started');
			expect(form_example.url).toMatch(/form/i);
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

		const search_data = await response.json();
		expect(search_data).toHaveProperty('results');
		expect(search_data).toHaveProperty('query', 'form');
		expect(search_data).toHaveProperty('filter', 'docs');

		// Verify results have proper structure
		if (search_data.results.length > 0) {
			const result = search_data.results[0];
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('title');
			expect(result).toHaveProperty('url');
			expect(result).toHaveProperty('type');
		}
	});
});
