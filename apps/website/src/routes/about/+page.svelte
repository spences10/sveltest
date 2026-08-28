<script lang="ts">
	let { data } = $props();
	const Copy = $derived(data.Copy);
	const slug = $derived(data.slug);

	// Format the title from slug
	const title = $derived(
		slug.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
	);
</script>

<svelte:head>
	<title>{title} - Sveltest Docs</title>
	<meta
		name="description"
		content="Comprehensive testing documentation for Svelte 5 + vitest-browser-svelte. Learn {title.toLowerCase()} patterns and best practices."
	/>
</svelte:head>

<div class="mx-auto prose prose-lg max-w-4xl p-6">
	<Copy />
</div>
