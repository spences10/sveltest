<script lang="ts">
	import SocialMeta from '#lib/components/social-meta.svelte';
	let { data } = $props();
	const Copy = $derived(data.Copy);
	const slug = $derived(data.slug);

	// Format the title from slug
	const title = $derived(
		slug.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
	);
</script>

<SocialMeta
	title="{title} - Sveltest Docs"
	description="Comprehensive testing documentation for Svelte 5 + vitest-browser-svelte. Learn {title.toLowerCase()} patterns and best practices."
/>

<div class="mx-auto prose prose-lg max-w-4xl p-6">
	<Copy />
</div>
