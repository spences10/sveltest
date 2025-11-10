#!/usr/bin/env tsx

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

/**
 * File system helpers for reading/writing files
 */

export async function read_file(file_path: string): Promise<string> {
	return await readFile(file_path, 'utf-8');
}

export async function write_file(
	file_path: string,
	content: string,
): Promise<void> {
	await writeFile(file_path, content, 'utf-8');
}

export async function find_test_files(
	base_dir: string,
): Promise<string[]> {
	const test_files: string[] = [];

	async function scan_directory(dir: string): Promise<void> {
		const entries = await readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const full_path = join(dir, entry.name);

			if (entry.isDirectory()) {
				// Skip node_modules, .git, dist, build
				if (
					![
						'node_modules',
						'.git',
						'dist',
						'build',
						'.svelte-kit',
					].includes(entry.name)
				) {
					await scan_directory(full_path);
				}
			} else if (entry.isFile()) {
				// Match test files: *.test.ts, *.svelte.test.ts, *.ssr.test.ts
				if (
					entry.name.endsWith('.test.ts') ||
					entry.name.endsWith('.svelte.test.ts') ||
					entry.name.endsWith('.ssr.test.ts')
				) {
					test_files.push(full_path);
				}
			}
		}
	}

	await scan_directory(base_dir);
	return test_files;
}

export async function get_relative_path(
	file_path: string,
	base_dir: string,
): Promise<string> {
	return relative(base_dir, file_path);
}

export async function file_exists(
	file_path: string,
): Promise<boolean> {
	try {
		await stat(file_path);
		return true;
	} catch {
		return false;
	}
}
