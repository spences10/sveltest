import { card_for_slug } from '#lib/og/cards.js';
import { render_card } from '#lib/server/og/render.js';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const get: RequestHandler = ({ params }) => {
	const card = card_for_slug(params.slug);
	if (!card) error(404, 'Share card not found');

	return new Response(render_card(card), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=86400, s-maxage=604800',
		},
	});
};

export { get as GET };
