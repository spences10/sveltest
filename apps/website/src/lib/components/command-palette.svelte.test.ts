import { page } from 'vitest/browser';
import {
	describe,
	expect,
	test,
	vi,
	beforeEach,
	afterEach,
} from 'vitest';
import { render } from 'vitest-browser-svelte';
import CommandPalette from './command-palette.svelte';
import { command_palette_state } from '$lib/state/command-palette.svelte';

// Mock search_site - use vi.stubGlobal for CI compatibility
vi.mock('$lib/search.remote', () => ({
	search_site: vi.fn().mockResolvedValue([]),
}));

// Mock goto for navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
}));

describe('CommandPalette', () => {
	beforeEach(() => {
		// Reset state before each test
		command_palette_state.query = '';
		command_palette_state.is_open = false;
		vi.clearAllMocks();
	});

	afterEach(() => {
		// Clean up - close dialog if open
		if (command_palette_state.is_open) {
			command_palette_state.close();
		}
	});

	describe('Initial Rendering', () => {
		test('should render dialog element when opened', async () => {
			render(CommandPalette);

			command_palette_state.open();

			const dialog = page.getByRole('dialog');
			await expect.element(dialog).toBeInTheDocument();
		});

		test('should have search input when opened', async () => {
			render(CommandPalette);

			command_palette_state.open();

			const input = page.getByRole('searchbox');
			await expect.element(input).toBeInTheDocument();
		});

		test('should have proper aria-label when opened', async () => {
			render(CommandPalette);

			command_palette_state.open();

			const dialog = page.getByRole('dialog');
			await expect
				.element(dialog)
				.toHaveAttribute('aria-label', 'Search');
		});
	});

	describe('Opening and Closing', () => {
		test('should open when showModal is called on dialog', async () => {
			render(CommandPalette);

			// Open the palette through state
			command_palette_state.open();

			const dialog = page.getByRole('dialog');
			await expect.element(dialog).toBeVisible();
		});

		test('should update is_open state when opened', async () => {
			render(CommandPalette);

			expect(command_palette_state.is_open).toBe(false);

			command_palette_state.open();

			expect(command_palette_state.is_open).toBe(true);
		});

		test('should close via state close method', async () => {
			render(CommandPalette);

			command_palette_state.open();
			expect(command_palette_state.is_open).toBe(true);

			command_palette_state.close();

			expect(command_palette_state.is_open).toBe(false);
		});

		test('should toggle open/close', async () => {
			render(CommandPalette);

			command_palette_state.toggle();
			expect(command_palette_state.is_open).toBe(true);

			command_palette_state.toggle();
			expect(command_palette_state.is_open).toBe(false);
		});

		test('should clear query when closed', async () => {
			render(CommandPalette);

			command_palette_state.open();
			command_palette_state.query = 'test query';

			command_palette_state.close();

			expect(command_palette_state.query).toBe('');
		});
	});

	describe('Search Input', () => {
		test('should update query state directly', async () => {
			render(CommandPalette);

			command_palette_state.open();
			command_palette_state.query = 'button';

			expect(command_palette_state.query).toBe('button');
		});

		test.skip('should update query state when typing in input', async () => {
			// TODO: Native dialog visibility in vitest-browser-svelte requires special handling
			// The dialog shows via showModal() but Playwright sees the input as not visible
			// This may be a limitation of testing native <dialog> elements
		});

		test('should show placeholder text', async () => {
			render(CommandPalette);

			command_palette_state.open();

			const input = page.getByRole('searchbox');
			await expect
				.element(input)
				.toHaveAttribute(
					'placeholder',
					'Search docs, examples, components...',
				);
		});

		test('should show start typing message when empty', async () => {
			render(CommandPalette);

			command_palette_state.open();

			await expect
				.element(page.getByText('Start typing to search...'))
				.toBeInTheDocument();
		});
	});

	describe('Keyboard Navigation', () => {
		test('should have keyboard hint in footer', async () => {
			render(CommandPalette);

			command_palette_state.open();

			await expect
				.element(page.getByText('navigate'))
				.toBeInTheDocument();
			await expect
				.element(page.getByText('select'))
				.toBeInTheDocument();
			// close text appears multiple times (footer + backdrop button)
			await expect
				.element(page.getByText('close').first())
				.toBeInTheDocument();
		});

		test.skip('should navigate with arrow keys when results exist', async () => {
			// TODO: Requires mocking search results and verifying selection changes
			// Complex test involving async search + keyboard events
		});

		test.skip('should select result on Enter key', async () => {
			// TODO: Requires mocking search results and navigation
		});
	});

	describe('Search Results', () => {
		test('should show no results message when query has no matches', async () => {
			const { search_site } = await import('$lib/search.remote');
			vi.mocked(search_site).mockResolvedValue([]);

			render(CommandPalette);

			command_palette_state.open();
			command_palette_state.query = 'nonexistent';

			// Wait for search to complete
			await vi.waitFor(() => {
				expect(search_site).toHaveBeenCalled();
			});

			await expect
				.element(page.getByText('No results found'))
				.toBeInTheDocument();
		});

		test.skip('should group results by category', async () => {
			// TODO: Mock results with different categories and verify grouping
		});

		test.skip('should render doc results with BookOpen icon', async () => {
			// TODO: Verify icon rendering for doc type results
		});

		test.skip('should render example results with Code icon', async () => {
			// TODO: Verify icon rendering for example type results
		});

		test.skip('should render component results with Eye icon', async () => {
			// TODO: Verify icon rendering for component type results
		});
	});

	describe('Result Navigation', () => {
		test.skip('should navigate to result URL when clicked', async () => {
			// TODO: Mock results and verify goto is called with correct URL
		});

		test.skip('should add clicked result to recent list', async () => {
			// TODO: Verify add_recent is called
		});

		test.skip('should close palette after navigation', async () => {
			// TODO: Verify palette closes after selecting result
		});
	});

	describe('Recent Items', () => {
		test.skip('should show recent section when query is empty and has recent items', async () => {
			// TODO: Set up recent items and verify they display
		});

		test.skip('should limit recent items to 5', async () => {
			// TODO: Add more than 5 recent items and verify limit
		});
	});

	describe('Loading State', () => {
		test.skip('should show loading spinner while searching', async () => {
			// TODO: Mock slow search and verify loading state displays
		});
	});

	describe('Accessibility', () => {
		test('should have navigation with aria-label for results', async () => {
			render(CommandPalette);

			command_palette_state.open();

			// Results nav has aria-label
			const nav = page.getByRole('navigation', {
				name: 'Search results',
			});
			await expect.element(nav).toBeInTheDocument();
		});

		test('should have sr-only label for search input', async () => {
			render(CommandPalette);

			command_palette_state.open();

			const label = page.getByText(
				'Search docs, examples, and components',
			);
			await expect.element(label).toBeInTheDocument();
		});
	});
});
