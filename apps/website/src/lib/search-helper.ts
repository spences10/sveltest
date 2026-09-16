import {
	generate_search_index,
	search_full_text,
	type SearchResult,
} from '#lib/server/search-index.js';
import * as v from 'valibot';

export const search_schema = v.object({
	q: v.pipe(v.string(), v.minLength(1)),
	filter: v.optional(
		v.picklist(['all', 'docs', 'examples', 'components']),
		'all',
	),
});

export type SearchParams = v.InferOutput<typeof search_schema>;

export async function perform_search({
	q,
	filter,
}: SearchParams): Promise<SearchResult[]> {
	const index = await generate_search_index();
	return search_full_text(q, index, filter);
}
