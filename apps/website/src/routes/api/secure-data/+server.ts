import { API_SECRET } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ request }) => {
	const auth_token = request.headers.get('authorization');

	if (!auth_token || auth_token !== `Bearer ${API_SECRET}`) {
		throw error(401, 'Unauthorized');
	}

	return json({
		message: 'Secret data retrieved successfully',
		data: {
			items: ['secret1', 'secret2', 'secret3'],
		},
	});
};
