<script lang="ts">
	import { Arrow } from '$lib/icons';
	import type { Component } from 'svelte';

	interface Props {
		icon: Component;
		title: string;
		description: string;
		href?: string;
		button_text?: string;
		color_scheme?: string;
		onclick_event?: () => void;
		button_icon?: Component;
		button_size?: string;
		button_classes?: string;
		button_icon_classes?: string;
		badges?: Array<{ text: string; color: string }>;
		show_button?: boolean;
	}

	let {
		icon: Icon,
		title,
		description,
		href,
		button_text,
		color_scheme = 'primary',
		onclick_event,
		button_icon,
		button_size = 'btn-sm',
		button_classes = '',
		button_icon_classes = 'h-4 w-4',
		badges = [],
		show_button = true,
	}: Props = $props();

	// Use button_icon if provided, otherwise use the main icon
	const ButtonIcon = button_icon || Icon;

	// Check if the href is an external URL
	const is_external_url = (url: string | undefined): boolean => {
		if (!url) return false;
		return url.startsWith('http://') || url.startsWith('https://');
	};
</script>

<div class="group relative">
	<div
		class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
	>
		<div class="card-body p-8">
			<div
				class="from-{color_scheme}/20 to-{color_scheme}/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
			>
				<Icon class_names="text-{color_scheme} h-8 w-8" />
			</div>
			<h3 class="mb-4 text-2xl font-bold">{title}</h3>
			<p class="text-base-content/70 mb-6 leading-relaxed">
				{description}
			</p>
			{#if badges.length > 0}
				<div class="mb-6 flex flex-wrap gap-2">
					{#each badges as badge}
						<div class="badge badge-{badge.color} badge-sm">
							{badge.text}
						</div>
					{/each}
				</div>
			{/if}
			{#if show_button && href && button_text}
				<a
					{href}
					{...is_external_url(href)
						? { target: '_blank', rel: 'noopener noreferrer' }
						: {}}
					class="btn btn-{color_scheme} {button_size} gap-2 {button_classes}"
					onclick={onclick_event}
				>
					<ButtonIcon class_names={button_icon_classes} />
					{button_text}
					{#if !button_icon}
						<Arrow direction="right" class_names="h-4 w-4" />
					{/if}
				</a>
			{/if}
		</div>
	</div>
</div>
