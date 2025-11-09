import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Locator Patterns Testing Scenarios Endpoint
 *
 * Demonstrates vitest-browser-svelte locator strategies
 * and best practices for element selection
 */

const locator_strategies = {
	getByRole: {
		description: 'Preferred for accessibility testing',
		examples: [
			"page.getByRole('button')",
			"page.getByRole('button', { name: 'Sign In' })",
			"page.getByRole('textbox')",
		],
		use_cases: ['Buttons', 'Links', 'Form controls', 'Headings'],
		priority: 1,
	},
	getByLabelText: {
		description: 'Best for form fields with labels',
		examples: [
			"page.getByLabelText('Email Address')",
			"page.getByLabelText('Remember me')",
		],
		use_cases: ['Text inputs', 'Checkboxes', 'Radio buttons'],
		priority: 2,
	},
	getByTestId: {
		description: 'For elements without semantic selectors',
		examples: [
			"page.getByTestId('new-todo-input')",
			"page.getByTestId('modal-close-button')",
		],
		use_cases: ['Complex components', 'Non-semantic elements'],
		priority: 3,
	},
	getByText: {
		description: 'Find by visible text content',
		examples: [
			"page.getByText('Click me')",
			"page.getByText('This field is required')",
		],
		use_cases: ['Error messages', 'Static content', 'Labels'],
		priority: 4,
	},
};

const strict_mode_handling = {
	problem: 'Locators throw if multiple elements match (strict mode)',
	solutions: {
		first: {
			method: '.first()',
			example: 'page.getByRole("button").first()',
			use_when: 'Need the first matching element',
		},
		nth: {
			method: '.nth(index)',
			example: 'page.getByRole("listitem").nth(2)',
			use_when: 'Need specific index',
		},
		last: {
			method: '.last()',
			example: 'page.getByTestId("todo-item").last()',
			use_when: 'Need the last matching element',
		},
	},
	critical_pattern:
		'Always handle multiple matches with .first(), .nth(), or .last()',
};

const assertion_patterns = {
	element_assertions: {
		pattern: 'await expect.element(locator)',
		examples: [
			'await expect.element(button).toBeInTheDocument()',
			'await expect.element(input).toHaveValue("text")',
			'await expect.element(button).toBeDisabled()',
		],
		critical:
			'Always use await expect.element() - never expect() alone',
	},
	interactions: {
		click: 'await button.click()',
		fill: 'await input.fill("value")',
		check: 'await checkbox.click()',
		keyboard: "await userEvent.keyboard('{Enter}')",
	},
};

const anti_patterns = {
	never_use_containers: {
		wrong: 'const { container } = render(Component)',
		correct:
			'const screen = render(Component); screen.getByRole(...)',
		reason: 'Containers bypass strict mode and accessibility checks',
	},
	never_use_element_directly: {
		wrong: 'expect(button).toBeInTheDocument()',
		correct: 'await expect.element(button).toBeInTheDocument()',
		reason: 'Must use expect.element() for proper async handling',
	},
};

export const GET: RequestHandler = async () => {
	return json({
		title: 'Locator Patterns Testing Scenarios',
		description:
			'vitest-browser-svelte locator strategies and best practices',
		source_file: 'All .svelte.test.ts files',
		locator_strategies,
		strict_mode_handling,
		assertion_patterns,
		anti_patterns,
		testing_patterns: {
			critical_patterns: [
				'Always use page.getBy*() locators - never containers',
				'Use await expect.element() for all assertions',
				'Handle multiple elements with .first(), .nth(), .last()',
				'Prefer getByRole() for accessibility',
				'Use getByLabelText() for form fields',
			],
			locator_priority: [
				'1st: getByRole() - best for accessibility',
				'2nd: getByLabelText() - form fields',
				'3rd: getByTestId() - when no semantic option',
				'4th: getByText() - visible content',
			],
		},
		meta: {
			framework: 'vitest-browser-svelte',
			browser: 'Playwright',
			key_concept: 'Semantic, accessible element selection',
		},
	});
};
