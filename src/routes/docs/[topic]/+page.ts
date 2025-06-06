import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const slug = params.topic || 'getting-started';
	try {
		const Copy = await import(`../../../copy/${slug}.md`);
		return {
			Copy: Copy.default,
			slug,
		};
	} catch (e) {
		error(404, `Documentation for "${slug}" not found`);
	}
};
