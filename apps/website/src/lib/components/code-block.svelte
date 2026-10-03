<script lang="ts">
	import Check from '#lib/icons/check.svelte';
	import Clipboard from '#lib/icons/clipboard.svelte';
	import {
		language_icon,
		language_label,
		render_code,
	} from '#lib/markdown/highlighter.js';
	import '#lib/markdown/twinkleplop.css';
	import { line_numbers_state } from '#lib/state/line-numbers.svelte.js';
	import { onMount } from 'svelte';

	interface Props {
		code?: string;
		digits?: number;
		html?: string;
		icon?: string;
		lang?: string;
		label?: string;
		meta?: string;
	}

	let {
		code = '',
		digits,
		html,
		icon,
		lang = 'javascript',
		label,
		meta,
	}: Props = $props();

	let block: HTMLDivElement | undefined;
	let copy_status = $state('');
	let reset_timer: ReturnType<typeof setTimeout> | undefined;

	const rendered_html = $derived(
		html ?? render_code(code, lang, meta),
	);
	const resolved_label = $derived(
		label ?? (html === undefined ? language_label(lang) : undefined),
	);
	const resolved_icon = $derived(
		icon ?? (html === undefined ? language_icon(lang) : undefined),
	);
	const has_line_numbers = $derived(
		rendered_html.includes('class="ln"'),
	);
	const resolved_digits = $derived(
		digits ??
			Math.max(
				1,
				(
					rendered_html.match(/class="ln">(\d+)</g)?.at(-1) ?? ''
				).replace(/\D/g, '').length,
			),
	);

	onMount(() => {
		line_numbers_state.sync();
		return () => clearTimeout(reset_timer);
	});

	async function copy_code() {
		const code_element = block?.querySelector('pre code');
		if (!code_element) return;

		const clone = code_element.cloneNode(true) as HTMLElement;
		clone
			.querySelectorAll('.ln')
			.forEach((line_number) => line_number.remove());

		try {
			await navigator.clipboard.writeText(clone.textContent ?? '');
			copy_status = 'Copied';
		} catch {
			copy_status = 'Copy failed';
		}

		clearTimeout(reset_timer);
		reset_timer = setTimeout(() => (copy_status = ''), 2000);
	}
</script>

<div
	class="not-prose code-block my-7 overflow-hidden rounded-lg border border-base-300 bg-base-200 shadow-sm"
	style:--ln-digits={resolved_digits}
	bind:this={block}
>
	<div
		class="flex min-h-11 items-center gap-2 border-b border-base-300 px-3 py-1.5"
	>
		{#if resolved_label}
			<span
				class="inline-flex size-7 items-center justify-center text-base-content/70"
				role="img"
				aria-label={resolved_label}
				title={resolved_label}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
					class="size-4"
				>
					{#if resolved_icon}
						<path d={resolved_icon} />
					{:else}
						<path
							d="m8.25 9.75-3 2.25 3 2.25m7.5-4.5 3 2.25-3 2.25m-3.75-9-3 13.5"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					{/if}
				</svg>
			</span>
		{/if}
		<div class="ml-auto flex items-center gap-1">
			{#if has_line_numbers}
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					aria-label="Line numbers"
					aria-pressed={line_numbers_state.visible}
					title={`${line_numbers_state.visible ? 'Hide' : 'Show'} line numbers`}
					onclick={() => line_numbers_state.toggle()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.25 6.75h12m-12 5.25h12m-12 5.25h12M3.75 5.25v3m0-3H3m.75 0h.75m-1.5 6.5h.75l-.75 1.5h1.5m-1.5 3.5h1.5L3 18.25h1.5"
						/>
					</svg>
				</button>
			{/if}
			<button
				type="button"
				class="btn btn-ghost btn-sm"
				aria-label="Copy code"
				title={copy_status || 'Copy code'}
				onclick={copy_code}
			>
				{#if copy_status === 'Copied'}
					<Check height="18px" width="18px" aria_label="" />
				{:else}
					<Clipboard height="18px" width="18px" aria_label="" />
				{/if}
				<span class="hidden sm:inline">
					{copy_status || 'Copy'}
				</span>
			</button>
		</div>
		<span class="sr-only" role="status">{copy_status}</span>
	</div>
	{@html rendered_html}
</div>

<style>
	.code-block {
		--code-gutter: clamp(1rem, 3vw, 1.25rem);
	}

	.code-block :global(pre),
	.code-block :global(figure) {
		margin: 0;
		border-radius: 0;
	}

	.code-block :global(pre) {
		padding-block: 1rem;
	}

	.code-block :global(pre:focus-visible) {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
</style>
