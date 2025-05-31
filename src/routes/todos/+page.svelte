<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		BarChart,
		Check,
		CheckCircle,
		Clipboard,
		Clock,
		Document,
		Filter,
		Heart,
		LightningBolt,
		Plus,
		Trash,
	} from '$lib/icons';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Todo Manager - TestSuite Pro</title>
	<meta
		name="description"
		content="Interactive todo management with comprehensive testing examples"
	/>
</svelte:head>

<!-- Modern gradient background with glass morphism -->
<div
	class="from-primary/10 via-secondary/5 to-accent/10 min-h-screen bg-gradient-to-br"
>
	<div class="container mx-auto max-w-6xl px-4 py-8">
		<!-- Hero Section with Glass Effect -->
		<div class="hero mb-12">
			<div class="hero-content text-center">
				<div class="max-w-2xl">
					<div class="mb-6">
						<div
							class="bg-base-100/80 inline-flex items-center gap-3 rounded-full px-6 py-3 shadow-lg backdrop-blur-sm"
						>
							<div class="text-3xl">✨</div>
							<span
								class="text-base-content/70 text-sm font-medium tracking-wider uppercase"
							>
								Productivity Suite
							</span>
						</div>
					</div>
					<h1
						class="from-primary to-secondary bg-gradient-to-r bg-clip-text text-6xl font-black text-transparent"
					>
						Todo Nexus
					</h1>
					<p
						class="text-base-content/80 py-6 text-xl leading-relaxed font-light"
					>
						Streamline your workflow with intelligent task management
						<br />
						<span class="text-base-content/60 text-base"
							>Built for modern productivity</span
						>
					</p>
				</div>
			</div>
		</div>

		<!-- Main Content Grid -->
		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Add Todo Form - Enhanced -->
			<div class="lg:col-span-2">
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-8">
						<div class="mb-6 flex items-center gap-3">
							<div
								class="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full"
							>
								<Plus class_names="text-primary h-5 w-5" />
							</div>
							<h2 class="text-2xl font-bold">Create New Task</h2>
						</div>

						<form
							method="POST"
							action="?/add_todo"
							use:enhance
							class="space-y-6"
						>
							<div class="form-control">
								<label class="label" for="title">
									<span class="label-text text-base font-medium"
										>Task Description</span
									>
									<span class="label-text-alt text-base-content/50"
										>What needs to be done?</span
									>
								</label>
								<div class="relative">
									<input
										type="text"
										name="title"
										id="title"
										placeholder="Enter your task description..."
										class="input input-bordered input-lg bg-base-200/50 border-base-300 focus:border-primary focus:bg-base-100 w-full pl-12 transition-all duration-200"
										required
									/>
									<div
										class="text-base-content/40 absolute top-1/2 left-4 -translate-y-1/2"
									>
										<Document class_names="h-5 w-5" />
									</div>
								</div>
							</div>

							<div class="card-actions justify-end">
								<button
									type="submit"
									class="btn btn-primary btn-lg gap-2 px-8 shadow-lg transition-all duration-200 hover:shadow-xl"
								>
									<Plus class_names="h-5 w-5" />
									Add Task
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<!-- Statistics Dashboard -->
			<div class="space-y-6">
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<h3
							class="mb-4 flex items-center gap-2 text-lg font-bold"
						>
							<div
								class="bg-info/20 flex h-8 w-8 items-center justify-center rounded-lg"
							>
								<BarChart class_names="text-info h-4 w-4" />
							</div>
							Analytics
						</h3>

						<div class="space-y-4">
							<div
								class="stat from-primary/10 to-primary/5 border-primary/20 rounded-xl border bg-gradient-to-r p-4"
							>
								<div
									class="stat-title text-base-content/60 text-xs font-medium"
								>
									Total Tasks
								</div>
								<div
									class="stat-value text-primary text-2xl font-black"
								>
									{data.todos.length}
								</div>
								<div class="stat-desc text-base-content/50 text-xs">
									All time
								</div>
							</div>

							<div
								class="stat from-success/10 to-success/5 border-success/20 rounded-xl border bg-gradient-to-r p-4"
							>
								<div
									class="stat-title text-base-content/60 text-xs font-medium"
								>
									Completed
								</div>
								<div
									class="stat-value text-success text-2xl font-black"
								>
									{data.todos.filter((t) => t.done).length}
								</div>
								<div class="stat-desc text-base-content/50 text-xs">
									{data.todos.length > 0
										? Math.round(
												(data.todos.filter((t) => t.done).length /
													data.todos.length) *
													100,
											)
										: 0}% completion rate
								</div>
							</div>

							<div
								class="stat from-warning/10 to-warning/5 border-warning/20 rounded-xl border bg-gradient-to-r p-4"
							>
								<div
									class="stat-title text-base-content/60 text-xs font-medium"
								>
									Pending
								</div>
								<div
									class="stat-value text-warning text-2xl font-black"
								>
									{data.todos.filter((t) => !t.done).length}
								</div>
								<div class="stat-desc text-base-content/50 text-xs">
									Remaining work
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<h3
							class="mb-4 flex items-center gap-2 text-lg font-bold"
						>
							<div
								class="bg-secondary/20 flex h-8 w-8 items-center justify-center rounded-lg"
							>
								<LightningBolt class_names="text-secondary h-4 w-4" />
							</div>
							Quick Actions
						</h3>

						<div class="space-y-3">
							<form
								method="POST"
								action="?/clear_completed"
								use:enhance
							>
								<button
									type="submit"
									class="btn btn-success btn-sm w-full gap-2"
									disabled={data.todos.filter((t) => t.done)
										.length === 0}
								>
									<Check class_names="h-4 w-4" />
									Clear Completed ({data.todos.filter((t) => t.done)
										.length})
								</button>
							</form>

							<form method="POST" action="?/delete_all" use:enhance>
								<button
									type="submit"
									class="btn btn-error btn-sm w-full gap-2"
									disabled={data.todos.length === 0}
								>
									<Trash class_names="h-4 w-4" />
									Delete All ({data.todos.length})
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Todo List - Redesigned -->
		<div class="mt-12">
			<div
				class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<div class="mb-8 flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="bg-accent/20 flex h-10 w-10 items-center justify-center rounded-full"
							>
								<Clipboard class_names="text-accent h-5 w-5" />
							</div>
							<h2 class="text-3xl font-bold">Task Overview</h2>
						</div>

						{#if data.todos.length > 0}
							<div class="flex gap-2">
								<div class="dropdown dropdown-end">
									<div
										tabindex="0"
										role="button"
										class="btn btn-ghost btn-sm gap-2"
									>
										<div
											class="bg-info/20 flex h-8 w-8 items-center justify-center rounded-lg"
										>
											<Filter class_names="text-info h-4 w-4" />
										</div>
										Filter
									</div>
									<ul
										tabindex="0"
										class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
									>
										<li><a>All Tasks</a></li>
										<li><a>Pending Only</a></li>
										<li><a>Completed Only</a></li>
									</ul>
								</div>
							</div>
						{/if}
					</div>

					{#if data.todos.length === 0}
						<div class="py-16 text-center">
							<div class="mb-6">
								<div
									class="from-primary/20 to-secondary/20 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br"
								>
									<div class="text-4xl">🚀</div>
								</div>
							</div>
							<h3 class="mb-2 text-2xl font-bold">
								Ready to Get Started?
							</h3>
							<p
								class="text-base-content/70 mx-auto mb-6 max-w-md text-lg"
							>
								Your productivity journey begins with a single task.
								Add your first todo above and watch your progress
								unfold.
							</p>
							<div class="flex justify-center gap-2">
								<div class="badge badge-primary badge-lg gap-2">
									<LightningBolt class_names="h-3 w-3" />
									Fast
								</div>
								<div class="badge badge-secondary badge-lg gap-2">
									<CheckCircle class_names="h-3 w-3" />
									Reliable
								</div>
								<div class="badge badge-accent badge-lg gap-2">
									<Heart class_names="h-3 w-3" />
									Intuitive
								</div>
							</div>
						</div>
					{:else}
						<div class="space-y-3">
							{#each data.todos as todo (todo.id)}
								<div
									class="group border-base-300/50 bg-base-50/50 hover:border-base-300 hover:bg-base-100/80 relative rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
								>
									<div class="flex items-center gap-4">
										<!-- Toggle Form -->
										<form
											method="POST"
											action="?/toggle_todo"
											use:enhance
											class="flex-shrink-0"
										>
											<input
												type="hidden"
												name="id"
												value={todo.id}
											/>
											<button
												type="submit"
												class="btn btn-circle btn-sm {todo.done
													? 'btn-success'
													: 'btn-outline'} transition-all duration-200"
												aria-label={todo.done
													? 'Mark as incomplete'
													: 'Mark as complete'}
											>
												{#if todo.done}
													<Check class_names="h-4 w-4" />
												{:else}
													<div class="h-4 w-4"></div>
												{/if}
											</button>
										</form>

										<!-- Todo Content -->
										<div class="min-w-0 flex-1">
											<p
												class="text-base-content transition-all duration-200 {todo.done
													? 'line-through opacity-60'
													: ''}"
											>
												{todo.title}
											</p>
											<div
												class="text-base-content/50 mt-1 flex items-center gap-2 text-xs"
											>
												<Clock class_names="h-3 w-3" />
												<span> Created recently </span>
											</div>
										</div>

										<!-- Actions -->
										<div
											class="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
										>
											<form
												method="POST"
												action="?/delete_todo"
												use:enhance
												class="inline"
											>
												<input
													type="hidden"
													name="id"
													value={todo.id}
												/>
												<button
													type="submit"
													class="btn btn-circle btn-sm btn-ghost text-error hover:bg-error/10"
													aria-label="Delete todo"
												>
													<Trash class_names="h-4 w-4" />
												</button>
											</form>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
