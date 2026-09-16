import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

const CLI_PATH = join(import.meta.dirname, '..', 'dist', 'index.js');

interface CliResult {
	stdout: string;
	stderr: string;
	code: number | null;
}

function run_node(args: string[]): Promise<CliResult> {
	return new Promise((resolve) => {
		execFile('node', args, (error, stdout, stderr) => {
			resolve({
				stdout,
				stderr,
				code: error ? Number(error.code ?? 1) : 0,
			});
		});
	});
}

function run_cli(...args: string[]): Promise<CliResult> {
	return run_node([CLI_PATH, ...args]);
}

function run_with_docs(...args: string[]): Promise<CliResult> {
	const mock_fetch = `globalThis.fetch = async (url) => {
		if (!['https://sveltest.dev/api/docs/getting-started', 'https://sveltest.dev/llms-full.txt'].includes(String(url))) {
			throw new Error('Unexpected documentation URL: ' + url);
		}
		return new Response('# Documentation fixture');
	};`;
	return run_node([
		'--import',
		`data:text/javascript,${encodeURIComponent(mock_fetch)}`,
		CLI_PATH,
		...args,
	]);
}

// Citty writes help/usage to stderr and exits with code 1
// when no subcommand is given or --help is used
function get_output(result: CliResult): string {
	return result.stdout + result.stderr;
}

describe('sveltest CLI', () => {
	describe('help output', () => {
		it('shows help with no args', async () => {
			const result = await run_cli();
			const output = get_output(result);
			expect(output).toContain('sveltest');
			expect(output).toContain('USAGE');
			expect(output).toContain('COMMANDS');
		});

		it('shows help with --help flag', async () => {
			const result = await run_cli('--help');
			const output = get_output(result);
			expect(output).toContain('sveltest');
			expect(output).toContain('COMMANDS');
		});

		it('lists all subcommands in help', async () => {
			const result = await run_cli('--help');
			const output = get_output(result);
			expect(output).toContain('llms');
			expect(output).toContain('docs');
			expect(output).toContain('list');
			expect(output).toContain('get');
			expect(output).toContain('search');
		});

		it('shows subcommand help for llms', async () => {
			const result = await run_cli('llms', '--help');
			const output = get_output(result);
			expect(output).toContain('--full');
			expect(output).toContain('--context');
		});

		it('shows subcommand help for docs', async () => {
			const result = await run_cli('docs', '--help');
			const output = get_output(result);
			expect(output).toContain('TOPIC');
			expect(output).toContain('--json');
			expect(output).toContain('--context');
		});

		it('shows subcommand help for get', async () => {
			const result = await run_cli('get', '--help');
			const output = get_output(result);
			expect(output).toContain('SCENARIO');
			expect(output).toContain('--json');
			expect(output).toContain('--compact');
			expect(output).toContain('--filter');
			expect(output).toContain('--sections');
			expect(output).toContain('--plain');
		});

		it('shows subcommand help for search', async () => {
			const result = await run_cli('search', '--help');
			const output = get_output(result);
			expect(output).toContain('QUERY');
			expect(output).toContain('--filter');
		});

		it('shows subcommand help for list', async () => {
			const result = await run_cli('list', '--help');
			const output = get_output(result);
			expect(output).toContain('--plain');
		});
	});

	describe('documentation context', () => {
		it.each([
			['docs', 'getting-started', '--context'],
			['llms', '--full', '--context'],
		])('includes the scaffold baseline for %s', async (...args) => {
			const result = await run_with_docs(...args);
			expect(result.code).toBe(0);
			expect(result.stdout).toContain('Official Svelte CLI');
			expect(result.stdout).toContain('*.e2e.ts');
			expect(result.stdout).toContain('requireAssertions: true');
			expect(result.stdout).toContain('vitest/browser');
			expect(result.stdout).toContain('# Documentation fixture');
		});

		it('omits the context header unless requested', async () => {
			const result = await run_with_docs('llms', '--full');
			expect(result.code).toBe(0);
			expect(result.stdout).toBe('# Documentation fixture');
		});
	});

	describe('version output', () => {
		it('prints version with --version', async () => {
			const result = await run_cli('--version');
			expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
		});
	});

	describe('error cases', () => {
		it('exits 1 for unknown command', async () => {
			const result = await run_cli('foobar');
			expect(result.code).toBe(1);
			const output = get_output(result);
			expect(output).toContain('Unknown command');
			expect(output).toContain('foobar');
		});

		it('exits 1 when "get" has no scenario', async () => {
			const result = await run_cli('get');
			expect(result.code).toBe(1);
			const output = get_output(result);
			expect(output).toContain('SCENARIO');
		});

		it('exits 1 when "search" has no query', async () => {
			const result = await run_cli('search');
			expect(result.code).toBe(1);
			const output = get_output(result);
			expect(output).toContain('QUERY');
		});
	});
});
