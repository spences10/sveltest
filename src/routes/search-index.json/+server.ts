import { generate_search_index } from '$lib/server/search-index';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	try {
		const search_index = await generate_search_index();

		return json(search_index, {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-Control': 'public, max-age=3600',
				'X-Robots-Tag': 'noindex', // Don't index the search data
			},
		});
	} catch (error) {
		console.error('Failed to generate search index:', error);

		return json(
			{
				items: [],
				generated_at: new Date().toISOString(),
				total_items: 0,
				error: 'Failed to generate search index',
			},
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
			},
		);
	}
};
