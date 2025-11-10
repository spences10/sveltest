/**
 * Test-type-specific validation prompts
 *
 * Different test types require different validation focus:
 * - Browser components: vitest-browser-svelte patterns
 * - SSR: Server rendering without browser APIs
 * - Server: SvelteKit API endpoints with Request/Response
 * - Playwright: E2E workflows with page interactions
 * - Unit: Pure logic testing without DOM
 */

import { get_browser_component_prompt } from './browser-component.js';
import { get_playwright_prompt } from './playwright.js';
import { get_server_prompt } from './server.js';
import { get_ssr_prompt } from './ssr.js';
import { get_unit_prompt } from './unit.js';

export type TestType =
	| 'browser_component'
	| 'ssr'
	| 'server'
	| 'playwright'
	| 'unit';

/**
 * Detect test type from file path and content
 */
export function detect_test_type(
	file_path: string,
	test_code: string,
): TestType {
	// Check file extension patterns first (most reliable)
	if (file_path.endsWith('.ssr.test.ts')) {
		return 'ssr';
	}

	if (file_path.endsWith('.spec.ts')) {
		return 'playwright';
	}

	if (file_path.endsWith('.svelte.test.ts')) {
		return 'browser_component';
	}

	// Check file path for server tests
	if (
		file_path.includes('server.test.ts') ||
		file_path.includes('+server.ts') ||
		file_path.includes('+page.server.ts') ||
		file_path.includes('/api/')
	) {
		return 'server';
	}

	// Check imports to distinguish between browser and unit tests
	if (test_code.includes('vitest-browser-svelte')) {
		return 'browser_component';
	}

	if (test_code.includes('@playwright/test')) {
		return 'playwright';
	}

	if (test_code.includes('svelte/server')) {
		return 'ssr';
	}

	// Default to unit test for .test.ts files
	return 'unit';
}

/**
 * Get appropriate validation prompt for test type
 */
export function get_validation_prompt(
	test_type: TestType,
	file_path: string,
	test_code: string,
): string {
	switch (test_type) {
		case 'browser_component':
			return get_browser_component_prompt(file_path, test_code);
		case 'ssr':
			return get_ssr_prompt(file_path, test_code);
		case 'server':
			return get_server_prompt(file_path, test_code);
		case 'playwright':
			return get_playwright_prompt(file_path, test_code);
		case 'unit':
			return get_unit_prompt(file_path, test_code);
	}
}
