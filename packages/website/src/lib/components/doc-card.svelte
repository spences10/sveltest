<script lang="ts">
	import { Arrow } from '$lib/icons';
	import type { Component } from 'svelte';

	interface Props {
		href: string;
		title: string;
		description: string;
		icon: Component;
		color_scheme?: string;
		index?: number;
		test_id?: string;
	}

	let {
		href,
		title,
		description,
		icon: Icon,
		color_scheme = 'primary',
		index,
		test_id,
	}: Props = $props();
</script>

<a
	{href}
	class="group bg-base-100 hover:bg-base-200 border-base-300/50 hover:border-{color_scheme}/50 transform rounded-2xl border p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
	data-testid={test_id}
>
	<div class="mb-4 flex items-center justify-between">
		<div
			class="bg-{color_scheme}/10 text-{color_scheme} flex h-14 w-14 items-center justify-center rounded-xl transition-colors group-hover:bg-{color_scheme}/20"
		>
			<Icon class_names="h-7 w-7" />
		</div>
		{#if index !== undefined}
			<div
				class="text-{color_scheme} bg-{color_scheme}/10 rounded-full px-3 py-1 text-sm font-medium"
			>
				{index + 1}
			</div>
		{:else}
			<Arrow
				direction="right"
				class_names="h-5 w-5 text-base-content/40 group-hover:text-{color_scheme} transition-colors group-hover:translate-x-1 transform"
			/>
		{/if}
	</div>

	<h3
		class="text-base-content mb-3 text-2xl font-bold group-hover:text-{color_scheme} transition-colors"
	>
		{title}
	</h3>

	<p class="text-base-content/70 text-base leading-relaxed">
		{description}
	</p>
</a>
