#!/usr/bin/env tsx

import { ValidationResult } from './analyze-test-file.js';
import { write_file } from '../utils/file-helpers.js';
import { logger } from '../utils/logger.js';

/**
 * Generate validation reports in markdown format
 */

export interface ValidationReport {
	total_files: number;
	valid_files: number;
	invalid_files: number;
	total_issues: number;
	critical_issues: number;
	warning_issues: number;
	suggestion_issues: number;
	total_web_searches: number;
	results: ValidationResult[];
	generated_at: string;
}

function format_severity_badge(
	severity: 'critical' | 'warning' | 'suggestion',
): string {
	const badges = {
		critical: '🔴 **CRITICAL**',
		warning: '🟡 **WARNING**',
		suggestion: '🔵 **SUGGESTION**',
	};
	return badges[severity];
}

function format_category_badge(category: string): string {
	const badges: Record<string, string> = {
		api_usage: '📋 API Usage',
		anti_pattern: '⚠️ Anti-Pattern',
		deprecation: '📅 Deprecation',
		accessibility: '♿ Accessibility',
		best_practice: '✨ Best Practice',
		performance: '⚡ Performance',
	};
	return badges[category] || category;
}

export function generate_markdown_report(
	report: ValidationReport,
): string {
	const lines: string[] = [];

	// Header
	lines.push('# Test Validation Report');
	lines.push('');
	lines.push(`**Generated:** ${report.generated_at}`);
	lines.push('');

	// Summary
	lines.push('## Summary');
	lines.push('');
	lines.push('| Metric | Count |');
	lines.push('|--------|-------|');
	lines.push(`| Total Files Analyzed | ${report.total_files} |`);
	lines.push(`| Valid Files | ✅ ${report.valid_files} |`);
	lines.push(`| Invalid Files | ❌ ${report.invalid_files} |`);
	lines.push(`| Total Issues | ${report.total_issues} |`);
	lines.push(`| Critical Issues | 🔴 ${report.critical_issues} |`);
	lines.push(`| Warning Issues | 🟡 ${report.warning_issues} |`);
	lines.push(
		`| Suggestion Issues | 🔵 ${report.suggestion_issues} |`,
	);
	lines.push(
		`| Web Searches Used | 🔍 ${report.total_web_searches} |`,
	);
	lines.push('');

	// Overall status
	if (report.critical_issues === 0 && report.invalid_files === 0) {
		lines.push(
			'✅ **Status: PASSED** - All tests follow best practices!',
		);
		lines.push('');
	} else {
		lines.push(
			`❌ **Status: FAILED** - ${report.critical_issues} critical issues need fixing`,
		);
		lines.push('');
	}

	// Files with issues
	const files_with_issues = report.results.filter(
		(r) => !r.is_valid || r.total_issues > 0,
	);

	if (files_with_issues.length > 0) {
		lines.push('## Files Requiring Attention');
		lines.push('');

		for (const result of files_with_issues) {
			lines.push(`### ${result.file_path}`);
			lines.push('');
			lines.push(`**Summary:** ${result.summary}`);
			lines.push('');

			if (result.total_issues > 0) {
				lines.push(
					`**Issues:** ${result.critical_issues} critical, ${result.warning_issues} warnings, ${result.suggestion_issues} suggestions`,
				);
				lines.push('');

				// Sort issues by severity
				const sorted_issues = [...result.issues].sort((a, b) => {
					const severity_order = {
						critical: 0,
						warning: 1,
						suggestion: 2,
					};
					return (
						severity_order[a.severity] - severity_order[b.severity]
					);
				});

				for (const issue of sorted_issues) {
					lines.push(
						`#### ${format_severity_badge(issue.severity)} ${format_category_badge(issue.category)}`,
					);
					lines.push('');

					if (issue.line_number) {
						lines.push(`**Line:** ${issue.line_number}`);
						lines.push('');
					}

					lines.push(`**Issue:** ${issue.description}`);
					lines.push('');

					if (issue.current_code) {
						lines.push('**Current Code:**');
						lines.push('```typescript');
						lines.push(issue.current_code);
						lines.push('```');
						lines.push('');
					}

					lines.push('**Recommended Fix:**');
					lines.push('```typescript');
					lines.push(issue.recommended_fix);
					lines.push('```');
					lines.push('');

					lines.push(
						`**Reference:** ${issue.documentation_reference}`,
					);
					lines.push('');
					lines.push('---');
					lines.push('');
				}
			}
		}
	}

	// Valid files
	const valid_files = report.results.filter(
		(r) => r.is_valid && r.total_issues === 0,
	);

	if (valid_files.length > 0) {
		lines.push('## Valid Files ✅');
		lines.push('');
		lines.push('The following files passed all validation checks:');
		lines.push('');

		for (const result of valid_files) {
			lines.push(`- ${result.file_path}`);
		}
		lines.push('');
	}

	// Next steps
	if (report.critical_issues > 0) {
		lines.push('## Next Steps');
		lines.push('');
		lines.push(
			'1. **Fix Critical Issues First** - These prevent best practices',
		);
		lines.push('2. **Address Warnings** - Improve code quality');
		lines.push('3. **Consider Suggestions** - Optional improvements');
		lines.push('4. **Re-run Validation** - Verify fixes');
		lines.push('');
	}

	return lines.join('\n');
}

export async function save_validation_report(
	report: ValidationReport,
	output_path: string,
): Promise<void> {
	const markdown = generate_markdown_report(report);
	await write_file(output_path, markdown);
	logger.success(`Report saved to: ${output_path}`);
}

export function print_summary(report: ValidationReport): void {
	logger.divider();
	logger.table({
		'Total Files': report.total_files,
		'Valid Files': `✅ ${report.valid_files}`,
		'Invalid Files': `❌ ${report.invalid_files}`,
		'Critical Issues': `🔴 ${report.critical_issues}`,
		'Warning Issues': `🟡 ${report.warning_issues}`,
		'Suggestion Issues': `🔵 ${report.suggestion_issues}`,
		'Web Searches Used': `🔍 ${report.total_web_searches}`,
	});
	logger.divider();

	if (report.critical_issues === 0 && report.invalid_files === 0) {
		logger.success('All tests passed validation! 🎉');
	} else {
		logger.error(
			`Found ${report.critical_issues} critical issues that need fixing`,
		);
	}
}
