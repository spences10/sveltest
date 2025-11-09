import { describe, expect, it } from 'vitest';
import { GET } from './+server';

describe('Modal States Endpoint', () => {
	it('should return valid response structure', async () => {
		const request = new Request(
			'http://localhost/api/examples/modal-states',
		);
		const response = await GET({ request } as any);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toHaveProperty('title');
		expect(data).toHaveProperty('modal_sizes');
		expect(data).toHaveProperty('modal_interactions');
		expect(data).toHaveProperty('test_scenarios');
	});

	it('should include all modal sizes', async () => {
		const request = new Request(
			'http://localhost/api/examples/modal-states',
		);
		const response = await GET({ request } as any);
		const data = await response.json();

		expect(data.modal_sizes).toHaveLength(4);
		const sizes = data.modal_sizes.map((s: any) => s.size);
		expect(sizes).toEqual(['sm', 'md', 'lg', 'xl']);
	});

	it('should include user interaction patterns', async () => {
		const request = new Request(
			'http://localhost/api/examples/modal-states',
		);
		const response = await GET({ request } as any);
		const data = await response.json();

		expect(data.modal_interactions.length).toBeGreaterThan(0);
		const interactions = data.modal_interactions.map(
			(i: any) => i.interaction,
		);
		expect(interactions).toContain('Close button click');
		expect(interactions).toContain('Escape key press');
	});
});
