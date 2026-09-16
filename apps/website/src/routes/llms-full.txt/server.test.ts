import { describe, expect, it } from 'vitest';
import { content_map } from '#lib/server/content.js';
import { GET, prerender } from './+server';

describe('full LLM documentation', () => {
	it('serves plain text generated from every documentation topic', async () => {
		const response = GET();
		const content = await response.text();

		expect(prerender).toBe(true);
		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe(
			'text/plain; charset=utf-8',
		);
		expect(content).toContain('# Sveltest Testing Documentation');
		for (const markdown of Object.values(content_map)) {
			expect(content).toContain(markdown.trim());
		}
	});

	it('teaches the same runner boundaries as the CLI scaffold', async () => {
		const content = await GET().text();

		expect(content).toContain('requireAssertions: true');
		expect(content).toContain("testMatch: '**/*.e2e.{ts,js}'");
		expect(content).toContain('page.svelte.e2e.ts');
		expect(content).not.toContain('@vitest/browser/context');
		expect(content).not.toContain('vitest-browser/context');
		expect(content).not.toContain("provider: 'playwright'");
	});
});
