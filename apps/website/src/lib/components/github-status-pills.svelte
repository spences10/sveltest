<script lang="ts">
	import { github_status } from '$lib/state/github-status.svelte.ts';
</script>

{#if github_status.data && github_status.data.unit_tests && github_status.data.e2e_tests}
	<div class="flex flex-wrap items-center justify-center gap-3">
		<!-- Unit Tests Status -->
		<div
			class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-linear-to-r from-primary/10 via-base-100/80 to-primary/10 px-4 py-2 shadow-lg backdrop-blur-sm"
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
				class="text-xs font-medium tracking-wider text-base-content/70 uppercase text-shadow-2xs"
			>
				Unit Tests
			</span>
		</div>

		<!-- E2E Tests Status -->
		<div
			class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-linear-to-r from-primary/10 via-base-100/80 to-primary/10 px-4 py-2 shadow-lg backdrop-blur-sm"
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
				class="text-xs font-medium tracking-wider text-base-content/70 uppercase text-shadow-2xs"
			>
				E2E Tests
			</span>
		</div>
	</div>
{:else if github_status.loading}
	<div class="flex items-center justify-center gap-2">
		<span class="loading loading-sm loading-spinner"></span>
		<span class="text-sm text-base-content/60">Loading status...</span
		>
	</div>
{/if}
