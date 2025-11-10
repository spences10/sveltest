#!/usr/bin/env tsx

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../utils/logger.js';
import { find_test_files } from '../utils/file-helpers.js';
import { analyze_test_file } from './analyze-test-file.js';
import type { ValidationResult } from './analyze-test-file.js';
import {
	save_validation_report,
	print_summary,
	type ValidationReport,
} from './generate-report.js';

/**
 * Main validation orchestrator
 *
 * Uses Haiku 4.5 with web search tool to validate tests on-demand
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..', '..');
const WEBSITE_DIR = join(ROOT_DIR, 'apps', 'website');
const OUTPUT_DIR = join(ROOT_DIR, 'validation-reports');

interface ValidationOptions {
	target_dir?: string;
	specific_file?: string;
}

async function run_validation(
	options: ValidationOptions = {},
): Promise<void> {
	logger.header('🧪 Sveltest Validation System (Agent-Powered)');

	// Step 1: Determine what to validate
	const target_dir = options.target_dir || WEBSITE_DIR;
	logger.step(1, 'Finding test files');

	let test_files: string[] = [];

	if (options.specific_file) {
		logger.info(`Validating specific file: ${options.specific_file}`);
		test_files = [options.specific_file];
	} else {
		logger.info(`Scanning directory: ${target_dir}`);
		test_files = await find_test_files(target_dir);
		logger.success(`Found ${test_files.length} test files`);
	}

	if (test_files.length === 0) {
		logger.warn('No test files found to validate');
		return;
	}

	// Step 2: Analyze each test file (agent searches for docs as needed)
	logger.step(2, 'Analyzing test files with intelligent doc search');
	logger.info(
		`Agent will search for relevant documentation on-demand...`,
	);

	const results: ValidationResult[] = [];

	for (let i = 0; i < test_files.length; i++) {
		const file = test_files[i];
		logger.info(`[${i + 1}/${test_files.length}] ${file}`);

		const result = await analyze_test_file(file);
		results.push(result);

		// Show quick status
		if (result.is_valid) {
			logger.success(
				`  ✅ Valid (${result.web_searches_used} searches)`,
			);
		} else {
			logger.error(
				`  ❌ ${result.critical_issues} critical, ${result.warning_issues} warnings (${result.web_searches_used} searches)`,
			);
		}

		// Small delay to avoid rate limiting
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	// Step 3: Generate report
	logger.step(3, 'Generating validation report');

	const report: ValidationReport = {
		total_files: results.length,
		valid_files: results.filter((r) => r.is_valid).length,
		invalid_files: results.filter((r) => !r.is_valid).length,
		total_issues: results.reduce((sum, r) => sum + r.total_issues, 0),
		critical_issues: results.reduce(
			(sum, r) => sum + r.critical_issues,
			0,
		),
		warning_issues: results.reduce(
			(sum, r) => sum + r.warning_issues,
			0,
		),
		suggestion_issues: results.reduce(
			(sum, r) => sum + r.suggestion_issues,
			0,
		),
		total_web_searches: results.reduce(
			(sum, r) => sum + r.web_searches_used,
			0,
		),
		results,
		generated_at: new Date().toISOString(),
	};

	// Save report
	const report_filename = `validation-report-${new Date().toISOString().split('T')[0]}.md`;
	const report_path = join(OUTPUT_DIR, report_filename);

	await save_validation_report(report, report_path);

	// Print summary
	logger.step(4, 'Validation Complete');
	print_summary(report);

	// Cost estimate
	const search_cost = (report.total_web_searches / 1000) * 10;
	const token_estimate = results.length * 7000; // ~7K tokens per file
	const token_cost = (token_estimate / 1_000_000) * 6; // Haiku pricing
	const total_cost = search_cost + token_cost;

	logger.info(`💰 Estimated cost: $${total_cost.toFixed(2)}`);
	logger.info(
		`   - Web searches: ${report.total_web_searches} × $0.01 = $${search_cost.toFixed(2)}`,
	);
	logger.info(
		`   - Tokens: ~${token_estimate.toLocaleString()} = $${token_cost.toFixed(2)}`,
	);

	// Exit with appropriate code
	if (report.critical_issues > 0 || report.invalid_files > 0) {
		process.exit(1);
	}
}

// CLI handling
async function main() {
	const args = process.argv.slice(2);

	const options: ValidationOptions = {
		specific_file: args.includes('--file')
			? args[args.indexOf('--file') + 1]
			: undefined,
		target_dir: args.includes('--dir')
			? args[args.indexOf('--dir') + 1]
			: undefined,
	};

	// Show help
	if (args.includes('--help') || args.includes('-h')) {
		console.log(`
Sveltest Validation System (Agent-Powered)

Uses Haiku 4.5 with web search tool to validate tests on-demand.
The agent autonomously searches for relevant documentation as needed.

Usage:
  pnpm validate:tests [options]

Options:
  --file <path>              Validate a specific test file
  --dir <path>               Validate all tests in directory (default: apps/website)
  --help, -h                 Show this help message

Examples:
  pnpm validate:tests
  pnpm validate:tests --file apps/website/src/lib/components/button.svelte.test.ts
  pnpm validate:tests --dir apps/website/src/lib/components

Cost:
  - Web searches: $10 per 1,000 searches
  - Haiku 4.5: $1/$5 per million tokens (input/output)
  - Typical run (49 files): ~$2-3
		`);
		return;
	}

	try {
		await run_validation(options);
	} catch (error) {
		logger.error(
			`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
		process.exit(1);
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch((error) => {
		logger.error(`Fatal error: ${error.message}`);
		process.exit(1);
	});
}

export { run_validation };
