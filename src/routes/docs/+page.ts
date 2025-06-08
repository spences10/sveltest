import { topics } from '$lib/data/topics';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	// Fetch dynamic stats from server
	let docs_stats = {
		sections: topics.length,
		examples: 50, // fallback
		coverage: 100,
		accessibility: 'A11y',
	};

	try {
		const response = await fetch('/api/search', { method: 'POST' });
		if (response.ok) {
			docs_stats = await response.json();
		}
	} catch (error) {
		console.warn(
			'Failed to fetch docs stats, using fallback:',
			error,
		);
	}

	return {
		topics,
		docs_stats,
	};
};
