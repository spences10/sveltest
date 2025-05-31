<script lang="ts">
	let { data } = $props();
</script>

<div class="min-h-screen px-4 py-12">
	<div class="container mx-auto max-w-6xl">
		<!-- Page Header -->
		<div class="mb-16 text-center">
			<div
				class="bg-base-100/80 border-base-300/50 mb-8 inline-flex items-center gap-3 rounded-full border px-6 py-3 shadow-lg backdrop-blur-sm"
			>
				<div
					class="from-primary to-secondary flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br"
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
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				</div>
				<span
					class="text-base-content/70 text-sm font-medium tracking-wider uppercase"
				>
					Testing Examples
				</span>
			</div>

			<h1
				class="from-primary via-secondary to-accent mb-6 bg-gradient-to-r bg-clip-text text-6xl font-black text-transparent"
			>
				Testing Examples
			</h1>
			<p
				class="text-base-content/70 mx-auto max-w-3xl text-xl leading-relaxed"
			>
				Explore comprehensive testing patterns and real-world examples
				<br />
				<span class="text-base-content/60 text-base"
					>Learn by doing with interactive demonstrations</span
				>
			</p>
		</div>

		<!-- Examples Grid -->
		<div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Unit Testing Card -->
			<div class="group relative">
				<div
					class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div class="mb-6 flex items-center gap-4">
							<div
								class="from-info/20 to-info/10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-info h-8 w-8"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div>
								<h2 class="text-2xl font-bold">Unit Testing</h2>
								<div class="badge badge-info badge-sm mt-1">
									Interactive
								</div>
							</div>
						</div>

						<p class="text-base-content/70 mb-6 leading-relaxed">
							Examples of testing utility functions and business logic
							with comprehensive test coverage and best practices.
						</p>

						<div class="mb-6 flex flex-wrap gap-2">
							<div class="badge badge-outline badge-sm">Vitest</div>
							<div class="badge badge-outline badge-sm">
								Functions
							</div>
							<div class="badge badge-outline badge-sm">Logic</div>
						</div>

						<div class="card-actions justify-end">
							<a
								href="/examples/unit"
								class="btn btn-info gap-2 transition-all duration-200 hover:shadow-lg"
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
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
								Try Examples
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- Form Actions Card -->
			<div class="group relative">
				<div
					class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div class="mb-6 flex items-center gap-4">
							<div
								class="from-success/20 to-success/10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-success h-8 w-8"
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
							<div>
								<h2 class="text-2xl font-bold">Form Actions</h2>
								<div class="badge badge-success badge-sm mt-1">
									Live Demo
								</div>
							</div>
						</div>

						<p class="text-base-content/70 mb-6 leading-relaxed">
							Testing form actions and server-side validation with
							Todos - a complete CRUD application example.
						</p>

						<div class="mb-6 flex flex-wrap gap-2">
							<div class="badge badge-outline badge-sm">
								SvelteKit
							</div>
							<div class="badge badge-outline badge-sm">Forms</div>
							<div class="badge badge-outline badge-sm">
								Validation
							</div>
						</div>

						<div class="card-actions justify-end">
							<a
								href="/examples/todos"
								class="btn btn-success gap-2 transition-all duration-200 hover:shadow-lg"
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
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
								View Examples
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- Component Testing Card -->
			<div class="group relative md:col-span-2">
				<div
					class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div class="mb-6 flex items-center gap-4">
							<div
								class="from-warning/20 to-warning/10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-warning h-8 w-8"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
									/>
								</svg>
							</div>
							<div class="flex-1">
								<h2 class="text-2xl font-bold">Component Testing</h2>
								<div class="badge badge-warning badge-sm mt-1">
									Coming Soon
								</div>
							</div>
							<div class="text-right">
								<div class="text-base-content/60 text-sm">
									Advanced Testing
								</div>
								<div class="text-base-content/50 text-xs">
									Full component lifecycle
								</div>
							</div>
						</div>

						<p class="text-base-content/70 mb-6 leading-relaxed">
							Testing Svelte components with Vitest and Testing
							Library - comprehensive examples covering props, events,
							slots, and component interactions.
						</p>

						<div class="mb-6 flex flex-wrap gap-2">
							<div class="badge badge-outline badge-sm">
								Testing Library
							</div>
							<div class="badge badge-outline badge-sm">
								Components
							</div>
							<div class="badge badge-outline badge-sm">
								Props & Events
							</div>
							<div class="badge badge-outline badge-sm">
								User Interactions
							</div>
						</div>

						<div class="card-actions items-center justify-between">
							<div
								class="text-base-content/60 flex items-center gap-2 text-sm"
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
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Available in next release
							</div>
							<button class="btn btn-outline btn-disabled gap-2">
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
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
								Coming Soon
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Links Section -->
		<div
			class="card from-primary/10 via-secondary/5 to-accent/10 border-primary/20 border bg-gradient-to-br shadow-2xl backdrop-blur-sm"
		>
			<div class="card-body p-8">
				<div class="mb-8 text-center">
					<h3 class="mb-4 text-3xl font-bold">Quick Navigation</h3>
					<p class="text-base-content/70">
						Jump directly to specific testing scenarios
					</p>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					<a
						href="/todos"
						class="btn btn-outline btn-lg hover:bg-primary/10 h-auto flex-col gap-3 p-6 transition-all duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
							/>
						</svg>
						<div class="text-center">
							<div class="font-bold">Full Todo App</div>
							<div class="text-sm opacity-70">
								Complete application
							</div>
						</div>
					</a>

					<a
						href="/examples/unit"
						class="btn btn-outline btn-lg hover:bg-secondary/10 h-auto flex-col gap-3 p-6 transition-all duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						<div class="text-center">
							<div class="font-bold">Calculator Demo</div>
							<div class="text-sm opacity-70">
								Unit testing example
							</div>
						</div>
					</a>

					<a
						href="/examples/todos"
						class="btn btn-outline btn-lg hover:bg-accent/10 h-auto flex-col gap-3 p-6 transition-all duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
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
						<div class="text-center">
							<div class="font-bold">Form Testing</div>
							<div class="text-sm opacity-70">
								Server actions demo
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
