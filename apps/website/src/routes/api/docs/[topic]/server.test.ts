import { describe, expect, it } from 'vitest';
import { GET } from './+server';

function make_request(
	topic: string,
	format?: string,
): { params: { topic: string }; url: URL } {
	const url_str = format
		? `http://localhost/api/docs/${topic}?format=${format}`
		: `http://localhost/api/docs/${topic}`;
	return {
		params: { topic },
		url: new URL(url_str),
	};
}

describe('Documentation Topic Content Endpoint', () => {
	describe('Markdown format (default)', () => {
		it('should return markdown for valid topic', async () => {
			const response = await GET(
				make_request('getting-started') as any,
			);

			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toContain(
				'text/markdown',
			);

			const text = await response.text();
			expect(text.length).toBeGreaterThan(100);
		});

		it('should return markdown for runes-testing', async () => {
			const response = await GET(
				make_request('runes-testing') as any,
			);

			expect(response.status).toBe(200);
			const text = await response.text();
			expect(text).toContain('rune');
		});
	});

	describe('JSON format', () => {
		it('should return JSON when format=json', async () => {
			const response = await GET(
				make_request('getting-started', 'json') as any,
			);

			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toContain(
				'application/json',
			);

			const data = await response.json();
			expect(data).toHaveProperty('slug', 'getting-started');
			expect(data).toHaveProperty('title');
			expect(data).toHaveProperty('description');
			expect(data).toHaveProperty('category');
			expect(data).toHaveProperty('content');
			expect(data.content.length).toBeGreaterThan(100);
		});
	});

	describe('Error handling', () => {
		it('should return 404 for unknown topic', async () => {
			const response = await GET(
				make_request('nonexistent-topic') as any,
			);

			expect(response.status).toBe(404);
			const data = await response.json();
			expect(data).toHaveProperty('error');
			expect(data.error).toContain('nonexistent-topic');
			expect(data).toHaveProperty('available_topics');
			expect(data.available_topics).toBeInstanceOf(Array);
		});
	});
});
