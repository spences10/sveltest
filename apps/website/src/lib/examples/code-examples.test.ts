import { describe, expect, it } from 'vitest';
import {
	documentation_examples,
	e2e_test_examples,
	integration_test_examples,
	unit_test_examples,
} from './code-examples';

const component_examples = Object.values({
	...unit_test_examples,
	...integration_test_examples,
}).filter((code) => code.includes("from 'vitest-browser-svelte'"));

describe('documentation runner conventions', () => {
	it.each(component_examples)(
		'names browser component examples for the client project',
		(code) => {
			expect(code.split('\n')[0]).toMatch(/\.svelte\.test\.ts$/);
		},
	);

	it.each(
		Object.values(e2e_test_examples).filter((code) =>
			code.includes("from '@playwright/test'"),
		),
	)(
		'names Playwright test examples independently of Vitest',
		(code) => {
			if (code.startsWith('// playwright.config.ts')) {
				expect(code).toContain('defineConfig');
			} else {
				expect(code.split('\n')[0]).toMatch(/\.e2e\.ts$/);
			}
		},
	);

	it.each(
		[
			...component_examples,
			...Object.values(documentation_examples),
		].filter((code) => code.includes("from 'vitest-browser-svelte'")),
	)('uses current browser imports and awaits rendering', (code) => {
		expect(code).toContain("from 'vitest/browser'");
		expect(code).not.toMatch(/(?<!await )\brender\(/);
	});
});
