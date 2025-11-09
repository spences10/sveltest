import { describe, expect, test } from 'vitest';
import {
	generate_search_index,
	search_full_text,
} from './search-index';

describe('Search Index', () => {
	test('should generate search index with full content', async () => {
		const index = await generate_search_index();

		expect(index.items.length).toBeGreaterThan(0);
		expect(index.total_items).toBe(index.items.length);
		expect(index.generated_at).toBeDefined();

		// Should have documentation topics
		const docs = index.items.filter((item) => item.type === 'topic');
		expect(docs.length).toBeGreaterThan(5);

		// Should have code examples
		const examples = index.items.filter(
			(item) => item.type === 'example',
		);
		expect(examples.length).toBeGreaterThan(10);

		// Items should have full content
		const api_reference = index.items.find(
			(item) => item.id === 'topic-api-reference',
		);
		expect(api_reference).toBeDefined();
		expect(api_reference!.content.length).toBeGreaterThan(1000);
		expect(api_reference!.keywords).toContain('mock');
	});

	test('should find "mock" in documentation', async () => {
		const index = await generate_search_index();
		const results = search_full_text('mock', index);

		expect(results.length).toBeGreaterThan(0);

		// Should find API Reference and Best Practices (both contain extensive mock content)
		const api_reference = results.find(
			(item) => item.id === 'topic-api-reference',
		);
		const best_practices = results.find(
			(item) => item.id === 'topic-best-practices',
		);

		expect(api_reference).toBeDefined();
		expect(best_practices).toBeDefined();

		// Results should be scored (higher scores first)
		expect(results[0].score).toBeGreaterThan(0);
		if (results.length > 1) {
			expect(results[0].score).toBeGreaterThanOrEqual(
				results[1].score,
			);
		}
	});

	test('should find "vi.fn" in documentation', async () => {
		const index = await generate_search_index();
		const results = search_full_text('vi.fn', index);

		expect(results.length).toBeGreaterThan(0);

		// Should find content with vi.fn
		const has_vi_fn = results.some(
			(item) =>
				item.content.toLowerCase().includes('vi.fn') ||
				item.keywords.includes('vi.fn'),
		);
		expect(has_vi_fn).toBe(true);
	});

	test('should filter results by category', async () => {
		const index = await generate_search_index();

		// Test docs filter
		const docs_results = search_full_text('test', index, 'docs');
		docs_results.forEach((result) => {
			expect(
				result.type === 'topic' ||
					result.category === 'Documentation' ||
					result.category === 'Quick Start',
			).toBe(true);
		});

		// Test examples filter
		const examples_results = search_full_text(
			'test',
			index,
			'examples',
		);
		examples_results.forEach((result) => {
			expect(result.type).toBe('example');
			expect([
				'Components',
				'Documentation',
				'Quick Start',
			]).not.toContain(result.category);
		});
	});

	test('should handle empty queries gracefully', async () => {
		const index = await generate_search_index();

		const empty_results = search_full_text('', index);
		expect(empty_results).toEqual([]);

		const whitespace_results = search_full_text('   ', index);
		expect(whitespace_results).toEqual([]);
	});

	test('should extract relevant keywords', async () => {
		const index = await generate_search_index();

		// Find an item with mock-related content
		const mock_item = index.items.find(
			(item) =>
				item.keywords.includes('mock') ||
				item.keywords.includes('vi.fn'),
		);

		expect(mock_item).toBeDefined();
		expect(mock_item!.keywords.length).toBeGreaterThan(0);

		// Should extract testing-related keywords
		const testing_keywords = [
			'mock',
			'test',
			'expect',
			'vi.fn',
			'render',
		];
		const has_testing_keywords = testing_keywords.some((keyword) =>
			mock_item!.keywords.includes(keyword),
		);
		expect(has_testing_keywords).toBe(true);
	});
});
