import type { ActionFailure } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { actions } from './+page.server';

describe('Docs Search Action', () => {
	it('should return results for a valid query', async () => {
		const form_data = new FormData();
		form_data.append('q', 'testing');

		const response = await actions.search({
			request: new Request('http://localhost', {
				method: 'POST',
				body: form_data,
			}),
		} as any);

		const success_response = response as {
			success: boolean;
			query: string;
			results: unknown[];
			total: number;
		};
		expect(success_response.success).toBe(true);
		expect(success_response.query).toBe('testing');
		expect(Array.isArray(success_response.results)).toBe(true);
		expect(success_response.total).toBeGreaterThan(0);
	});

	it('should fail with 400 for empty query', async () => {
		const form_data = new FormData();
		form_data.append('q', '');

		const response = await actions.search({
			request: new Request('http://localhost', {
				method: 'POST',
				body: form_data,
			}),
		} as any);

		const failure_response = response as ActionFailure<{
			error: string;
		}>;
		expect(failure_response.status).toBe(400);
	});

	it('should fail with 400 for missing query', async () => {
		const form_data = new FormData();

		const response = await actions.search({
			request: new Request('http://localhost', {
				method: 'POST',
				body: form_data,
			}),
		} as any);

		const failure_response = response as ActionFailure<{
			error: string;
		}>;
		expect(failure_response.status).toBe(400);
	});

	it('should respect filter parameter', async () => {
		const form_data = new FormData();
		form_data.append('q', 'svelte');
		form_data.append('filter', 'docs');

		const response = await actions.search({
			request: new Request('http://localhost', {
				method: 'POST',
				body: form_data,
			}),
		} as any);

		const success_response = response as {
			success: boolean;
			filter: string;
		};
		expect(success_response.success).toBe(true);
		expect(success_response.filter).toBe('docs');
	});
});
