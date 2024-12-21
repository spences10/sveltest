import type { ActionFailure } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import type { RequestEvent } from './$types';
import { actions, load } from './+page.server';

describe('Todos Server', () => {
	describe('load function', () => {
		it('should return initial todos', async () => {
			const response = (await load({ locals: {} } as any)) as {
				todos: Array<{ title: string; done: boolean }>;
			};

			expect(response.todos).toHaveLength(2);
			expect(response.todos[0]).toHaveProperty('title');
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
			} as any);

			const success_response = response as {
				success: boolean;
				todo: { id: number; title: string; done: boolean };
			};
			expect(success_response.success).toBe(true);
			expect(success_response.todo).toHaveProperty(
				'title',
				'New Todo',
			);
			expect(success_response.todo.done).toBe(false);
		});

		it('should fail with empty title', async () => {
			const form_data = new FormData();
			form_data.append('title', '');

			const response = await actions.add_todo({
				request: new Request('http://localhost', {
					method: 'POST',
					body: form_data,
				}),
				url: new URL('http://localhost/examples/todos'),
			} as RequestEvent);

			const failure_response = response as ActionFailure<{
				error: string;
			}>;
			expect(failure_response.status).toBe(400);
		});
	});
});
