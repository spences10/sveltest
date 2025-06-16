import { load_full_content } from '$lib/server/llms';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
	const variant = params.variant;

	// Handle the base case (llms.txt)
	const full_variant =
		variant === 'llms' ? 'llms' : `llms-${variant}`;

	// Special handling for full variant - always available from markdown
	if (full_variant === 'llms-full') {
		const content = load_full_content();
		return new Response(content, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'public, max-age=3600',
			},
		});
	}

	// For other variants, show generation instructions
	const placeholder = `# ${full_variant.toUpperCase()} - Pre-generated File Required

> This documentation variant is generated using AI and served from the /static directory.

## Generate ${full_variant}.txt

To generate this documentation variant, run:
\`\`\`bash
ANTHROPIC_API_KEY=your_key npm run generate:llm-docs
\`\`\`

This will create:
- **${full_variant}.txt** in the /static directory
- All other documentation variants as well

## Alternative Access

For immediate access to documentation:
- **Full documentation**: /llms-full.txt (available now - no generation needed)
- **Generation script**: Creates optimized AI variants for different use cases

## Available Variants

- **llms.txt** - Navigation index *(AI-generated)*
- **llms-full.txt** - Complete docs *(markdown concatenation, always available)*  
- **llms-medium.txt** - Compressed version *(AI-generated)*
- **llms-small.txt** - Essential content only *(AI-generated)*
- **llms-api.txt** - API reference *(AI-generated)*
- **llms-examples.txt** - Code examples *(AI-generated)*
- **llms-ctx.txt** - XML structured format *(AI-generated)*
`;

	return new Response(placeholder, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'no-cache',
		},
	});
};
