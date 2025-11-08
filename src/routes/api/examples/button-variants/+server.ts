import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Button Variants Testing Scenarios Endpoint
 *
 * This endpoint provides button component testing scenario data extracted from
 * the actual button.svelte.test.ts file. It demonstrates component testing patterns
 * for variants, sizes, states, and user interactions.
 *
 * Meta-Example Pattern:
 * - Returns data used in button component tests
 * - Tested with server-side tests using real Request objects
 * - Demonstrates the testing patterns it describes
 */

export interface ButtonVariant {
	variant: 'primary' | 'secondary' | 'outline' | 'ghost';
	expected_class: string;
	description: string;
}

export interface ButtonSize {
	size: 'sm' | 'md' | 'lg';
	expected_class: string | null;
	description: string;
}

export interface ButtonState {
	state: 'enabled' | 'disabled' | 'loading';
	props: Record<string, any>;
	expected_behavior: string;
	accessibility: string[];
}

export interface ButtonTestScenario {
	category: string;
	scenarios: any[];
}

const variants: ButtonVariant[] = [
	{
		variant: 'primary',
		expected_class: 'btn-primary',
		description: 'Primary action button with strong visual emphasis',
	},
	{
		variant: 'secondary',
		expected_class: 'btn-secondary',
		description: 'Secondary action with moderate visual emphasis',
	},
	{
		variant: 'outline',
		expected_class: 'btn-outline',
		description: 'Outlined button for tertiary actions',
	},
	{
		variant: 'ghost',
		expected_class: 'btn-ghost',
		description: 'Minimal styling for subtle actions',
	},
];

const sizes: ButtonSize[] = [
	{
		size: 'sm',
		expected_class: 'btn-sm',
		description: 'Small button for compact layouts',
	},
	{
		size: 'md',
		expected_class: null,
		description: 'Default medium size (no extra class, just "btn")',
	},
	{
		size: 'lg',
		expected_class: 'btn-lg',
		description: 'Large button for prominent actions',
	},
];

const states: ButtonState[] = [
	{
		state: 'enabled',
		props: { disabled: false, loading: false },
		expected_behavior:
			'Button can be clicked and fires onclick events',
		accessibility: ['toBeEnabled()', 'role="button"'],
	},
	{
		state: 'disabled',
		props: { disabled: true },
		expected_behavior:
			'Button cannot be clicked, no onclick events fired',
		accessibility: [
			'toBeDisabled()',
			'aria-disabled="true"',
			'role="button"',
		],
	},
	{
		state: 'loading',
		props: { loading: true },
		expected_behavior:
			'Button shows "Loading..." text and is disabled',
		accessibility: [
			'toBeDisabled()',
			'aria-disabled="true"',
			'role="button"',
			'toHaveTextContent("Loading...")',
		],
	},
];

const test_scenarios: ButtonTestScenario[] = [
	{
		category: 'Basic Rendering',
		scenarios: [
			{
				name: 'Render with text content',
				test_pattern: 'createRawSnippet with HTML element',
				locators: ['getByRole("button")', 'toHaveTextContent'],
				key_learnings: [
					'Use createRawSnippet() for children props',
					'render() must return HTML elements, not plain text',
					'Always use await expect.element()',
				],
			},
			{
				name: 'Render with different button types',
				test_pattern: 'Testing type attribute',
				props: { type: 'submit' },
				assertions: ['toHaveAttribute("type", "submit")'],
			},
		],
	},
	{
		category: 'Variants and Styling',
		scenarios: variants.map((v) => ({
			variant: v.variant,
			expected_class: v.expected_class,
			test_pattern: 'toHaveClass() assertion',
			key_learnings: [
				'CSS classes can be tested in browser environment',
				'Test visual styling through class names',
			],
		})),
	},
	{
		category: 'Sizes',
		scenarios: sizes.map((s) => ({
			size: s.size,
			expected_class: s.expected_class,
			test_pattern:
				s.expected_class === null
					? 'Testing absence of size classes'
					: 'toHaveClass() assertion',
			edge_case:
				s.size === 'md'
					? 'Medium is default - verify no extra classes'
					: null,
		})),
	},
	{
		category: 'User Interactions',
		scenarios: [
			{
				name: 'Handle click events',
				test_pattern: 'vi.fn() mock + real browser click',
				code_example: `const clickHandler = vi.fn();
const screen = render(Button, { onclick: clickHandler });
const button = screen.getByRole('button');
await button.click();
expect(clickHandler).toHaveBeenCalledOnce();`,
				key_learnings: [
					'Real browser click events',
					'Vitest mock functions for event handlers',
					'await button.click() for async interactions',
				],
			},
		],
	},
	{
		category: 'States',
		scenarios: states.map((s) => ({
			state: s.state,
			props: s.props,
			expected_behavior: s.expected_behavior,
			test_pattern: s.accessibility
				.map((a) => a.replace(/\(\)/g, '()'))
				.join(' + '),
			accessibility: s.accessibility,
		})),
	},
	{
		category: 'Accessibility',
		scenarios: [
			{
				name: 'Proper button role',
				locator: 'getByRole("button")',
				key_learnings: [
					'Use semantic role selectors for accessibility',
					'getByRole is preferred over getByTestId',
				],
			},
			{
				name: 'ARIA disabled states',
				states: ['disabled', 'loading'],
				expected: 'aria-disabled="true"',
				test_pattern: 'toHaveAttribute("aria-disabled", "true")',
			},
		],
	},
	{
		category: 'Custom Classes',
		scenarios: [
			{
				name: 'Apply custom class names',
				props: { class_names: 'custom-class another-class' },
				assertions: [
					'toHaveClass("custom-class")',
					'toHaveClass("another-class")',
				],
				key_learnings: [
					'Custom classes are additive',
					'Base classes are maintained',
				],
			},
		],
	},
	{
		category: 'Edge Cases',
		scenarios: [
			{
				name: 'Empty children',
				test_pattern: 'Graceful handling of empty content',
				code_example: `const children = createRawSnippet(() => ({
  render: () => \`<span></span>\`,
  setup: () => {},
}));`,
			},
			{
				name: 'All props combined',
				props: {
					variant: 'outline',
					size: 'lg',
					type: 'submit',
					class_names: 'custom-btn',
				},
				test_pattern: 'Comprehensive test with multiple features',
				assertions: [
					'toHaveAttribute("type", "submit")',
					'toHaveClass("btn-outline")',
					'toHaveClass("btn-lg")',
					'toHaveClass("custom-btn")',
				],
			},
		],
	},
];

const testing_patterns = {
	critical_patterns: [
		'Always use locators (page.getBy*()) - never containers',
		'Use await expect.element() for all assertions',
		'Use createRawSnippet() for Svelte 5 children props',
		'Snippets must return HTML elements, not plain text',
		'Use vi.fn() for mocking event handlers',
		'Real browser interactions with await button.click()',
	],
	common_mistakes: [
		'Using containers instead of locators',
		'Forgetting await on expect.element()',
		'Returning plain text from snippet render()',
		'Not using getByRole for accessibility testing',
		'Clicking disabled/loading buttons (will timeout)',
	],
	best_practices: [
		'Test accessibility with ARIA roles and attributes',
		'Test user-visible behavior over implementation',
		'Use semantic queries (getByRole, getByLabelText)',
		'Test edge cases like empty content',
		'Test combinations of props together',
	],
};

export const GET: RequestHandler = async () => {
	return json({
		title: 'Button Component Testing Scenarios',
		description:
			'Testing patterns for Svelte 5 button components using vitest-browser-svelte',
		source_file: 'src/lib/components/button.svelte.test.ts',
		total_tests: 24, // Actual number from the test file
		variants,
		sizes,
		states,
		test_scenarios,
		testing_patterns,
		meta: {
			component: 'Button',
			test_type: 'Component Testing (Browser)',
			framework: 'vitest-browser-svelte',
			patterns_demonstrated: [
				'Snippet testing',
				'User interactions',
				'Accessibility',
				'CSS class testing',
				'State management',
			],
		},
	});
};
