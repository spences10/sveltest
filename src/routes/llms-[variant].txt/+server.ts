import { generate_llm_content, topics } from '$lib/server/llms';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const variant = params.variant;

	// Handle the base case (llms.txt)
	const fullVariant = variant === 'llms' ? 'llms' : `llms-${variant}`;

	try {
		const content = await generate_llm_content({
			topics,
			variant: fullVariant,
		});

		return new Response(content, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'public, max-age=3600',
			},
		});
	} catch (error) {
		console.error(`Error generating ${fullVariant}:`, error);
		return new Response(`Error generating ${fullVariant}`, {
			status: 500,
		});
	}
};
