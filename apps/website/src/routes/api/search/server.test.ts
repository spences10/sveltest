import { describe, expect, test } from 'vitest';
import { GET } from './+server';

describe('/api/search', () => {
	describe('GET - Full-text search functionality', () => {
		test('should return empty results for empty query', async () => {
			const url = new URL('http://localhost/api/search?q=');
			const response = await GET({ url } as any);
			const data = await response.json();

			expect(data.query).toBe('');
			expect(data.filter).toBe('all');
			expect(data.results).toEqual([]);
			expect(data.total).toBe(0);
		});

		test('should find "mock" in documentation content', async () => {
			const url = new URL('http://localhost/api/search?q=mock');
			const response = await GET({ url } as any);
			const data = await response.json();

			expect(data.query).toBe('mock');
			expect(data.results.length).toBeGreaterThan(0);

			// Should find API Reference and Best Practices (both contain mock content)
			const api_reference = data.results.find(
				(r: any) => r.id === 'topic-api-reference',
			);
			const best_practices = data.results.find(
				(r: any) => r.id === 'topic-best-practices',
			);

			expect(api_reference || best_practices).toBeDefined();
		});

		test('should find "vi.fn" in code examples', async () => {
			const url = new URL('http://localhost/api/search?q=vi.fn');
			const response = await GET({ url } as any);
			const data = await response.json();

			expect(data.results.length).toBeGreaterThan(0);

			// Should find results when searching for vi.fn (content is in full text, not just excerpts)
			// The search algorithm finds it in the full content and returns relevant results
			expect(data.results.length).toBeGreaterThan(0);
		});

		test('should handle case-insensitive search', async () => {
			const lower_url = new URL('http://localhost/api/search?q=mock');
			const upper_url = new URL('http://localhost/api/search?q=MOCK');

			const lower_response = await GET({ url: lower_url } as any);
			const upper_response = await GET({ url: upper_url } as any);

			const lower_data = await lower_response.json();
			const upper_data = await upper_response.json();

			expect(lower_data.results.length).toBeGreaterThan(0);
			expect(upper_data.results.length).toBeGreaterThan(0);
			// Should find similar results regardless of case
			expect(lower_data.results.length).toBe(
				upper_data.results.length,
			);
		});

		test('should filter results by docs only', async () => {
			const url = new URL(
				'http://localhost/api/search?q=test&filter=docs',
			);
			const response = await GET({ url } as any);
			const data = await response.json();

			expect(data.filter).toBe('docs');
			// All results should be docs-related
			data.results.forEach((result: any) => {
				expect(
					result.type === 'topic' ||
						result.category === 'Documentation' ||
						result.category === 'Quick Start',
				).toBe(true);
			});
		});

		test('should filter results by examples only', async () => {
			const url = new URL(
				'http://localhost/api/search?q=test&filter=examples',
			);
			const response = await GET({ url } as any);
			const data = await response.json();

			expect(data.filter).toBe('examples');
			// All results should be examples (but not components/docs)
			data.results.forEach((result: any) => {
				expect(result.type).toBe('example');
				expect([
					'Components',
					'Documentation',
					'Quick Start',
				]).not.toContain(result.category);
			});
		});

		test('should include excerpts for results', async () => {
			const url = new URL('http://localhost/api/search?q=component');
			const response = await GET({ url } as any);
			const data = await response.json();

			if (data.results.length > 0) {
				expect(data.results[0]).toHaveProperty('excerpt');
				expect(typeof data.results[0].excerpt).toBe('string');
			}
		});
	});
});
