import {
	generate_search_index,
	search_full_text,
} from '$lib/server/search-index';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	search: async ({ request }) => {
		const form_data = await request.formData();
		const query = form_data.get('q')?.toString() || '';
		const filter = form_data.get('filter')?.toString() || 'all';

		if (!query.trim()) {
			return fail(400, {
				error: 'Search query is required',
				query,
				filter,
			});
		}

		try {
			// Generate search index (cached in production)
			const search_index = await generate_search_index();

			// Perform full-text search
			const results = search_full_text(query, search_index, filter);

			return {
				success: true,
				query,
				filter,
				results: results.slice(0, 10), // Limit results for form response
				total: results.length,
				search_type: 'server_action',
			};
		} catch (error) {
			console.error('Search error:', error);
			return fail(500, {
				error: 'Search failed. Please try again.',
				query,
				filter,
			});
		}
	},
};
