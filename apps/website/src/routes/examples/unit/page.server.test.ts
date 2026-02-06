import type { ActionFailure } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { actions } from './+page.server';

describe('Unit Examples Calculate Action', () => {
	it('should return correct sum for valid numbers', async () => {
		const form_data = new FormData();
		form_data.append('num1', '3');
		form_data.append('num2', '7');

		const response = await actions.calculate({
			request: new Request('http://localhost', {
				method: 'POST',
				body: form_data,
			}),
		} as any);

		const success_response = response as { result: number };
		expect(success_response.result).toBe(10);
	});

	it('should handle decimal numbers', async () => {
		const form_data = new FormData();
		form_data.append('num1', '1.5');
		form_data.append('num2', '2.5');

		const response = await actions.calculate({
			request: new Request('http://localhost', {
				method: 'POST',
				body: form_data,
			}),
		} as any);

		const success_response = response as { result: number };
		expect(success_response.result).toBe(4);
	});

	it('should fail with 400 for non-numeric input', async () => {
		const form_data = new FormData();
		form_data.append('num1', 'abc');
		form_data.append('num2', '5');

		const response = await actions.calculate({
			request: new Request('http://localhost', {
				method: 'POST',
				body: form_data,
			}),
		} as any);

		const failure_response = response as ActionFailure<{
			error: string;
		}>;
		expect(failure_response.status).toBe(400);
	});

	it('should treat missing fields as zero', async () => {
		const form_data = new FormData();

		const response = await actions.calculate({
			request: new Request('http://localhost', {
				method: 'POST',
				body: form_data,
			}),
		} as any);

		// Number(null) returns 0, so missing fields are treated as 0
		const success_response = response as { result: number };
		expect(success_response.result).toBe(0);
	});
});
