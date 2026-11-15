import { topics } from '#lib/data/topics.js';

export const card_width = 1200;
export const card_height = 630;

export const site_card = {
	slug: 'site',
	title: 'Test your Svelte apps with confidence.',
	description:
		'Practical testing guides for Svelte 5, Vitest and Playwright.',
	category: 'Svelte testing, explained',
};

export function card_for_slug(slug: string) {
	return slug === site_card.slug
		? site_card
		: topics.find((topic) => topic.slug === slug);
}

export function card_for_path(pathname: string) {
	const match = /^\/docs\/([^/]+)\/?$/.exec(pathname);
	return (match && card_for_slug(match[1])) || site_card;
}
