#!/usr/bin/env tsx

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { find_test_files } from '../utils/file-helpers.js';
import { logger } from '../utils/logger.js';
import type { ValidationResult } from './analyze-test-file.js';
import { analyze_test_file } from './analyze-test-file.js';
import {
	print_summary,
	save_validation_report,
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

	// Group files by test type for more efficient batch processing
	const files_by_type = new Map<string, string[]>();
	test_files.forEach((file) => {
		// Quick detection based on filename patterns
		let type = 'unit';
		if (file.endsWith('.ssr.test.ts')) type = 'ssr';
		else if (file.endsWith('.spec.ts')) type = 'playwright';
		else if (file.endsWith('.svelte.test.ts'))
			type = 'browser_component';
		else if (file.includes('server.test.ts')) type = 'server';

		if (!files_by_type.has(type)) {
			files_by_type.set(type, []);
		}
		files_by_type.get(type)!.push(file);
	});

	// Show test type breakdown
	logger.info(`Test types found:`);
	for (const [type, files] of files_by_type.entries()) {
		logger.info(`  - ${type}: ${files.length} files`);
	}
	logger.info('');

	// Process files in batches, grouped by test type
	const BATCH_SIZE = 10;
	let total_completed = 0;

	for (const [test_type, files] of files_by_type.entries()) {
		logger.info(
			`🔹 Processing ${test_type} tests (${files.length} files)`,
		);

		for (let i = 0; i < files.length; i += BATCH_SIZE) {
			const batch = files.slice(i, i + BATCH_SIZE);
			const batch_num = Math.floor(i / BATCH_SIZE) + 1;
			const total_batches = Math.ceil(files.length / BATCH_SIZE);

			logger.info(
				`  Batch ${batch_num}/${total_batches} (${batch.length} files)`,
			);

			// Process batch in parallel
			const batch_results = await Promise.all(
				batch.map(async (file) => {
					const file_number = total_completed + 1;
					total_completed++;

					const result = await analyze_test_file(file);

					// Show quick status
					if (result.is_valid) {
						logger.success(
							`    ✅ [${file_number}/${test_files.length}] Valid (${result.web_searches_used} searches) - ${file}`,
						);
					} else {
						logger.error(
							`    ❌ [${file_number}/${test_files.length}] ${result.critical_issues} critical, ${result.warning_issues} warnings (${result.web_searches_used} searches) - ${file}`,
						);
					}

					return result;
				}),
			);

			results.push(...batch_results);

			// Small delay between batches to avoid rate limiting
			if (i + BATCH_SIZE < files.length) {
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}

		logger.info('');
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

	// Save report with timestamp to prevent overwriting
	const timestamp = new Date()
		.toISOString()
		.replace(/T/, '_')
		.replace(/\..+/, '')
		.replace(/:/g, '-');
	const report_filename = `validation-report-${timestamp}.md`;
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
