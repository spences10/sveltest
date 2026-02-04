<script lang="ts">
	import { goto } from '$app/navigation';
	import { BookOpen, Code, Eye } from '$lib/icons';
	import { search_site } from '$lib/search.remote';
	import { command_palette_state } from '$lib/state/command-palette.svelte';
	import type { SearchResult } from '$lib/server/search-index';

	let results = $state<SearchResult[]>([]);
	let loading = $state(false);
	let selected_index = $state(0);

	// Lazy load search when palette opens and query changes
	$effect(() => {
		if (
			command_palette_state.is_open &&
			command_palette_state.query.trim()
		) {
			loading = true;
			search_site({ q: command_palette_state.query, filter: 'all' })
				.then((search_results) => {
					results = search_results;
				})
				.finally(() => {
					loading = false;
				});
		} else if (!command_palette_state.query.trim()) {
			results = [];
		}
	});

	// Group results by category type
	let grouped_results = $derived.by(() => {
		const docs = results.filter(
			(r) =>
				r.type === 'topic' ||
				r.category === 'Documentation' ||
				r.category === 'Quick Start',
		);
		const examples = results.filter(
			(r) =>
				r.type === 'example' &&
				!['Components', 'Documentation', 'Quick Start'].includes(
					r.category,
				),
		);
		const components = results.filter(
			(r) => r.category === 'Components',
		);
		return { docs, examples, components };
	});

	// Flat list for keyboard navigation
	let flat_items = $derived([
		...grouped_results.docs,
		...grouped_results.examples,
		...grouped_results.components,
	]);

	// Reset selection when query changes
	$effect(() => {
		const _query = command_palette_state.query;
		selected_index = 0;
	});

	const scroll_selected_into_view = () => {
		const selected_el = command_palette_state.dialog?.querySelector(
			`[data-index="${selected_index}"]`,
		);
		selected_el?.scrollIntoView({ block: 'nearest' });
	};

	const handle_keydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selected_index = Math.min(
				selected_index + 1,
				flat_items.length - 1,
			);
			scroll_selected_into_view();
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selected_index = Math.max(selected_index - 1, 0);
			scroll_selected_into_view();
		} else if (event.key === 'Enter' && flat_items[selected_index]) {
			event.preventDefault();
			navigate_to(flat_items[selected_index]);
		}
	};

	const navigate_to = (item: SearchResult) => {
		command_palette_state.add_recent(item.url);
		command_palette_state.close();
		goto(item.url);
	};

	const handle_close = () => {
		command_palette_state.close();
	};

	const get_flat_index = (
		type: 'docs' | 'examples' | 'components',
		index: number,
	) => {
		if (type === 'docs') return index;
		if (type === 'examples')
			return grouped_results.docs.length + index;
		return (
			grouped_results.docs.length +
			grouped_results.examples.length +
			index
		);
	};

	// Get icon component based on result type
	const get_icon_class = (result: SearchResult) => {
		if (
			result.type === 'topic' ||
			result.category === 'Documentation' ||
			result.category === 'Quick Start'
		) {
			return 'text-primary';
		}
		if (result.category === 'Components') {
			return 'text-accent';
		}
		return 'text-secondary';
	};
</script>

<dialog
	class="modal modal-middle p-4"
	{@attach command_palette_state.register}
	onclose={handle_close}
	aria-label="Search"
>
	<article
		class="modal-box rounded-box flex h-auto max-h-[75dvh] w-full max-w-xl flex-col p-0 sm:max-h-[80vh] lg:max-w-3xl"
	>
		<search class="border-base-300 border-b p-4">
			<label for="command-palette-search" class="sr-only">
				Search docs, examples, and components
			</label>
			<input
				id="command-palette-search"
				{@attach command_palette_state.register_input}
				bind:value={command_palette_state.query}
				onkeydown={handle_keydown}
				type="search"
				placeholder="Search docs, examples, components..."
				class="input input-ghost w-full text-lg focus:outline-none"
			/>
		</search>

		<nav
			class="flex-1 overflow-y-auto p-2 sm:max-h-[60vh]"
			aria-label="Search results"
		>
			{#if command_palette_state.query.trim() === '' && command_palette_state.recent.length > 0}
				<div
					class="text-base-content/50 px-3 py-2 text-xs font-semibold uppercase"
				>
					Recent
				</div>
				<ul role="listbox">
					{#each command_palette_state.recent as href, index (href)}
						{@const item = results.find((r) => r.url === href)}
						{#if item}
							<li
								role="option"
								aria-selected={index === selected_index}
								data-index={index}
							>
								<button
									class="hover:bg-base-200 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors {index ===
									selected_index
										? 'bg-base-200'
										: ''}"
									onclick={() => navigate_to(item)}
								>
									<span class="text-base-content/50">
										<BookOpen
											height="20"
											width="20"
											class_names={get_icon_class(item)}
										/>
									</span>
									<div class="flex-1">
										<div class="font-medium">{item.title}</div>
									</div>
								</button>
							</li>
						{/if}
					{/each}
				</ul>
			{:else if command_palette_state.query.trim() !== ''}
				{#if grouped_results.docs.length > 0}
					<div
						class="text-base-content/50 px-3 py-2 text-xs font-semibold uppercase"
					>
						Docs
					</div>
					<ul role="listbox">
						{#each grouped_results.docs as item, index (item.id)}
							{@const flat_index = get_flat_index('docs', index)}
							<li
								role="option"
								aria-selected={flat_index === selected_index}
								data-index={flat_index}
							>
								<button
									class="hover:bg-base-200 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors {flat_index ===
									selected_index
										? 'bg-base-200'
										: ''}"
									onclick={() => navigate_to(item)}
								>
									<span class="text-base-content/50">
										<BookOpen
											height="20"
											width="20"
											class_names="text-primary"
										/>
									</span>
									<div class="flex-1 overflow-hidden">
										<div class="truncate font-medium">
											{item.title}
										</div>
										{#if item.excerpt}
											<div
												class="text-base-content/50 truncate text-sm"
											>
												{item.excerpt}
											</div>
										{/if}
									</div>
								</button>
							</li>
						{/each}
					</ul>
				{/if}

				{#if grouped_results.examples.length > 0}
					<div
						class="text-base-content/50 mt-2 px-3 py-2 text-xs font-semibold uppercase"
					>
						Examples
					</div>
					<ul role="listbox">
						{#each grouped_results.examples as item, index (item.id)}
							{@const flat_index = get_flat_index('examples', index)}
							<li
								role="option"
								aria-selected={flat_index === selected_index}
								data-index={flat_index}
							>
								<button
									class="hover:bg-base-200 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors {flat_index ===
									selected_index
										? 'bg-base-200'
										: ''}"
									onclick={() => navigate_to(item)}
								>
									<span class="text-base-content/50">
										<Code
											height="20"
											width="20"
											class_names="text-secondary"
										/>
									</span>
									<div class="flex-1 overflow-hidden">
										<div class="truncate font-medium">
											{item.title}
										</div>
										<div class="text-base-content/50 text-sm">
											{item.category}
										</div>
									</div>
								</button>
							</li>
						{/each}
					</ul>
				{/if}

				{#if grouped_results.components.length > 0}
					<div
						class="text-base-content/50 mt-2 px-3 py-2 text-xs font-semibold uppercase"
					>
						Components
					</div>
					<ul role="listbox">
						{#each grouped_results.components as item, index (item.id)}
							{@const flat_index = get_flat_index(
								'components',
								index,
							)}
							<li
								role="option"
								aria-selected={flat_index === selected_index}
								data-index={flat_index}
							>
								<button
									class="hover:bg-base-200 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors {flat_index ===
									selected_index
										? 'bg-base-200'
										: ''}"
									onclick={() => navigate_to(item)}
								>
									<span class="text-base-content/50">
										<Eye
											height="20"
											width="20"
											class_names="text-accent"
										/>
									</span>
									<div class="flex-1 overflow-hidden">
										<div class="truncate font-medium">
											{item.title}
										</div>
									</div>
								</button>
							</li>
						{/each}
					</ul>
				{/if}

				{#if flat_items.length === 0 && !loading}
					<div class="text-base-content/50 p-4 text-center">
						No results found
					</div>
				{/if}
			{:else if loading}
				<div
					class="text-base-content/50 flex items-center justify-center gap-2 p-4"
				>
					<span class="loading loading-spinner loading-sm"></span>
					Loading...
				</div>
			{:else}
				<div class="text-base-content/50 p-4 text-center">
					Start typing to search...
				</div>
			{/if}
		</nav>

		<footer
			class="border-base-300 text-base-content/50 flex gap-4 border-t p-3 text-xs"
		>
			<span><kbd class="kbd kbd-xs">↑↓</kbd> navigate</span>
			<span><kbd class="kbd kbd-xs">↵</kbd> select</span>
			<span><kbd class="kbd kbd-xs">esc</kbd> close</span>
		</footer>
	</article>
	<button class="modal-backdrop" onclick={handle_close}>close</button>
</dialog>
