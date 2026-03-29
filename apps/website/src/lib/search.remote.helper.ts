import {
	generate_search_index,
	search_full_text,
	type SearchResult,
} from '$lib/server/search-index';
import { z } from 'zod';

export const search_schema = z.object({
	q: z.string().min(1),
	filter: z
		.enum(['all', 'docs', 'examples', 'components'])
		.default('all'),
});

export type SearchParams = z.infer<typeof search_schema>;

export async function perform_search({
	q,
	filter,
}: SearchParams): Promise<SearchResult[]> {
	const index = await generate_search_index();
	return search_full_text(q, index, filter);
}
