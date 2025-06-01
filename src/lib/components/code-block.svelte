<script lang="ts">
	import { createHighlighter } from 'shiki';
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
	let is_loading = $state(true);

	// Module-level singleton highlighter promise (recommended by Shiki docs)
	const highlighter_promise = createHighlighter({
		themes: ['night-owl'],
		langs: [
			'svelte',
			'typescript',
			'javascript',
			'html',
			'css',
			'json',
			'markdown',
			'python',
			'bash',
		],
	});

	async function highlight_code() {
		try {
			const highlighter = await highlighter_promise;
			highlighted_code = highlighter.codeToHtml(code, {
				lang,
				theme,
			});
		} catch (error) {
			console.error('Failed to highlight code:', error);
			// Simple fallback
			highlighted_code = `<pre><code>${code}</code></pre>`;
		} finally {
			is_loading = false;
		}
	}

	onMount(() => {
		highlight_code();
	});

	// Re-highlight when props change
	$effect(() => {
		if (code || lang || theme) {
			is_loading = true;
			highlight_code();
		}
	});
</script>

{#if is_loading}
	<div class="loading">Loading...</div>
{:else}
	{@html highlighted_code}
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
</style>
