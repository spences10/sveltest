import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Simulate DB fetch
	const todos = [
		{ id: 1, title: 'Learn SvelteKit', done: false },
		{ id: 2, title: 'Write tests', done: false },
	];

	return { todos };
};

export const actions = {
	add_todo: async ({ request }) => {
		const form_data = await request.formData();
		const title = form_data.get('title')?.toString();

		if (!title) {
			return fail(400, { error: 'Title is required' });
		}

		// Simulate DB insert
		const new_todo = {
			id: Date.now(),
			title,
			done: false,
		};

		return { success: true, todo: new_todo };
	},
} satisfies Actions;
