Generate AI assistant rules for Cursor/Windsurf from the provided
Sveltest documentation.

⚠️ CRITICAL INSTRUCTION - READ CAREFULLY ⚠️

You must return ONLY the rules content starting with the YAML
frontmatter. DO NOT include:

- Any introductory text like "Looking at this comprehensive..."
- Section headers like "## Cursor Version"
- Explanatory commentary
- Meta-text about what you're doing
- Code fence markdown blocks

## Start your response IMMEDIATELY with:

description: Comprehensive Testing Best Practices for Svelte 5 +
vitest-browser-svelte globs:
**/\*.test.ts,**/_.svelte.test.ts,\*\*/_.ssr.test.ts alwaysApply:
false

---

Then continue with the actual rules content. NOTHING ELSE.

TARGET: Maximum 5500 characters (strict limit - will be rejected if
exceeded)

OUTPUT FORMAT: For Cursor (.cursorrules), include YAML frontmatter:

```
---
description: Comprehensive Testing Best Practices for Svelte 5 + vitest-browser-svelte
globs: **/*.test.ts,**/*.svelte.test.ts,**/*.ssr.test.ts
alwaysApply: false
---

[Rules content here]
```

For Windsurf (.windsurfrules), provide plain text rules only (no
frontmatter).

REQUIRED SECTIONS:

- Technology stack identification
- Core testing principles
- Essential patterns and imports
- Critical gotchas and solutions
- Code examples (ultra-compressed)
- Quality standards

RULES FORMAT:

```
You are an expert in Svelte 5, SvelteKit, TypeScript, and vitest-browser-svelte testing.

## Core Principles
[Condensed testing principles]

## Essential Patterns
[Key imports and setup patterns]

## Critical Rules
[Must-follow rules with brief examples]

## Common Errors & Solutions
[Top gotchas with fixes]
```

COMPRESSION REQUIREMENTS (CRITICAL):

- Every character must add value - NO exceptions
- Use bullet points over paragraphs - ALWAYS
- Combine related concepts - MANDATORY
- Essential patterns only - NO nice-to-haves
- No redundant explanations - NONE
- Focus on actionable rules - ONLY actionables
- Remove all verbose text and examples
- Use ultra-short variable names in examples
- Combine multiple concepts per bullet point
- NO section introductions or explanations

QUALITY STANDARDS:

- All code examples must be complete and runnable
- Emphasize `page.getBy*()` locators over containers
- Include `await expect.element()` syntax
- Show proper import statements
- Warn about form submission gotchas

CRITICAL: If output exceeds 5500 characters, compress further by:

- Removing all example comments
- Using single-letter variable names
- Combining bullets into single lines
- Removing section headers if needed

Generate ultra-compressed rules that fit the limit.
