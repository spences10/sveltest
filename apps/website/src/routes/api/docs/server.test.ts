import { describe, expect, it } from 'vitest';
import { GET } from './+server';

describe('Documentation Topics Index Endpoint', () => {
	describe('Response Structure', () => {
		it('should return valid JSON response', async () => {
			const request = new Request('http://localhost/api/docs');
			const response = await GET({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toContain(
				'application/json',
			);
			expect(data).toBeDefined();
		});

		it('should include all required top-level fields', async () => {
			const request = new Request('http://localhost/api/docs');
			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data).toHaveProperty('title');
			expect(data).toHaveProperty('description');
			expect(data).toHaveProperty('total_topics');
			expect(data).toHaveProperty('categories');
			expect(data).toHaveProperty('topics');
		});

		it('should have correct topic count', async () => {
			const request = new Request('http://localhost/api/docs');
			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.total_topics).toBe(data.topics.length);
			expect(data.total_topics).toBeGreaterThanOrEqual(14);
		});

		it('should have correct topic structure', async () => {
			const request = new Request('http://localhost/api/docs');
			const response = await GET({ request } as any);
			const data = await response.json();

			const topic = data.topics[0];
			expect(topic).toHaveProperty('slug');
			expect(topic).toHaveProperty('title');
			expect(topic).toHaveProperty('description');
			expect(topic).toHaveProperty('category');
			expect(topic).toHaveProperty('has_content');
		});

		it('should include expected categories', async () => {
			const request = new Request('http://localhost/api/docs');
			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.categories).toContain('Fundamentals');
			expect(data.categories).toContain('Test Types');
			expect(data.categories).toContain('Advanced Patterns');
		});

		it('should include known topics', async () => {
			const request = new Request('http://localhost/api/docs');
			const response = await GET({ request } as any);
			const data = await response.json();

			const slugs = data.topics.map((t: { slug: string }) => t.slug);
			expect(slugs).toContain('getting-started');
			expect(slugs).toContain('runes-testing');
			expect(slugs).toContain('component-testing');
		});
	});
});
