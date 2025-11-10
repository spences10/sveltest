/**
 * Validation prompt for SvelteKit server/API endpoint tests
 *
 * These tests use:
 * - Real Request/Response objects
 * - FormData for form submissions
 * - Minimal mocking (test actual server logic)
 * - SvelteKit load functions and API routes
 */

export function get_server_prompt(
	file_path: string,
	test_code: string,
): string {
	return `Analyze this SvelteKit server/API test and return JSON validation results.

File: ${file_path}

\`\`\`typescript
${test_code}
\`\`\`

IMPORTANT: Do a MAXIMUM of 2-3 web searches, then provide your analysis.

**Context**: This is a teaching/example codebase. Focus on broken patterns that teach incorrect usage.

Search for:
1. SvelteKit server-side testing patterns (+server.ts, +page.server.ts)
2. Web API Request/Response/FormData best practices
3. SvelteKit load function testing

**Only flag CRITICAL issues**:
- Incorrect Request/FormData construction that would fail
- Wrong SvelteKit API usage
- Deprecated patterns

**IGNORE these (acceptable for examples)**:
- Using 'as any' for simplified request mocks (clarity > type safety in examples)
- Missing edge case tests (examples show happy path)
- Incomplete mock objects (YAGNI - only mock what's used)
- Missing error case tests (unless teaching error handling)

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
- critical: Code will fail or uses wrong APIs
- warning: Works but uses heavy mocking or anti-patterns
- suggestion: Missing edge case tests or minor improvements

If no issues found, return: {"is_valid": true, "summary": "Server test follows SvelteKit testing best practices with minimal mocking", "issues": []}`;
}
