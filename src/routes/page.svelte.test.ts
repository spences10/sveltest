// BEFORE: @testing-library/svelte
/*
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	test('should render h1', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});
});
*/

// AFTER: vitest-browser-svelte
import { page } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	test('should render h1', async () => {
		render(Page);

		const heading = page.getByText('Sveltest').first();
		await expect.element(heading).toBeInTheDocument();
	});
});
