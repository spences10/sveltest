#!/usr/bin/env tsx

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../utils/logger.js';
import { find_test_files } from '../utils/file-helpers.js';
import { fetch_all_official_docs } from './fetch-official-docs.js';
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
 * Validates all test files against official documentation
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..', '..');
const WEBSITE_DIR = join(ROOT_DIR, 'apps', 'website');
const OUTPUT_DIR = join(ROOT_DIR, 'validation-reports');

interface ValidationOptions {
	target_dir?: string;
	specific_file?: string;
	skip_docs_fetch?: boolean;
	cached_docs_path?: string;
}

async function run_validation(
	options: ValidationOptions = {},
): Promise<void> {
	logger.header('🧪 Sveltest Validation System');

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

	// Step 2: Fetch official documentation
	logger.step(2, 'Fetching official documentation');

	let official_docs: string;

	if (options.skip_docs_fetch && options.cached_docs_path) {
		logger.info('Using cached documentation');
		const { read_file } = await import('../utils/file-helpers.js');
		official_docs = await read_file(options.cached_docs_path);
	} else {
		official_docs = await fetch_all_official_docs();

		// Cache the docs
		const { write_file } = await import('../utils/file-helpers.js');
		const cache_path = join(OUTPUT_DIR, 'cached-official-docs.md');
		await write_file(cache_path, official_docs);
		logger.success(`Cached documentation to: ${cache_path}`);
	}

	// Step 3: Analyze each test file
	logger.step(3, 'Analyzing test files');
	logger.info(
		`This will take a few minutes for ${test_files.length} files...`,
	);

	const results: ValidationResult[] = [];

	for (let i = 0; i < test_files.length; i++) {
		const file = test_files[i];
		logger.info(`[${i + 1}/${test_files.length}] Analyzing: ${file}`);

		const result = await analyze_test_file(file, official_docs);
		results.push(result);

		// Show quick status
		if (result.is_valid) {
			logger.success(`  ✅ Valid`);
		} else {
			logger.error(
				`  ❌ Issues found: ${result.critical_issues} critical, ${result.warning_issues} warnings`,
			);
		}

		// Small delay to avoid rate limiting
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	// Step 4: Generate report
	logger.step(4, 'Generating validation report');

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
		results,
		generated_at: new Date().toISOString(),
	};

	// Save report
	const report_filename = `validation-report-${new Date().toISOString().split('T')[0]}.md`;
	const report_path = join(OUTPUT_DIR, report_filename);

	await save_validation_report(report, report_path);

	// Print summary
	logger.step(5, 'Validation Complete');
	print_summary(report);

	// Exit with appropriate code
	if (report.critical_issues > 0 || report.invalid_files > 0) {
		process.exit(1);
	}
}

// CLI handling
async function main() {
	const args = process.argv.slice(2);

	const options: ValidationOptions = {
		skip_docs_fetch: args.includes('--skip-docs-fetch'),
		cached_docs_path: args.includes('--cached-docs')
			? args[args.indexOf('--cached-docs') + 1]
			: undefined,
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
Sveltest Validation System

Usage:
  pnpm validate:tests [options]

Options:
  --file <path>              Validate a specific test file
  --dir <path>               Validate all tests in directory (default: apps/website)
  --skip-docs-fetch          Skip fetching official docs
  --cached-docs <path>       Use cached documentation file
  --help, -h                 Show this help message

Examples:
  pnpm validate:tests
  pnpm validate:tests --file apps/website/src/lib/components/button.svelte.test.ts
  pnpm validate:tests --skip-docs-fetch --cached-docs validation-reports/cached-official-docs.md
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
