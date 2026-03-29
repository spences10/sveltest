import { describe, expect, test } from 'vitest';
import {
	perform_search,
	search_schema,
} from './search.remote.helper';

describe('search.remote helpers', () => {
	describe('search_schema validation', () => {
		test('should accept valid query with filter', () => {
			const result = search_schema.parse({
				q: 'testing',
				filter: 'docs',
			});

			expect(result.q).toBe('testing');
			expect(result.filter).toBe('docs');
		});

		test('should default filter to all', () => {
			const result = search_schema.parse({ q: 'mock' });

			expect(result.filter).toBe('all');
		});

		test('should reject empty query', () => {
			expect(() => search_schema.parse({ q: '' })).toThrow();
		});

		test('should reject missing query', () => {
			expect(() => search_schema.parse({})).toThrow();
		});

		test('should reject invalid filter', () => {
			expect(() =>
				search_schema.parse({ q: 'test', filter: 'invalid' }),
			).toThrow();
		});

		test('should accept all valid filters', () => {
			const filters = [
				'all',
				'docs',
				'examples',
				'components',
			] as const;

			for (const filter of filters) {
				const result = search_schema.parse({ q: 'query', filter });
				expect(result.filter).toBe(filter);
			}
		});
	});

	describe('perform_search', () => {
		test('should return results for valid query', async () => {
			const results = await perform_search({
				q: 'vitest',
				filter: 'all',
			});

			expect(results.length).toBeGreaterThan(0);
			expect(results[0].score).toBeGreaterThan(0);
		});

		test('should filter by docs', async () => {
			const results = await perform_search({
				q: 'test',
				filter: 'docs',
			});

			for (const result of results) {
				expect(
					result.type === 'topic' ||
						result.category === 'Documentation' ||
						result.category === 'Quick Start',
				).toBe(true);
			}
		});

		test('should filter by components', async () => {
			const results = await perform_search({
				q: 'button',
				filter: 'components',
			});

			for (const result of results) {
				expect(result.category).toBe('Components');
			}
		});

		test('should return empty for whitespace query', async () => {
			const results = await perform_search({
				q: '   ',
				filter: 'all',
			});

			expect(results).toEqual([]);
		});

		test('should limit results to 20', async () => {
			const results = await perform_search({
				q: 'test',
				filter: 'all',
			});

			expect(results.length).toBeLessThanOrEqual(20);
		});

		test('should sort by score descending', async () => {
			const results = await perform_search({
				q: 'component',
				filter: 'all',
			});

			for (let i = 1; i < results.length; i++) {
				expect(results[i - 1].score).toBeGreaterThanOrEqual(
					results[i].score,
				);
			}
		});
	});
});
