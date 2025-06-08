<script lang="ts">
	import DocsToc from '$lib/components/docs-toc.svelte';
	import './prism.css';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.topic_info.title} - Sveltest Docs</title>
	<meta
		name="description"
		content="{data.topic_info
			.description} - Comprehensive testing documentation for Svelte 5 + vitest-browser-svelte."
	/>
</svelte:head>

<!-- Fixed positioned TOC -->
<DocsToc current_topic={data.slug} />

<div class="container mx-auto max-w-4xl overflow-x-hidden px-4 py-6">
	<!-- Main Content -->
	<main class="max-w-full min-w-0">
		{#key data.slug}
			<div class="prose prose-lg max-w-none overflow-x-auto">
				<data.Copy />
			</div>
		{/key}
	</main>
</div>
