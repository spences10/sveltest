import { generate_llm_content, topics } from '$lib/server/llms';

export const prerender = true;

export async function GET() {
	const content = await generate_llm_content({
		topics,
		include_full_content: true,
	});
	const fullContent = `<SYSTEM>This is the comprehensive testing documentation for Sveltest - vitest-browser-svelte patterns for Svelte 5.</SYSTEM>\n\n${content}`;

	return new Response(fullContent, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
