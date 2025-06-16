import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	// Return placeholder indicating static file should be used
	const placeholder = `# LLM Documentation - Pre-generated Files Required

> This endpoint serves pre-generated documentation files from the /static directory.

## Available Documentation Formats

To generate all documentation variants, run:
\`\`\`bash
ANTHROPIC_API_KEY=your_key npm run generate:llm-docs
\`\`\`

This will create optimized versions for different use cases:
- **llms.txt** - Navigation index
- **llms-full.txt** - Complete documentation  
- **llms-medium.txt** - Compressed version (~50% of full)
- **llms-small.txt** - Essential content only (~10% of full)
- **llms-api.txt** - API reference
- **llms-examples.txt** - Code examples
- **llms-ctx.txt** - XML structured format

All files are served from /static/ for optimal performance.

## Immediate Access

For full documentation without AI generation:
- Visit: /llms-full.txt (concatenated markdown, no generation needed)
`;

	return new Response(placeholder, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'no-cache',
		},
	});
};
