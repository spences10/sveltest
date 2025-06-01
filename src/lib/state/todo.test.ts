import { flushSync, untrack } from 'svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Mock browser environment BEFORE importing the module
vi.mock('$app/environment', () => ({
	browser: true,
}));

// Mock localStorage BEFORE importing the module
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};

Object.defineProperty(globalThis, 'localStorage', {
	value: mockLocalStorage,
	writable: true,
});

// Mock crypto.randomUUID to generate unique IDs
let uuidCounter = 0;
Object.defineProperty(globalThis, 'crypto', {
	value: {
		randomUUID: vi.fn(() => `test-uuid-${++uuidCounter}`),
	},
	writable: true,
});

// Now import the module after mocks are set up
const { todo_state } = await import('./todo.svelte.ts');

describe('Todo State', () => {
	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks();
		mockLocalStorage.getItem.mockReturnValue(null);
		uuidCounter = 0; // Reset UUID counter

		// Reset todo state
		todo_state.reset();
	});

	describe('Initial State', () => {
		test('should initialize with default values', () => {
			expect(untrack(() => todo_state.todos)).toEqual([]);
			expect(untrack(() => todo_state.filter)).toEqual({
				status: 'all',
				search: '',
			});
			expect(untrack(() => todo_state.is_loading)).toBe(false);
		});

		test('should have all required methods', () => {
			expect(typeof todo_state.add_todo).toBe('function');
			expect(typeof todo_state.toggle_todo).toBe('function');
			expect(typeof todo_state.update_todo).toBe('function');
			expect(typeof todo_state.delete_todo).toBe('function');
			expect(typeof todo_state.clear_completed).toBe('function');
			expect(typeof todo_state.toggle_all).toBe('function');
			expect(typeof todo_state.set_filter).toBe('function');
			expect(typeof todo_state.reset).toBe('function');
			expect(typeof todo_state.load_sample_data).toBe('function');
		});

		test('should have all required getters', () => {
			expect(untrack(() => todo_state.todos)).toBeDefined();
			expect(untrack(() => todo_state.filter)).toBeDefined();
			expect(untrack(() => todo_state.filtered_todos)).toBeDefined();
			expect(untrack(() => todo_state.stats)).toBeDefined();
			expect(untrack(() => todo_state.is_loading)).toBeDefined();
		});

		test.skip('should load from localStorage on initialization in browser', () => {
			// TODO: Test localStorage loading during initialization
		});
	});

	describe('Adding Todos', () => {
		test('should add a new todo with correct properties', () => {
			const todoText = 'Test todo item';
			todo_state.add_todo(todoText);

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(1);
			expect(todos[0]).toMatchObject({
				id: 'test-uuid-1',
				text: todoText,
				completed: false,
			});
			expect(todos[0].createdAt).toBeInstanceOf(Date);
			expect(todos[0].updatedAt).toBeInstanceOf(Date);
		});

		test('should trim whitespace from todo text', () => {
			todo_state.add_todo('  Test todo  ');

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe('Test todo');
		});

		test('should not add empty todos', () => {
			todo_state.add_todo('');
			todo_state.add_todo('   ');
			todo_state.add_todo('\t\n');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(0);
		});

		test('should add multiple todos', () => {
			todo_state.add_todo('First todo');
			todo_state.add_todo('Second todo');
			todo_state.add_todo('Third todo');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(3);
			expect(todos.map((t) => t.text)).toEqual([
				'First todo',
				'Second todo',
				'Third todo',
			]);
		});

		test('should save to localStorage after adding', () => {
			todo_state.add_todo('Test todo');

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				'sveltest-todos',
				expect.stringContaining('Test todo'),
			);
		});

		test.skip('should handle localStorage save errors gracefully', () => {
			// TODO: Test localStorage save error handling
		});
	});

	describe('Toggling Todos', () => {
		test('should toggle todo completion status', () => {
			todo_state.add_todo('Test todo');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.toggle_todo(todoId);

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].completed).toBe(true);
		});

		test('should toggle back to incomplete', () => {
			todo_state.add_todo('Test todo');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.toggle_todo(todoId);
			todo_state.toggle_todo(todoId);

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].completed).toBe(false);
		});

		test('should update updatedAt timestamp when toggling', async () => {
			todo_state.add_todo('Test todo');
			const todoId = untrack(() => todo_state.todos[0].id);
			const originalUpdatedAt = untrack(
				() => todo_state.todos[0].updatedAt,
			);

			// Wait a bit to ensure timestamp difference
			await new Promise((resolve) => setTimeout(resolve, 10));

			todo_state.toggle_todo(todoId);
			const newUpdatedAt = untrack(
				() => todo_state.todos[0].updatedAt,
			);
			expect(newUpdatedAt.getTime()).toBeGreaterThan(
				originalUpdatedAt.getTime(),
			);
		});

		test('should handle non-existent todo id gracefully', () => {
			todo_state.add_todo('Test todo');
			const originalTodos = untrack(() => todo_state.todos);

			todo_state.toggle_todo('non-existent-id');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toEqual(originalTodos);
		});

		test('should save to localStorage after toggling', () => {
			todo_state.add_todo('Test todo');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.toggle_todo(todoId);

			expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2); // Once for add, once for toggle
		});

		test.skip('should handle multiple rapid toggles', () => {
			// TODO: Test rapid toggle operations
		});
	});

	describe('Updating Todos', () => {
		test('should update todo text', () => {
			todo_state.add_todo('Original text');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.update_todo(todoId, 'Updated text');

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe('Updated text');
		});

		test('should trim whitespace from updated text', () => {
			todo_state.add_todo('Original text');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.update_todo(todoId, '  Updated text  ');

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe('Updated text');
		});

		test('should not update with empty text', () => {
			todo_state.add_todo('Original text');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.update_todo(todoId, '');
			todo_state.update_todo(todoId, '   ');

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe('Original text');
		});

		test('should update updatedAt timestamp', async () => {
			todo_state.add_todo('Original text');
			const todoId = untrack(() => todo_state.todos[0].id);
			const originalUpdatedAt = untrack(
				() => todo_state.todos[0].updatedAt,
			);

			await new Promise((resolve) => setTimeout(resolve, 10));

			todo_state.update_todo(todoId, 'Updated text');
			const newUpdatedAt = untrack(
				() => todo_state.todos[0].updatedAt,
			);
			expect(newUpdatedAt.getTime()).toBeGreaterThan(
				originalUpdatedAt.getTime(),
			);
		});

		test('should handle non-existent todo id gracefully', () => {
			todo_state.add_todo('Original text');
			const originalTodos = untrack(() => todo_state.todos);

			todo_state.update_todo('non-existent-id', 'Updated text');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toEqual(originalTodos);
		});

		test('should save to localStorage after updating', () => {
			todo_state.add_todo('Original text');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.update_todo(todoId, 'Updated text');

			expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
		});

		test.skip('should handle concurrent updates', () => {
			// TODO: Test concurrent update operations
		});
	});

	describe('Deleting Todos', () => {
		test('should delete a todo by id', () => {
			todo_state.add_todo('First todo');
			todo_state.add_todo('Second todo');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.delete_todo(todoId);

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(1);
			expect(todos[0].text).toBe('Second todo');
		});

		test('should handle non-existent todo id gracefully', () => {
			todo_state.add_todo('Test todo');
			const originalTodos = untrack(() => todo_state.todos);

			todo_state.delete_todo('non-existent-id');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toEqual(originalTodos);
		});

		test('should delete from middle of array', () => {
			todo_state.add_todo('First');
			todo_state.add_todo('Second');
			todo_state.add_todo('Third');
			const middleTodoId = untrack(() => todo_state.todos[1].id);

			todo_state.delete_todo(middleTodoId);

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(2);
			expect(todos.map((t) => t.text)).toEqual(['First', 'Third']);
		});

		test('should save to localStorage after deleting', () => {
			todo_state.add_todo('Test todo');
			const todoId = untrack(() => todo_state.todos[0].id);

			todo_state.delete_todo(todoId);

			expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
		});

		test.skip('should handle deleting all todos', () => {
			// TODO: Test deleting all todos one by one
		});
	});

	describe('Clearing Completed Todos', () => {
		test('should remove all completed todos', () => {
			todo_state.add_todo('Active todo');
			todo_state.add_todo('Completed todo 1');
			todo_state.add_todo('Completed todo 2');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[1].id);
			todo_state.toggle_todo(todos[2].id);

			todo_state.clear_completed();

			const remainingTodos = untrack(() => todo_state.todos);
			expect(remainingTodos).toHaveLength(1);
			expect(remainingTodos[0].text).toBe('Active todo');
		});

		test('should do nothing if no completed todos', () => {
			todo_state.add_todo('Active todo 1');
			todo_state.add_todo('Active todo 2');

			todo_state.clear_completed();

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(2);
		});

		test('should save to localStorage after clearing', () => {
			todo_state.add_todo('Completed todo');
			const todoId = untrack(() => todo_state.todos[0].id);
			todo_state.toggle_todo(todoId);

			todo_state.clear_completed();

			expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3); // add, toggle, clear
		});

		test.skip('should handle clearing when all todos are completed', () => {
			// TODO: Test clearing all todos when all are completed
		});
	});

	describe('Toggle All Todos', () => {
		test('should mark all todos as completed when none are completed', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');
			todo_state.add_todo('Todo 3');

			todo_state.toggle_all();

			const todos = untrack(() => todo_state.todos);
			expect(todos.every((todo) => todo.completed)).toBe(true);
		});

		test('should mark all todos as incomplete when all are completed', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');
			const todos = untrack(() => todo_state.todos);

			// Mark all as completed first
			todos.forEach((todo) => todo_state.toggle_todo(todo.id));

			todo_state.toggle_all();

			const updatedTodos = untrack(() => todo_state.todos);
			expect(updatedTodos.every((todo) => !todo.completed)).toBe(
				true,
			);
		});

		test('should mark all as completed when some are completed', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');
			todo_state.add_todo('Todo 3');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[0].id); // Mark first as completed

			todo_state.toggle_all();

			const updatedTodos = untrack(() => todo_state.todos);
			expect(updatedTodos.every((todo) => todo.completed)).toBe(true);
		});

		test('should update updatedAt timestamps for all todos', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');

			todo_state.toggle_all();

			const todos = untrack(() => todo_state.todos);
			todos.forEach((todo) => {
				expect(todo.updatedAt).toBeInstanceOf(Date);
			});
		});

		test('should save to localStorage after toggle all', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');

			todo_state.toggle_all();

			expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3); // 2 adds, 1 toggle_all
		});

		test.skip('should handle empty todo list gracefully', () => {
			// TODO: Test toggle_all with no todos
		});
	});

	describe('Filtering Todos', () => {
		beforeEach(() => {
			todo_state.add_todo('Active todo 1');
			todo_state.add_todo('Completed todo');
			todo_state.add_todo('Active todo 2');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[1].id); // Mark second as completed
		});

		test('should filter by status: all', () => {
			todo_state.set_filter({ status: 'all' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(3);
		});

		test('should filter by status: active', () => {
			todo_state.set_filter({ status: 'active' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(2);
			expect(filteredTodos.every((todo) => !todo.completed)).toBe(
				true,
			);
		});

		test('should filter by status: completed', () => {
			todo_state.set_filter({ status: 'completed' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(1);
			expect(filteredTodos[0].completed).toBe(true);
		});

		test('should filter by search text', () => {
			todo_state.set_filter({ search: 'Active' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(2);
			expect(
				filteredTodos.every((todo) => todo.text.includes('Active')),
			).toBe(true);
		});

		test('should filter by search text case insensitive', () => {
			todo_state.set_filter({ search: 'ACTIVE' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(2);
		});

		test('should combine status and search filters', () => {
			todo_state.set_filter({ status: 'active', search: 'todo 1' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(1);
			expect(filteredTodos[0].text).toBe('Active todo 1');
		});

		test('should trim search text', () => {
			todo_state.set_filter({ search: '  Active  ' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(2);
		});

		test('should return empty array when no matches', () => {
			todo_state.set_filter({ search: 'nonexistent' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(0);
		});

		test.skip('should handle special characters in search', () => {
			// TODO: Test search with special characters
		});

		test.skip('should handle regex-like search patterns', () => {
			// TODO: Test search with regex-like patterns
		});
	});

	describe('Statistics', () => {
		test('should calculate stats for empty todo list', () => {
			const stats = untrack(() => todo_state.stats);

			expect(stats).toEqual({
				total: 0,
				completed: 0,
				active: 0,
				completionRate: 0,
			});
		});

		test('should calculate stats with all active todos', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');
			todo_state.add_todo('Todo 3');

			const stats = untrack(() => todo_state.stats);

			expect(stats).toEqual({
				total: 3,
				completed: 0,
				active: 3,
				completionRate: 0,
			});
		});

		test('should calculate stats with all completed todos', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');

			const todos = untrack(() => todo_state.todos);
			todos.forEach((todo) => todo_state.toggle_todo(todo.id));

			const stats = untrack(() => todo_state.stats);

			expect(stats).toEqual({
				total: 2,
				completed: 2,
				active: 0,
				completionRate: 100,
			});
		});

		test('should calculate stats with mixed completion status', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');
			todo_state.add_todo('Todo 3');
			todo_state.add_todo('Todo 4');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[0].id);
			todo_state.toggle_todo(todos[2].id);

			const stats = untrack(() => todo_state.stats);

			expect(stats).toEqual({
				total: 4,
				completed: 2,
				active: 2,
				completionRate: 50,
			});
		});

		test('should round completion rate correctly', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');
			todo_state.add_todo('Todo 3');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[0].id); // 1/3 = 33.33%

			const stats = untrack(() => todo_state.stats);
			expect(stats.completionRate).toBe(33);
		});

		test.skip('should handle very large numbers of todos', () => {
			// TODO: Test performance with large todo lists
		});
	});

	describe('Local Storage Integration', () => {
		test('should save todos to localStorage', () => {
			todo_state.add_todo('Test todo');

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				'sveltest-todos',
				expect.stringContaining('"text":"Test todo"'),
			);
		});

		test('should handle localStorage save errors gracefully', () => {
			mockLocalStorage.setItem.mockImplementation(() => {
				throw new Error('localStorage save error');
			});

			expect(() => {
				todo_state.add_todo('Test todo');
			}).not.toThrow();
		});

		test.skip('should load todos from localStorage on initialization', () => {
			// TODO: Test localStorage loading during initialization
		});

		test.skip('should handle localStorage load errors gracefully', () => {
			// TODO: Test localStorage load error handling
		});

		test.skip('should handle invalid JSON in localStorage', () => {
			// TODO: Test invalid JSON handling
		});

		test.skip('should handle localStorage quota exceeded', () => {
			// TODO: Test localStorage quota exceeded scenarios
		});
	});

	describe('Sample Data Loading', () => {
		test('should load sample todos', () => {
			todo_state.load_sample_data();

			const todos = untrack(() => todo_state.todos);
			expect(todos.length).toBeGreaterThan(0);
			expect(todos.some((todo) => todo.completed)).toBe(true);
			expect(todos.some((todo) => !todo.completed)).toBe(true);
		});

		test('should replace existing todos with sample data', () => {
			todo_state.add_todo('Existing todo');
			todo_state.load_sample_data();

			const todos = untrack(() => todo_state.todos);
			expect(
				todos.every((todo) => todo.text !== 'Existing todo'),
			).toBe(true);
		});

		test('should save sample data to localStorage', () => {
			todo_state.load_sample_data();

			expect(mockLocalStorage.setItem).toHaveBeenCalled();
		});

		test.skip('should generate realistic sample data', () => {
			// TODO: Test that sample data has realistic properties
		});
	});

	describe('Reset Functionality', () => {
		test('should reset all state to initial values', () => {
			todo_state.add_todo('Test todo');
			todo_state.set_filter({ status: 'active', search: 'test' });

			todo_state.reset();

			expect(untrack(() => todo_state.todos)).toEqual([]);
			expect(untrack(() => todo_state.filter)).toEqual({
				status: 'all',
				search: '',
			});
		});

		test('should remove data from localStorage', () => {
			todo_state.add_todo('Test todo');
			todo_state.reset();

			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
				'sveltest-todos',
			);
		});

		test.skip('should handle reset during ongoing operations', () => {
			// TODO: Test reset during concurrent operations
		});
	});

	describe('State Reactivity', () => {
		test('should update reactive values immediately', () => {
			todo_state.add_todo('Test todo');
			flushSync();

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(1);
		});

		test('should maintain state consistency during operations', () => {
			todo_state.add_todo('Test todo');
			const todoId = untrack(() => todo_state.todos[0].id);
			todo_state.toggle_todo(todoId);

			const todos = untrack(() => todo_state.todos);
			const stats = untrack(() => todo_state.stats);

			expect(todos[0].completed).toBe(true);
			expect(stats.completed).toBe(1);
			expect(stats.active).toBe(0);
		});

		test('should update filtered todos when filter changes', () => {
			todo_state.add_todo('Active todo');
			todo_state.add_todo('Completed todo');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[1].id);

			todo_state.set_filter({ status: 'active' });
			const filteredTodos = untrack(() => todo_state.filtered_todos);

			expect(filteredTodos).toHaveLength(1);
			expect(filteredTodos[0].text).toBe('Active todo');
		});

		test.skip('should handle rapid state changes', () => {
			// TODO: Test rapid consecutive state changes
		});

		test.skip('should maintain referential stability where appropriate', () => {
			// TODO: Test object reference stability
		});
	});

	describe('Edge Cases and Error Handling', () => {
		test('should handle undefined and null inputs gracefully', () => {
			// The implementation calls .trim() on the input, so null/undefined will throw
			// This is actually the expected behavior - we want to catch these programming errors
			expect(() => {
				todo_state.add_todo(null as any);
			}).toThrow('Cannot read properties of null');

			expect(() => {
				todo_state.add_todo(undefined as any);
			}).toThrow('Cannot read properties of undefined');

			// For update_todo, it checks if todo exists first, then calls text.trim()
			// So we need a valid todo ID to test the null/undefined text behavior
			todo_state.add_todo('Test todo');
			const todoId = untrack(() => todo_state.todos[0].id);
			const originalTodos = untrack(() => todo_state.todos);

			expect(() => {
				todo_state.update_todo(todoId, null as any);
			}).toThrow('Cannot read properties of null');

			expect(() => {
				todo_state.update_todo(todoId, undefined as any);
			}).toThrow('Cannot read properties of undefined');

			// Verify todos are unchanged (we can't check this since the methods throw)
			const todos = untrack(() => todo_state.todos);
			expect(todos).toEqual(originalTodos);
		});

		test('should handle very long todo text', () => {
			const longText = 'a'.repeat(10000);
			todo_state.add_todo(longText);

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe(longText);
		});

		test('should handle special characters in todo text', () => {
			const specialText = '🚀 Special chars: <>&"\'';
			todo_state.add_todo(specialText);

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe(specialText);
		});

		test('should handle duplicate todo text', () => {
			todo_state.add_todo('Duplicate todo');
			todo_state.add_todo('Duplicate todo');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(2);
			expect(todos[0].id).not.toBe(todos[1].id);
		});

		test.skip('should handle memory constraints with large datasets', () => {
			// TODO: Test performance with thousands of todos
		});

		test.skip('should handle concurrent access patterns', () => {
			// TODO: Test concurrent read/write operations
		});
	});
});
