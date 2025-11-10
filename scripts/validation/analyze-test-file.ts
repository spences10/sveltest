#!/usr/bin/env tsx

import { query } from '@anthropic-ai/claude-agent-sdk';
import { ANTHROPIC_CONFIG } from '../config/anthropic.js';
import { logger } from '../utils/logger.js';
import { read_file } from '../utils/file-helpers.js';

/**
 * Analyze a test file using Agent SDK with web search
 *
 * The agent autonomously searches for relevant docs as needed
 */

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

		const prompt = `You are a senior testing expert validating Svelte 5 test code.

## Test File to Validate

File: ${file_path}

\`\`\`typescript
${test_code}
\`\`\`

## Your Task

Validate this test file against official best practices. Use web search to look up:
- Vitest browser mode documentation
- vitest-browser-svelte patterns
- Playwright locator best practices
- Svelte 5 testing with runes
- SvelteKit server testing patterns

Search for specific topics as needed. Examples:
- "vitest browser mode page.getByRole official"
- "playwright strict mode first nth last"
- "svelte 5 untrack derived testing"
- "sveltekit FormData Request testing"

## Validation Categories

### 1. API Usage
- Deprecated APIs
- Incorrect imports
- Wrong function signatures

### 2. Anti-Patterns
- Using containers instead of locators
- Not handling strict mode (multiple elements)
- Testing implementation vs behavior
- Missing await

### 3. Accessibility
- Not using semantic queries (getByRole, getByLabel)
- Incorrect ARIA roles

### 4. Best Practices
- Not using untrack() with $derived
- Heavy mocking vs real FormData/Request
- Missing error handling

### 5. Svelte 5
- Using Svelte 4 patterns
- Incorrect runes usage
- Missing flushSync()

## Output Format

Return ONLY valid JSON (no markdown):

{
  "is_valid": boolean,
  "summary": "Brief 1-2 sentence summary",
  "issues": [
    {
      "severity": "critical" | "warning" | "suggestion",
      "line_number": number,
      "category": "api_usage" | "anti_pattern" | "deprecation" | "accessibility" | "best_practice" | "performance",
      "description": "Clear issue description",
      "current_code": "Problematic code",
      "recommended_fix": "Specific code fix",
      "documentation_reference": "Link to docs you found"
    }
  ]
}

**severity rules:**
- "critical": Code will fail or uses deprecated APIs
- "warning": Works but uses anti-patterns
- "suggestion": Code is fine but could improve

Use web search to verify against official docs. If code follows best practices, return is_valid: true with empty issues array.`;

		let result_text = '';
		let web_searches = 0;

		// Use Agent SDK query with web search enabled
		for await (const msg of query({
			prompt,
			options: {
				model: ANTHROPIC_CONFIG.haiku.model,
				maxTurns: 5, // Allow multiple search rounds
				tools: [{ name: 'web_search' }],
			},
		})) {
			if (msg.type === 'result') {
				result_text = msg.result || '';
			}
			// Track web search usage
			if (msg.type === 'tool_use' && msg.tool === 'web_search') {
				web_searches++;
			}
		}

		logger.progress_done();

		// Parse JSON response
		const json_match = result_text.match(/\{[\s\S]*\}/);
		if (!json_match) {
			throw new Error('No JSON found in response');
		}

		const result = JSON.parse(json_match[0]);

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
			web_searches_used: web_searches,
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
