import { expect, test } from '@playwright/test';

test('searches through the validated remote query', async ({
	page,
}) => {
	await page.goto('/');
	await expect(page.locator(':root')).toHaveAttribute('hydrated');
	await page.keyboard.press('ControlOrMeta+k');

	const dialog = page.getByRole('dialog', {
		name: 'Search',
		exact: true,
	});
	await expect(dialog).toBeVisible();
	await dialog
		.getByRole('searchbox', {
			name: 'Search docs, examples, and components',
		})
		.fill('runes');

	const result = dialog
		.getByRole('button', { name: /Runes Testing/ })
		.first();
	await expect(result).toBeVisible();
	await result.click();
	await expect(page).toHaveURL(/\/docs\/runes-testing$/);
});
