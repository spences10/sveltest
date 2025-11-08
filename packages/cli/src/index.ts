#!/usr/bin/env node

const API_BASE = 'https://sveltest.dev/api';

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

async function fetchJSON<T>(url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json() as Promise<T>;
}

function formatJSON(data: unknown): string {
	return JSON.stringify(data, null, 2);
}

function formatReadable(data: unknown): string {
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

	if ('testingPatterns' in data && Array.isArray(data.testingPatterns)) {
		lines.push('\nTesting Patterns:');
		data.testingPatterns.forEach((pattern: { category: string; tests: { description: string }[] }) => {
			lines.push(`\n  ${pattern.category}:`);
			pattern.tests.forEach((test: { description: string }) => {
				lines.push(`    - ${test.description}`);
			});
		});
	}

	return lines.join('\n');
}

async function listExamples() {
	try {
		const data = await fetchJSON<ExamplesResponse>(`${API_BASE}/examples`);
		console.log('\nAvailable Testing Scenarios:\n');
		data.scenarios.forEach((scenario) => {
			const scenarioName = scenario.endpoint.split('/').pop();
			console.log(`  ${scenarioName}`);
			console.log(`    Category: ${scenario.category}`);
			console.log(`    ${scenario.description}\n`);
		});
	} catch (error) {
		console.error('Error fetching examples:', error);
		process.exit(1);
	}
}

async function getExample(scenario: string, format: 'json' | 'readable' = 'readable') {
	try {
		const data = await fetchJSON(`${API_BASE}/examples/${scenario}`);
		if (format === 'json') {
			console.log(formatJSON(data));
		} else {
			console.log(formatReadable(data));
		}
	} catch (error) {
		console.error(`Error fetching example '${scenario}':`, error);
		process.exit(1);
	}
}

async function searchDocs(query: string, filter?: string) {
	try {
		const params = new URLSearchParams({ q: query });
		if (filter) params.append('filter', filter);

		const data = await fetchJSON<SearchResult[]>(`${API_BASE}/search?${params}`);

		if (data.length === 0) {
			console.log(`\nNo results found for: "${query}"\n`);
			return;
		}

		console.log(`\nSearch Results for "${query}":\n`);
		data.forEach((result, index) => {
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

function showHelp() {
	console.log(`
Sveltest CLI - Fetch Svelte testing patterns and examples

Usage:
  sveltest [command] [options]

Commands:
  list                          List all available testing examples
  get <scenario> [--json]       Get a specific testing example
                                Scenarios: button-variants, form-validation,
                                          modal-states, crud-patterns,
                                          locator-patterns, authentication,
                                          runes-testing
  search <query> [--filter]     Search documentation and examples
                                Filters: all, docs, examples, components
  help                          Show this help message

Options:
  --json                        Output in JSON format (for 'get' command)
  --filter <type>               Filter search results (for 'search' command)

Examples:
  sveltest list
  sveltest get button-variants
  sveltest get form-validation --json
  sveltest search "form validation"
  sveltest search "runes" --filter examples

Documentation: https://sveltest.dev
	`);
}

async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
		showHelp();
		return;
	}

	const command = args[0];

	try {
		switch (command) {
			case 'list':
				await listExamples();
				break;

			case 'get': {
				const scenario = args[1];
				if (!scenario) {
					console.error('Error: Please specify a scenario\nRun "sveltest help" for usage information');
					process.exit(1);
				}
				const format = args.includes('--json') ? 'json' : 'readable';
				await getExample(scenario, format);
				break;
			}

			case 'search': {
				const query = args[1];
				if (!query) {
					console.error('Error: Please specify a search query\nRun "sveltest help" for usage information');
					process.exit(1);
				}
				const filterIndex = args.indexOf('--filter');
				const filter = filterIndex !== -1 ? args[filterIndex + 1] : undefined;
				await searchDocs(query, filter);
				break;
			}

			default:
				console.error(`Unknown command: ${command}\nRun "sveltest help" for usage information`);
				process.exit(1);
		}
	} catch (error) {
		console.error('An error occurred:', error);
		process.exit(1);
	}
}

main();
