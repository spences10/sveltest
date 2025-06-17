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
import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
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

			const cursor_link = page.getByRole('link', {
				name: /View Cursor Rules/i,
			});
			await expect.element(cursor_link).toBeInTheDocument();
			await expect
				.element(cursor_link)
				.toHaveAttribute(
					'href',
					'https://github.com/spences10/sveltest/blob/main/.cursor/rules/testing.mdc',
				);
		});

		it('should provide Windsurf rules file link', async () => {
			render(Page);

			const windsurf_link = page.getByRole('link', {
				name: /View Windsurf Rules/i,
			});
			await expect.element(windsurf_link).toBeInTheDocument();
			await expect
				.element(windsurf_link)
				.toHaveAttribute(
					'href',
					'https://github.com/spences10/sveltest/blob/main/.windsurf/rules/testing.md',
				);
		});

		it('should open rules links in new tab with security attributes', async () => {
			render(Page);

			const cursor_link = page.getByRole('link', {
				name: /View Cursor Rules/i,
			});
			const windsurf_link = page.getByRole('link', {
				name: /View Windsurf Rules/i,
			});

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
