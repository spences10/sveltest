import { describe, expect, it } from 'vitest';
import { GET } from './+server';

describe('CRUD Patterns Endpoint', () => {
	it('should return CRUD operations data', async () => {
		const request = new Request(
			'http://localhost/api/examples/crud-patterns',
		);
		const response = await GET({ request } as any);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.crud_operations).toHaveProperty('create');
		expect(data.crud_operations).toHaveProperty('read');
		expect(data.crud_operations).toHaveProperty('update');
		expect(data.crud_operations).toHaveProperty('delete');
	});

	it('should emphasize untrack() usage', async () => {
		const request = new Request(
			'http://localhost/api/examples/crud-patterns',
		);
		const response = await GET({ request } as any);
		const data = await response.json();

		const hasUntrackPattern =
			data.testing_patterns.critical_patterns.some((p: string) =>
				p.includes('untrack()'),
			);
		expect(hasUntrackPattern).toBe(true);
	});
});
