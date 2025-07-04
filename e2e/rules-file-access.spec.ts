import { expect, test } from '@playwright/test';

test.describe('Rules File Access via Deployed Project', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Rules File Links Visibility', () => {
		test('should display both Cursor and Windsurf rules cards', async ({
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

		test('should have accessible View Rules buttons', async ({
			page,
		}) => {
			const cursor_button = page.getByRole('link', {
				name: /View Cursor Rules/i,
			});
			const windsurf_button = page.getByRole('link', {
				name: /View Windsurf Rules/i,
			});

			await expect(cursor_button).toBeVisible();
			await expect(windsurf_button).toBeVisible();
		});
	});

	test.describe('GitHub Rules File Links', () => {
		test('should have correct URLs for rules files', async ({
			page,
		}) => {
			// Cursor rules file link
			const cursor_link = page.getByRole('link', {
				name: /View Cursor Rules/i,
			});
			await expect(cursor_link).toHaveAttribute(
				'href',
				'https://github.com/spences10/sveltest/blob/main/.cursor/rules/testing.mdc',
			);

			// Windsurf rules file link
			const windsurf_link = page.getByRole('link', {
				name: /View Windsurf Rules/i,
			});
			await expect(windsurf_link).toHaveAttribute(
				'href',
				'https://github.com/spences10/sveltest/blob/main/.windsurf/rules/testing.md',
			);
		});

		test('should open links in new tab with security attributes', async ({
			page,
		}) => {
			const cursor_link = page.getByRole('link', {
				name: /View Cursor Rules/i,
			});
			const windsurf_link = page.getByRole('link', {
				name: /View Windsurf Rules/i,
			});

			// Security and UX attributes for external links
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

	test.describe('User Journey', () => {
		test('should provide clear path to access rules files', async ({
			page,
		}) => {
			// User can see the rules cards
			await expect(
				page.getByText('Cursor Rules').first(),
			).toBeVisible();
			await expect(
				page.getByText('Windsurf Rules').first(),
			).toBeVisible();

			// User can access the links (they exist and are clickable)
			const cursor_link = page.getByRole('link', {
				name: /View Cursor Rules/i,
			});
			const windsurf_link = page.getByRole('link', {
				name: /View Windsurf Rules/i,
			});

			await expect(cursor_link).toBeEnabled();
			await expect(windsurf_link).toBeEnabled();
		});
	});
});
