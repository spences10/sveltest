<script lang="ts">
	import { card_height, card_width } from '#lib/og/cards.js';

	let { alt }: { alt: string } = $props();
</script>

<!-- Keep these after Svead's og:image. A parent's own svelte:head
     renders before its children's head content during SSR. -->
<svelte:head>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content={String(card_width)} />
	<meta property="og:image:height" content={String(card_height)} />
	<meta name="twitter:image:alt" content={alt} />
</svelte:head>
