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

IMPORTANT: Do a MAXIMUM of 2-3 web searches, then provide your analysis.

**Context**: This is a teaching/example codebase. Focus on broken patterns that would fail.

Search for:
1. Vitest unit testing best practices
2. Mocking and stubbing patterns in Vitest
3. Test organization and structure

**Only flag CRITICAL issues**:
- Browser APIs used in Node unit tests (will fail)
- Deprecated Vitest APIs
- Missing cleanup causing test pollution

**IGNORE these (acceptable for examples)**:
- Simplified mocks (teaching pattern, not production code)
- Missing edge case tests (examples show main path)
- Test organization preferences
- Using 'any' for test fixtures

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
- warning: Missing important test cases or uses anti-patterns
- suggestion: Test organization or naming improvements

If no issues found, return: {"is_valid": true, "summary": "Unit test follows Vitest best practices", "issues": []}`;
}
