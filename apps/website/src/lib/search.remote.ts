import { query } from '$app/server';
import { z } from 'zod';
import {
	generate_search_index,
	search_full_text,
} from '$lib/server/search-index';

const search_schema = z.object({
	q: z.string().min(1),
	filter: z
		.enum(['all', 'docs', 'examples', 'components'])
		.default('all'),
});

export const search_site = query(
	search_schema,
	async ({ q, filter }) => {
		const index = await generate_search_index();
		return search_full_text(q, index, filter);
	},
);
