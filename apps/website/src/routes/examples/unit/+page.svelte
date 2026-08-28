<script lang="ts">
	import CalculatorComponent from '$lib/components/calculator.svelte';
	import CodeBlock from '$lib/components/code-block.svelte';
	import { unit_test_examples } from '$lib/examples/code-examples';
	import {
		Arrow,
		BarChart,
		BookOpen,
		Calculator,
		CheckCircle,
		Code,
		Eye,
		LightningBolt,
		Settings,
	} from '$lib/icons';
</script>

<svelte:head>
	<title>Unit Testing Examples - Sveltest</title>
	<meta
		name="description"
		content="Learn unit testing with practical examples using Vitest and vitest-browser-svelte"
	/>
</svelte:head>

<!-- Unit Testing Examples Page -->
<div class="min-h-screen px-4 py-8">
	<div class="container mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-12 text-center">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full bg-info/10 px-4 py-2"
			>
				<Calculator class_names="text-info h-4 w-4" />
				<span class="text-sm font-medium text-info">Unit Testing</span
				>
			</div>
			<h1
				class="mb-4 bg-linear-to-r from-info via-primary to-secondary bg-clip-text text-6xl leading-normal font-black text-transparent"
			>
				Unit Testing Examples
			</h1>
			<p class="mx-auto max-w-3xl text-xl text-base-content/70">
				Learn unit testing fundamentals with practical examples using
				Vitest and vitest-browser-svelte
			</p>
		</div>

		<!-- Interactive Calculator Demo -->
		<div class="mb-16">
			<div
				class="card border border-base-300/50 bg-base-100/90 shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-info/20"
						>
							<Calculator class_names="text-info h-6 w-6" />
						</div>
						<div>
							<h2 class="text-2xl font-bold">
								Interactive Calculator
							</h2>
							<p class="text-sm text-base-content/60">
								A working calculator with comprehensive unit tests
							</p>
						</div>
					</div>

					<div class="grid gap-8 lg:grid-cols-2">
						<!-- Calculator Interface -->
						<CalculatorComponent />

						<!-- Test Information -->
						<div class="space-y-6">
							<div
								class="rounded-xl border border-success/20 bg-success/10 p-6"
							>
								<h3
									class="mb-4 flex items-center gap-2 text-lg font-bold"
								>
									<CheckCircle class_names="text-success h-5 w-5" />
									Test Coverage
								</h3>
								<div class="space-y-3">
									<div class="flex items-center justify-between">
										<span class="text-sm">Basic Operations</span>
										<div class="badge badge-sm badge-success">
											100%
										</div>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm">Edge Cases</span>
										<div class="badge badge-sm badge-success">
											95%
										</div>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm">Error Handling</span>
										<div class="badge badge-sm badge-success">
											90%
										</div>
									</div>
								</div>
							</div>

							<div
								class="rounded-xl border border-info/20 bg-info/10 p-6"
							>
								<h3
									class="mb-4 flex items-center gap-2 text-lg font-bold"
								>
									<Code class_names="text-info h-5 w-5" />
									Testing Tools
								</h3>
								<div class="space-y-2">
									<div class="badge badge-outline badge-sm">
										Vitest
									</div>
									<div class="badge badge-outline badge-sm">
										vitest-browser-svelte
									</div>
									<div class="badge badge-outline badge-sm">
										User Events
									</div>
									<div class="badge badge-outline badge-sm">
										Mock Functions
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Testing Concepts -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Testing Concepts
			</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<!-- Arrange, Act, Assert -->
				<div
					class="card border border-base-300/50 bg-base-100/80 shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20"
						>
							<LightningBolt class_names="text-primary h-6 w-6" />
						</div>
						<h3 class="mb-3 text-xl font-bold">
							Arrange, Act, Assert
						</h3>
						<p class="mb-4 text-sm text-base-content/70">
							The fundamental pattern for structuring unit tests
						</p>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-primary"></div>
								<span class="text-xs">Setup test data</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-secondary"></div>
								<span class="text-xs">Execute function</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-accent"></div>
								<span class="text-xs">Verify results</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Mocking -->
				<div
					class="card border border-base-300/50 bg-base-100/80 shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20"
						>
							<Settings class_names="text-secondary h-6 w-6" />
						</div>
						<h3 class="mb-3 text-xl font-bold">Mocking</h3>
						<p class="mb-4 text-sm text-base-content/70">
							Isolate units by mocking dependencies
						</p>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-3 w-3" />
								<span class="text-xs">Mock functions</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-3 w-3" />
								<span class="text-xs">Mock modules</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-3 w-3" />
								<span class="text-xs">Spy on calls</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Test Coverage -->
				<div
					class="card border border-base-300/50 bg-base-100/80 shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20"
						>
							<BarChart class_names="text-accent h-6 w-6" />
						</div>
						<h3 class="mb-3 text-xl font-bold">Test Coverage</h3>
						<p class="mb-4 text-sm text-base-content/70">
							Measure and improve test coverage
						</p>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-success"></div>
								<span class="text-xs">Line coverage</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-info"></div>
								<span class="text-xs">Branch coverage</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-warning"></div>
								<span class="text-xs">Function coverage</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Code Examples -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Code Examples
			</h2>
			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Basic Test Example -->
				<div
					class="card border border-base-300/50 bg-base-100/90 shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div class="mb-4 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20"
							>
								<Code class_names="text-success h-5 w-5" />
							</div>
							<h3 class="text-xl font-bold">Basic Function Test</h3>
						</div>
						<CodeBlock
							code={unit_test_examples.basic_function_test}
							lang="javascript"
							theme="night-owl"
						/>
					</div>
				</div>

				<!-- Component Test Example -->
				<div
					class="card border border-base-300/50 bg-base-100/90 shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div class="mb-4 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-info/20"
							>
								<BookOpen class_names="text-info h-5 w-5" />
							</div>
							<h3 class="text-xl font-bold">Component Test</h3>
						</div>
						<CodeBlock
							code={unit_test_examples.component_test}
							lang="javascript"
							theme="night-owl"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Best Practices -->
		<div class="mb-16">
			<div
				class="card border border-primary/20 bg-linear-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20"
						>
							<LightningBolt class_names="text-primary h-6 w-6" />
						</div>
						<h2 class="text-3xl font-bold">
							Unit Testing Best Practices
						</h2>
					</div>

					<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<div class="space-y-3">
							<h3 class="flex items-center gap-2 font-semibold">
								<CheckCircle class_names="text-success h-4 w-4" />
								Test Structure
							</h3>
							<ul class="space-y-1 text-sm text-base-content/70">
								<li>• Use descriptive test names</li>
								<li>• Follow AAA pattern</li>
								<li>• One assertion per test</li>
								<li>• Group related tests</li>
							</ul>
						</div>

						<div class="space-y-3">
							<h3 class="flex items-center gap-2 font-semibold">
								<Settings class_names="text-info h-4 w-4" />
								Test Quality
							</h3>
							<ul class="space-y-1 text-sm text-base-content/70">
								<li>• Test behavior, not implementation</li>
								<li>• Use meaningful assertions</li>
								<li>• Avoid test interdependence</li>
								<li>• Keep tests simple</li>
							</ul>
						</div>

						<div class="space-y-3">
							<h3 class="flex items-center gap-2 font-semibold">
								<BarChart class_names="text-warning h-4 w-4" />
								Coverage Goals
							</h3>
							<ul class="space-y-1 text-sm text-base-content/70">
								<li>• Aim for 80%+ coverage</li>
								<li>• Focus on critical paths</li>
								<li>• Test edge cases</li>
								<li>• Don't chase 100%</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="text-center">
			<div
				class="card border border-base-300/50 bg-base-100/90 shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<h2 class="mb-4 text-2xl font-bold">
						Explore More Examples
					</h2>
					<p class="mb-6 text-base-content/70">
						Continue learning with more advanced testing patterns
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/examples/todos"
							class="btn gap-2 transition-all duration-200 btn-primary hover:scale-105"
						>
							<Eye class_names="h-4 w-4" />
							Form Testing Examples
						</a>
						<a
							href="/todos"
							class="btn gap-2 btn-outline transition-all duration-200 hover:scale-105"
						>
							<Arrow direction="right" class_names="h-4 w-4" />
							Try Live Demo
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
