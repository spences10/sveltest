#!/usr/bin/env tsx

import { query } from '@anthropic-ai/claude-agent-sdk';
import { ANTHROPIC_CONFIG } from '../config/anthropic.js';
import { read_file } from '../utils/file-helpers.js';
import { logger } from '../utils/logger.js';
import {
	detect_test_type,
	get_validation_prompt,
	type TestType,
} from './prompts/index.js';

/**
 * Analyze a test file using Agent SDK with web search
 *
 * The agent autonomously searches for relevant docs as needed
 * Uses test-type-specific prompts for accurate validation
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
	test_type: TestType;
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

		// Detect test type and get appropriate prompt
		const test_type = detect_test_type(file_path, test_code);
		const prompt = get_validation_prompt(
			test_type,
			file_path,
			test_code,
		);

		logger.info(`  📝 Test type: ${test_type}`);

		let result_text = '';
		let web_searches = 0;

		// Use Agent SDK query with web search enabled
		for await (const msg of query({
			prompt,
			options: {
				model: ANTHROPIC_CONFIG.haiku.model,
				maxTurns: 10, // Limit searches to force quicker response
				allowedTools: ['WebSearch', 'WebFetch'],
				permissionMode: 'bypassPermissions', // Required for non-interactive scripts
			},
		})) {
			if (msg.type === 'result' && msg.subtype === 'success') {
				result_text = msg.result || '';
			}

			if (msg.type === 'result' && msg.subtype !== 'success') {
				logger.error(`  ❌ Result error: ${msg.subtype}`);
				if ('errors' in msg && msg.errors.length > 0) {
					logger.error(`  📋 Errors: ${msg.errors.join(', ')}`);
				}
			}

			// Track web search usage
			if (msg.type === 'assistant') {
				msg.message.content.forEach((c: any) => {
					if (c.type === 'tool_use' && c.name === 'WebSearch') {
						web_searches++;
					}
				});
			}
		}

		logger.progress_done();

		// Parse JSON response - try multiple strategies
		let result;
		try {
			// Strategy 1: Strip markdown code blocks and parse
			const cleaned = result_text
				.replace(/```json\s*/g, '')
				.replace(/```\s*/g, '')
				.trim();

			// Strategy 2: Extract JSON object (non-greedy, first valid JSON)
			const json_match = cleaned.match(/\{[\s\S]*?\}/);
			if (!json_match) {
				throw new Error(
					`No JSON found in response. Got: ${result_text.slice(0, 300)}...`,
				);
			}

			result = JSON.parse(json_match[0]);
		} catch (parse_error) {
			throw new Error(
				`Failed to parse JSON: ${parse_error instanceof Error ? parse_error.message : 'Unknown error'}.\nResponse: ${result_text.slice(0, 500)}...`,
			);
		}

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
			test_type,
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
			test_type: 'unit', // Default to unit on error
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
