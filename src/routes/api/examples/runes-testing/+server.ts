import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Svelte 5 Runes Testing Scenarios Endpoint
 *
 * Demonstrates testing patterns for Svelte 5 runes:
 * $state, $derived, $effect - from todo.test.ts
 */

const runes_patterns = {
	state_rune: {
		rune: '$state',
		description: 'Reactive state management',
		testing_pattern: {
			setup: 'Mock before importing module',
			mutation: 'Call state mutation functions',
			verification: 'Use untrack() to read values',
			example: `todo_state.add_todo('New task');
flushSync(); // Ensure immediate update
const todos = untrack(() => todo_state.todos);
expect(todos).toHaveLength(1);`,
		},
		critical_patterns: [
			'Use flushSync() for immediate updates',
			'Always use untrack() to read $state in tests',
			'Mock environment before importing',
		],
	},
	derived_rune: {
		rune: '$derived',
		description: 'Computed reactive values',
		testing_pattern: {
			problem: 'Cannot read $derived values directly in tests',
			solution: 'Always use untrack()',
			example: `// ❌ WRONG: const stats = todo_state.stats;
// ✅ CORRECT:
const stats = untrack(() => todo_state.stats);
expect(stats.total).toBe(5);`,
		},
		critical_patterns: [
			'MUST use untrack() for $derived',
			'Test that derived values update reactively',
			'Verify computed calculations are correct',
		],
	},
	effect_rune: {
		rune: '$effect',
		description: 'Side effects and lifecycle',
		testing_pattern: {
			challenge: 'Effects run in component context',
			approach: 'Test effects indirectly through state changes',
			example: 'Test localStorage saves after mutations',
		},
	},
};

const testing_utilities = {
	flushSync: {
		import: "import { flushSync } from 'svelte';",
		purpose: 'Force immediate synchronous state updates',
		usage: `todo_state.add_todo('Task');
flushSync(); // Updates happen immediately
const todos = untrack(() => todo_state.todos);`,
	},
	untrack: {
		import: "import { untrack } from 'svelte';",
		purpose: 'Read reactive values without tracking',
		critical: 'Required for reading $derived values in tests',
		usage: `const filtered = untrack(() => todo_state.filtered_todos);
const stats = untrack(() => todo_state.stats);`,
	},
};

const mocking_patterns = {
	browser_environment: {
		pattern: 'Mock $app/environment before import',
		example: `vi.mock('$app/environment', () => ({
  browser: true,
}));`,
	},
	localStorage: {
		pattern: 'Mock localStorage globally',
		example: `const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
});`,
	},
	crypto_uuid: {
		pattern: 'Mock crypto.randomUUID for predictable IDs',
		example: `Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: vi.fn(() => 'test-uuid-1') },
});`,
	},
};

const common_pitfalls = {
	forgetting_untrack: {
		error: 'Reading $derived without untrack()',
		solution: 'Always wrap in untrack(() => ...)',
	},
	importing_before_mocks: {
		error: 'Importing module before setting up mocks',
		solution: 'Set up all mocks first, then import',
		example: `// ❌ WRONG order
import { todo_state } from './todo.svelte';
vi.mock('$app/environment');

// ✅ CORRECT order
vi.mock('$app/environment');
const { todo_state } = await import('./todo.svelte');`,
	},
	expecting_immediate_updates: {
		error: 'State not updated immediately',
		solution: 'Use flushSync() for synchronous updates',
	},
};

export const GET: RequestHandler = async () => {
	return json({
		title: 'Svelte 5 Runes Testing Scenarios',
		description:
			'Testing patterns for $state, $derived, and $effect runes',
		source_file: 'src/lib/state/todo.test.ts',
		runes_patterns,
		testing_utilities,
		mocking_patterns,
		common_pitfalls,
		testing_patterns: {
			critical_patterns: [
				'Always use untrack() to read $derived values',
				'Use flushSync() for immediate state updates',
				'Mock environment BEFORE importing module',
				'Mock localStorage, crypto before imports',
				'Reset state in beforeEach hooks',
			],
			anti_patterns: [
				'Reading $derived without untrack()',
				'Importing before mocking',
				'Not using flushSync() for immediate updates',
			],
		},
		meta: {
			svelte_version: '5',
			key_runes: ['$state', '$derived', '$effect'],
			essential_imports: ['flushSync', 'untrack'],
		},
	});
};
