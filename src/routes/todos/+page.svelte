<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

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
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-primary h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
									</div>
								</div>
							</div>

							<div class="card-actions justify-end">
								<button
									type="submit"
									class="btn btn-primary btn-lg gap-2 px-8 shadow-lg transition-all duration-200 hover:shadow-xl"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
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
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-info h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
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
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-secondary h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							Quick Actions
						</h3>
						<div class="space-y-2">
							<button
								class="btn btn-ghost btn-sm w-full justify-start gap-2 text-left"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Mark All Complete
							</button>
							<button
								class="btn btn-ghost btn-sm w-full justify-start gap-2 text-left"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Clear Completed
							</button>
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
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-accent h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
											/>
										</svg>
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
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-3 w-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
									Fast
								</div>
								<div class="badge badge-secondary badge-lg gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-3 w-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Reliable
								</div>
								<div class="badge badge-accent badge-lg gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-3 w-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
									Intuitive
								</div>
							</div>
						</div>
					{:else}
						<div class="space-y-3">
							{#each data.todos as todo, index (todo.id)}
								<div class="group relative">
									<div
										class="card from-base-200/50 to-base-200/30 hover:from-base-200/80 hover:to-base-200/60 border-base-300/30 hover:border-base-300/60 border bg-gradient-to-r transition-all duration-300 hover:shadow-lg"
									>
										<div class="card-body p-6">
											<div class="flex items-center justify-between">
												<div class="flex flex-1 items-center gap-4">
													<div class="relative">
														<input
															type="checkbox"
															class="checkbox checkbox-primary checkbox-lg transition-all duration-200 hover:scale-110"
															checked={todo.done}
															onchange={() => {
																console.log('Toggle todo:', todo.id);
															}}
														/>
														{#if todo.done}
															<div
																class="pointer-events-none absolute inset-0 flex items-center justify-center"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="text-primary-content h-4 w-4"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																>
																	<path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		stroke-width="3"
																		d="M5 13l4 4L19 7"
																	/>
																</svg>
															</div>
														{/if}
													</div>

													<div class="min-w-0 flex-1">
														<div class="flex items-center gap-3">
															<span
																class="text-lg font-medium {todo.done
																	? 'text-base-content/50 line-through'
																	: 'text-base-content'} transition-all duration-200"
															>
																{todo.title}
															</span>

															<div class="flex gap-2">
																{#if todo.done}
																	<div
																		class="badge badge-success badge-sm gap-1 font-medium"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class="h-3 w-3"
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M5 13l4 4L19 7"
																			/>
																		</svg>
																		Done
																	</div>
																{:else}
																	<div
																		class="badge badge-warning badge-sm gap-1 font-medium"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class="h-3 w-3"
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				stroke-width="2"
																				d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																		Pending
																	</div>
																{/if}

																<div
																	class="badge badge-ghost badge-sm"
																>
																	#{index + 1}
																</div>
															</div>
														</div>
													</div>
												</div>

												<div
													class="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
												>
													<div
														class="tooltip tooltip-top"
														data-tip="Edit task"
													>
														<button
															class="btn btn-ghost btn-sm btn-square hover:btn-info transition-all duration-200"
															onclick={() => {
																console.log('Edit todo:', todo.id);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-4 w-4"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
																/>
															</svg>
														</button>
													</div>

													<div
														class="tooltip tooltip-top"
														data-tip="Delete task"
													>
														<button
															class="btn btn-ghost btn-sm btn-square hover:btn-error transition-all duration-200"
															onclick={() => {
																console.log('Delete todo:', todo.id);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-4 w-4"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																/>
															</svg>
														</button>
													</div>
												</div>
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
	</div>
</div>
