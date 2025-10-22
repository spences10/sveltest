// BEFORE: @testing-library/svelte
/*
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});
});
*/

// AFTER: vitest-browser-svelte
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page);

		const heading = page.getByText('Sveltest').first();
		await expect.element(heading).toBeInTheDocument();
	});

	describe('AI Rules File Access', () => {
		it('should provide Cursor rules file link', async () => {
			render(Page);

			// Find the Cursor Rules heading first, then find the link nearby
			const cursor_heading = page.getByText('Cursor Rules').first();
			await expect.element(cursor_heading).toBeInTheDocument();

			// Get all links and check that one has the correct href
			const all_links = page.getByRole('link');
			const cursor_link_exists = await all_links
				.filter({ hasText: 'View Rules' })
				.first();

			await expect.element(cursor_link_exists).toBeInTheDocument();
		});

		it('should provide Windsurf rules file link', async () => {
			render(Page);

			// Find the Windsurf Rules heading first
			const windsurf_heading = page
				.getByText('Windsurf Rules')
				.first();
			await expect.element(windsurf_heading).toBeInTheDocument();

			// Get all links and check that one has the correct href
			const all_links = page.getByRole('link');
			const windsurf_link_exists = await all_links
				.filter({ hasText: 'View Rules' })
				.nth(1);

			await expect.element(windsurf_link_exists).toBeInTheDocument();
		});

		it('should open rules links in new tab with security attributes', async () => {
			render(Page);

			// Get the first two "View Rules" links (Cursor and Windsurf)
			const view_rules_links = page
				.getByRole('link')
				.filter({ hasText: 'View Rules' });

			const cursor_link = view_rules_links.first();
			const windsurf_link = view_rules_links.nth(1);

			await expect
				.element(cursor_link)
				.toHaveAttribute('target', '_blank');
			await expect
				.element(cursor_link)
				.toHaveAttribute('rel', 'noopener noreferrer');

			await expect
				.element(windsurf_link)
				.toHaveAttribute('target', '_blank');
			await expect
				.element(windsurf_link)
				.toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('should display AI rules section content', async () => {
			render(Page);

			await expect
				.element(page.getByText('Cursor Rules').first())
				.toBeInTheDocument();
			await expect
				.element(page.getByText('Windsurf Rules').first())
				.toBeInTheDocument();
			await expect
				.element(
					page.getByText(
						/Pre-configured AI assistant rules for Cursor/i,
					),
				)
				.toBeInTheDocument();
			await expect
				.element(
					page.getByText(
						/Modern rule system with trigger-based activation for Windsurf/i,
					),
				)
				.toBeInTheDocument();
		});
	});
});
