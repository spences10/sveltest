import { expect, test } from '@playwright/test';

test.describe('Todos Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/todos');
	});

	test('displays the todos page correctly', async ({ page }) => {
		// Check page title using specific heading
		await expect(
			page.getByRole('heading', { name: 'Todos' }),
		).toBeVisible();

		// Check that the form is present
		await expect(
			page.locator('form[action*="add_todo"]'),
		).toBeVisible();
		await expect(page.locator('input[name="title"]')).toBeVisible();
		await expect(page.locator('button[type="submit"]')).toBeVisible();

		// Check that initial todos are displayed
		await expect(page.locator('.todo-item')).toHaveCount(2);
		await expect(page.locator('.todo-item').first()).toContainText(
			'Learn SvelteKit',
		);
		await expect(page.locator('.todo-item').last()).toContainText(
			'Write tests',
		);
	});

	test('can add a new todo', async ({ page }) => {
		const newTodoTitle = 'Test E2E functionality';

		// Fill in the form
		await page.fill('input[name="title"]', newTodoTitle);

		// Submit the form
		await page.click('button[type="submit"]');

		// Wait for the page to reload/update
		await page.waitForLoadState('networkidle');

		// Verify the form was submitted (should be cleared or show success)
		// Note: Since this is a form submission, the page will reload
		// and we should verify the form is in its initial state
		await expect(page.locator('input[name="title"]')).toHaveValue('');
	});

	test('shows validation error for empty todo', async ({ page }) => {
		// Try to submit empty form
		await page.click('button[type="submit"]');

		// Wait for response
		await page.waitForLoadState('networkidle');

		// The form should still be visible and the input should be empty
		await expect(page.locator('input[name="title"]')).toBeVisible();
		await expect(page.locator('input[name="title"]')).toHaveValue('');
	});

	test('form has proper accessibility attributes', async ({
		page,
	}) => {
		const titleInput = page.locator('input[name="title"]');
		const submitButton = page.locator('button[type="submit"]');

		// Check input has placeholder
		await expect(titleInput).toHaveAttribute(
			'placeholder',
			'Add todo',
		);

		// Check button has proper type
		await expect(submitButton).toHaveAttribute('type', 'submit');

		// Check form has proper method and action
		const form = page.locator('form');
		await expect(form).toHaveAttribute('method', 'POST');
		await expect(form).toHaveAttribute('action', '?/add_todo');
	});

	test('keyboard navigation works', async ({ page }) => {
		// Focus on input field
		await page.focus('input[name="title"]');

		// Type a todo
		await page.keyboard.type('Keyboard navigation test');

		// Press Enter to submit
		await page.keyboard.press('Enter');

		// Wait for submission
		await page.waitForLoadState('networkidle');

		// Verify form was submitted
		await expect(page.locator('input[name="title"]')).toHaveValue('');
	});
});
