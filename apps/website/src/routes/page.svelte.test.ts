import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-svelte';
import { page } from 'vite-plus/test/browser';
import Page from './+page.svelte';

const skill_url =
	'https://github.com/spences10/sveltest/tree/main/.agents/skills/svelte-testing';
const devin_setup_url =
	'https://github.com/spences10/sveltest/blob/main/.agents/skills/svelte-testing/README.md';

describe('/+page.svelte', () => {
	it('renders the main heading', async () => {
		await render(Page);
		await expect
			.element(
				page.getByRole('heading', {
					level: 1,
					name: 'Sveltest',
					exact: true,
				}),
			)
			.toBeInTheDocument();
	});

	it('keeps the Cursor rules link', async () => {
		await render(Page);
		await expect
			.element(page.getByRole('link', { name: /View Rules/ }))
			.toHaveAttribute(
				'href',
				'https://github.com/spences10/sveltest/blob/main/.cursor/rules/testing.mdc',
			);
	});

	it('points Devin Desktop users to shared skill setup', async () => {
		await render(Page);
		await expect
			.element(page.getByRole('heading', { name: 'Devin Desktop' }))
			.toBeVisible();
		await expect
			.element(page.getByRole('link', { name: /View Devin Setup/ }))
			.toHaveAttribute('href', devin_setup_url);
		await expect
			.element(page.getByText(/Formerly Windsurf/))
			.toBeVisible();
		await expect
			.element(page.getByRole('heading', { name: 'Windsurf Rules' }))
			.not.toBeInTheDocument();
	});

	it('presents the testing skill as shared rather than Claude-only', async () => {
		await render(Page);
		await expect
			.element(
				page.getByRole('heading', { name: 'Shared Testing Skill' }),
			)
			.toBeVisible();
		await expect
			.element(page.getByRole('link', { name: /View Skill/ }))
			.toHaveAttribute('href', skill_url);
	});

	it.each(['View Rules', 'View Devin Setup', 'View Skill'])(
		'opens %s with safe external-link attributes',
		async (link_name) => {
			await render(Page);
			const link = page.getByRole('link', {
				name: new RegExp(link_name),
			});
			await expect.element(link).toHaveAttribute('target', '_blank');
			await expect
				.element(link)
				.toHaveAttribute('rel', 'noopener noreferrer');
		},
	);
});
