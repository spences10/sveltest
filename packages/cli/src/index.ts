#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API_BASE = 'https://sveltest.dev/api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get CLI version from package.json
function get_cli_version() {
	try {
		const pkg_path = join(__dirname, '..', 'package.json');
		const pkg = JSON.parse(readFileSync(pkg_path, 'utf-8'));
		return pkg.version;
	} catch {
		return 'unknown';
	}
}

// Related patterns mapping for better discoverability
const RELATED_PATTERNS: Record<string, string[]> = {
	'button-variants': [
		'locator-patterns',
		'modal-states',
		'runes-testing',
	],
	'form-validation': [
		'authentication',
		'crud-patterns',
		'locator-patterns',
	],
	'modal-states': [
		'button-variants',
		'locator-patterns',
		'runes-testing',
	],
	'crud-patterns': [
		'form-validation',
		'runes-testing',
		'authentication',
	],
	'locator-patterns': [
		'button-variants',
		'form-validation',
		'modal-states',
	],
	authentication: ['form-validation', 'crud-patterns'],
	'runes-testing': [
		'crud-patterns',
		'button-variants',
		'modal-states',
	],
};

// Add related patterns to response
function add_related_patterns(
	data: Record<string, unknown>,
	scenario: string,
): Record<string, unknown> {
	const related = RELATED_PATTERNS[scenario];
	if (related && related.length > 0) {
		return {
			...data,
			_related: related,
		};
	}
	return data;
}

// Add metadata to JSON responses
function add_metadata(
	data: Record<string, unknown>,
): Record<string, unknown> {
	return {
		...data,
		_meta: {
			cli_version: get_cli_version(),
			timestamp: new Date().toISOString(),
			source: 'https://sveltest.dev',
		},
	};
}

interface ScenarioMeta {
	endpoint: string;
	method: string;
	category: string;
	description: string;
	patterns: string[];
	example_test_file: string;
}

interface ExamplesResponse {
	title: string;
	description: string;
	total_scenarios: number;
	categories: string[];
	scenarios: ScenarioMeta[];
}

interface SearchResult {
	id: string;
	title: string;
	description: string;
	url: string;
	type: string;
	category: string;
	excerpt: string;
}

interface SearchResponse {
	query: string;
	filter: string;
	results: SearchResult[];
	total: number;
}

interface GetExampleOptions {
	compact?: boolean;
	filter?: string;
	sections?: string[];
}

async function fetch_json<T>(url: string): Promise<T> {
	const controller = new AbortController();
	const timeout_id = setTimeout(() => controller.abort(), 30000);
	try {
		const response = await fetch(url, { signal: controller.signal });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json() as Promise<T>;
	} finally {
		clearTimeout(timeout_id);
	}
}

function format_json(data: unknown): string {
	return JSON.stringify(data, null, 2);
}

function format_readable(data: unknown): string {
	if (typeof data !== 'object' || data === null) {
		return String(data);
	}

	const lines: string[] = [];

	if ('title' in data && typeof data.title === 'string') {
		lines.push(`\n${data.title}`);
		lines.push('='.repeat(data.title.length));
	}

	if ('description' in data && typeof data.description === 'string') {
		lines.push(`\n${data.description}`);
	}

	if (
		'testingPatterns' in data &&
		Array.isArray(data.testingPatterns)
	) {
		lines.push('\nTesting Patterns:');
		data.testingPatterns.forEach(
			(pattern: {
				category: string;
				tests: { description: string }[];
			}) => {
				lines.push(`\n  ${pattern.category}:`);
				pattern.tests.forEach((test: { description: string }) => {
					lines.push(`    - ${test.description}`);
				});
			},
		);
	}

	return lines.join('\n');
}

async function list_examples() {
	try {
		const data = await fetch_json<ExamplesResponse>(
			`${API_BASE}/examples`,
		);
		console.log('\nAvailable Testing Scenarios:\n');
		data.scenarios.forEach((scenario) => {
			const scenario_name = scenario.endpoint.split('/').pop();
			console.log(`  ${scenario_name}`);
			console.log(`    Category: ${scenario.category}`);
			console.log(`    ${scenario.description}\n`);
		});
	} catch (error) {
		console.error('Error fetching examples:', error);
		process.exit(1);
	}
}

function compact_json(
	data: Record<string, unknown>,
): Record<string, unknown> {
	// Remove verbose fields to reduce token usage
	const {
		description,
		source_file,
		total_tests,
		meta,
		...essential
	} = data;

	// Keep only essential fields
	return essential;
}

async function get_example(
	scenario: string,
	format: 'json' | 'readable' = 'readable',
	options: GetExampleOptions = {},
) {
	try {
		const data = await fetch_json(`${API_BASE}/examples/${scenario}`);

		if (format === 'json') {
			let output = data as Record<string, unknown>;

			// Apply compact mode
			if (options.compact) {
				output = compact_json(output);
			}

			// Apply filter if specified
			if (options.filter) {
				const filterKey = options.filter;
				if (output[filterKey]) {
					output = { [filterKey]: output[filterKey] };
				}
			}

			// Apply section filtering
			if (options.sections && options.sections.length > 0) {
				const filtered: Record<string, unknown> = {};
				options.sections.forEach((section) => {
					if (output[section]) {
						filtered[section] = output[section];
					}
				});
				output = filtered;
			}

			// Add related patterns
			output = add_related_patterns(output, scenario);

			// Add metadata to response
			output = add_metadata(output);

			console.log(format_json(output));
		} else {
			console.log(format_readable(data));
		}
	} catch (error) {
		console.error(`Error fetching example '${scenario}':`, error);
		process.exit(1);
	}
}

async function search_docs(query: string, filter?: string) {
	try {
		const params = new URLSearchParams({ q: query });
		if (filter) params.append('filter', filter);

		const response = await fetch_json<SearchResponse>(
			`${API_BASE}/search?${params}`,
		);

		if (response.results.length === 0) {
			console.log(`\nNo results found for: "${query}"\n`);
			return;
		}

		console.log(`\nSearch Results for "${query}":\n`);
		response.results.forEach((result, index) => {
			console.log(`${index + 1}. ${result.title}`);
			console.log(`   ${result.description}`);
			console.log(`   ${result.url}`);
			if (result.excerpt) {
				console.log(`   ...${result.excerpt}...\n`);
			} else {
				console.log('');
			}
		});
	} catch (error) {
		console.error('Error searching:', error);
		process.exit(1);
	}
}

function show_help() {
	console.log(`
Sveltest CLI - Fetch Svelte testing patterns and examples

Usage:
  sveltest [command] [options]

Commands:
  list                          List all available testing examples
  get <scenario> [options]      Get a specific testing example
                                Scenarios: button-variants, form-validation,
                                          modal-states, crud-patterns,
                                          locator-patterns, authentication,
                                          runes-testing
                                Supports batch: button-variants,form-validation
  search <query> [--filter]     Search documentation and examples
                                Filters: all, docs, examples, components
  help                          Show this help message

Options (for 'get' command):
  --json                        Output in JSON format
  --compact                     Minimal JSON output (reduces token usage by ~50%)
  --filter <field>              Get only specific field (e.g., testing_patterns)
  --sections <list>             Get specific sections (comma-separated)

Options (for 'search' command):
  --filter <type>               Filter results by type

Examples:
  sveltest list
  sveltest get button-variants
  sveltest get form-validation --json
  sveltest get button-variants --json --compact
  sveltest get form-validation --json --filter testing_patterns
  sveltest get modal-states --json --sections test_scenarios,testing_patterns
  sveltest get button-variants,form-validation --json
  sveltest search "form validation"
  sveltest search "runes" --filter examples

Documentation: https://sveltest.dev
	`);
}

async function main() {
	const args = process.argv.slice(2);

	if (
		args.length === 0 ||
		args[0] === 'help' ||
		args[0] === '--help' ||
		args[0] === '-h'
	) {
		show_help();
		return;
	}

	if (args[0] === '--version' || args[0] === '-v') {
		console.log(get_cli_version());
		return;
	}

	const command = args[0];

	try {
		switch (command) {
			case 'list':
				await list_examples();
				break;

			case 'get': {
				const scenario = args[1];
				if (!scenario) {
					console.error(
						'Error: Please specify a scenario\nRun "sveltest help" for usage information',
					);
					process.exit(1);
				}

				const format = args.includes('--json') ? 'json' : 'readable';
				const compact = args.includes('--compact');

				// Parse --filter flag
				const filter_index = args.indexOf('--filter');
				let filter: string | undefined;
				if (filter_index !== -1) {
					const next_arg = args[filter_index + 1];
					if (!next_arg || next_arg.startsWith('--')) {
						console.error(
							'Error: --filter requires a value\nRun "sveltest help" for usage information',
						);
						process.exit(1);
					}
					filter = next_arg;
				}

				// Parse --sections flag (comma-separated)
				const sections_index = args.indexOf('--sections');
				let sections: string[] | undefined;
				if (sections_index !== -1) {
					const next_arg = args[sections_index + 1];
					if (!next_arg || next_arg.startsWith('--')) {
						console.error(
							'Error: --sections requires a value\nRun "sveltest help" for usage information',
						);
						process.exit(1);
					}
					sections = next_arg.split(',');
				}

				const options = { compact, filter, sections };

				// Handle batch get (comma-separated scenarios)
				if (scenario.includes(',')) {
					const scenarios = scenario.split(',').map((s) => s.trim());
					const results: Record<string, Record<string, unknown>> = {};

					for (const s of scenarios) {
						try {
							const data = await fetch_json(
								`${API_BASE}/examples/${s}`,
							);
							let output = data as Record<string, unknown>;

							if (options.compact) {
								output = compact_json(output);
							}

							if (options.filter && output[options.filter]) {
								output = { [options.filter]: output[options.filter] };
							}

							if (options.sections && options.sections.length > 0) {
								const filtered: Record<string, unknown> = {};
								options.sections.forEach((section) => {
									if (output[section]) {
										filtered[section] = output[section];
									}
								});
								output = filtered;
							}

							// Add related patterns
							output = add_related_patterns(output, s);

							results[s] = output;
						} catch (error) {
							console.error(`Error fetching '${s}':`, error);
						}
					}

					if (format === 'json') {
						// Add metadata to batch results
						const output = add_metadata(results);
						console.log(format_json(output));
					} else {
						console.log('Batch mode requires --json flag');
						process.exit(1);
					}
				} else {
					await get_example(scenario, format, options);
				}
				break;
			}

			case 'search': {
				const query = args[1];
				if (!query) {
					console.error(
						'Error: Please specify a search query\nRun "sveltest help" for usage information',
					);
					process.exit(1);
				}
				const search_filter_index = args.indexOf('--filter');
				let search_filter: string | undefined;
				if (search_filter_index !== -1) {
					const next_arg = args[search_filter_index + 1];
					if (!next_arg || next_arg.startsWith('--')) {
						console.error(
							'Error: --filter requires a value\nRun "sveltest help" for usage information',
						);
						process.exit(1);
					}
					search_filter = next_arg;
				}
				await search_docs(query, search_filter);
				break;
			}

			default:
				console.error(
					`Unknown command: ${command}\nRun "sveltest help" for usage information`,
				);
				process.exit(1);
		}
	} catch (error) {
		console.error('An error occurred:', error);
		process.exit(1);
	}
}

main();
