import { expect, test } from '@playwright/test';

test.describe('AI Rules and Shared Skills', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('shows Cursor rules and Devin Desktop skill setup', async ({
		page,
	}) => {
		await expect(
			page.getByRole('heading', { name: 'Cursor Rules' }),
		).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Devin Desktop' }),
		).toBeVisible();
		await expect(page.getByText(/Formerly Windsurf/)).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Windsurf Rules' }),
		).toHaveCount(0);
	});

	test('links Devin setup and the shared skill to the same source directory', async ({
		page,
	}) => {
		const devin_link = page.getByRole('link', {
			name: /View Devin Setup/,
		});
		const skill_link = page.getByRole('link', { name: /View Skill/ });

		await expect(devin_link).toHaveAttribute(
			'href',
			'https://github.com/spences10/sveltest/blob/main/.agents/skills/svelte-testing/README.md',
		);
		await expect(skill_link).toHaveAttribute(
			'href',
			'https://github.com/spences10/sveltest/tree/main/.agents/skills/svelte-testing',
		);
	});

	test('keeps Cursor rules and safe external links', async ({
		page,
	}) => {
		await expect(
			page.getByRole('link', { name: /View Rules/ }),
		).toHaveAttribute(
			'href',
			'https://github.com/spences10/sveltest/blob/main/.cursor/rules/testing.mdc',
		);
		for (const link_name of [
			'View Rules',
			'View Devin Setup',
			'View Skill',
		]) {
			const link = page.getByRole('link', {
				name: new RegExp(link_name),
			});
			await expect(link).toBeVisible();
			await expect(link).toHaveAttribute('target', '_blank');
			await expect(link).toHaveAttribute(
				'rel',
				'noopener noreferrer',
			);
		}
	});
});
