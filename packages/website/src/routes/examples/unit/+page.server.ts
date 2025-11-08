import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	calculate: async ({ request }) => {
		const data = await request.formData();
		const num1 = Number(data.get('num1'));
		const num2 = Number(data.get('num2'));

		if (isNaN(num1) || isNaN(num2)) {
			return fail(400, { error: 'Please provide valid numbers' });
		}

		return { result: num1 + num2 };
	},
} satisfies Actions;
