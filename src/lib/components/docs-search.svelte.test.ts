import { page } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DocsSearch from './docs-search.svelte';

// Mock fetch for API calls
const mock_fetch = vi.fn();
global.fetch = mock_fetch;

describe('DocsSearch', () => {
	describe('Initial Rendering', () => {
		test('should render search input', async () => {
			render(DocsSearch);

			await expect
				.element(page.getByLabelText('Search Documentation'))
				.toBeInTheDocument();

			await expect
				.element(page.getByTestId('docs-search-input'))
				.toBeInTheDocument();
		});

		test('should show search placeholder', async () => {
			render(DocsSearch);

			const input = page.getByTestId('docs-search-input');
			await expect
				.element(input)
				.toHaveAttribute(
					'placeholder',
					'Search topics, examples, patterns...',
				);
		});
	});

	describe('Search Functionality', () => {
		test('should show loading spinner when searching', async () => {
			// Mock successful API response
			mock_fetch.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						results: [],
						total: 0,
					}),
			});

			render(DocsSearch);

			const input = page.getByTestId('docs-search-input');
			await input.fill('test query');

			// Should show loading spinner briefly
			await expect
				.element(page.locator('.loading-spinner'))
				.toBeInTheDocument();
		});

		test('should show clear button when text is entered', async () => {
			render(DocsSearch);

			const input = page.getByTestId('docs-search-input');
			await input.fill('test');

			await expect
				.element(page.getByTestId('clear-search-button'))
				.toBeInTheDocument();
		});

		test('should clear search when clear button is clicked', async () => {
			render(DocsSearch);

			const input = page.getByTestId('docs-search-input');
			await input.fill('test');

			const clear_button = page.getByTestId('clear-search-button');
			await clear_button.click();

			await expect.element(input).toHaveValue('');
		});
	});

	describe('Search Results', () => {
		test.skip('should show search results after typing', async () => {
			// TODO: This test requires proper async handling with API
			// Skip for now due to timing issues with debounced search + API calls
		});

		test.skip('should show no results message when no matches found', async () => {
			// TODO: Test no results state with API
		});
	});

	describe('Keyboard Shortcuts', () => {
		test('should show keyboard shortcut hint', async () => {
			render(DocsSearch);

			await expect.element(page.getByText('⌘')).toBeInTheDocument();

			await expect.element(page.getByText('K')).toBeInTheDocument();
		});

		test.skip('should focus input on Ctrl+K', async () => {
			// TODO: Test keyboard shortcuts - requires proper event simulation
			// Skip for now due to complexity of testing global keyboard events
		});

		test.skip('should clear search on Escape', async () => {
			// TODO: Test escape key functionality
		});
	});

	describe('Accessibility', () => {
		test('should have proper labels and ARIA attributes', async () => {
			render(DocsSearch);

			const input = page.getByTestId('docs-search-input');
			await expect
				.element(input)
				.toHaveAttribute('id', 'docs-search');

			const label = page.getByText('Search Documentation');
			await expect
				.element(label)
				.toHaveAttribute('for', 'docs-search');
		});

		test('should have clear button with proper aria-label', async () => {
			render(DocsSearch);

			const input = page.getByTestId('docs-search-input');
			await input.fill('test');

			const clear_button = page.getByTestId('clear-search-button');
			await expect
				.element(clear_button)
				.toHaveAttribute('aria-label', 'Clear search');
		});
	});
});
