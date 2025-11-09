import { describe, expect, it } from 'vitest';
import { GET } from './+server';

describe('Runes Testing Endpoint', () => {
	it('should return runes testing patterns', async () => {
		const request = new Request(
			'http://localhost/api/examples/runes-testing',
		);
		const response = await GET({ request } as any);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.runes_patterns).toHaveProperty('state_rune');
		expect(data.runes_patterns).toHaveProperty('derived_rune');
		expect(data.runes_patterns).toHaveProperty('effect_rune');
	});

	it('should emphasize untrack() for $derived', async () => {
		const request = new Request(
			'http://localhost/api/examples/runes-testing',
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
