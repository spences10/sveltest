import { topics, topic_categories } from '$lib/data/topics';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		topics,
		topic_categories,
	};
};
