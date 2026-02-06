import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const CLI_PATH = join(
	import.meta.dirname,
	'..',
	'bin',
	'sveltest.js',
);

interface CliResult {
	stdout: string;
	stderr: string;
	code: number | null;
}

function run_cli(...args: string[]): Promise<CliResult> {
	return new Promise((resolve) => {
		execFile('node', [CLI_PATH, ...args], (error, stdout, stderr) => {
			resolve({
				stdout,
				stderr,
				code: error ? (error.code ?? 1) : 0,
			});
		});
	});
}

describe('sveltest CLI', () => {
	describe('help output', () => {
		it('shows help with no args', async () => {
			const result = await run_cli();
			expect(result.code).toBe(0);
			expect(result.stdout).toContain('Sveltest CLI');
			expect(result.stdout).toContain('Usage:');
			expect(result.stdout).toContain('Commands:');
		});

		it('shows help with "help" command', async () => {
			const result = await run_cli('help');
			expect(result.code).toBe(0);
			expect(result.stdout).toContain('Sveltest CLI');
		});

		it('shows help with --help flag', async () => {
			const result = await run_cli('--help');
			expect(result.code).toBe(0);
			expect(result.stdout).toContain('Sveltest CLI');
		});

		it('shows help with -h flag', async () => {
			const result = await run_cli('-h');
			expect(result.code).toBe(0);
			expect(result.stdout).toContain('Sveltest CLI');
		});
	});

	describe('version output', () => {
		it('prints version with --version', async () => {
			const result = await run_cli('--version');
			expect(result.code).toBe(0);
			expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
		});

		it('prints version with -v', async () => {
			const result = await run_cli('-v');
			expect(result.code).toBe(0);
			expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
		});
	});

	describe('error cases', () => {
		it('exits 1 for unknown command', async () => {
			const result = await run_cli('foobar');
			expect(result.code).toBe(1);
			expect(result.stderr).toContain('Unknown command: foobar');
		});

		it('exits 1 when "get" has no scenario', async () => {
			const result = await run_cli('get');
			expect(result.code).toBe(1);
			expect(result.stderr).toContain(
				'Error: Please specify a scenario',
			);
		});

		it('exits 1 when "search" has no query', async () => {
			const result = await run_cli('search');
			expect(result.code).toBe(1);
			expect(result.stderr).toContain(
				'Error: Please specify a search query',
			);
		});

		it('exits 1 when --sections has no value', async () => {
			const result = await run_cli(
				'get',
				'foo',
				'--json',
				'--sections',
			);
			expect(result.code).toBe(1);
			expect(result.stderr).toContain(
				'Error: --sections requires a value',
			);
		});

		it('exits 1 when --filter has no value', async () => {
			const result = await run_cli(
				'get',
				'foo',
				'--json',
				'--filter',
			);
			expect(result.code).toBe(1);
			expect(result.stderr).toContain(
				'Error: --filter requires a value',
			);
		});

		it('exits 1 when --filter value is a flag', async () => {
			const result = await run_cli(
				'get',
				'foo',
				'--json',
				'--filter',
				'--compact',
			);
			expect(result.code).toBe(1);
			expect(result.stderr).toContain(
				'Error: --filter requires a value',
			);
		});

		it('exits 1 when --sections value is a flag', async () => {
			const result = await run_cli(
				'get',
				'foo',
				'--json',
				'--sections',
				'--compact',
			);
			expect(result.code).toBe(1);
			expect(result.stderr).toContain(
				'Error: --sections requires a value',
			);
		});

		it('exits 1 for search --filter without value', async () => {
			const result = await run_cli('search', 'runes', '--filter');
			expect(result.code).toBe(1);
			expect(result.stderr).toContain(
				'Error: --filter requires a value',
			);
		});
	});
});
