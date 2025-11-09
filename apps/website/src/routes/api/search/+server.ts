import {
	generate_search_index,
	search_full_text,
	type SearchIndex,
	type SearchIndexItem,
} from '$lib/server/search-index';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export interface SearchResult {
	id: string;
	title: string;
	description: string;
	url: string;
	type: 'topic' | 'example' | 'code';
	category?: string;
	excerpt?: string;
}

// Full-text search index
let full_search_index: SearchIndex | null = null;

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const filter = url.searchParams.get('filter') || 'all'; // 'all', 'docs', 'examples', 'components'

	// Build full-text search index once per server instance
	if (!full_search_index) {
		full_search_index = await generate_search_index();
	}

	// Perform full-text search
	const results = search_full_text(query, full_search_index, filter);

	// Convert to API format for compatibility with existing components
	const api_results: SearchResult[] = results.map(
		(item: SearchIndexItem) => ({
			id: item.id,
			title: item.title,
			description: item.description,
			url: item.url,
			type: item.type,
			category: item.category,
			excerpt: item.excerpt,
		}),
	);

	return json({
		query,
		filter,
		results: api_results,
		total: api_results.length,
	});
};
