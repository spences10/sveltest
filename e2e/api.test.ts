import { expect, test } from '@playwright/test';

const API_SECRET = 'test_secret_123';

test.describe('API Endpoints', () => {
	test.describe('Secure Data API', () => {
		test('returns data with valid authentication', async ({
			request,
		}) => {
			const response = await request.get('/api/secure-data', {
				headers: {
					authorization: `Bearer ${API_SECRET}`,
				},
			});

			expect(response.status()).toBe(200);

			const data = await response.json();
			expect(data).toEqual({
				message: 'Secret data retrieved successfully',
				data: {
					items: ['secret1', 'secret2', 'secret3'],
				},
			});
		});

		test('returns 401 with invalid token', async ({ request }) => {
			const response = await request.get('/api/secure-data', {
				headers: {
					authorization: 'Bearer invalid-token',
				},
			});

			expect(response.status()).toBe(401);
		});

		test('returns 401 with malformed authorization header', async ({
			request,
		}) => {
			const response = await request.get('/api/secure-data', {
				headers: {
					authorization: 'InvalidFormat token',
				},
			});

			expect(response.status()).toBe(401);
		});

		test('returns 401 with no authorization header', async ({
			request,
		}) => {
			const response = await request.get('/api/secure-data');
			expect(response.status()).toBe(401);
		});

		test('returns proper content-type header', async ({
			request,
		}) => {
			const response = await request.get('/api/secure-data', {
				headers: {
					authorization: `Bearer ${API_SECRET}`,
				},
			});

			expect(response.status()).toBe(200);
			expect(response.headers()['content-type']).toContain(
				'application/json',
			);
		});
	});

	test.describe('General API Behavior', () => {
		test('returns 404 for non-existent API endpoints', async ({
			request,
		}) => {
			const response = await request.get('/api/non-existent');
			expect(response.status()).toBe(404);
		});

		test('handles malformed requests gracefully', async ({
			request,
		}) => {
			// Test with invalid JSON in request body for POST endpoint that doesn't exist
			const response = await request.post('/api/non-existent', {
				data: 'invalid json{',
				headers: {
					'content-type': 'application/json',
				},
			});

			// Should return 404 for non-existent endpoint
			expect(response.status()).toBe(404);
		});

		test('API endpoints respond within reasonable time', async ({
			request,
		}) => {
			const startTime = Date.now();

			const response = await request.get('/api/secure-data', {
				headers: {
					authorization: `Bearer ${API_SECRET}`,
				},
			});

			const endTime = Date.now();
			const responseTime = endTime - startTime;

			expect(response.status()).toBe(200);
			// API should respond within 5 seconds (generous for CI)
			expect(responseTime).toBeLessThan(5000);
		});
	});
});
