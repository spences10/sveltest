import { render } from 'svelte/server';
import { describe, expect, it } from 'vite-plus/test';
import { load } from './+page';

describe('documentation topic rendering', () => {
	it('loads and renders the mutation guide with code examples', async () => {
		const data = await load({
			params: { topic: 'mutation-testing' },
		} as Parameters<typeof load>[0]);

		if (!data) throw new Error('Expected documentation page data');
		expect(data.topic_info.title).toBe('Mutation Testing');
		const { body } = render(data.Copy);
		expect(body).toContain('Catch a Real Surviving Mutation');
		expect(body).toContain('user@example.com!');
		expect(body).toContain('Run in CI');
	});
});
