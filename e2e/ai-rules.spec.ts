import { expect, test } from '@playwright/test';

test.describe('AI Rules File Access', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Rules File Links', () => {
		test('should display both Cursor and Windsurf rule cards', async ({
			page,
		}) => {
			// Use .first() to handle multiple elements with same text
			await expect(
				page.getByText('Cursor Rules').first(),
			).toBeVisible();
			await expect(
				page.getByText('Windsurf Rules').first(),
			).toBeVisible();
		});

		test('should have functional links to rules files', async ({
			page,
		}) => {
			const cursor_link = page.getByRole('link', {
				name: /View Cursor Rules/i,
			});
			const windsurf_link = page.getByRole('link', {
				name: /View Windsurf Rules/i,
			});

			await expect(cursor_link).toBeVisible();
			await expect(windsurf_link).toBeVisible();
		});
	});

	test.describe('GitHub Links Verification', () => {
		test('should have correct URLs and attributes', async ({
			page,
		}) => {
			const cursor_link = page.getByRole('link', {
				name: /View Cursor Rules/i,
			});
			const windsurf_link = page.getByRole('link', {
				name: /View Windsurf Rules/i,
			});

			// Verify URLs
			await expect(cursor_link).toHaveAttribute(
				'href',
				'https://github.com/spences10/sveltest/blob/main/.cursor/rules/testing.mdc',
			);
			await expect(windsurf_link).toHaveAttribute(
				'href',
				'https://github.com/spences10/sveltest/blob/main/.windsurf/rules/testing.md',
			);

			// Verify security attributes
			await expect(cursor_link).toHaveAttribute('target', '_blank');
			await expect(cursor_link).toHaveAttribute(
				'rel',
				'noopener noreferrer',
			);
			await expect(windsurf_link).toHaveAttribute('target', '_blank');
			await expect(windsurf_link).toHaveAttribute(
				'rel',
				'noopener noreferrer',
			);
		});
	});
});
