<script lang="ts">
	import { SiteSearch } from '$lib';
</script>

<svelte:head>
	<title>Search Examples - SvelTest</title>
	<meta
		name="description"
		content="Examples of different search filters"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Search Examples</h1>

	<div class="space-y-12">
		<!-- Site-wide Search -->
		<section class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4 text-2xl">Site-wide Search</h2>
				<p class="text-base-content/70 mb-6">
					Search across all content: documentation, examples, and
					components.
				</p>
				<SiteSearch
					filter="all"
					label="Search Everything"
					placeholder="Search all content..."
				/>
			</div>
		</section>

		<!-- Documentation Only -->
		<section class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4 text-2xl">Documentation Search</h2>
				<p class="text-base-content/70 mb-6">
					Search only documentation topics and guides.
				</p>
				<SiteSearch
					filter="docs"
					label="Search Documentation"
					placeholder="Search docs and guides..."
				/>
			</div>
		</section>

		<!-- Examples Only -->
		<section class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4 text-2xl">Examples Search</h2>
				<p class="text-base-content/70 mb-6">
					Search only testing examples and code snippets.
				</p>
				<SiteSearch
					filter="examples"
					label="Search Examples"
					placeholder="Search test examples..."
				/>
			</div>
		</section>

		<!-- Components Only -->
		<section class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4 text-2xl">Components Search</h2>
				<p class="text-base-content/70 mb-6">
					Search only UI components and their examples.
				</p>
				<SiteSearch
					filter="components"
					label="Search Components"
					placeholder="Search UI components..."
				/>
			</div>
		</section>
	</div>

	<!-- Usage Instructions -->
	<div class="alert alert-info mt-12">
		<div>
			<h3 class="font-bold">Keyboard Shortcuts</h3>
			<p>
				Press <kbd class="kbd kbd-sm">⌘</kbd> +
				<kbd class="kbd kbd-sm">K</kbd>
				(or <kbd class="kbd kbd-sm">Ctrl</kbd> +
				<kbd class="kbd kbd-sm">K</kbd>) to focus any search input.
			</p>
			<p>
				Press <kbd class="kbd kbd-sm">Esc</kbd> to clear the search and
				unfocus.
			</p>
		</div>
	</div>
</div>
