import { browser } from '$app/environment';
import { createHighlighter } from 'shiki';

// Module-level singleton highlighter (shared across all component instances)
let highlighter_instance: any = null;
let highlighter_promise: Promise<any> | null = null;

export function get_highlighter(): Promise<any> {
	if (!browser) return Promise.resolve(null);

	// Return existing instance if available
	if (highlighter_instance) {
		return Promise.resolve(highlighter_instance);
	}

	// Return existing promise if in progress
	if (highlighter_promise) {
		return highlighter_promise;
	}

	// Create new highlighter promise
	highlighter_promise = createHighlighter({
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
	}).then((highlighter: any) => {
		highlighter_instance = highlighter;
		return highlighter;
	});

	return highlighter_promise;
}
