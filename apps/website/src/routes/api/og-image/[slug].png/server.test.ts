import { topics } from '#lib/data/topics.js';
import { card_height, card_width, site_card } from '#lib/og/cards.js';
import { describe, expect, test } from 'vite-plus/test';
import { GET } from './+server.js';

async function request_card(slug: string) {
	return GET({ params: { slug } } as Parameters<typeof GET>[0]);
}

describe('dynamic share cards', () => {
	test('shares WASM initialization across simultaneous first requests', async () => {
		const responses = await Promise.all([
			request_card('site'),
			request_card('getting-started'),
		]);
		for (const response of responses) {
			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toBe('image/png');
			const png = Buffer.from(await response.arrayBuffer());
			expect(png.readUInt32BE(16)).toBe(card_width);
			expect(png.readUInt32BE(20)).toBe(card_height);
		}
	});

	test.each([site_card, ...topics])(
		'renders a PNG for $slug',
		async ({ slug }) => {
			const response = await request_card(slug);
			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toBe('image/png');
			expect(response.headers.get('cache-control')).toBe(
				'public, max-age=86400, s-maxage=604800',
			);
			const png = Buffer.from(await response.arrayBuffer());
			expect(png.subarray(0, 8)).toEqual(
				Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
			);
			expect(png.readUInt32BE(16)).toBe(card_width);
			expect(png.readUInt32BE(20)).toBe(card_height);
		},
	);

	test('different topics produce different cards', async () => {
		const first = await request_card('getting-started');
		const second = await request_card('ssr-testing');
		expect(Buffer.from(await first.arrayBuffer())).not.toEqual(
			Buffer.from(await second.arrayBuffer()),
		);
	});

	test('unknown slugs return 404', async () => {
		await expect(request_card('not-a-topic')).rejects.toMatchObject({
			status: 404,
		});
	});
});
