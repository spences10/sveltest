import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Testing Scenarios API - Index Endpoint
 *
 * This endpoint returns a catalog of all available testing scenario endpoints.
 * Each scenario demonstrates specific testing patterns used in the Sveltest project.
 *
 * Meta-Example Pattern:
 * - This endpoint provides test scenario data
 * - It's tested using the same server-side testing patterns it represents
 * - Creates a self-referential example that won't go out of sync
 */

export interface TestingScenario {
	endpoint: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	category: string;
	description: string;
	patterns: string[];
	example_test_file: string;
}

const scenarios: TestingScenario[] = [
	{
		endpoint: '/api/examples/button-variants',
		method: 'GET',
		category: 'Component Testing',
		description:
			'Button component testing scenarios with variants, sizes, and states',
		patterns: [
			'Component variants testing',
			'Size prop testing',
			'Disabled and loading states',
			'Click event handling',
			'Accessibility (ARIA attributes)',
			'CSS class application',
		],
		example_test_file: 'src/lib/components/button.svelte.test.ts',
	},
	{
		endpoint: '/api/examples/form-validation',
		method: 'POST',
		category: 'Form Testing',
		description:
			'Form validation patterns including email, password, and custom validation',
		patterns: [
			'Email validation',
			'Password strength rules',
			'Required field validation',
			'Form validation lifecycle',
			'Error message display',
			'Keyboard navigation (Enter to submit)',
		],
		example_test_file: 'src/lib/components/login-form.svelte.test.ts',
	},
	{
		endpoint: '/api/examples/modal-states',
		method: 'GET',
		category: 'Component Testing',
		description:
			'Modal component state management and user interaction patterns',
		patterns: [
			'Open/close state testing',
			'Size variants (sm, md, lg, xl)',
			'Backdrop click handling',
			'Escape key handling',
			'Focus management',
			'ARIA roles and accessibility',
		],
		example_test_file: 'src/lib/components/modal.svelte.test.ts',
	},
	{
		endpoint: '/api/examples/crud-patterns',
		method: 'GET',
		category: 'State Management',
		description:
			'CRUD operations testing patterns with Svelte 5 runes ($state, $derived)',
		patterns: [
			'Create operations',
			'Read/filter operations',
			'Update operations',
			'Delete operations',
			'Bulk actions (toggle all, clear completed)',
			'Using untrack() for $derived values',
			'LocalStorage persistence',
		],
		example_test_file: 'src/lib/state/todo.test.ts',
	},
	{
		endpoint: '/api/examples/locator-patterns',
		method: 'GET',
		category: 'Testing Patterns',
		description:
			'vitest-browser-svelte locator strategies and best practices',
		patterns: [
			'Using page.getByRole() for accessibility',
			'Using page.getByTestId() for specific elements',
			'Using page.getByText() for content',
			'Using page.getByLabelText() for form fields',
			'Handling strict mode with .first(), .nth(), .last()',
			'await expect.element() syntax',
		],
		example_test_file: 'src/lib/components/login-form.svelte.test.ts',
	},
	{
		endpoint: '/api/examples/authentication',
		method: 'POST',
		category: 'API Testing',
		description:
			'Authentication and authorization testing with Bearer tokens',
		patterns: [
			'Valid Bearer token validation',
			'Invalid token handling (401 errors)',
			'Missing authorization headers',
			'Malformed token formats',
			'Case-sensitive token comparison',
			'Timing attack prevention',
			'Real Request object usage',
		],
		example_test_file: 'src/routes/api/secure-data/server.test.ts',
	},
	{
		endpoint: '/api/examples/runes-testing',
		method: 'GET',
		category: 'Svelte 5 Patterns',
		description:
			'Svelte 5 runes testing patterns ($state, $derived, $effect)',
		patterns: [
			'Using untrack() to read $derived values in tests',
			'Using flushSync() for immediate updates',
			'Testing reactive state changes',
			'Mocking browser environment',
			'Testing $state mutations',
			'Testing $derived computations',
		],
		example_test_file: 'src/lib/state/todo.test.ts',
	},
];

export const GET: RequestHandler = async () => {
	return json({
		title: 'Sveltest Testing Scenarios',
		description:
			'A catalog of testing scenario endpoints demonstrating real-world testing patterns for Svelte 5 applications using vitest-browser-svelte',
		total_scenarios: scenarios.length,
		categories: [...new Set(scenarios.map((s) => s.category))].sort(),
		scenarios,
		meta: {
			project: 'Sveltest',
			testing_framework: 'vitest-browser-svelte',
			svelte_version: '5',
			pattern: 'meta-example',
			purpose:
				'These endpoints serve as both documentation and live examples of testing patterns',
		},
	});
};
