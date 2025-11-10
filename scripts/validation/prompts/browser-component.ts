/**
 * Validation prompt for vitest-browser-svelte component tests
 *
 * These tests use:
 * - vitest-browser-svelte's render() function
 * - Playwright locators via page.getByRole(), page.getByText(), etc.
 * - expect.element() for assertions
 * - Svelte 5 runes ($state, $derived, $effect)
 * - Real browser interactions
 */

export function get_browser_component_prompt(
	file_path: string,
	test_code: string,
): string {
	return `Analyze this vitest-browser-svelte component test and return JSON validation results.

File: ${file_path}

\`\`\`typescript
${test_code}
\`\`\`

IMPORTANT: Do a MAXIMUM of 2-3 web searches, then provide your analysis. Focus on obvious issues.

Search for:
1. vitest-browser-svelte API patterns (render, expect.element, locators)
2. Playwright strict mode and locator best practices
3. Svelte 5 runes testing ($state, $derived with untrack())

Common issues to check:
- Using containers instead of locators (❌ container.querySelector vs ✅ page.getByRole)
- Not using .first()/.nth()/.last() for multiple elements (strict mode violations)
- Missing await on expect.element() assertions
- Not using untrack() when accessing $derived values in tests
- Not using semantic queries (getByRole, getByLabel) for accessibility
- Testing implementation details instead of user-visible behavior

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
- critical: Code will fail or uses wrong/deprecated APIs
- warning: Works but violates best practices or uses anti-patterns
- suggestion: Minor improvements for code quality

If no issues found, return: {"is_valid": true, "summary": "Component test follows vitest-browser-svelte best practices", "issues": []}`;
}
