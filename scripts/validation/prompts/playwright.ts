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

IMPORTANT: Do a MAXIMUM of 2-3 web searches, then provide your analysis. Focus on obvious issues.

Search for:
1. Playwright Test framework best practices
2. Playwright locator strategies and strict mode
3. Playwright test organization patterns

Common issues to check:
- Not using test.step() for complex workflows
- Using CSS selectors instead of semantic locators (getByRole, getByLabel, getByText)
- Not handling strict mode violations (.first(), .nth(), .last() for multiple elements)
- Missing expect() assertions or using wrong assertion methods
- Not using page.waitForLoadState() when needed
- Test flakiness from timing issues or missing waits
- Not using test fixtures for common setup
- Missing test.describe() for logical grouping

Then return ONLY this JSON (no markdown, no explanations):

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
