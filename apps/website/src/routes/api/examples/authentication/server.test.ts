import { describe, expect, it } from 'vitest';
import { GET, POST } from './+server';

describe('Authentication Endpoint', () => {
	describe('GET - Documentation', () => {
		it('should return authentication patterns', async () => {
			const request = new Request(
				'http://localhost/api/examples/authentication',
			);
			const response = await GET({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.auth_scenarios).toHaveProperty('bearer_token');
			expect(data.security_patterns).toBeDefined();
		});
	});

	describe('POST - Authentication Test', () => {
		it('should accept valid Bearer token', async () => {
			const request = new Request(
				'http://localhost/api/examples/authentication',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer demo_secret_token',
					},
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.authenticated).toBe(true);
		});

		it('should reject invalid Bearer token', async () => {
			const request = new Request(
				'http://localhost/api/examples/authentication',
				{
					method: 'POST',
					headers: { authorization: 'Bearer wrong_token' },
				},
			);

			const response = await POST({ request } as any);

			expect(response.status).toBe(401);
		});

		it('should reject missing authorization header', async () => {
			const request = new Request(
				'http://localhost/api/examples/authentication',
				{
					method: 'POST',
				},
			);

			const response = await POST({ request } as any);

			expect(response.status).toBe(401);
		});
	});
});
