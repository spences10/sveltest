import { describe, expect, it } from 'vitest';
import { GET } from './+server';

describe('Search Index JSON API', () => {
	it('should return 200 with valid JSON', async () => {
		const response = await GET({} as any);
		const result = await response.json();

		expect(response.status).toBe(200);
		expect(result).toBeDefined();
	});

	it('should return items array with required fields', async () => {
		const response = await GET({} as any);
		const result = await response.json();

		expect(Array.isArray(result.items)).toBe(true);
		expect(result.items.length).toBeGreaterThan(0);

		const item = result.items[0];
		expect(item).toHaveProperty('id');
		expect(item).toHaveProperty('title');
		expect(item).toHaveProperty('description');
		expect(item).toHaveProperty('url');
		expect(item).toHaveProperty('type');
		expect(item).toHaveProperty('category');
		expect(item).toHaveProperty('content');
		expect(item).toHaveProperty('keywords');
	});

	it('should have generated_at and total_items', async () => {
		const response = await GET({} as any);
		const result = await response.json();

		expect(result.generated_at).toBeDefined();
		expect(typeof result.total_items).toBe('number');
		expect(result.total_items).toBe(result.items.length);
	});

	it('should have expected cache headers', async () => {
		const response = await GET({} as any);

		expect(response.headers.get('Cache-Control')).toBe(
			'public, max-age=3600',
		);
		expect(response.headers.get('Content-Type')).toContain(
			'application/json',
		);
		expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
	});
});
