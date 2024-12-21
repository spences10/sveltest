import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './+server';

describe('Secure Data Endpoint', () => {
	beforeEach(() => {
		// Mock environment variables
		vi.stubEnv('API_SECRET', 'test_secret_123');
	});

	it('should return data with valid auth token', async () => {
		const mock_request = new Request('http://localhost', {
			headers: {
				authorization: 'Bearer test_secret_123',
			},
		});

		const response = await GET({ request: mock_request } as any);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({
			message: 'Secret data retrieved successfully',
			data: {
				items: ['secret1', 'secret2', 'secret3'],
			},
		});
	});

	it('should throw 401 with invalid auth token', async () => {
		const mock_request = new Request('http://localhost', {
			headers: {
				authorization: 'Bearer wrong_token',
			},
		});

		try {
			await GET({ request: mock_request } as any);
			// If we reach here, test should fail
			expect(true).toBe(false);
		} catch (e: any) {
			expect(e.status).toBe(401);
			expect(e.body.message).toBe('Unauthorized');
		}
	});

	it('should throw 401 with missing auth token', async () => {
		const mock_request = new Request('http://localhost');

		try {
			await GET({ request: mock_request } as any);
			// If we reach here, test should fail
			expect(true).toBe(false);
		} catch (e: any) {
			expect(e.status).toBe(401);
			expect(e.body.message).toBe('Unauthorized');
		}
	});
});
