<script lang="ts">
	import CodeBlock from '$lib/components/code-block.svelte';
	import { e2e_test_examples } from '$lib/examples/code-examples';
	import {
		ArrowLongRight,
		Calculator,
		CheckCircle,
		Clock,
		Eye,
		LightningBolt,
		Server,
		Settings,
	} from '$lib/icons';

	// E2E testing categories
	const e2e_categories = [
		{
			id: 'user-journeys',
			title: 'User Journey Testing',
			description: 'Complete user workflows from start to finish',
			icon: Eye,
			color: 'primary',
			examples: [
				'Complete todo workflow',
				'Form submission flows',
				'Navigation between pages',
				'Mobile responsive flows',
			],
		},
		{
			id: 'cross-browser',
			title: 'Cross-Browser Testing',
			description: 'Ensure compatibility across different browsers',
			icon: Server,
			color: 'secondary',
			examples: [
				'Chrome, Firefox, Safari testing',
				'Mobile browser testing',
				'Feature compatibility',
				'Performance across browsers',
			],
		},
		{
			id: 'performance',
			title: 'Performance Testing',
			description: 'Load time, interaction metrics, and optimization',
			icon: LightningBolt,
			color: 'accent',
			examples: [
				'Core Web Vitals monitoring',
				'Page load performance',
				'JavaScript execution time',
				'Memory usage tracking',
			],
		},
		{
			id: 'accessibility',
			title: 'Accessibility Testing',
			description: 'Automated accessibility checks and workflows',
			icon: Settings,
			color: 'info',
			examples: [
				'Screen reader navigation',
				'Keyboard-only workflows',
				'ARIA attributes validation',
				'Color contrast testing',
			],
		},
	];

	// Best practices
	const best_practices = [
		{
			title: 'Test Real User Scenarios',
			description:
				'Focus on actual user workflows and business-critical paths',
			icon: Eye,
		},
		{
			title: 'Stable Selectors',
			description:
				'Use data-testid attributes and semantic selectors for reliability',
			icon: CheckCircle,
		},
		{
			title: 'Performance Monitoring',
			description:
				'Continuously monitor Core Web Vitals and loading performance',
			icon: LightningBolt,
		},
		{
			title: 'Cross-Platform Testing',
			description:
				'Test across different browsers, devices, and screen sizes',
			icon: Server,
		},
	];

	// Real E2E test files from the project
	const existing_tests = [
		{
			name: 'Homepage Tests',
			file: 'e2e/homepage.spec.ts',
			description: 'Basic navigation and content verification',
			coverage: [
				'Navigation',
				'Content rendering',
				'Responsive design',
			],
		},
		{
			name: 'Smoke Tests',
			file: 'e2e/smoke-test.spec.ts',
			description: 'Critical functionality verification',
			coverage: ['Page loading', 'Error handling', '404 pages'],
		},
		{
			name: 'API Integration',
			file: 'e2e/api.spec.ts',
			description: 'Frontend-backend communication testing',
			coverage: ['API responses', 'Error handling', 'Authentication'],
		},
		{
			name: 'Performance Tests',
			file: 'e2e/performance.spec.ts',
			description: 'Core Web Vitals and loading performance',
			coverage: [
				'Load times',
				'JavaScript performance',
				'Memory usage',
			],
		},
		{
			name: 'Accessibility Tests',
			file: 'e2e/accessibility.spec.ts',
			description: 'Automated accessibility validation',
			coverage: [
				'ARIA attributes',
				'Keyboard navigation',
				'Screen readers',
			],
		},
		{
			name: 'Advanced Scenarios',
			file: 'e2e/advanced-scenarios.spec.ts',
			description: 'Complex user workflows and edge cases',
			coverage: [
				'Network failures',
				'Concurrent actions',
				'Browser navigation',
			],
		},
	];

	let active_category = $state('user-journeys');

	// Map category IDs to code example keys
	const category_to_code_map: Record<
		string,
		keyof typeof e2e_test_examples
	> = {
		'user-journeys': 'user_journey',
		'cross-browser': 'cross_browser',
		performance: 'performance',
		accessibility: 'accessibility',
	};

	// Get the current code example based on active category
	const current_code_example = $derived(
		e2e_test_examples[
			category_to_code_map[active_category] || 'user_journey'
		],
	);
</script>

<svelte:head>
	<title>E2E Testing - Sveltest</title>
	<meta
		name="description"
		content="Learn end-to-end testing patterns with Playwright - user journeys, cross-browser testing, performance monitoring, and accessibility validation"
	/>
</svelte:head>

<div class="min-h-screen px-4 py-8">
	<div class="container mx-auto max-w-7xl">
		<!-- Hero Section -->
		<div class="mb-16 text-center">
			<div
				class="bg-accent/10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
			>
				<Calculator class_names="text-accent h-4 w-4" />
				<span class="text-accent text-sm font-medium">
					End-to-End Testing
				</span>
			</div>
			<h1
				class="from-accent via-primary to-secondary mb-4 bg-gradient-to-r bg-clip-text text-6xl leading-normal font-black text-transparent"
			>
				E2E Testing
			</h1>
			<p class="text-base-content/70 mx-auto max-w-3xl text-xl">
				Master end-to-end testing with Playwright - from user journeys
				to performance monitoring and accessibility validation
			</p>
		</div>

		<!-- E2E Categories -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				E2E Testing Categories
			</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{#each e2e_categories as category}
					<div class="group">
						<div
							class="card bg-base-100/80 border-base-300/50 hover:shadow-3xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
						>
							<div class="card-body p-6">
								<div
									class="from-{category.color}/20 to-{category.color}/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
								>
									<category.icon
										class_names="text-{category.color} h-6 w-6"
									/>
								</div>
								<h3 class="mb-2 text-lg font-bold">
									{category.title}
								</h3>
								<p
									class="text-base-content/70 mb-4 text-sm leading-relaxed"
								>
									{category.description}
								</p>
								<ul class="space-y-1 text-xs">
									{#each category.examples as example}
										<li
											class="text-base-content/60 flex items-center gap-2"
										>
											<CheckCircle
												class_names="h-3 w-3 text-success"
											/>
											{example}
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Interactive Examples -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Interactive Examples
			</h2>

			<!-- Category Navigation -->
			<div class="mb-8 flex flex-wrap justify-center gap-2">
				{#each e2e_categories as category}
					<button
						class="btn btn-sm {active_category === category.id
							? `btn-${category.color}`
							: 'btn-ghost'} transition-all duration-200"
						onclick={() => (active_category = category.id)}
					>
						<category.icon class_names="h-4 w-4" />
						{category.title}
					</button>
				{/each}
			</div>

			<!-- Code Examples -->
			<div class="grid gap-8 lg:grid-cols-2">
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<h3 class="mb-4 text-xl font-bold">Code Example</h3>
						<CodeBlock
							code={current_code_example}
							lang="typescript"
							theme="night-owl"
						/>
					</div>
				</div>

				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<h3 class="mb-4 text-xl font-bold">Key Concepts</h3>
						{#if active_category === 'user-journeys'}
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Complete Workflows:</strong> Test entire user
										journeys from start to finish
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>State Persistence:</strong> Verify data persists
										across page navigation
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Error Recovery:</strong> Test graceful handling
										of failures and edge cases
									</div>
								</li>
							</ul>
						{:else if active_category === 'cross-browser'}
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Browser Compatibility:</strong> Ensure consistent
										behavior across browsers
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Device Testing:</strong> Verify responsive
										design on different screen sizes
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Feature Detection:</strong> Test progressive
										enhancement and fallbacks
									</div>
								</li>
							</ul>
						{:else if active_category === 'performance'}
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Core Web Vitals:</strong> Monitor FCP, LCP,
										CLS, and other performance metrics
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Load Performance:</strong> Measure page load
										times and resource loading
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Runtime Performance:</strong> Track JavaScript
										execution and memory usage
									</div>
								</li>
							</ul>
						{:else if active_category === 'accessibility'}
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Automated Testing:</strong> Use axe-core for
										comprehensive accessibility validation
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Keyboard Navigation:</strong> Verify complete
										keyboard accessibility
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Screen Reader Support:</strong> Test with assistive
										technology patterns
									</div>
								</li>
							</ul>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Existing Test Files -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Live E2E Test Examples
			</h2>
			<p class="text-base-content/70 mb-8 text-center">
				This project includes comprehensive E2E tests that you can run
				and explore
			</p>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each existing_tests as test}
					<div
						class="card bg-base-100/80 border-base-300/50 border shadow-xl backdrop-blur-sm"
					>
						<div class="card-body p-6">
							<div class="mb-4 flex items-center gap-3">
								<div
									class="from-accent/20 to-accent/10 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br"
								>
									<Calculator class_names="text-accent h-5 w-5" />
								</div>
								<h3 class="text-lg font-bold">{test.name}</h3>
							</div>
							<p class="text-base-content/70 mb-4 text-sm">
								{test.description}
							</p>
							<div class="mb-4">
								<h4 class="mb-2 text-sm font-semibold">Coverage:</h4>
								<div class="flex flex-wrap gap-1">
									{#each test.coverage as item}
										<span class="badge badge-outline badge-xs">
											{item}
										</span>
									{/each}
								</div>
							</div>
							<div class="bg-base-200 rounded p-2">
								<code class="text-xs">{test.file}</code>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Best Practices -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				E2E Testing Best Practices
			</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each best_practices as practice}
					<div
						class="card bg-base-100/80 border-base-300/50 border shadow-xl backdrop-blur-sm"
					>
						<div class="card-body p-6 text-center">
							<div
								class="from-primary/20 to-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br"
							>
								<practice.icon class_names="text-primary h-6 w-6" />
							</div>
							<h3 class="mb-2 text-lg font-bold">
								{practice.title}
							</h3>
							<p class="text-base-content/70 text-sm">
								{practice.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Running Tests -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Running E2E Tests
			</h2>
			<div class="grid gap-8 lg:grid-cols-2">
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-8">
						<div class="mb-4 flex items-center gap-3">
							<div
								class="from-primary/20 to-primary/10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br"
							>
								<Clock class_names="text-primary h-6 w-6" />
							</div>
							<h3 class="text-xl font-bold">Quick Start</h3>
						</div>
						<p class="text-base-content/70 mb-6">
							Get started with E2E testing in this project with these
							simple commands
						</p>
						<CodeBlock
							code={e2e_test_examples.quick_start}
							lang="bash"
							theme="night-owl"
						/>
					</div>
				</div>

				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-8">
						<div class="mb-4 flex items-center gap-3">
							<div
								class="from-secondary/20 to-secondary/10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br"
							>
								<Settings class_names="text-secondary h-6 w-6" />
							</div>
							<h3 class="text-xl font-bold">Configuration</h3>
						</div>
						<p class="text-base-content/70 mb-6">
							E2E tests are configured with Playwright for maximum
							reliability and cross-browser support
						</p>
						<ul class="space-y-2 text-sm">
							<li class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								Chromium, Firefox, and WebKit support
							</li>
							<li class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								Mobile device emulation
							</li>
							<li class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								Automatic screenshots on failure
							</li>
							<li class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-4 w-4" />
								Parallel test execution
							</li>
						</ul>
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
					<h2 class="mb-4 text-2xl font-bold">
						Explore More Testing Patterns
					</h2>
					<p class="text-base-content/70 mb-6">
						Continue your testing journey with our comprehensive
						documentation and component examples
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/docs"
							class="btn btn-primary gap-2 transition-all duration-200 hover:scale-105"
						>
							<Eye class_names="h-4 w-4" />
							View Documentation
						</a>
						<a
							href="/components"
							class="btn btn-outline gap-2 transition-all duration-200 hover:scale-105"
						>
							<ArrowLongRight class_names="h-4 w-4" />
							Component Showcase
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
