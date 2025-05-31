<script lang="ts">
	import {
		BarChart,
		Check,
		CheckCircle,
		Clock,
		Filter,
		Plus,
		Trash,
		XCircle,
	} from '$lib/icons';
	import { todo_state } from '$lib/state/todo.svelte.js';

	interface Props {
		title?: string;
		showStats?: boolean;
		enableSampleData?: boolean;
	}

	let {
		title = 'Todo Manager',
		showStats = true,
		enableSampleData = false,
	}: Props = $props();

	let newTodoText = $state('');
	let editingId = $state<string | null>(null);
	let editingText = $state('');

	// Local state for filters that sync with store
	let filterStatus = $state<'all' | 'active' | 'completed'>('all');
	let searchText = $state('');

	// Sync local filter state with store
	$effect(() => {
		todo_state.set_filter({
			status: filterStatus,
			search: searchText,
		});
	});

	function handle_add_todo() {
		if (newTodoText.trim()) {
			todo_state.add_todo(newTodoText);
			newTodoText = '';
		}
	}

	function handle_keydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handle_add_todo();
		}
	}

	function start_editing(id: string, text: string) {
		editingId = id;
		editingText = text;
	}

	function save_edit() {
		if (editingId && editingText.trim()) {
			todo_state.update_todo(editingId, editingText);
		}
		cancel_edit();
	}

	function cancel_edit() {
		editingId = null;
		editingText = '';
	}

	function handle_edit_keydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			save_edit();
		} else if (event.key === 'Escape') {
			cancel_edit();
		}
	}

	function format_date(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	}

	// Focus action for auto-focus on edit input
	function focus(element: HTMLElement) {
		element.focus();
		if (element instanceof HTMLInputElement) {
			element.select();
		}
	}
</script>

<div class="mx-auto w-full max-w-4xl">
	<!-- Header -->
	<div class="mb-8">
		<h2 class="text-base-content mb-2 text-3xl font-bold">{title}</h2>
		{#if showStats}
			<div class="stats bg-base-100 shadow">
				<div class="stat">
					<div class="stat-figure text-primary">
						<BarChart class_names="w-8 h-8" />
					</div>
					<div class="stat-title">Total Tasks</div>
					<div class="stat-value text-primary">
						{todo_state.stats.total}
					</div>
				</div>

				<div class="stat">
					<div class="stat-figure text-success">
						<CheckCircle class_names="w-8 h-8" />
					</div>
					<div class="stat-title">Completed</div>
					<div class="stat-value text-success">
						{todo_state.stats.completed}
					</div>
				</div>

				<div class="stat">
					<div class="stat-figure text-warning">
						<Clock class_names="w-8 h-8" />
					</div>
					<div class="stat-title">Active</div>
					<div class="stat-value text-warning">
						{todo_state.stats.active}
					</div>
				</div>

				<div class="stat">
					<div class="stat-title">Progress</div>
					<div class="stat-value">
						{todo_state.stats.completionRate}%
					</div>
					<div class="stat-desc">
						<progress
							class="progress progress-success w-20"
							value={todo_state.stats.completionRate}
							max="100"
						></progress>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Add Todo Form -->
	<div class="card bg-base-100 mb-6 shadow-xl">
		<div class="card-body">
			<h3 class="card-title">
				<Plus class_names="w-5 h-5" />
				Add New Task
			</h3>
			<div class="space-y-6">
				<!-- Add New Task Section -->
				<div class="form-control w-full">
					<label class="label" for="new-todo">
						<span class="label-text font-medium">
							What needs to be done?
						</span>
					</label>
					<div class="join w-full">
						<input
							bind:value={newTodoText}
							id="new-todo"
							type="text"
							placeholder="Enter a new task..."
							class="input input-bordered join-item flex-1"
							onkeydown={handle_keydown}
							data-testid="new-todo-input"
						/>
						<button
							onclick={handle_add_todo}
							class="btn btn-primary join-item"
							disabled={!newTodoText.trim()}
							data-testid="add-todo-button"
						>
							<Plus class_names="w-4 h-4" />
							Add
						</button>
					</div>
				</div>

				<div class="divider">Filters & Actions</div>

				<!-- Filters Section -->
				<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<!-- Status Filter -->
					<div class="form-control w-full">
						<label class="label" for="status-filter">
							<span class="label-text">Filter by status</span>
						</label>
						<select
							id="status-filter"
							class="select select-bordered w-full"
							bind:value={filterStatus}
							data-testid="status-filter"
						>
							<option value="all">All Tasks</option>
							<option value="active">Active</option>
							<option value="completed">Completed</option>
						</select>
					</div>

					<!-- Search -->
					<div class="form-control w-full">
						<label class="label" for="search-todos">
							<span class="label-text">Search tasks</span>
						</label>
						<label
							class="input input-bordered flex items-center gap-2"
						>
							<Filter class_names="w-4 h-4 opacity-70" />
							<input
								bind:value={searchText}
								id="search-todos"
								type="text"
								class="grow"
								placeholder="Search..."
								data-testid="search-input"
							/>
						</label>
					</div>
				</div>

				<!-- Bulk Actions -->
				<div class="flex flex-wrap gap-2">
					<div class="tooltip" data-tip="Toggle all tasks">
						<button
							onclick={() => todo_state.toggle_all()}
							class="btn btn-sm btn-outline"
							disabled={todo_state.todos.length === 0}
							data-testid="toggle-all-button"
						>
							<Check class_names="w-4 h-4" />
							Toggle All
						</button>
					</div>

					<div class="tooltip" data-tip="Clear completed tasks">
						<button
							onclick={() => todo_state.clear_completed()}
							class="btn btn-sm btn-outline btn-error"
							disabled={todo_state.stats.completed === 0}
							data-testid="clear-completed-button"
						>
							<Trash class_names="w-4 h-4" />
							Clear Completed
						</button>
					</div>

					{#if enableSampleData}
						<div class="tooltip" data-tip="Load sample data">
							<button
								onclick={() => todo_state.load_sample_data()}
								class="btn btn-sm btn-outline btn-info"
								disabled={todo_state.todos.length > 0}
								data-testid="load-sample-button"
							>
								<BarChart class_names="w-4 h-4" />
								Load Sample
							</button>
						</div>
					{/if}

					<div class="tooltip" data-tip="Reset all tasks">
						<button
							onclick={() => todo_state.reset()}
							class="btn btn-sm btn-outline btn-warning"
							disabled={todo_state.todos.length === 0}
							data-testid="reset-button"
						>
							<XCircle class_names="w-4 h-4" />
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Todo List -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h3 class="card-title mb-4">
				<CheckCircle class_names="w-5 h-5" />
				Your Tasks
				<div class="badge badge-neutral">
					{todo_state.filtered_todos.length}
				</div>
			</h3>

			{#if todo_state.filtered_todos.length === 0}
				<div class="alert">
					{#if todo_state.todos.length === 0}
						<div class="w-full text-center">
							<div class="mb-4 text-6xl">📝</div>
							<h4
								class="text-base-content/70 mb-2 text-xl font-semibold"
							>
								No tasks yet
							</h4>
							<p class="text-base-content/50 mb-4">
								Add your first task above to get started!
							</p>
							{#if enableSampleData}
								<button
									class="btn btn-primary btn-sm"
									onclick={() => todo_state.load_sample_data()}
									data-testid="load-sample-empty-btn"
								>
									<Plus class_names="w-4 h-4" />
									Load Sample Data
								</button>
							{/if}
						</div>
					{:else}
						<div class="w-full text-center">
							<div class="mb-4 text-6xl">🔍</div>
							<h4
								class="text-base-content/70 mb-2 text-xl font-semibold"
							>
								No matching tasks
							</h4>
							<p class="text-base-content/50">
								Try adjusting your filters or search terms.
							</p>
						</div>
					{/if}
				</div>
			{:else}
				<div class="space-y-2">
					{#each todo_state.filtered_todos as todo (todo.id)}
						<div
							class="card card-compact bg-base-50 hover:bg-base-100 border-base-300 border transition-all duration-200"
							data-testid="todo-item"
							data-todo-id={todo.id}
						>
							<div class="card-body">
								<div class="flex items-center gap-3">
									<!-- Checkbox -->
									<div
										class="tooltip"
										data-tip={todo.completed
											? 'Mark as incomplete'
											: 'Mark as complete'}
									>
										<input
											type="checkbox"
											class="checkbox checkbox-primary"
											checked={todo.completed}
											onchange={() => todo_state.toggle_todo(todo.id)}
											data-testid="todo-checkbox"
										/>
									</div>

									<!-- Todo Content -->
									<div class="min-w-0 flex-1">
										{#if editingId === todo.id}
											<input
												type="text"
												class="input input-bordered input-sm w-full"
												bind:value={editingText}
												onkeydown={(e) => handle_edit_keydown(e)}
												onblur={save_edit}
												data-testid="edit-todo-input"
												use:focus
											/>
										{:else}
											<button
												type="button"
												class="hover:bg-base-200 w-full rounded p-2 text-left transition-colors"
												onclick={() =>
													start_editing(todo.id, todo.text)}
												data-testid="todo-text"
											>
												<p
													class="font-medium {todo.completed
														? 'text-base-content/50 line-through'
														: 'text-base-content'}"
												>
													{todo.text}
												</p>
												<p class="text-base-content/40 mt-1 text-xs">
													Created: {format_date(todo.createdAt)}
													{#if todo.updatedAt.getTime() !== todo.createdAt.getTime()}
														• Updated: {format_date(todo.updatedAt)}
													{/if}
												</p>
											</button>
										{/if}
									</div>

									<!-- Status Badge -->
									<div
										class="badge {todo.completed
											? 'badge-success'
											: 'badge-warning'} badge-sm"
									>
										{todo.completed ? 'Done' : 'Active'}
									</div>

									<!-- Delete Button -->
									<div class="tooltip" data-tip="Delete task">
										<button
											class="btn btn-ghost btn-sm btn-square text-error hover:bg-error hover:text-error-content"
											onclick={() => todo_state.delete_todo(todo.id)}
											data-testid="delete-todo-button"
										>
											<Trash class_names="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
