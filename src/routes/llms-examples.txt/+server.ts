import { generate_llm_content, topics } from '$lib/server/llms';

export const prerender = true;

export async function GET() {
	const content = await generate_llm_content({
		topics,
		variant: 'examples',
	});

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
			'X-Robots-Tag': 'llms-txt',
		},
	});
}
