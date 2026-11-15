<script lang="ts">
	import { card_for_path } from '#lib/og/cards.js';
	import { page } from '$app/state';
	import { Head, type SeoConfig } from 'svead';
	import ShareCardSize from './share-card-size.svelte';

	let {
		title,
		description,
		url,
	}: {
		title: string;
		description: string;
		url?: Pick<URL, 'pathname' | 'origin'>;
	} = $props();

	const current_url = $derived(url ?? page.url);
	const card = $derived(card_for_path(current_url.pathname));
	const seo_config: SeoConfig = $derived({
		title,
		description,
		url: new URL(current_url.pathname, current_url.origin).href,
		site_name: 'Sveltest',
		open_graph_image: new URL(
			`/api/og-image/${card.slug}.png`,
			current_url.origin,
		).href,
		open_graph_image_alt: card.title,
		twitter_card_type: 'summary_large_image',
	});
</script>

<Head {seo_config} />
<ShareCardSize alt={card.title} />
