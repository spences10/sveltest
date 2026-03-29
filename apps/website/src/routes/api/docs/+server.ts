import { content_map, topics } from '$lib/server/content';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({
		title: 'Sveltest Documentation Topics',
		description:
			'All available documentation topics for Svelte 5 testing with vitest-browser-svelte',
		total_topics: topics.length,
		categories: [...new Set(topics.map((t) => t.category))].sort(),
		topics: topics.map((t) => ({
			slug: t.slug,
			title: t.title,
			description: t.description,
			category: t.category,
			has_content: t.slug in content_map,
		})),
	});
};
