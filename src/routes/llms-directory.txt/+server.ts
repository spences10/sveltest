export const prerender = true;

export async function GET() {
	const content = `# Sveltest LLM Documentation Directory

> Available llms.txt files for different use cases and context windows

## Standard Files
- [Index](/llms.txt): Navigation links and structure overview
- [Full Documentation](/llms-full.txt): Complete content in one file

## Context-Optimized Files
- [Medium Context](/llms-medium.txt): Compressed for medium context windows
- [Small Context](/llms-small.txt): Highly compressed for small context windows

## Specialized Files
- [API Reference](/llms-api.txt): Testing utilities and functions only
- [Code Examples](/llms-examples.txt): Curated code patterns

## XML Context Files
- [Context Format](/llms-ctx.txt): XML structure without optional content
- [Full Context Format](/llms-ctx-full.txt): Complete XML structure
`;

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
			'X-Robots-Tag': 'llms-txt',
		},
	});
}
