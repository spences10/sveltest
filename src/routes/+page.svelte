<script lang="ts">
</script>

<!-- Hero section with enhanced design -->
<div class="relative overflow-hidden">
	<!-- Background decorative elements -->
	<div
		class="from-primary/10 via-secondary/5 to-accent/10 absolute inset-0 bg-gradient-to-br"
	></div>
	<div
		class="bg-primary/5 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl"
	></div>
	<div
		class="bg-secondary/5 absolute right-1/4 bottom-0 h-96 w-96 rounded-full blur-3xl"
	></div>

	<div class="hero relative flex min-h-screen items-center">
		<div class="hero-content mx-auto max-w-6xl px-4 text-center">
			<div class="space-y-8">
				<!-- Badge -->
				<div
					class="bg-base-100/80 border-base-300/50 inline-flex items-center gap-3 rounded-full border px-6 py-3 shadow-lg backdrop-blur-sm"
				>
					<div
						class="bg-success h-2 w-2 animate-pulse rounded-full"
					></div>
					<span
						class="text-base-content/70 text-sm font-medium tracking-wider uppercase"
					>
						Professional Testing Suite
					</span>
				</div>

				<!-- Main heading -->
				<div class="space-y-4">
					<h1
						class="from-primary via-secondary to-accent bg-gradient-to-r bg-clip-text text-7xl leading-tight font-black text-transparent lg:text-8xl"
					>
						TestSuite Pro
					</h1>
					<p
						class="text-base-content/80 mx-auto max-w-4xl text-2xl leading-relaxed font-light lg:text-3xl"
					>
						A comprehensive collection of testing patterns and
						examples
						<br />
						<span class="text-base-content/60 text-lg"
							>for modern Svelte applications</span
						>
					</p>
				</div>

				<!-- CTA Buttons -->
				<div
					class="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row"
				>
					<a
						href="/examples"
						class="btn btn-primary btn-lg gap-3 px-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
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
						Explore Examples
					</a>
					<a
						href="/todos"
						class="btn btn-outline btn-lg hover:bg-base-100/10 gap-3 px-8 backdrop-blur-sm transition-all duration-300"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
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
						Try Todo Manager
					</a>
				</div>

				<!-- Stats -->
				<div class="pt-12">
					<div
						class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3"
					>
						<div
							class="stat bg-base-100/60 border-base-300/30 rounded-2xl border p-6 shadow-lg backdrop-blur-sm"
						>
							<div class="stat-figure text-primary">
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
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div class="stat-title text-base-content/60">
								Test Coverage
							</div>
							<div
								class="stat-value text-primary text-3xl font-black"
							>
								98%
							</div>
							<div class="stat-desc text-base-content/50">
								Comprehensive testing
							</div>
						</div>

						<div
							class="stat bg-base-100/60 border-base-300/30 rounded-2xl border p-6 shadow-lg backdrop-blur-sm"
						>
							<div class="stat-figure text-secondary">
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
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<div class="stat-title text-base-content/60">
								Performance
							</div>
							<div
								class="stat-value text-secondary text-3xl font-black"
							>
								Fast
							</div>
							<div class="stat-desc text-base-content/50">
								Lightning quick tests
							</div>
						</div>

						<div
							class="stat bg-base-100/60 border-base-300/30 rounded-2xl border p-6 shadow-lg backdrop-blur-sm"
						>
							<div class="stat-figure text-accent">
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
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							</div>
							<div class="stat-title text-base-content/60">
								Developer Experience
							</div>
							<div class="stat-value text-accent text-3xl font-black">
								A+
							</div>
							<div class="stat-desc text-base-content/50">
								Intuitive & powerful
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Feature showcase section -->
<div class="px-4 py-24">
	<div class="container mx-auto max-w-7xl">
		<!-- Section header -->
		<div class="mb-16 text-center">
			<div
				class="bg-primary/10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="text-primary h-4 w-4"
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
				<span class="text-primary text-sm font-medium">Features</span>
			</div>
			<h2
				class="from-base-content to-base-content/70 mb-4 bg-gradient-to-r bg-clip-text text-5xl font-black text-transparent"
			>
				Everything You Need
			</h2>
			<p class="text-base-content/70 mx-auto max-w-2xl text-xl">
				Comprehensive testing tools and examples for building robust
				Svelte applications
			</p>
		</div>

		<!-- Feature grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			<!-- Testing Types Card -->
			<div class="group relative">
				<div
					class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div
							class="from-primary/20 to-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-primary h-8 w-8"
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
						<h3 class="mb-4 text-2xl font-bold">Testing Types</h3>
						<p class="text-base-content/70 mb-6 leading-relaxed">
							Unit, integration, and component testing examples using
							Vitest and Testing Library
						</p>
						<div class="flex flex-wrap gap-2">
							<div class="badge badge-primary badge-sm">
								Unit Tests
							</div>
							<div class="badge badge-secondary badge-sm">
								Integration
							</div>
							<div class="badge badge-accent badge-sm">E2E</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Best Practices Card -->
			<div class="group relative">
				<div
					class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div
							class="from-secondary/20 to-secondary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-secondary h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.414-5.414a2 2 0 00-2.828 0L9 11.171l-2.586-2.586a2 2 0 00-2.828 2.828l4 4a2 2 0 002.828 0l8-8a2 2 0 000-2.828z"
								/>
							</svg>
						</div>
						<h3 class="mb-4 text-2xl font-bold">Best Practices</h3>
						<p class="text-base-content/70 mb-6 leading-relaxed">
							Learn testing best practices and patterns specific to
							Svelte applications
						</p>
						<div class="flex flex-wrap gap-2">
							<div class="badge badge-success badge-sm">Patterns</div>
							<div class="badge badge-info badge-sm">Guidelines</div>
							<div class="badge badge-warning badge-sm">Tips</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Real-world Examples Card -->
			<div class="group relative md:col-span-2 lg:col-span-1">
				<div
					class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div
							class="from-accent/20 to-accent/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-accent h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
								/>
							</svg>
						</div>
						<h3 class="mb-4 text-2xl font-bold">
							Real-world Examples
						</h3>
						<p class="text-base-content/70 mb-6 leading-relaxed">
							Practical testing scenarios you'll encounter in
							production applications
						</p>
						<div class="flex flex-wrap gap-2">
							<div class="badge badge-primary badge-sm">Forms</div>
							<div class="badge badge-secondary badge-sm">APIs</div>
							<div class="badge badge-accent badge-sm">
								Components
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Call to action -->
		<div class="mt-16 text-center">
			<div
				class="card from-primary/10 via-secondary/5 to-accent/10 border-primary/20 mx-auto max-w-4xl border bg-gradient-to-br shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-12">
					<h3 class="mb-4 text-3xl font-bold">
						Ready to Start Testing?
					</h3>
					<p
						class="text-base-content/70 mx-auto mb-8 max-w-2xl text-lg"
					>
						Dive into our comprehensive examples and start building
						more reliable Svelte applications today.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/examples"
							class="btn btn-primary btn-lg gap-2 px-8"
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
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							Get Started
						</a>
						<a
							href="/todos"
							class="btn btn-outline btn-lg gap-2 px-8"
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
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							View Demo
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
