#!/usr/bin/env tsx

import Anthropic from '@anthropic-ai/sdk';
import {
	ANTHROPIC_CONFIG,
	get_api_key,
} from '../config/anthropic.js';
import { logger } from '../utils/logger.js';
import { read_file } from '../utils/file-helpers.js';

/**
 * Analyze a test file using Haiku 4.5 with web search tool
 *
 * The agent autonomously searches for relevant docs as needed
 */

const anthropic = new Anthropic({
	apiKey: get_api_key(),
});

export interface ValidationIssue {
	severity: 'critical' | 'warning' | 'suggestion';
	line_number?: number;
	category:
		| 'api_usage'
		| 'anti_pattern'
		| 'deprecation'
		| 'accessibility'
		| 'best_practice'
		| 'performance';
	description: string;
	current_code?: string;
	recommended_fix: string;
	documentation_reference: string;
}

export interface ValidationResult {
	file_path: string;
	is_valid: boolean;
	total_issues: number;
	critical_issues: number;
	warning_issues: number;
	suggestion_issues: number;
	issues: ValidationIssue[];
	summary: string;
	web_searches_used: number;
}

export async function analyze_test_file(
	file_path: string,
): Promise<ValidationResult> {
	logger.progress(`Analyzing ${file_path}`);

	try {
		const test_code = await read_file(file_path);

		const response = await anthropic.messages.create({
			model: ANTHROPIC_CONFIG.haiku.model,
			max_tokens: ANTHROPIC_CONFIG.haiku.max_tokens,
			temperature: ANTHROPIC_CONFIG.haiku.temperature,
			messages: [
				{
					role: 'user',
					content: `You are a senior testing expert validating Svelte 5 test code against official documentation.

## Test File to Validate

File: ${file_path}

\`\`\`typescript
${test_code}
\`\`\`

## Your Task

Analyze this test file and identify ALL issues. You have access to web search - use it to look up official documentation for:
- Vitest browser mode
- vitest-browser-svelte
- Playwright locators
- Svelte 5 testing patterns
- SvelteKit server testing

Search for specific topics you need. For example:
- "vitest browser mode page.getByRole official docs"
- "playwright locators first nth last strict mode"
- "svelte 5 untrack derived testing"
- "sveltekit FormData Request testing"

## Validation Categories

### 1. API Usage
- Using deprecated APIs
- Incorrect import statements
- Wrong function signatures
- Outdated patterns from older versions

### 2. Anti-Patterns
- Using containers instead of locators
- Not handling strict mode violations (multiple elements)
- Testing implementation details instead of behavior
- Missing await on async operations

### 3. Accessibility
- Not using semantic queries (getByRole, getByLabel)
- Incorrect ARIA roles
- Missing accessibility attributes in tests

### 4. Best Practices
- Not using untrack() with $derived values
- Heavy mocking instead of real FormData/Request objects
- Missing error handling in tests
- Poor test structure or organization

### 5. Performance
- Inefficient selectors
- Missing timeouts
- Not cleaning up resources

### 6. Svelte 5 Specific
- Using Svelte 4 patterns
- Incorrect runes usage
- Missing flushSync() when needed

## Output Format

Return a JSON object with this exact structure:

\`\`\`json
{
  "is_valid": boolean,
  "summary": "Brief 1-2 sentence summary of findings",
  "issues": [
    {
      "severity": "critical" | "warning" | "suggestion",
      "line_number": number (if applicable),
      "category": "api_usage" | "anti_pattern" | "deprecation" | "accessibility" | "best_practice" | "performance",
      "description": "Clear description of the issue",
      "current_code": "The problematic code snippet (if applicable)",
      "recommended_fix": "Specific code example of how to fix it",
      "documentation_reference": "Link or reference to official docs you found"
    }
  ]
}
\`\`\`

## Critical Rules

- **severity: "critical"** - Code will fail or uses deprecated/incorrect APIs
- **severity: "warning"** - Code works but uses anti-patterns or non-recommended approaches
- **severity: "suggestion"** - Code is fine but could be improved

Use web search to verify your findings against official documentation. Be thorough but fair. If the code follows official best practices, return is_valid: true with an empty issues array.`,
				},
			],
			tools: [
				{
					type: 'web_search_20250305',
					name: 'web_search',
					max_uses: 5,
				},
			],
		});

		logger.progress_done();

		// Extract web search usage
		const web_searches_used =
			response.usage?.web_search_requests ?? 0;

		// Find the final text response (after any tool uses)
		let content = '';
		for (const block of response.content) {
			if (block.type === 'text') {
				content = block.text;
			}
		}

		// Parse JSON from response (extract from markdown code blocks if needed)
		const json_match = content.match(/```json\s*([\s\S]*?)\s*```/);
		const json_str = json_match ? json_match[1] : content;

		const result = JSON.parse(json_str);

		// Build validation result
		const issues: ValidationIssue[] = result.issues || [];
		const critical_count = issues.filter(
			(i) => i.severity === 'critical',
		).length;
		const warning_count = issues.filter(
			(i) => i.severity === 'warning',
		).length;
		const suggestion_count = issues.filter(
			(i) => i.severity === 'suggestion',
		).length;

		return {
			file_path,
			is_valid: result.is_valid && critical_count === 0,
			total_issues: issues.length,
			critical_issues: critical_count,
			warning_issues: warning_count,
			suggestion_issues: suggestion_count,
			issues,
			summary: result.summary || 'Analysis complete',
			web_searches_used,
		};
	} catch (error) {
		logger.error(
			`Failed to analyze ${file_path}: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);

		return {
			file_path,
			is_valid: false,
			total_issues: 1,
			critical_issues: 1,
			warning_issues: 0,
			suggestion_issues: 0,
			issues: [
				{
					severity: 'critical',
					category: 'api_usage',
					description: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
					recommended_fix: 'Manual review required',
					documentation_reference: 'N/A',
				},
			],
			summary: 'Analysis failed - manual review required',
			web_searches_used: 0,
		};
	}
}
