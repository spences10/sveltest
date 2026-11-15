<script lang="ts">
	import {
		card_for_path,
		card_height,
		card_width,
	} from '#lib/og/cards.js';

	let { url }: { url: Pick<URL, 'pathname' | 'origin'> } = $props();
	const card = $derived(card_for_path(url.pathname));
	const image_url = $derived(
		new URL(`/api/og-image/${card.slug}.png`, url.origin).href,
	);
	const page_url = $derived(new URL(url.pathname, url.origin).href);
	const title = $derived(
		card.slug === 'site'
			? 'Sveltest — Svelte testing guides'
			: `${card.title} — Sveltest Docs`,
	);
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Sveltest" />
	<meta property="og:url" content={page_url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={card.description} />
	<meta property="og:image" content={image_url} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content={String(card_width)} />
	<meta property="og:image:height" content={String(card_height)} />
	<meta property="og:image:alt" content={card.title} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={card.description} />
	<meta name="twitter:image" content={image_url} />
	<meta name="twitter:image:alt" content={card.title} />
</svelte:head>
