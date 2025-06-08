<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import { GitHub, Heart } from '$lib/icons';
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

	<!-- Footer -->
	<footer
		class="bg-base-200/50 border-base-300/50 border-t backdrop-blur-sm"
	>
		<div class="container mx-auto max-w-6xl px-4 py-8">
			<div
				class="flex flex-col items-center justify-between gap-4 md:flex-row"
			>
				<div class="flex items-center gap-2">
					<span class="text-base-content/70"> Built with </span>
					<Heart class_names="text-red-500 h-4 w-4" />
					<span class="text-base-content/70">
						by the Svelte community
					</span>
				</div>
				<div class="flex items-center gap-4">
					<a
						href="https://github.com/spences10/sveltest"
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-ghost btn-sm hover:bg-base-300/50 gap-2"
					>
						<GitHub class_names="h-4 w-4" />
						GitHub
						<span class="text-xs opacity-60">↗</span>
					</a>
					<a
						href="https://github.com/spences10/sveltest/issues"
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-ghost btn-sm hover:bg-base-300/50"
					>
						Report Issue
						<span class="text-xs opacity-60">↗</span>
					</a>
				</div>
			</div>
			<div class="divider my-4"></div>
			<div class="text-center">
				<p class="text-base-content/50 text-sm">
					© 2024 Sveltest - Open source testing resource for Svelte
					applications
				</p>
			</div>
		</div>
	</footer>
</div>
