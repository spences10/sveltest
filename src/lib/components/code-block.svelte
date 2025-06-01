<script lang="ts">
	import { browser } from '$app/environment';
	import { get_highlighter } from '$lib/utils/highlighter.svelte.ts';
	import { onMount } from 'svelte';

	// Props using Svelte 5 syntax
	interface Props {
		code: string;
		lang?: string;
		theme?: string;
	}

	const {
		code,
		lang = 'javascript',
		theme = 'night-owl',
	}: Props = $props();

	let highlighted_code = $state('');
	let is_loading = $state(!browser); // Start as not loading on client, loading on server
	let is_enhanced = $state(false);

	async function highlight_code() {
		if (!browser) return; // Skip highlighting on server

		try {
			const highlighter = await get_highlighter();
			if (!highlighter) return;

			highlighted_code = highlighter.codeToHtml(code, {
				lang,
				theme,
			});
			is_enhanced = true;
		} catch (error) {
			console.error('Failed to highlight code:', error);
			// Keep the fallback version
		} finally {
			is_loading = false;
		}
	}

	onMount(() => {
		highlight_code();
	});

	// Re-highlight when props change (only on client)
	$effect(() => {
		if (browser && (code || lang || theme)) {
			is_loading = true;
			is_enhanced = false;
			highlight_code();
		}
	});
</script>

{#if is_loading && browser}
	<div class="loading">Loading...</div>
{:else if is_enhanced && highlighted_code}
	{@html highlighted_code}
{:else}
	<!-- SSR fallback - renders the raw code with basic styling -->
	<pre class="code-fallback"><code>{code}</code></pre>
{/if}

<style>
	/* Core code block styling */
	:global(.shiki) {
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
		font-family:
			'Victor Mono', 'Fira Code', 'Monaco', 'Cascadia Code',
			'Roboto Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	/* Accessibility - keyboard focus */
	:global(.shiki:focus) {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	/* Simple loading state */
	.loading {
		padding: 1rem;
		color: #666;
		font-style: italic;
	}

	/* Fallback styling for SSR */
	.code-fallback {
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
		font-family:
			'Victor Mono', 'Fira Code', 'Monaco', 'Cascadia Code',
			'Roboto Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		background-color: #011627;
		color: #d6deeb;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		margin: 0;
	}

	.code-fallback code {
		background: none;
		padding: 0;
		color: inherit;
		font-size: inherit;
		font-family: inherit;
	}
</style>
