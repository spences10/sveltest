<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import { Arrow, CircleDot, GitHub, Heart, Robot } from '$lib/icons';
	import '../app.css';

	let { children } = $props();
</script>

<!-- Modern gradient background -->
<div
	class="from-primary/5 via-secondary/3 to-accent/5 min-h-screen overflow-x-hidden bg-gradient-to-br"
>
	<!-- Navigation Component -->
	<Nav />

	<!-- Page content -->
	<main class="min-h-screen overflow-x-hidden pb-20 lg:pb-0">
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
					<Robot class_names="text-primary h-4 w-4" />
					<span class="text-base-content/70"> and </span>
					<Heart
						class_names="text-red-500 h-4 w-4"
						fill="currentColor"
					/>
					<span class="text-base-content/70">
						for the Svelte community
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
						<Arrow
							direction="up-right"
							class_names="h-3 w-3 opacity-60"
						/>
					</a>
					<a
						href="https://github.com/spences10/sveltest/issues"
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-ghost btn-sm hover:bg-base-300/50"
					>
						<CircleDot class_names="h-4 w-4" />
						Report Issue
						<Arrow
							direction="up-right"
							class_names="h-3 w-3 opacity-60"
						/>
					</a>
				</div>
			</div>
			<div class="divider my-4"></div>
			<div class="text-center">
				<p class="text-base-content/50 text-sm">
					© {new Date().getFullYear()} Sveltest - Open source testing
					resource for Svelte applications
				</p>
			</div>
		</div>
	</footer>
</div>
