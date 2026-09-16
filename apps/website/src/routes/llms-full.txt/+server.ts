import { content_map } from '#lib/server/content.js';

export const prerender = true;

export function GET() {
	const content = [
		'# Sveltest Testing Documentation',
		'> Svelte and SvelteKit testing with the official CLI baseline, plus optional SSR coverage.',
		...Object.values(content_map).map((markdown) => markdown.trim()),
	].join('\n\n');

	return new Response(`${content}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
