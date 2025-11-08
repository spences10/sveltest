import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * CRUD Patterns Testing Scenarios Endpoint
 *
 * Demonstrates CRUD operations testing with Svelte 5 runes
 * from todo.test.ts - state management patterns
 */

const crud_operations = {
	create: {
		operation: 'add_todo(text)',
		pattern: 'Test adding new items to $state',
		test_cases: [
			{ input: 'New task', expected: 'Todo added to array' },
			{ input: '  trimmed  ', expected: 'Whitespace trimmed' },
			{ input: '', expected: 'Empty todos rejected' },
		],
		critical_pattern: 'Always trim and validate input',
	},
	read: {
		operation: 'filtered_todos ($derived)',
		pattern: 'Use untrack() to read $derived values',
		test_example: `const todos = untrack(() => todo_state.todos);
expect(todos).toHaveLength(3);`,
		critical_pattern: 'Must use untrack() for $derived in tests',
	},
	update: {
		operation: 'update_todo(id, text)',
		pattern: 'Test state mutations and timestamp updates',
		test_cases: [
			'Update text content',
			'Trim whitespace',
			'Reject empty updates',
			'Update updatedAt timestamp',
		],
	},
	delete: {
		operation: 'delete_todo(id)',
		pattern: 'Test item removal from array',
		test_cases: [
			'Delete by ID',
			'Handle non-existent IDs gracefully',
			'Delete from middle of array',
		],
	},
	bulk_operations: {
		toggle_all: 'Mark all complete/incomplete',
		clear_completed: 'Remove all completed items',
		set_filter: 'Filter by status and search text',
	},
};

const svelte5_patterns = {
	state_testing: {
		pattern: '$state mutations',
		example: `todo_state.add_todo('Test');
flushSync(); // Ensure state updates immediately
const todos = untrack(() => todo_state.todos);`,
	},
	derived_testing: {
		pattern: '$derived computations',
		critical: 'Always use untrack() to read $derived values',
		example: `const stats = untrack(() => todo_state.stats);
expect(stats.total).toBe(5);`,
	},
	reactivity_testing: {
		pattern: 'Test reactive updates',
		tools: ['flushSync()', 'untrack()'],
	},
};

const testing_patterns = {
	critical_patterns: [
		'Use untrack() for all $derived value reads',
		'Use flushSync() for immediate state updates',
		'Mock localStorage before importing module',
		'Mock crypto.randomUUID for predictable IDs',
		'Reset state in beforeEach hooks',
	],
	persistence_patterns: [
		'Mock localStorage.setItem and getItem',
		'Test save operations after mutations',
		'Test error handling for storage failures',
	],
	best_practices: [
		'Test CRUD operations individually',
		'Test edge cases (empty, duplicates, etc.)',
		'Test derived computations update correctly',
		'Test bulk operations',
		'Verify timestamps update on changes',
	],
};

export const GET: RequestHandler = async () => {
	return json({
		title: 'CRUD Patterns Testing Scenarios',
		description:
			'Testing CRUD operations and state management with Svelte 5 runes',
		source_file: 'src/lib/state/todo.test.ts',
		crud_operations,
		svelte5_patterns,
		testing_patterns,
		meta: {
			test_type: 'State Management Testing',
			framework: 'Svelte 5 Runes',
			key_concepts: [
				'$state',
				'$derived',
				'untrack()',
				'flushSync()',
			],
		},
	});
};
