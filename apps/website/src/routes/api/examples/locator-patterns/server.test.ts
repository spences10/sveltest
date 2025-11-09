import { describe, expect, it } from 'vitest';
import { GET } from './+server';

describe('Locator Patterns Endpoint', () => {
	it('should return locator strategies', async () => {
		const request = new Request(
			'http://localhost/api/examples/locator-patterns',
		);
		const response = await GET({ request } as any);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.locator_strategies).toHaveProperty('getByRole');
		expect(data.locator_strategies).toHaveProperty('getByLabelText');
		expect(data.locator_strategies).toHaveProperty('getByTestId');
	});

	it('should emphasize getByRole priority', async () => {
		const request = new Request(
			'http://localhost/api/examples/locator-patterns',
		);
		const response = await GET({ request } as any);
		const data = await response.json();

		expect(data.locator_strategies.getByRole.priority).toBe(1);
	});
});
