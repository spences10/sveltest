<script lang="ts">
	const { data } = $props();
	const { Copy, slug } = data;

	// Format the title from slug
	const title = slug
		.replace('-', ' ')
		.replace(/\b\w/g, (l) => l.toUpperCase());
</script>

<svelte:head>
	<title>{title} - Sveltest Docs</title>
	<meta
		name="description"
		content="Comprehensive testing documentation for Svelte 5 + vitest-browser-svelte. Learn {title.toLowerCase()} patterns and best practices."
	/>
</svelte:head>

<div class="prose prose-lg mx-auto max-w-4xl p-6">
	<Copy />
</div>
