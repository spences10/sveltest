/**
 * Validation prompt for Svelte SSR (server-side rendering) tests
 *
 * These tests use:
 * - svelte/server's render() function
 * - HTML string assertions
 * - No browser interactions or locators
 * - Test static HTML output only
 */

export function get_ssr_prompt(
	file_path: string,
	test_code: string,
): string {
	return `Analyze this Svelte SSR (server-side rendering) test and return JSON validation results.

File: ${file_path}

\`\`\`typescript
${test_code}
\`\`\`

IMPORTANT: Do a MAXIMUM of 2-3 web searches, then provide your analysis.

**Context**: This is a teaching/example codebase. Focus on broken or deprecated patterns.

Search for:
1. Svelte server-side render() API usage
2. SSR testing patterns and best practices
3. Any deprecated Svelte SSR APIs

**Only flag CRITICAL issues**:
- Deprecated APIs (e.g., Svelte 4 'body' vs Svelte 5 'html')
- Wrong imports (not from 'svelte/server')
- Browser APIs used in SSR (window, document)

**IGNORE these (acceptable for examples)**:
- Simplified HTML assertions (exact string matching is fine for examples)
- Missing hydration marker tests (advanced topic)
- Using 'any' in test setup

CRITICAL: Your response must be ONLY valid JSON. No explanations, no markdown blocks, no text before or after.

Return this exact JSON structure:

{
  "is_valid": boolean,
  "summary": "1-2 sentence summary",
  "issues": [
    {
      "severity": "critical"|"warning"|"suggestion",
      "line_number": number,
      "category": "api_usage"|"anti_pattern"|"best_practice",
      "description": "Issue description",
      "current_code": "Problematic code snippet",
      "recommended_fix": "How to fix it",
      "documentation_reference": "URL if you found docs"
    }
  ]
}

Severity rules:
- critical: Code will fail or uses wrong APIs (e.g., browser APIs in SSR)
- warning: Works but uses anti-patterns or non-standard approaches
- suggestion: Minor improvements for code quality

If no issues found, return: {"is_valid": true, "summary": "SSR test follows Svelte server rendering best practices", "issues": []}`;
}
