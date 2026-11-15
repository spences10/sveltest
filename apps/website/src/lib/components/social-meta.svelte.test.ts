import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-svelte';
import SocialMeta from './social-meta.svelte';

// Metadata has no accessible role or visible text; inspect head attributes.
function image_urls() {
	return Array.from(
		document.head.querySelectorAll('meta[property="og:image"]'),
		(tag) => tag.getAttribute('content'),
	);
}

test('updates Svead metadata without duplicates when the page changes', async () => {
	const view = await render(SocialMeta, {
		title: 'Getting Started - Sveltest Docs',
		description: 'Setup your first test',
		url: new URL('https://sveltest.dev/docs/getting-started'),
	});
	await expect
		.poll(image_urls)
		.toEqual([
			'https://sveltest.dev/api/og-image/getting-started.png',
		]);
	await expect
		.poll(() => document.title)
		.toBe('Getting Started - Sveltest Docs');

	await view.rerender({
		title: 'SSR Testing - Sveltest Docs',
		description: 'Server-side rendering test patterns',
		url: new URL('https://sveltest.dev/docs/ssr-testing'),
	});
	await expect
		.poll(image_urls)
		.toEqual(['https://sveltest.dev/api/og-image/ssr-testing.png']);
	await expect
		.poll(() => document.title)
		.toBe('SSR Testing - Sveltest Docs');
	expect(
		document.head.querySelectorAll('meta[name="description"]'),
	).toHaveLength(1);
	expect(
		document.head
			.querySelector('meta[name="description"]')
			?.getAttribute('content'),
	).toBe('Server-side rendering test patterns');
	expect(
		document.head.querySelectorAll('link[rel="canonical"]'),
	).toHaveLength(1);
	expect(
		document.head
			.querySelector('link[rel="canonical"]')
			?.getAttribute('href'),
	).toBe('https://sveltest.dev/docs/ssr-testing');
});
