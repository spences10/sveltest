import { topics } from '#lib/data/topics.js';
import { render } from 'svelte/server';
import { describe, expect, test } from 'vite-plus/test';
import SocialMeta from './social-meta.svelte';

describe('social metadata', () => {
	test.each(topics)('uses the $slug documentation card', (topic) => {
		const { head } = render(SocialMeta, {
			props: {
				url: new URL(
					`https://sveltest.dev/docs/${topic.slug}?ref=share`,
				),
			},
		});
		expect(head).toContain(
			`property="og:image" content="https://sveltest.dev/api/og-image/${topic.slug}.png"`,
		);
		expect(head).toContain(
			`name="twitter:image" content="https://sveltest.dev/api/og-image/${topic.slug}.png"`,
		);
		expect(head).toContain(
			`property="og:title" content="${topic.title} — Sveltest Docs"`,
		);
		expect(head).toContain(
			`property="og:description" content="${topic.description}"`,
		);
		expect(head).toContain(
			`property="og:url" content="https://sveltest.dev/docs/${topic.slug}"`,
		);
		expect(head.match(/property="og:image"/g)).toHaveLength(1);
		expect(head.indexOf('property="og:image"')).toBeLessThan(
			head.indexOf('property="og:image:width"'),
		);
	});

	test.each(['/', '/docs', '/examples', '/docs/unknown'])(
		'uses the site card for %s',
		(pathname) => {
			const { head } = render(SocialMeta, {
				props: { url: new URL(pathname, 'http://localhost:5173') },
			});
			expect(head).toContain(
				'property="og:image" content="http://localhost:5173/api/og-image/site.png"',
			);
			expect(head).toContain(
				'name="twitter:card" content="summary_large_image"',
			);
			expect(head).toContain(
				'property="og:image:width" content="1200"',
			);
			expect(head).toContain(
				'property="og:image:height" content="630"',
			);
		},
	);

	test('handles a trailing slash', () => {
		const { head } = render(SocialMeta, {
			props: {
				url: new URL('http://localhost:5173/docs/getting-started/'),
			},
		});
		expect(head).toContain('/api/og-image/getting-started.png');
	});
});
