import type { RequestEvent } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { actions, load } from './+page.server';

describe('Todos Server', () => {
	describe('load function', () => {
		it('should return initial todos', async () => {
			const response = (await load()) as {
				todos: Array<{ title: string; done: boolean }>;
			};

			expect(response.todos).toHaveLength(2);
			expect(response.todos[0]).toHaveProperty(
				'title',
				'Learn SvelteKit',
			);
		});
	});

	describe('actions', () => {
		it('should add new todo with valid data', async () => {
			const form_data = new FormData();
			form_data.append('title', 'New Todo');

			const response = await actions.add_todo({
				request: new Request('http://localhost', {
					method: 'POST',
					body: form_data,
				}),
			} as RequestEvent);

			if (!('error' in response)) {
				expect(response.success).toBe(true);
				expect(response.todo).toHaveProperty('title', 'New Todo');
				expect(response.todo.done).toBe(false);
			}
		});

		it('should fail with empty title', async () => {
			const form_data = new FormData();
			form_data.append('title', '');

			const response = await actions.add_todo({
				request: new Request('http://localhost', {
					method: 'POST',
					body: form_data,
				}),
			} as RequestEvent);

			if ('error' in response) {
				expect(response.error).toBe('Title is required');
			}
		});
	});
});
