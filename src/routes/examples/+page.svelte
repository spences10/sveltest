<script lang="ts">
	import {
		Arrow,
		BarChart,
		BookOpen,
		Calculator,
		CheckCircle,
		Code,
		Document,
		Eye,
		LightningBolt,
		Server,
		Settings,
	} from '$lib/icons';
</script>

<svelte:head>
	<title>Testing Examples - Sveltest</title>
	<meta
		name="description"
		content="Comprehensive testing examples and patterns for Svelte applications"
	/>
</svelte:head>

<!-- Enhanced Examples Page -->
<div class="min-h-screen px-4 py-8">
	<div class="container mx-auto max-w-7xl">
		<!-- Hero Section -->
		<div class="mb-16 text-center">
			<div
				class="bg-primary/10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
			>
				<LightningBolt class_names="text-primary h-4 w-4" />
				<span class="text-primary text-sm font-medium">
					Testing Examples
				</span>
			</div>
			<h1
				class="from-primary via-secondary to-accent mb-4 bg-gradient-to-r bg-clip-text text-6xl leading-normal font-black text-transparent"
			>
				Testing Patterns
			</h1>
			<p class="text-base-content/70 mx-auto max-w-3xl text-xl">
				Explore comprehensive testing examples and best practices for
				building robust Svelte applications
			</p>
		</div>

		<!-- Quick Navigation -->
		<div class="mb-12">
			<div
				class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<h2 class="mb-6 text-2xl font-bold">Quick Navigation</h2>
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<a
							href="/examples/unit"
							class="btn btn-outline btn-lg gap-2 transition-all duration-200 hover:scale-105"
						>
							<Code class_names="h-5 w-5" />
							Unit Tests
						</a>
						<a
							href="/examples/todos"
							class="btn btn-outline btn-lg gap-2 transition-all duration-200 hover:scale-105"
						>
							<BookOpen class_names="h-5 w-5" />
							Form Actions
						</a>
						<a
							href="/todos"
							class="btn btn-outline btn-lg gap-2 transition-all duration-200 hover:scale-105"
						>
							<Arrow direction="right" class_names="h-5 w-5" />
							Live Demo
						</a>
						<a
							href="#patterns"
							class="btn btn-outline btn-lg gap-2 transition-all duration-200 hover:scale-105"
						>
							<CheckCircle class_names="h-5 w-5" />
							Patterns
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Testing Categories -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Testing Categories
			</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<!-- Unit Testing -->
				<div class="group">
					<div
						class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
					>
						<div class="card-body p-8">
							<div
								class="from-primary/20 to-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
							>
								<Code class_names="text-primary h-8 w-8" />
							</div>
							<h3 class="mb-4 text-2xl font-bold">Unit Testing</h3>
							<p class="text-base-content/70 mb-6 leading-relaxed">
								Test individual components and functions in isolation
								with Vitest and vitest-browser-svelte
							</p>
							<div class="mb-6 flex flex-wrap gap-2">
								<div class="badge badge-primary badge-sm">Vitest</div>
								<div class="badge badge-secondary badge-sm">
									vitest-browser-svelte
								</div>
								<div class="badge badge-accent badge-sm">
									Component Testing
								</div>
							</div>
							<a
								href="/examples/unit"
								class="btn btn-primary gap-2 transition-all duration-200 hover:scale-105"
							>
								<Arrow direction="right" class_names="h-4 w-4" />
								View Examples
							</a>
						</div>
					</div>
				</div>

				<!-- Integration Testing -->
				<div class="group">
					<div
						class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
					>
						<div class="card-body p-8">
							<div
								class="from-secondary/20 to-secondary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
							>
								<BarChart class_names="text-secondary h-8 w-8" />
							</div>
							<h3 class="mb-4 text-2xl font-bold">
								Integration Testing
							</h3>
							<p class="text-base-content/70 mb-6 leading-relaxed">
								Test how multiple components work together and
								interact with external services
							</p>
							<div class="mb-6 flex flex-wrap gap-2">
								<div class="badge badge-info badge-sm">
									API Testing
								</div>
								<div class="badge badge-success badge-sm">
									Component Integration
								</div>
								<div class="badge badge-warning badge-sm">
									Data Flow
								</div>
							</div>
							<a
								href="/examples/integration"
								class="btn btn-secondary gap-2 transition-all duration-200 hover:scale-105"
							>
								<Arrow direction="right" class_names="h-4 w-4" />
								View Examples
							</a>
						</div>
					</div>
				</div>

				<!-- E2E Testing -->
				<div class="group">
					<div
						class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
					>
						<div class="card-body p-8">
							<div
								class="from-accent/20 to-accent/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
							>
								<Calculator class_names="text-accent h-8 w-8" />
							</div>
							<h3 class="mb-4 text-2xl font-bold">E2E Testing</h3>
							<p class="text-base-content/70 mb-6 leading-relaxed">
								Test complete user workflows from start to finish
								using Playwright
							</p>
							<div class="mb-6 flex flex-wrap gap-2">
								<div class="badge badge-error badge-sm">
									Playwright
								</div>
								<div class="badge badge-info badge-sm">
									User Workflows
								</div>
								<div class="badge badge-success badge-sm">
									Browser Testing
								</div>
							</div>
							<a
								href="/examples/e2e"
								class="btn btn-accent gap-2 transition-all duration-200 hover:scale-105"
							>
								<Arrow direction="right" class_names="h-4 w-4" />
								View Examples
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Featured Examples -->
		<div class="mb-16" id="patterns">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Featured Examples
			</h2>
			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Form Testing -->
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-8">
						<div class="mb-6 flex items-center gap-3">
							<div
								class="bg-success/20 flex h-12 w-12 items-center justify-center rounded-xl"
							>
								<Document class_names="text-success h-6 w-6" />
							</div>
							<h3 class="text-2xl font-bold">Form Testing</h3>
						</div>
						<p class="text-base-content/70 mb-6">
							Learn how to test form submissions, validation, and user
							interactions with comprehensive examples.
						</p>
						<div class="mb-6 space-y-3">
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								<span class="text-sm">Form validation testing</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								<span class="text-sm">SvelteKit actions testing</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								<span class="text-sm">Error handling patterns</span>
							</div>
						</div>
						<a
							href="/examples/todos"
							class="btn btn-success gap-2 transition-all duration-200 hover:scale-105"
						>
							<Eye class_names="h-4 w-4" />
							View Form Examples
						</a>
					</div>
				</div>

				<!-- Component Testing -->
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-8">
						<div class="mb-6 flex items-center gap-3">
							<div
								class="bg-info/20 flex h-12 w-12 items-center justify-center rounded-xl"
							>
								<Settings class_names="text-info h-6 w-6" />
							</div>
							<h3 class="text-2xl font-bold">Component Testing</h3>
						</div>
						<p class="text-base-content/70 mb-6">
							Master component testing with props, events, slots, and
							complex state management scenarios.
						</p>
						<div class="mb-6 space-y-3">
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								<span class="text-sm">Props and events testing</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								<span class="text-sm">Slot content testing</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								<span class="text-sm">State management testing</span>
							</div>
						</div>
						<a
							href="/examples/unit"
							class="btn btn-info gap-2 transition-all duration-200 hover:scale-105"
						>
							<Eye class_names="h-4 w-4" />
							View Component Examples
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Best Practices -->
		<div class="mb-16">
			<div
				class="card from-primary/10 via-secondary/5 to-accent/10 border-primary/20 border bg-gradient-to-br shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl"
						>
							<LightningBolt class_names="text-primary h-6 w-6" />
						</div>
						<h2 class="text-3xl font-bold">Testing Best Practices</h2>
					</div>

					<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						<div class="text-center">
							<div
								class="bg-success/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
							>
								<CheckCircle class_names="text-success h-8 w-8" />
							</div>
							<h3 class="mb-2 text-xl font-semibold">
								Test Structure
							</h3>
							<p class="text-base-content/70 text-sm">
								Organize tests with clear arrange, act, assert
								patterns
							</p>
						</div>

						<div class="text-center">
							<div
								class="bg-info/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
							>
								<Server class_names="text-info h-8 w-8" />
							</div>
							<h3 class="mb-2 text-xl font-semibold">Mocking</h3>
							<p class="text-base-content/70 text-sm">
								Effective mocking strategies for external dependencies
							</p>
						</div>

						<div class="text-center">
							<div
								class="bg-warning/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
							>
								<BarChart class_names="text-warning h-8 w-8" />
							</div>
							<h3 class="mb-2 text-xl font-semibold">Coverage</h3>
							<p class="text-base-content/70 text-sm">
								Achieve meaningful test coverage without over-testing
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Call to Action -->
		<div class="text-center">
			<div
				class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<h2 class="mb-4 text-3xl font-bold">
						Ready to Start Testing?
					</h2>
					<p
						class="text-base-content/70 mx-auto mb-8 max-w-2xl text-lg"
					>
						Explore our interactive examples and start building more
						reliable Svelte applications today.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/examples/unit"
							class="btn btn-primary btn-lg gap-2 px-8"
						>
							<Code class_names="h-5 w-5" />
							Start with Unit Tests
						</a>
						<a
							href="/todos"
							class="btn btn-outline btn-lg gap-2 px-8"
						>
							<Arrow direction="right" class_names="h-5 w-5" />
							Try Live Demo
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
