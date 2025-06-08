import {
	afterEach,
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

// Mock browser environment first
const mock_browser = vi.hoisted(() => ({ value: true }));
vi.mock('$app/environment', () => ({
	get browser() {
		return mock_browser.value;
	},
}));

// Mock fetch globally
const mock_fetch = vi.fn();
global.fetch = mock_fetch;

// Import after mocking
import {
	GitHubStatusManager,
	type GitHubStatus,
} from './github-status.svelte';

describe('GitHubStatusManager', () => {
	let manager: GitHubStatusManager;

	beforeEach(() => {
		vi.clearAllMocks();
		mock_browser.value = true;
	});

	afterEach(() => {
		vi.clearAllTimers();
	});

	describe('Initial State', () => {
		test('should initialize with default state', () => {
			// Don't auto-fetch for this test
			mock_browser.value = false;
			manager = new GitHubStatusManager();

			expect(manager.data).toBe(null);
			expect(manager.loading).toBe(false);
			expect(manager.error).toBe(null);
			expect(manager.last_updated).toBe(null);
			expect(manager.overall_status).toBe('unknown');
			expect(manager.status_message).toBe('Status unknown');
			expect(manager.status_color).toBe('warning');
		});

		test('should not fetch on server side', () => {
			mock_browser.value = false;
			manager = new GitHubStatusManager();

			expect(mock_fetch).not.toHaveBeenCalled();
		});
	});

	describe('Status Computation', () => {
		beforeEach(() => {
			// Don't auto-fetch for these tests
			mock_browser.value = false;
			manager = new GitHubStatusManager();
		});

		test('should return passing when both tests pass', () => {
			const mock_data: GitHubStatus = {
				unit_tests: { status: 'passing', badge_url: 'test-url' },
				e2e_tests: { status: 'passing', badge_url: 'test-url' },
			};

			// Manually set state for testing
			(manager as any).state.data = mock_data;

			expect(manager.overall_status).toBe('passing');
			expect(manager.status_message).toBe('All tests passing');
			expect(manager.status_color).toBe('success');
		});

		test('should return failing when unit tests fail', () => {
			const mock_data: GitHubStatus = {
				unit_tests: { status: 'failing', badge_url: 'test-url' },
				e2e_tests: { status: 'passing', badge_url: 'test-url' },
			};

			(manager as any).state.data = mock_data;

			expect(manager.overall_status).toBe('failing');
			expect(manager.status_message).toBe('Unit tests failing');
			expect(manager.status_color).toBe('error');
		});

		test('should return failing when e2e tests fail', () => {
			const mock_data: GitHubStatus = {
				unit_tests: { status: 'passing', badge_url: 'test-url' },
				e2e_tests: { status: 'failing', badge_url: 'test-url' },
			};

			(manager as any).state.data = mock_data;

			expect(manager.overall_status).toBe('failing');
			expect(manager.status_message).toBe('E2E tests failing');
			expect(manager.status_color).toBe('error');
		});

		test('should return failing when both tests fail', () => {
			const mock_data: GitHubStatus = {
				unit_tests: { status: 'failing', badge_url: 'test-url' },
				e2e_tests: { status: 'failing', badge_url: 'test-url' },
			};

			(manager as any).state.data = mock_data;

			expect(manager.overall_status).toBe('failing');
			expect(manager.status_message).toBe('Unit & E2E tests failing');
			expect(manager.status_color).toBe('error');
		});

		test('should return unknown when tests have unknown status', () => {
			const mock_data: GitHubStatus = {
				unit_tests: { status: 'unknown', badge_url: 'test-url' },
				e2e_tests: { status: 'passing', badge_url: 'test-url' },
			};

			(manager as any).state.data = mock_data;

			expect(manager.overall_status).toBe('unknown');
			expect(manager.status_message).toBe('Test status unknown');
			expect(manager.status_color).toBe('warning');
		});
	});

	describe('Fetch Status', () => {
		beforeEach(() => {
			mock_browser.value = false; // Don't auto-fetch in constructor
			manager = new GitHubStatusManager();
			mock_browser.value = true; // Enable for manual fetch calls
		});

		test('should fetch and update state successfully', async () => {
			const mock_response: GitHubStatus = {
				unit_tests: { status: 'passing', badge_url: 'unit-url' },
				e2e_tests: { status: 'passing', badge_url: 'e2e-url' },
			};

			mock_fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mock_response,
			});

			await manager.fetch_status();

			expect(mock_fetch).toHaveBeenCalledWith('/api/github-status');
			expect(manager.data).toEqual(mock_response);
			expect(manager.loading).toBe(false);
			expect(manager.error).toBe(null);
			expect(manager.last_updated).toBeTypeOf('number');
		});

		test('should handle fetch errors gracefully', async () => {
			mock_fetch.mockRejectedValueOnce(new Error('Network error'));

			await manager.fetch_status();

			expect(manager.data).toBe(null);
			expect(manager.loading).toBe(false);
			expect(manager.error).toBe('Network error');
		});

		test('should handle HTTP errors', async () => {
			mock_fetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			});

			await manager.fetch_status();

			expect(manager.error).toBe('HTTP 500: Internal Server Error');
		});

		test('should not fetch if browser is false', async () => {
			mock_browser.value = false;

			await manager.fetch_status();

			expect(mock_fetch).not.toHaveBeenCalled();
		});
	});

	describe('Caching Behavior', () => {
		beforeEach(() => {
			mock_browser.value = false; // Don't auto-fetch
			manager = new GitHubStatusManager();
			mock_browser.value = true; // Enable for manual calls
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		test('should not refetch within cache duration', async () => {
			const mock_response: GitHubStatus = {
				unit_tests: { status: 'passing', badge_url: 'unit-url' },
				e2e_tests: { status: 'passing', badge_url: 'e2e-url' },
			};

			mock_fetch.mockResolvedValue({
				ok: true,
				json: async () => mock_response,
			});

			// First fetch
			await manager.fetch_status();
			expect(mock_fetch).toHaveBeenCalledTimes(1);

			// Second fetch within cache duration
			await manager.fetch_status();
			expect(mock_fetch).toHaveBeenCalledTimes(1); // Should not fetch again
		});

		test('should refetch after cache expires', async () => {
			const mock_response: GitHubStatus = {
				unit_tests: { status: 'passing', badge_url: 'unit-url' },
				e2e_tests: { status: 'passing', badge_url: 'e2e-url' },
			};

			mock_fetch.mockResolvedValue({
				ok: true,
				json: async () => mock_response,
			});

			// First fetch
			await manager.fetch_status();
			expect(mock_fetch).toHaveBeenCalledTimes(1);

			// Advance time beyond cache duration (5 minutes)
			vi.advanceTimersByTime(5 * 60 * 1000 + 1);

			// Second fetch after cache expires
			await manager.fetch_status();
			expect(mock_fetch).toHaveBeenCalledTimes(2);
		});

		test('should force refresh when requested', async () => {
			const mock_response: GitHubStatus = {
				unit_tests: { status: 'passing', badge_url: 'unit-url' },
				e2e_tests: { status: 'passing', badge_url: 'e2e-url' },
			};

			mock_fetch.mockResolvedValue({
				ok: true,
				json: async () => mock_response,
			});

			// First fetch
			await manager.fetch_status();
			expect(mock_fetch).toHaveBeenCalledTimes(1);

			// Force refresh
			await manager.refresh();
			expect(mock_fetch).toHaveBeenCalledTimes(2);
		});
	});

	describe('Loading State', () => {
		beforeEach(() => {
			mock_browser.value = false; // Don't auto-fetch
			manager = new GitHubStatusManager();
			mock_browser.value = true; // Enable for manual calls
		});

		test('should set loading state during fetch', async () => {
			let resolve_fetch: (value: any) => void;
			const fetch_promise = new Promise((resolve) => {
				resolve_fetch = resolve;
			});

			mock_fetch.mockReturnValueOnce(fetch_promise);

			// Start fetch
			const fetch_promise_result = manager.fetch_status();

			// Should be loading
			expect(manager.loading).toBe(true);

			// Resolve fetch
			resolve_fetch!({
				ok: true,
				json: async () => ({
					unit_tests: { status: 'passing', badge_url: 'test' },
					e2e_tests: { status: 'passing', badge_url: 'test' },
				}),
			});

			await fetch_promise_result;

			// Should not be loading anymore
			expect(manager.loading).toBe(false);
		});
	});
});
