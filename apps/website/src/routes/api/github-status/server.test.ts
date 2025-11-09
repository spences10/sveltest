import { beforeEach, describe, expect, test, vi } from 'vitest';
import { GET } from './+server';

// Mock fetch globally
const mock_fetch = vi.fn();
vi.stubGlobal('fetch', mock_fetch);

// Create a mock RequestEvent for testing
const create_mock_request_event = () =>
	({
		request: new Request('http://localhost/api/github-status'),
		url: new URL('http://localhost/api/github-status'),
		params: {},
		route: { id: '/api/github-status' },
		platform: undefined,
		locals: {},
		cookies: {
			get: vi.fn(),
			getAll: vi.fn(),
			set: vi.fn(),
			delete: vi.fn(),
			serialize: vi.fn(),
		},
		fetch: mock_fetch,
		getClientAddress: vi.fn(() => '127.0.0.1'),
		isDataRequest: false,
		isSubRequest: false,
		setHeaders: vi.fn(),
	}) as any;

describe('GitHub Status API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Successful API Responses', () => {
		test('should return passing status when both workflows are successful', async () => {
			// Mock successful workflow responses
			mock_fetch
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{
								conclusion: 'success',
								status: 'completed',
							},
						],
					}),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{
								conclusion: 'success',
								status: 'completed',
							},
						],
					}),
				});

			const response = await GET(create_mock_request_event());
			const data = await response.json();

			expect(data).toEqual({
				unit_tests: {
					status: 'passing',
					badge_url:
						'https://github.com/spences10/sveltest/actions/workflows/unit-tests.yaml/badge.svg',
				},
				e2e_tests: {
					status: 'passing',
					badge_url:
						'https://github.com/spences10/sveltest/actions/workflows/e2e.yaml/badge.svg',
				},
			});

			expect(response.headers.get('Cache-Control')).toBe(
				'public, max-age=300',
			);
		});

		test('should return failing status when workflows fail', async () => {
			// Mock failed workflow responses
			mock_fetch
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{
								conclusion: 'failure',
								status: 'completed',
							},
						],
					}),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{
								conclusion: 'success',
								status: 'completed',
							},
						],
					}),
				});

			const response = await GET(create_mock_request_event());
			const data = await response.json();

			expect(data.unit_tests.status).toBe('failing');
			expect(data.e2e_tests.status).toBe('passing');
		});

		test('should return unknown status when no workflow runs exist', async () => {
			// Mock empty workflow responses
			mock_fetch
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [],
					}),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [],
					}),
				});

			const response = await GET(create_mock_request_event());
			const data = await response.json();

			expect(data.unit_tests.status).toBe('unknown');
			expect(data.e2e_tests.status).toBe('unknown');
		});
	});

	describe('Error Handling', () => {
		test('should handle GitHub API errors gracefully', async () => {
			// Mock API error responses
			mock_fetch
				.mockResolvedValueOnce({
					ok: false,
					status: 404,
					statusText: 'Not Found',
				})
				.mockResolvedValueOnce({
					ok: false,
					status: 404,
					statusText: 'Not Found',
				});

			const response = await GET(create_mock_request_event());
			const data = await response.json();

			expect(data.unit_tests.status).toBe('unknown');
			expect(data.e2e_tests.status).toBe('unknown');
			expect(response.status).toBe(500);
			expect(response.headers.get('Cache-Control')).toBe(
				'public, max-age=60',
			);
		});

		test('should handle network errors', async () => {
			// Mock network errors
			mock_fetch
				.mockRejectedValueOnce(new Error('Network error'))
				.mockRejectedValueOnce(new Error('Network error'));

			const response = await GET(create_mock_request_event());
			const data = await response.json();

			expect(data.unit_tests.status).toBe('unknown');
			expect(data.e2e_tests.status).toBe('unknown');
			expect(response.status).toBe(500);
		});

		test('should handle malformed JSON responses', async () => {
			// Mock malformed responses
			mock_fetch
				.mockResolvedValueOnce({
					ok: true,
					json: async () => {
						throw new Error('Invalid JSON');
					},
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{
								conclusion: 'success',
								status: 'completed',
							},
						],
					}),
				});

			const response = await GET(create_mock_request_event());
			const data = await response.json();

			expect(data.unit_tests.status).toBe('unknown');
			expect(data.e2e_tests.status).toBe('passing');
		});
	});

	describe('API Request Validation', () => {
		test('should make correct API requests to GitHub', async () => {
			// Mock successful responses
			mock_fetch
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{ conclusion: 'success', status: 'completed' },
						],
					}),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{ conclusion: 'success', status: 'completed' },
						],
					}),
				});

			await GET(create_mock_request_event());

			expect(mock_fetch).toHaveBeenCalledTimes(2);

			// Check unit tests API call
			expect(mock_fetch).toHaveBeenCalledWith(
				'https://api.github.com/repos/spences10/sveltest/actions/workflows/unit-tests.yaml/runs?per_page=1&status=completed',
				{
					headers: {
						Accept: 'application/vnd.github.v3+json',
						'User-Agent': 'Sveltest-App',
					},
				},
			);

			// Check E2E tests API call
			expect(mock_fetch).toHaveBeenCalledWith(
				'https://api.github.com/repos/spences10/sveltest/actions/workflows/e2e.yaml/runs?per_page=1&status=completed',
				{
					headers: {
						Accept: 'application/vnd.github.v3+json',
						'User-Agent': 'Sveltest-App',
					},
				},
			);
		});
	});

	describe('Badge URLs', () => {
		test('should return correct badge URLs', async () => {
			// Mock successful responses
			mock_fetch
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{ conclusion: 'success', status: 'completed' },
						],
					}),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						workflow_runs: [
							{ conclusion: 'success', status: 'completed' },
						],
					}),
				});

			const response = await GET(create_mock_request_event());
			const data = await response.json();

			expect(data.unit_tests.badge_url).toBe(
				'https://github.com/spences10/sveltest/actions/workflows/unit-tests.yaml/badge.svg',
			);
			expect(data.e2e_tests.badge_url).toBe(
				'https://github.com/spences10/sveltest/actions/workflows/e2e.yaml/badge.svg',
			);
		});
	});
});
