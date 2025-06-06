import { error } from '@sveltejs/kit';

export const load = async () => {
	const slug = 'about';
	try {
		const Copy = await import(`../../copy/${slug}.md`);
		return {
			Copy: Copy.default,
			slug,
		};
	} catch (e) {
		error(404, `Documentation for "${slug}" not found`);
	}
};
