<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<!-- Modern gradient background -->
<div
	class="from-primary/5 via-secondary/3 to-accent/5 min-h-screen bg-gradient-to-br"
>
	<!-- Navigation Component -->
	<Nav />

	<!-- Page content -->
	<main class="min-h-screen pb-20 lg:pb-0">
		{@render children?.()}
	</main>
</div>
