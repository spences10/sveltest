/**
 * Validation prompt for Playwright E2E tests
 *
 * These tests use:
 * - Playwright Test framework (@playwright/test)
 * - page.goto(), page.getByRole(), page.click(), etc.
 * - test.describe(), test.beforeEach(), test.step()
 * - Full browser automation across pages
 */

export function get_playwright_prompt(
	file_path: string,
	test_code: string,
): string {
	return `Analyze this Playwright E2E test and return JSON validation results.

File: ${file_path}

\`\`\`typescript
${test_code}
\`\`\`

IMPORTANT: Do a MAXIMUM of 2-3 web searches, then provide your analysis.

**Context**: This is a teaching/example codebase. Focus on patterns that cause actual failures.

Search for:
1. Playwright Test framework best practices
2. Playwright locator strategies and strict mode
3. Playwright test organization patterns

**Only flag CRITICAL issues**:
- Deprecated Playwright APIs
- Strict mode violations that cause test failures
- Missing essential assertions
- Timing issues causing flaky tests

**IGNORE these (acceptable for examples)**:
- Not using test.step() (organizational preference)
- CSS selectors (sometimes clearer for examples)
- Not using fixtures (simpler for teaching)
- Missing test.describe() (optional grouping)

CRITICAL: Your response must be ONLY valid JSON. No explanations, no markdown blocks, no text before or after.

Return this exact JSON structure:

{
  "is_valid": boolean,
  "summary": "1-2 sentence summary",
  "issues": [
    {
      "severity": "critical"|"warning"|"suggestion",
      "line_number": number,
      "category": "api_usage"|"anti_pattern"|"best_practice"|"accessibility",
      "description": "Issue description",
      "current_code": "Problematic code snippet",
      "recommended_fix": "How to fix it",
      "documentation_reference": "URL if you found docs"
    }
  ]
}

Severity rules:
- critical: Code will fail or uses deprecated Playwright APIs
- warning: Test is flaky or uses anti-patterns
- suggestion: Accessibility improvements or code organization

If no issues found, return: {"is_valid": true, "summary": "E2E test follows Playwright best practices", "issues": []}`;
}
