import { untrack } from 'svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { todo_state, type Todo } from './todo.svelte.ts';

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: true,
}));

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

describe('TodoState', () => {
	beforeEach(() => {
		// Reset state and mocks before each test
		todo_state.reset();
		vi.clearAllMocks();
	});

	describe('Initial State', () => {
		test('should start with empty todos', () => {
			expect(untrack(() => todo_state.todos)).toEqual([]);
		});

		test('should have correct initial stats', () => {
			const stats = untrack(() => todo_state.stats);
			expect(stats.total).toBe(0);
			expect(stats.active).toBe(0);
			expect(stats.completed).toBe(0);
			expect(stats.completionRate).toBe(0);
		});

		test('should have default filter settings', () => {
			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toEqual([]);
		});
	});

	describe('Adding Todos', () => {
		test('should add a new todo', () => {
			todo_state.add_todo('Test todo');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(1);
			expect(todos[0].text).toBe('Test todo');
			expect(todos[0].completed).toBe(false);
			expect(todos[0].id).toBeDefined();
			expect(todos[0].createdAt).toBeInstanceOf(Date);
			expect(todos[0].updatedAt).toBeInstanceOf(Date);
		});

		test('should trim whitespace from todo text', () => {
			todo_state.add_todo('  Trimmed todo  ');

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe('Trimmed todo');
		});

		test('should not add empty todos', () => {
			todo_state.add_todo('');
			todo_state.add_todo('   ');
			todo_state.add_todo('\t\n');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(0);
		});

		test('should save to localStorage when adding todo', () => {
			todo_state.add_todo('Test todo');

			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'sveltest-todos',
				expect.any(String),
			);
		});

		test('should update stats when adding todo', () => {
			todo_state.add_todo('Test todo');

			const stats = untrack(() => todo_state.stats);
			expect(stats.total).toBe(1);
			expect(stats.active).toBe(1);
			expect(stats.completed).toBe(0);
			expect(stats.completionRate).toBe(0);
		});
	});

	describe('Toggling Todos', () => {
		let todoId: string;

		beforeEach(() => {
			todo_state.add_todo('Test todo');
			const todos = untrack(() => todo_state.todos);
			todoId = todos[0].id;
		});

		test('should toggle todo completion', () => {
			todo_state.toggle_todo(todoId);

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].completed).toBe(true);
			expect(todos[0].updatedAt).toBeInstanceOf(Date);
		});

		test('should toggle back to incomplete', () => {
			todo_state.toggle_todo(todoId);
			todo_state.toggle_todo(todoId);

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].completed).toBe(false);
		});

		test('should handle non-existent todo id', () => {
			const initialTodos = untrack(() => todo_state.todos);
			todo_state.toggle_todo('non-existent-id');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toEqual(initialTodos);
		});

		test('should update stats when toggling', () => {
			todo_state.toggle_todo(todoId);

			const stats = untrack(() => todo_state.stats);
			expect(stats.total).toBe(1);
			expect(stats.active).toBe(0);
			expect(stats.completed).toBe(1);
			expect(stats.completionRate).toBe(100);
		});
	});

	describe('Updating Todos', () => {
		let todoId: string;

		beforeEach(() => {
			todo_state.add_todo('Original text');
			const todos = untrack(() => todo_state.todos);
			todoId = todos[0].id;
		});

		test('should update todo text', () => {
			todo_state.update_todo(todoId, 'Updated text');

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe('Updated text');
			expect(todos[0].updatedAt).toBeInstanceOf(Date);
		});

		test('should trim whitespace when updating', () => {
			todo_state.update_todo(todoId, '  Updated text  ');

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe('Updated text');
		});

		test('should not update with empty text', () => {
			todo_state.update_todo(todoId, '');
			todo_state.update_todo(todoId, '   ');

			const todos = untrack(() => todo_state.todos);
			expect(todos[0].text).toBe('Original text');
		});

		test('should handle non-existent todo id', () => {
			const initialTodos = untrack(() => todo_state.todos);
			todo_state.update_todo('non-existent-id', 'New text');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toEqual(initialTodos);
		});
	});

	describe('Deleting Todos', () => {
		let todoId: string;

		beforeEach(() => {
			todo_state.add_todo('Todo to delete');
			const todos = untrack(() => todo_state.todos);
			todoId = todos[0].id;
		});

		test('should delete todo', () => {
			todo_state.delete_todo(todoId);

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(0);
		});

		test('should handle non-existent todo id', () => {
			const initialTodos = untrack(() => todo_state.todos);
			todo_state.delete_todo('non-existent-id');

			const todos = untrack(() => todo_state.todos);
			expect(todos).toEqual(initialTodos);
		});

		test('should update stats when deleting', () => {
			todo_state.delete_todo(todoId);

			const stats = untrack(() => todo_state.stats);
			expect(stats.total).toBe(0);
			expect(stats.active).toBe(0);
			expect(stats.completed).toBe(0);
			expect(stats.completionRate).toBe(0);
		});
	});

	describe('Bulk Operations', () => {
		beforeEach(() => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');
			todo_state.add_todo('Todo 3');
		});

		test('should toggle all todos to completed', () => {
			todo_state.toggle_all();

			const todos = untrack(() => todo_state.todos);
			expect(todos.every((todo) => todo.completed)).toBe(true);
		});

		test('should toggle all todos to incomplete when all are completed', () => {
			// First complete all
			todo_state.toggle_all();
			// Then toggle again
			todo_state.toggle_all();

			const todos = untrack(() => todo_state.todos);
			expect(todos.every((todo) => !todo.completed)).toBe(true);
		});

		test('should clear completed todos', () => {
			const todos = untrack(() => todo_state.todos);
			const firstTodoId = todos[0].id;

			// Complete first todo
			todo_state.toggle_todo(firstTodoId);

			// Clear completed
			todo_state.clear_completed();

			const remainingTodos = untrack(() => todo_state.todos);
			expect(remainingTodos).toHaveLength(2);
			expect(remainingTodos.every((todo) => !todo.completed)).toBe(
				true,
			);
		});

		test('should reset all todos', () => {
			todo_state.reset();

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(0);
			expect(localStorageMock.removeItem).toHaveBeenCalledWith(
				'sveltest-todos',
			);
		});
	});

	describe('Filtering', () => {
		beforeEach(() => {
			todo_state.add_todo('Active todo 1');
			todo_state.add_todo('Active todo 2');
			todo_state.add_todo('Completed todo');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[2].id); // Complete the third todo
		});

		test('should filter by status - all', () => {
			todo_state.set_filter({ status: 'all', search: '' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(3);
		});

		test('should filter by status - active', () => {
			todo_state.set_filter({ status: 'active', search: '' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(2);
			expect(filteredTodos.every((todo) => !todo.completed)).toBe(
				true,
			);
		});

		test('should filter by status - completed', () => {
			todo_state.set_filter({ status: 'completed', search: '' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(1);
			expect(filteredTodos.every((todo) => todo.completed)).toBe(
				true,
			);
		});

		test('should filter by search text', () => {
			todo_state.set_filter({ status: 'all', search: 'Active' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(2);
			expect(
				filteredTodos.every((todo) => todo.text.includes('Active')),
			).toBe(true);
		});

		test('should filter by search text case insensitive', () => {
			todo_state.set_filter({ status: 'all', search: 'active' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(2);
		});

		test('should combine status and search filters', () => {
			todo_state.set_filter({ status: 'active', search: 'Active' });

			const filteredTodos = untrack(() => todo_state.filtered_todos);
			expect(filteredTodos).toHaveLength(2);
			expect(
				filteredTodos.every(
					(todo) => !todo.completed && todo.text.includes('Active'),
				),
			).toBe(true);
		});
	});

	describe('Sample Data', () => {
		test('should load sample data', () => {
			todo_state.load_sample_data();

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(4);
			expect(todos[0].text).toBe('Write comprehensive unit tests');
			expect(todos[0].completed).toBe(true);
			expect(todos[1].text).toBe('Implement integration tests');
			expect(todos[1].completed).toBe(false);
		});

		test('should replace existing todos with sample data', () => {
			todo_state.add_todo('Existing todo');
			todo_state.load_sample_data();

			const todos = untrack(() => todo_state.todos);
			expect(todos).toHaveLength(4);
			expect(
				todos.some((todo) => todo.text === 'Existing todo'),
			).toBe(false);
		});
	});

	describe('LocalStorage Integration', () => {
		test('should load from localStorage on initialization', () => {
			const mockTodos: Todo[] = [
				{
					id: 'test-id',
					text: 'Loaded todo',
					completed: false,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			localStorageMock.getItem.mockReturnValue(
				JSON.stringify(mockTodos),
			);

			// Create a new instance to test loading
			const { TodoState } = iport('./todo.svelte.js');
			const newState = new TodoState();

			expect(localStorageMock.getItem).toHaveBeenCalledWith(
				'sveltest-todos',
			);
		});

		test('should handle invalid localStorage data', () => {
			localStorageMock.getItem.mockReturnValue('invalid json');

			// Should not throw and should start with empty state
			expect(() => {
				const { TodoState } = require('./todo.svelte.js');
				new TodoState();
			}).not.toThrow();
		});

		test('should handle localStorage errors gracefully', () => {
			localStorageMock.setItem.mockImplementation(() => {
				throw new Error('Storage quota exceeded');
			});

			// Should not throw when saving fails
			expect(() => {
				todo_state.add_todo('Test todo');
			}).not.toThrow();
		});
	});

	describe('Stats Calculation', () => {
		test('should calculate stats correctly with mixed todos', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');
			todo_state.add_todo('Todo 3');
			todo_state.add_todo('Todo 4');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[0].id);
			todo_state.toggle_todo(todos[1].id);

			const stats = untrack(() => todo_state.stats);
			expect(stats.total).toBe(4);
			expect(stats.active).toBe(2);
			expect(stats.completed).toBe(2);
			expect(stats.completionRate).toBe(50);
		});

		test('should handle 100% completion rate', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');

			const todos = untrack(() => todo_state.todos);
			todo_state.toggle_todo(todos[0].id);
			todo_state.toggle_todo(todos[1].id);

			const stats = untrack(() => todo_state.stats);
			expect(stats.completionRate).toBe(100);
		});

		test('should handle 0% completion rate', () => {
			todo_state.add_todo('Todo 1');
			todo_state.add_todo('Todo 2');

			const stats = untrack(() => todo_state.stats);
			expect(stats.completionRate).toBe(0);
		});
	});
});
