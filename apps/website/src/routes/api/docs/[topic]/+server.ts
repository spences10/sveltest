import { content_map, topics } from '$lib/server/content';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
	const { topic } = params;
	const format = url.searchParams.get('format');

	const content = content_map[topic];
	if (!content) {
		return json(
			{
				error: `Topic '${topic}' not found`,
				available_topics: topics.map((t) => t.slug),
			},
			{ status: 404 },
		);
	}

	const topic_meta = topics.find((t) => t.slug === topic);

	if (format === 'json') {
		return json({
			slug: topic,
			title: topic_meta?.title ?? topic,
			description: topic_meta?.description ?? '',
			category: topic_meta?.category ?? '',
			content,
		});
	}

	return new Response(content, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
		},
	});
};
