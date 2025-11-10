/**
 * Validation prompt for pure unit tests
 *
 * These tests use:
 * - Vitest core APIs (describe, it, expect, vi.mock)
 * - Test pure functions and business logic
 * - No DOM, no components, no browser
 * - Focus on isolated unit testing
 */

export function get_unit_prompt(
	file_path: string,
	test_code: string,
): string {
	return `Analyze this unit test and return JSON validation results.

File: ${file_path}

\`\`\`typescript
${test_code}
\`\`\`

IMPORTANT: Do a MAXIMUM of 2-3 web searches, then provide your analysis. Focus on obvious issues.

Search for:
1. Vitest unit testing best practices
2. Mocking and stubbing patterns in Vitest
3. Test organization and structure

Common issues to check:
- Using browser APIs (window, document) in unit tests
- Heavy mocking instead of testing actual logic
- Missing test cases for edge conditions
- Not testing error handling
- Unclear test names that don't describe behavior
- Missing cleanup (afterEach/afterAll)
- Not using vi.mock() for external dependencies
- Testing implementation details instead of behavior

Then return ONLY this JSON (no markdown, no explanations):

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
- warning: Missing important test cases or uses anti-patterns
- suggestion: Test organization or naming improvements

If no issues found, return: {"is_valid": true, "summary": "Unit test follows Vitest best practices", "issues": []}`;
}
