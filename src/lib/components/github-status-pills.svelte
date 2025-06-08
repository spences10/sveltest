<script lang="ts">
	import { github_status } from '$lib/state/github-status.svelte.ts';
</script>

{#if github_status.data}
	<div class="flex flex-wrap items-center justify-center gap-3">
		<!-- Unit Tests Status -->
		<div
			class="bg-base-100/80 border-base-300/50 inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg backdrop-blur-sm"
		>
			<div
				class="h-2 w-2 animate-pulse rounded-full {github_status.data
					.unit_tests.status === 'passing'
					? 'bg-success'
					: github_status.data.unit_tests.status === 'failing'
						? 'bg-error'
						: 'bg-warning'}"
			></div>
			<span
				class="text-base-content/70 text-xs font-medium tracking-wider uppercase"
			>
				Unit Tests
			</span>
		</div>

		<!-- E2E Tests Status -->
		<div
			class="bg-base-100/80 border-base-300/50 inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg backdrop-blur-sm"
		>
			<div
				class="h-2 w-2 animate-pulse rounded-full {github_status.data
					.e2e_tests.status === 'passing'
					? 'bg-success'
					: github_status.data.e2e_tests.status === 'failing'
						? 'bg-error'
						: 'bg-warning'}"
			></div>
			<span
				class="text-base-content/70 text-xs font-medium tracking-wider uppercase"
			>
				E2E Tests
			</span>
		</div>
	</div>
{:else if github_status.loading}
	<div class="mt-4 flex items-center justify-center gap-2">
		<span class="loading loading-spinner loading-sm"></span>
		<span class="text-base-content/60 text-sm">Loading status...</span
		>
	</div>
{/if}
