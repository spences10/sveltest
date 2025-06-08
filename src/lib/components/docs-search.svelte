<script lang="ts">
	import { BookOpen, Code, Eye, Search } from '$lib/icons';

	interface SearchResult {
		id: string;
		title: string;
		description: string;
		url: string;
		type: 'topic' | 'example' | 'code';
		category?: string;
		excerpt?: string;
	}

	let search_query = $state('');
	let search_results = $state<SearchResult[]>([]);
	let is_searching = $state(false);
	let show_results = $state(false);

	// Debounced search with API call
	let search_timeout: ReturnType<typeof setTimeout>;

	// Reference to the search input for keyboard shortcuts
	let search_input: HTMLInputElement;

	async function perform_search(
		query: string,
	): Promise<SearchResult[]> {
		if (!query.trim()) return [];

		try {
			// Filter to docs only for the documentation page
			const response = await fetch(
				`/api/search?q=${encodeURIComponent(query)}&filter=docs`,
			);
			if (!response.ok) throw new Error('Search failed');

			const data = await response.json();
			return data.results || [];
		} catch (error) {
			console.error('Search error:', error);
			return [];
		}
	}

	function handle_search_input() {
		clearTimeout(search_timeout);
		is_searching = true;

		search_timeout = setTimeout(async () => {
			if (search_query.trim()) {
				search_results = await perform_search(search_query);
				show_results = true;
			} else {
				// Handle when search is cleared (including native clear button)
				search_results = [];
				show_results = false;
			}
			is_searching = false;
		}, 300);
	}

	function handle_result_click() {
		// Close search results when user clicks a result
		show_results = false;
		search_query = '';
		search_results = [];
	}

	function handle_clear_search() {
		search_query = '';
		search_results = [];
		show_results = false;
		is_searching = false;
	}

	// Close results when clicking outside
	function handle_blur() {
		// Small delay to allow clicks on results
		setTimeout(() => {
			show_results = false;
		}, 150);
	}

	function get_result_icon(type: SearchResult['type']) {
		switch (type) {
			case 'topic':
				return BookOpen;
			case 'example':
				return Code;
			default:
				return Eye;
		}
	}

	function get_result_badge_class(category?: string) {
		switch (category) {
			case 'Documentation':
				return 'badge-primary';
			case 'Unit Testing':
				return 'badge-secondary';
			case 'Integration Testing':
				return 'badge-accent';
			case 'E2E Testing':
				return 'badge-info';
			case 'Components':
				return 'badge-success';
			case 'Quick Start':
				return 'badge-warning';
			default:
				return 'badge-neutral';
		}
	}

	// Handle keyboard shortcuts
	function handle_keydown(event: KeyboardEvent) {
		// Ctrl+K or Cmd+K to focus search
		if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
			event.preventDefault();
			search_input?.focus();
		}
		// Escape to clear search
		if (event.key === 'Escape') {
			handle_clear_search();
			search_input?.blur();
		}
	}
</script>

<!-- Global keyboard shortcuts -->
<svelte:window onkeydown={handle_keydown} />

<div class="relative w-full">
	<!-- Search Input -->
	<div class="form-control w-full">
		<label class="label" for="docs-search">
			<span class="label-text text-lg font-medium">
				Search Documentation
			</span>
			<span class="label-text-alt text-sm opacity-60">
				<kbd class="kbd kbd-sm">Ctrl</kbd> +
				<kbd class="kbd kbd-sm">k</kbd>
			</span>
		</label>
		<label
			class="input input-bordered input-lg rounded-box flex w-full items-center gap-2"
		>
			{#if is_searching}
				<span class="loading loading-spinner loading-sm text-primary"
				></span>
			{:else}
				<Search class_names="h-[1em] opacity-50" />
			{/if}
			<input
				bind:this={search_input}
				id="docs-search"
				type="search"
				placeholder="Search topics, examples, patterns..."
				class="grow text-lg"
				bind:value={search_query}
				oninput={handle_search_input}
				onblur={handle_blur}
				onfocus={() => {
					if (search_results.length > 0) {
						show_results = true;
					}
				}}
				data-testid="docs-search-input"
			/>
		</label>
	</div>

	<!-- Search Results Dropdown -->
	{#if show_results && search_results.length > 0}
		<div
			class="border-base-300 bg-base-100 absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border shadow-2xl"
			data-testid="search-results"
		>
			<div class="p-2">
				<div
					class="text-base-content/70 mb-2 px-3 py-2 text-sm font-medium"
				>
					Found {search_results.length} result{search_results.length ===
					1
						? ''
						: 's'}
				</div>
				{#each search_results as result}
					{@const IconComponent = get_result_icon(result.type)}
					<a
						href={result.url}
						class="hover:bg-base-200 flex items-center gap-3 rounded-lg p-3 transition-colors"
						onclick={handle_result_click}
						data-testid="search-result-{result.id}"
					>
						<div class="flex-shrink-0">
							<div
								class="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg"
							>
								<IconComponent class_names="h-5 w-5 text-primary" />
							</div>
						</div>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<h4 class="text-base-content truncate font-medium">
									{result.title}
								</h4>
								{#if result.category}
									<span
										class="badge badge-sm {get_result_badge_class(
											result.category,
										)}"
									>
										{result.category}
									</span>
								{/if}
							</div>
							<p class="text-base-content/70 truncate text-sm">
								{result.description}
							</p>
							{#if result.excerpt}
								<p
									class="text-base-content/50 mt-1 truncate font-mono text-xs"
								>
									{result.excerpt}
								</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	{:else if show_results && search_query.trim() && !is_searching}
		<div
			class="border-base-300 bg-base-100 absolute top-full right-0 left-0 z-50 mt-2 rounded-lg border p-4 shadow-2xl"
			data-testid="no-results"
		>
			<div class="text-center">
				<div class="mb-2 text-4xl">🔍</div>
				<p class="text-base-content/70 font-medium">
					No results found
				</p>
				<p class="text-base-content/50 text-sm">
					Try different keywords or browse the documentation sections
					below
				</p>
			</div>
		</div>
	{/if}
</div>
