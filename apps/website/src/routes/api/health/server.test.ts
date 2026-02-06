import { describe, expect, it } from 'vitest';
import { GET } from './+server';

describe('Health API', () => {
	it('should return 200 with status ok', async () => {
		const response = await GET();
		const result = await response.json();

		expect(response.status).toBe(200);
		expect(result.status).toBe('ok');
	});

	it('should return a valid ISO timestamp', async () => {
		const response = await GET();
		const result = await response.json();

		expect(result.timestamp).toBeDefined();
		const parsed = new Date(result.timestamp);
		expect(parsed.toISOString()).toBe(result.timestamp);
	});

	it('should return numeric uptime', async () => {
		const response = await GET();
		const result = await response.json();

		expect(typeof result.uptime).toBe('number');
		expect(result.uptime).toBeGreaterThanOrEqual(0);
	});
});
