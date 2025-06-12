# LLM Documentation Routes Analysis

## Current Implementation

Based on the analysis of the Sveltest project following the
[llms.txt convention](https://llms.txt), the project currently
implements:

### Existing Routes

- `/llms.txt` - Index file with structured navigation links
- `/llms-full.txt` - Complete documentation in a single file

### Current Structure

The implementation follows the standard llms.txt format with:

1. **H1 title**: Project name
2. **Blockquote summary**: Brief project description
3. **H2 sections**: Organized documentation links with descriptions
4. **Optional section**: Secondary resources

## Suggested Additional Routes

Based on the research and llms.txt convention best practices, here are
recommended additional routes:

### 1. `/llms-medium.txt` - Compressed Documentation

**Purpose**: For medium context window LLMs (like GPT-3.5, Claude
Instant)

- Remove legacy content and detailed examples
- Keep core concepts and essential patterns
- Normalize whitespace and remove non-essential blocks

### 2. `/llms-small.txt` - Highly Compressed Documentation

**Purpose**: For smaller context window LLMs or quick references

- Essential testing patterns only
- Minimal examples with core concepts
- Ultra-condensed format for rapid LLM ingestion

### 3. `/llms-ctx.txt` - Context-Optimized Format

**Purpose**: XML-structured format for systems like Claude

- Structured XML with clear sections
- Excludes optional URLs for focused context
- Optimized for reasoning and analysis tasks

### 4. `/llms-ctx-full.txt` - Complete Context Format

**Purpose**: Full XML-structured documentation

- Includes all URLs and references
- Complete content in XML format
- For comprehensive analysis and code generation

### 5. `/llms-api.txt` - API-Focused Documentation

**Purpose**: Testing API reference and patterns only

- Core testing utilities and functions
- Locators, assertions, and interactions
- Minimal narrative, maximum practical content

### 6. `/llms-examples.txt` - Code Examples Collection

**Purpose**: Curated code examples for AI coding assistants

- Real-world testing patterns
- Copy-paste ready code snippets
- Minimal explanatory text, maximum code

## Implementation Strategy

### Route Pattern

Each route should follow the existing pattern:

```typescript
// src/routes/llms-{variant}.txt/+server.ts
import { generate_llm_content, topics } from '$lib/server/llms';

export const prerender = true;

export async function GET() {
	const content = await generate_llm_content({
		topics,
		variant: 'medium', // or 'small', 'ctx', etc.
		minimize: {
			remove_legacy: true,
			remove_note_blocks: true,
			// variant-specific options
		},
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
```

### Enhanced Server Function

Extend `generate_llm_content` to support variants:

```typescript
interface GenerateLlmContentOptions {
	topics: Topic[];
	variant?:
		| 'index'
		| 'full'
		| 'medium'
		| 'small'
		| 'ctx'
		| 'ctx-full'
		| 'api'
		| 'examples';
	minimize?: {
		remove_legacy?: boolean;
		remove_note_blocks?: boolean;
		remove_details_blocks?: boolean;
		remove_playground_links?: boolean;
		remove_prettier_ignore?: boolean;
		normalize_whitespace?: boolean;
		xml_format?: boolean;
		code_only?: boolean;
	};
}
```

## Security Considerations

### For Documentation Generation CLI/API

If implementing a dynamic generation endpoint:

```typescript
// src/routes/api/generate-llms/+server.ts
export async function POST({ request }) {
	// Security headers
	const headers = {
		'Content-Type': 'application/json',
		'X-Content-Type-Options': 'nosniff',
		'X-Frame-Options': 'DENY',
		'X-XSS-Protection': '1; mode=block',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
	};

	// Rate limiting and authentication
	const auth = request.headers.get('authorization');
	if (!auth || !validateToken(auth)) {
		return new Response('Unauthorized', { status: 401, headers });
	}

	// Generate content based on request parameters
	const { variant, minimize } = await request.json();
	const content = await generate_llm_content({
		topics,
		variant,
		minimize,
	});

	return json({ content }, { headers });
}
```

## Integration with Documentation

### Update Documentation Page

Add links to new routes in `/src/routes/docs/+page.svelte`:

```svelte
<div class="flex w-full flex-col gap-3 sm:flex-row">
	<a href="/llms.txt" class="btn btn-outline btn-sm flex-1"
		>LLMs Index</a
	>
	<a href="/llms-full.txt" class="btn btn-primary btn-sm flex-1"
		>Full Documentation</a
	>
	<a href="/llms-medium.txt" class="btn btn-secondary btn-sm flex-1"
		>Medium Context</a
	>
	<a href="/llms-small.txt" class="btn btn-accent btn-sm flex-1"
		>Small Context</a
	>
</div>
```

### Directory Listing

Create `/llms-directory.txt` following the convention:

```
# Sveltest LLM Documentation Directory

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
```

## CLI Tool Implementation

For local generation, create a TypeScript CLI tool:

```typescript
// scripts/generate-llms.ts
import { generate_llm_content, topics } from '../src/lib/server/llms';
import { writeFile } from 'fs/promises';

async function generateLlmsFiles() {
	const variants = [
		'index',
		'full',
		'medium',
		'small',
		'api',
		'examples',
	];

	for (const variant of variants) {
		const content = await generate_llm_content({ topics, variant });
		const filename =
			variant === 'index' ? 'llms.txt' : `llms-${variant}.txt`;
		await writeFile(`static/${filename}`, content);
		console.log(`Generated ${filename}`);
	}
}

generateLlmsFiles().catch(console.error);
```

## Benefits of Additional Routes

1. **Context Window Optimization**: Different sizes for different LLM
   capabilities
2. **Use Case Specialization**: API-focused vs example-focused content
3. **Format Variety**: Both Markdown and XML for different AI systems
4. **Performance**: Smaller files load faster in AI tools
5. **Compatibility**: Broader support across AI platforms and tools

## Next Steps

1. Implement `/llms-medium.txt` and `/llms-small.txt` first (highest
   impact)
2. Add XML context formats for Claude integration
3. Create specialized API and examples routes
4. Implement the CLI tool for local generation
5. Update documentation to showcase all available formats
6. Add route tests following the existing pattern
