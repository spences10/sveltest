import { topics } from '$lib/data/topics';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const slug = params.topic || 'getting-started';
	const topic_info = topics.find((topic) => topic.slug === slug);

	if (!topic_info) {
		error(404, `Documentation for "${slug}" not found`);
	}

	try {
		const Copy = await import(`../../../copy/${slug}.md`);
		return {
			Copy: Copy.default,
			slug,
			topic_info,
		};
	} catch {
		error(404, `Documentation for "${slug}" not found`);
	}
};
