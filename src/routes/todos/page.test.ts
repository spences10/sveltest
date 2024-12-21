import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Page from './+page.svelte';

describe('Todos Page', () => {
	it('should render todos list', () => {
		const mock_data = {
			todos: [{ id: 1, title: 'Test Todo', done: false }],
		};

		render(Page, { data: mock_data });

		expect(screen.getByText('Test Todo')).toBeTruthy();
		expect(screen.getByPlaceholderText('Add todo')).toBeTruthy();
	});

	it('should render empty state', () => {
		const mock_data = {
			todos: [],
		};

		render(Page, { data: mock_data });

		expect(screen.queryByRole('listitem')).toBeFalsy();
	});
});
