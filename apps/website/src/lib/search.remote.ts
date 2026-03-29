import { query } from '$app/server';
import {
	perform_search,
	search_schema,
} from './search.remote.helper';

export const search_site = query(
	search_schema,
	async ({ q, filter }) => {
		return perform_search({ q, filter });
	},
);
