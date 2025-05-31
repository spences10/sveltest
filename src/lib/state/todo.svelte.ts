import { browser } from '$app/environment';

export interface Todo {
	id: string;
	text: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface TodoFilter {
	status: 'all' | 'active' | 'completed';
	search: string;
}

class TodoStore {
	private _todos = $state<Todo[]>([]);
	private _filter = $state<TodoFilter>({ status: 'all', search: '' });
	private _isLoading = $state(false);

	constructor() {
		if (browser) {
			this.load_from_storage();
		}
	}

	get is_loading(): boolean {
		return this._isLoading;
	}

	get todos(): Todo[] {
		return this._todos;
	}

	get filter(): TodoFilter {
		return this._filter;
	}

	get filtered_todos(): Todo[] {
		let filtered = this._todos;

		// Filter by status
		if (this._filter.status === 'active') {
			filtered = filtered.filter((todo) => !todo.completed);
		} else if (this._filter.status === 'completed') {
			filtered = filtered.filter((todo) => todo.completed);
		}

		// Filter by search
		if (this._filter.search.trim()) {
			const searchTerm = this._filter.search.toLowerCase().trim();
			filtered = filtered.filter((todo) =>
				todo.text.toLowerCase().includes(searchTerm),
			);
		}

		return filtered;
	}

	get stats() {
		const total = this._todos.length;
		const completed = this._todos.filter(
			(todo) => todo.completed,
		).length;
		const active = total - completed;
		const completionRate =
			total > 0 ? Math.round((completed / total) * 100) : 0;

		return {
			total,
			completed,
			active,
			completionRate,
		};
	}

	add_todo(text: string): void {
		if (!text.trim()) return;

		const newTodo: Todo = {
			id: crypto.randomUUID(),
			text: text.trim(),
			completed: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this._todos.push(newTodo);
		this.save_to_storage();
	}

	toggle_todo(id: string): void {
		const todo = this._todos.find((t) => t.id === id);
		if (todo) {
			todo.completed = !todo.completed;
			todo.updatedAt = new Date();
			this.save_to_storage();
		}
	}

	update_todo(id: string, text: string): void {
		const todo = this._todos.find((t) => t.id === id);
		if (todo && text.trim()) {
			todo.text = text.trim();
			todo.updatedAt = new Date();
			this.save_to_storage();
		}
	}

	delete_todo(id: string): void {
		const index = this._todos.findIndex((t) => t.id === id);
		if (index > -1) {
			this._todos.splice(index, 1);
			this.save_to_storage();
		}
	}

	clear_completed(): void {
		this._todos = this._todos.filter((todo) => !todo.completed);
		this.save_to_storage();
	}

	toggle_all(): void {
		const allCompleted = this._todos.every((todo) => todo.completed);
		this._todos.forEach((todo) => {
			todo.completed = !allCompleted;
			todo.updatedAt = new Date();
		});
		this.save_to_storage();
	}

	set_filter(filter: Partial<TodoFilter>): void {
		this._filter = { ...this._filter, ...filter };
	}

	private save_to_storage(): void {
		if (browser) {
			try {
				localStorage.setItem(
					'sveltest-todos',
					JSON.stringify(this._todos),
				);
			} catch (error) {
				console.error('Failed to save todos to localStorage:', error);
			}
		}
	}

	private load_from_storage(): void {
		try {
			const stored = localStorage.getItem('sveltest-todos');
			if (stored) {
				const parsed = JSON.parse(stored);
				this._todos = parsed.map((todo: any) => ({
					...todo,
					createdAt: new Date(todo.createdAt),
					updatedAt: new Date(todo.updatedAt),
				}));
			}
		} catch (error) {
			console.error('Failed to load todos from localStorage:', error);
			this._todos = [];
		}
	}

	// For testing purposes
	reset(): void {
		this._todos = [];
		this._filter = { status: 'all', search: '' };
		if (browser) {
			localStorage.removeItem('sveltest-todos');
		}
	}

	// Load sample data for demo
	load_sample_data(): void {
		const sampleTodos: Todo[] = [
			{
				id: crypto.randomUUID(),
				text: 'Write comprehensive unit tests',
				completed: true,
				createdAt: new Date(Date.now() - 86400000), // 1 day ago
				updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
			},
			{
				id: crypto.randomUUID(),
				text: 'Implement integration tests',
				completed: false,
				createdAt: new Date(Date.now() - 43200000), // 12 hours ago
				updatedAt: new Date(Date.now() - 43200000),
			},
			{
				id: crypto.randomUUID(),
				text: 'Set up end-to-end testing',
				completed: false,
				createdAt: new Date(Date.now() - 21600000), // 6 hours ago
				updatedAt: new Date(Date.now() - 21600000),
			},
			{
				id: crypto.randomUUID(),
				text: 'Document testing strategies',
				completed: false,
				createdAt: new Date(Date.now() - 10800000), // 3 hours ago
				updatedAt: new Date(Date.now() - 10800000),
			},
		];

		this._todos = sampleTodos;
		this.save_to_storage();
	}
}

// Export singleton instance
export const todoStore = new TodoStore();
