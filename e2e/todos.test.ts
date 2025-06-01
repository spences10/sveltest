import { expect, test } from '@playwright/test';

test.describe('Todos Page E2E', () => {
	test('page loads and displays todo manager', async ({ page }) => {
		await page.goto('/todos');

		// Wait for page to load completely
		await page.waitForLoadState('domcontentloaded');
		await page.waitForLoadState('networkidle');

		// Check basic page structure
		await expect(page.locator('body')).toBeVisible();
		await expect(page.locator('main')).toBeVisible();

		// Check page title
		const title = await page.title();
		expect(title).toContain('Todo Manager');

		// Check that the todo manager component is present with longer timeout
		await expect(page.getByTestId('new-todo-input')).toBeVisible({
			timeout: 10000,
		});
		await expect(page.getByTestId('add-todo-button')).toBeVisible();

		// Check for the main todo manager sections
		await expect(page.getByText('Todo Manager')).toBeVisible();
		await expect(page.getByText('Add New Task')).toBeVisible();
	});

	test('full user workflow - add, complete, filter, delete', async ({
		page,
	}) => {
		await page.goto('/todos');

		// Wait for page to be fully loaded
		await page.waitForLoadState('domcontentloaded');
		await page.waitForLoadState('networkidle');

		// Wait for the todo input to be available
		await expect(page.getByTestId('new-todo-input')).toBeVisible({
			timeout: 10000,
		});

		// Add multiple todos
		const todos = ['Buy groceries', 'Walk the dog', 'Write tests'];

		for (const todoText of todos) {
			await page.fill('[data-testid="new-todo-input"]', todoText);
			await page.click('[data-testid="add-todo-button"]');
			await expect(page.getByText(todoText)).toBeVisible();
		}

		// Complete one todo
		const firstTodoCheckbox = page
			.getByTestId('todo-item')
			.first()
			.getByTestId('todo-checkbox');
		await firstTodoCheckbox.click();

		// Filter by completed
		await page.selectOption(
			'[data-testid="status-filter"]',
			'completed',
		);
		await expect(page.getByText('Buy groceries')).toBeVisible();
		await expect(page.getByText('Walk the dog')).not.toBeVisible();

		// Filter by active
		await page.selectOption(
			'[data-testid="status-filter"]',
			'active',
		);
		await expect(page.getByText('Buy groceries')).not.toBeVisible();
		await expect(page.getByText('Walk the dog')).toBeVisible();

		// Show all
		await page.selectOption('[data-testid="status-filter"]', 'all');
		await expect(page.getByText('Buy groceries')).toBeVisible();
		await expect(page.getByText('Walk the dog')).toBeVisible();

		// Search functionality
		await page.fill('[data-testid="search-input"]', 'groceries');
		await expect(page.getByText('Buy groceries')).toBeVisible();
		await expect(page.getByText('Walk the dog')).not.toBeVisible();

		// Clear search
		await page.fill('[data-testid="search-input"]', '');
		await expect(page.getByText('Walk the dog')).toBeVisible();

		// Delete a todo
		const deleteButton = page
			.getByTestId('delete-todo-button')
			.first();
		await deleteButton.click();
		await expect(page.getByText('Buy groceries')).not.toBeVisible();
	});

	test('data persistence across page reloads', async ({ page }) => {
		await page.goto('/todos');

		// Wait for page to be fully loaded
		await page.waitForLoadState('domcontentloaded');
		await page.waitForLoadState('networkidle');

		// Wait for the todo input to be available
		await expect(page.getByTestId('new-todo-input')).toBeVisible({
			timeout: 10000,
		});

		// Add a todo
		const todoText = 'Persistent todo test';
		await page.fill('[data-testid="new-todo-input"]', todoText);
		await page.click('[data-testid="add-todo-button"]');
		await expect(page.getByText(todoText)).toBeVisible();

		// Reload the page
		await page.reload();
		await page.waitForLoadState('domcontentloaded');
		await page.waitForLoadState('networkidle');

		// Todo should still be there (localStorage persistence)
		await expect(page.getByText(todoText)).toBeVisible({
			timeout: 10000,
		});

		// Clean up
		const deleteButton = page
			.getByTestId('delete-todo-button')
			.first();
		await deleteButton.click();
	});
});
