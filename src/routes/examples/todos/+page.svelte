<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		ArrowLeft,
		ArrowLongRight,
		CheckCircle,
		Document,
		Plus,
		Server,
		XCircle,
	} from '$lib/icons';

	let { data, form } = $props();
</script>

<div class="min-h-screen px-4 py-12">
	<div class="container mx-auto max-w-4xl">
		<!-- Page Header -->
		<div class="mb-12 text-center">
			<div
				class="bg-base-100/80 border-base-300/50 mb-8 inline-flex items-center gap-3 rounded-full border px-6 py-3 shadow-lg backdrop-blur-sm"
			>
				<div
					class="from-success to-success/70 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br"
				>
					<Document class_names="text-success-content h-4 w-4" />
				</div>
				<span
					class="text-base-content/70 text-sm font-medium tracking-wider uppercase"
				>
					Form Actions Testing
				</span>
			</div>

			<h1
				class="from-success via-success/80 to-success/60 mb-4 bg-gradient-to-r bg-clip-text text-5xl font-black text-transparent"
			>
				Form Actions Testing
			</h1>
			<p
				class="text-base-content/70 mx-auto max-w-2xl text-lg leading-relaxed"
			>
				Interactive todo demonstration for testing form actions
				<br />
				<span class="text-base-content/60 text-base"
					>Server-side validation and CRUD operations</span
				>
			</p>
		</div>

		<!-- Todo Management Card -->
		<div
			class="card bg-base-100/80 border-base-300/50 mb-8 border shadow-2xl backdrop-blur-sm"
		>
			<div class="card-body p-8">
				<div class="mb-8 flex items-center gap-4">
					<div
						class="from-success/20 to-success/10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br"
					>
						<CheckCircle class_names="text-success h-8 w-8" />
					</div>
					<div>
						<h2 class="text-3xl font-bold">Todo Manager</h2>
						<p class="text-base-content/70">
							Test form actions and server validation
						</p>
					</div>
				</div>

				<!-- Add Todo Form -->
				<form
					method="POST"
					action="?/add_todo"
					use:enhance
					class="mb-8"
				>
					<div class="form-control">
						<label class="label" for="title">
							<span class="label-text text-base font-medium"
								>Todo Title</span
							>
							<span class="label-text-alt text-base-content/50"
								>What needs to be done?</span
							>
						</label>
						<div class="flex gap-3">
							<div class="relative flex-1">
								<input
									name="title"
									id="title"
									type="text"
									placeholder="Add a new todo..."
									class="input input-bordered input-lg bg-base-200/50 border-base-300 focus:border-success focus:bg-base-100 w-full pl-12 transition-all duration-200"
								/>
								<div
									class="text-base-content/40 absolute top-1/2 left-4 -translate-y-1/2"
								>
									<Document class_names="h-5 w-5" />
								</div>
							</div>
							<button
								type="submit"
								class="btn btn-success btn-lg gap-2 px-6 shadow-lg transition-all duration-200 hover:shadow-xl"
							>
								<Plus class_names="h-5 w-5" />
								Add
							</button>
						</div>
					</div>
				</form>

				<!-- Error Display -->
				{#if form?.error}
					<div class="alert alert-error mb-6 shadow-lg">
						<XCircle class_names="h-6 w-6 shrink-0 stroke-current" />
						<span class="font-medium">{form.error}</span>
					</div>
				{/if}

				<!-- Todo List -->
				<div class="space-y-3">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-xl font-bold">Your Todos</h3>
						<div class="badge badge-neutral">
							{data.todos.length} items
						</div>
					</div>

					{#if data.todos.length === 0}
						<div class="py-12 text-center">
							<div
								class="from-success/20 to-success/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br"
							>
								<CheckCircle class_names="text-success h-10 w-10" />
							</div>
							<h4 class="mb-2 text-lg font-medium">No todos yet</h4>
							<p class="text-base-content/60">
								Add your first todo above to get started!
							</p>
						</div>
					{:else}
						<div
							class="bg-base-200/50 border-base-300/30 rounded-2xl border p-6"
						>
							<ul class="space-y-3">
								{#each data.todos as todo, index}
									<li
										class="todo-item bg-base-100/60 border-base-300/30 hover:bg-base-100/80 flex items-center gap-4 rounded-xl border p-4 transition-all duration-200"
									>
										<div class="flex flex-1 items-center gap-3">
											<div
												class="bg-success/10 flex h-8 w-8 items-center justify-center rounded-lg"
											>
												<span class="text-success text-sm font-medium"
													>#{index + 1}</span
												>
											</div>
											<span class="text-base font-medium"
												>{todo.title}</span
											>
										</div>
										<div class="badge badge-success badge-sm">
											Active
										</div>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Testing Information Cards -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Form Testing Card -->
			<div
				class="card from-primary/10 to-primary/5 border-primary/20 border bg-gradient-to-br shadow-lg backdrop-blur-sm"
			>
				<div class="card-body p-6">
					<div class="mb-4 flex items-center gap-3">
						<div
							class="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl"
						>
							<Document class_names="text-primary h-5 w-5" />
						</div>
						<h3 class="text-xl font-bold">Form Testing</h3>
					</div>
					<p class="text-base-content/70 mb-4">
						This form demonstrates testing patterns for:
					</p>
					<ul class="space-y-2">
						<li class="flex items-center gap-2">
							<div class="bg-primary h-2 w-2 rounded-full"></div>
							<span class="text-sm">Form submissions</span>
						</li>
						<li class="flex items-center gap-2">
							<div class="bg-primary h-2 w-2 rounded-full"></div>
							<span class="text-sm">Server validation</span>
						</li>
						<li class="flex items-center gap-2">
							<div class="bg-primary h-2 w-2 rounded-full"></div>
							<span class="text-sm">Error handling</span>
						</li>
						<li class="flex items-center gap-2">
							<div class="bg-primary h-2 w-2 rounded-full"></div>
							<span class="text-sm">Progressive enhancement</span>
						</li>
					</ul>
				</div>
			</div>

			<!-- Server Actions Card -->
			<div
				class="card from-secondary/10 to-secondary/5 border-secondary/20 border bg-gradient-to-br shadow-lg backdrop-blur-sm"
			>
				<div class="card-body p-6">
					<div class="mb-4 flex items-center gap-3">
						<div
							class="bg-secondary/20 flex h-10 w-10 items-center justify-center rounded-xl"
						>
							<Server class_names="text-secondary h-5 w-5" />
						</div>
						<h3 class="text-xl font-bold">Server Actions</h3>
					</div>
					<p class="text-base-content/70 mb-4">
						Built with SvelteKit features:
					</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge badge-secondary badge-sm">
							Form Actions
						</div>
						<div class="badge badge-primary badge-sm">
							Server-side
						</div>
						<div class="badge badge-accent badge-sm">TypeScript</div>
						<div class="badge badge-info badge-sm">Progressive</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="text-center">
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="/examples" class="btn btn-outline btn-lg gap-2">
					<ArrowLeft class_names="h-5 w-5" />
					Back to Examples
				</a>
				<a href="/todos" class="btn btn-primary btn-lg gap-2">
					<ArrowLongRight class_names="h-5 w-5" />
					Full Todo App
				</a>
			</div>
		</div>
	</div>
</div>
