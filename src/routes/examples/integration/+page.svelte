<script lang="ts">
	import CodeBlock from '$lib/components/code-block.svelte';
	import { integration_test_examples } from '$lib/examples/code-examples';
	import {
		ArrowLongRight,
		BarChart,
		CheckCircle,
		Code,
		Eye,
		LightningBolt,
		Server,
		Settings,
	} from '$lib/icons';

	// Integration testing categories
	const integration_categories = [
		{
			id: 'component-integration',
			title: 'Component Integration',
			description: 'Testing how multiple components work together',
			icon: Code,
			color: 'primary',
			examples: [
				'Form + Input + Button workflows',
				'Modal + Form interactions',
				'Calculator + State management',
				'Navigation + Routing integration',
			],
		},
		{
			id: 'api-integration',
			title: 'API Integration',
			description: 'Frontend-backend communication testing',
			icon: Server,
			color: 'secondary',
			examples: [
				'SvelteKit API routes testing',
				'Form action integration',
				'Error handling workflows',
				'Authentication flows',
			],
		},
		{
			id: 'state-management',
			title: 'State Management',
			description: 'Testing reactive state across components',
			icon: BarChart,
			color: 'accent',
			examples: [
				'Svelte 5 runes integration',
				'Cross-component state sharing',
				'Store subscriptions',
				'State persistence',
			],
		},
		{
			id: 'form-workflows',
			title: 'Form Workflows',
			description: 'Multi-step form testing patterns',
			icon: Settings,
			color: 'info',
			examples: [
				'Multi-step form wizards',
				'Validation workflows',
				'Form submission flows',
				'Error recovery patterns',
			],
		},
	];

	// Best practices
	const best_practices = [
		{
			title: 'Test Real User Workflows',
			description:
				'Focus on complete user journeys rather than isolated components',
			icon: Eye,
		},
		{
			title: 'Mock External Dependencies',
			description:
				'Use realistic mocks for APIs and external services',
			icon: Server,
		},
		{
			title: 'Test Error Scenarios',
			description:
				'Verify graceful handling of failures and edge cases',
			icon: CheckCircle,
		},
		{
			title: 'Validate State Consistency',
			description:
				'Ensure state remains consistent across component boundaries',
			icon: BarChart,
		},
	];

	let active_category = $state('component-integration');

	// Map category IDs to code example keys
	const category_to_code_map: Record<
		string,
		keyof typeof integration_test_examples
	> = {
		'component-integration': 'component_integration',
		'api-integration': 'api_integration',
		'state-management': 'state_management',
		'form-workflows': 'form_workflows',
	};

	// Get the current code example based on active category
	const current_code_example = $derived(
		integration_test_examples[
			category_to_code_map[active_category] || 'component_integration'
		],
	);
</script>

<svelte:head>
	<title>Integration Testing - TestSuite Pro</title>
	<meta
		name="description"
		content="Learn integration testing patterns for Svelte applications - component integration, API testing, state management, and form workflows"
	/>
</svelte:head>

<div class="min-h-screen px-4 py-8">
	<div class="container mx-auto max-w-7xl">
		<!-- Hero Section -->
		<div class="mb-16 text-center">
			<div
				class="bg-secondary/10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
			>
				<BarChart class_names="text-secondary h-4 w-4" />
				<span class="text-secondary text-sm font-medium">
					Integration Testing
				</span>
			</div>
			<h1
				class="from-accent via-primary to-secondary mb-4 bg-gradient-to-r bg-clip-text text-6xl leading-normal font-black text-transparent"
			>
				Integration Testing
			</h1>
			<p class="text-base-content/70 mx-auto max-w-3xl text-xl">
				Learn how to test component interactions, API integration,
				state management, and complex user workflows
			</p>
		</div>

		<!-- Integration Categories -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Integration Testing Categories
			</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{#each integration_categories as category}
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
				{#each integration_categories as category}
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
							code={integration_test_examples.component_integration}
							lang="javascript"
							theme="night-owl"
						/>
					</div>
				</div>

				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<h3 class="mb-4 text-xl font-bold">Key Concepts</h3>
						{#if active_category === 'component-integration'}
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Component Workflows:</strong> Test complete
										user interactions across multiple components
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Event Propagation:</strong> Verify events flow
										correctly between parent and child components
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>State Synchronization:</strong> Ensure shared
										state updates consistently across components
									</div>
								</li>
							</ul>
						{:else if active_category === 'api-integration'}
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>SvelteKit Actions:</strong> Test form actions
										and server-side processing
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>API Routes:</strong> Verify API endpoints return
										correct data and status codes
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Error Handling:</strong> Test graceful handling
										of network failures and API errors
									</div>
								</li>
							</ul>
						{:else if active_category === 'state-management'}
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Svelte 5 Runes:</strong> Test $state, $derived,
										and $effect interactions
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Store Integration:</strong> Verify store subscriptions
										and updates work correctly
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>State Persistence:</strong> Test state preservation
										across navigation and page reloads
									</div>
								</li>
							</ul>
						{:else if active_category === 'form-workflows'}
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Multi-Step Forms:</strong> Test navigation
										between form steps and data persistence
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Validation Workflows:</strong> Verify real-time
										validation and error display
									</div>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle
										class_names="text-success mt-1 h-4 w-4 flex-shrink-0"
									/>
									<div>
										<strong>Form Submission:</strong> Test complete submission
										flow including loading states
									</div>
								</li>
							</ul>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Best Practices -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Integration Testing Best Practices
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

		<!-- Real-World Examples -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Real-World Examples
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
								<Settings class_names="text-primary h-6 w-6" />
							</div>
							<h3 class="text-xl font-bold">
								Todo Manager Integration
							</h3>
						</div>
						<p class="text-base-content/70 mb-6">
							See integration testing in action with our Todo Manager
							example, featuring form actions, state management, and
							component interactions.
						</p>
						<div class="flex gap-4">
							<a
								href="/examples/todos"
								class="btn btn-primary gap-2 transition-all duration-200 hover:scale-105"
							>
								<Eye class_names="h-4 w-4" />
								View Tests
							</a>
							<a
								href="/todos"
								class="btn btn-outline gap-2 transition-all duration-200 hover:scale-105"
							>
								<ArrowLongRight class_names="h-4 w-4" />
								Try Demo
							</a>
						</div>
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
								<Code class_names="text-secondary h-6 w-6" />
							</div>
							<h3 class="text-xl font-bold">Component Showcase</h3>
						</div>
						<p class="text-base-content/70 mb-6">
							Explore component integration patterns with our
							interactive component showcase, featuring live demos and
							testing examples.
						</p>
						<div class="flex gap-4">
							<a
								href="/components"
								class="btn btn-secondary gap-2 transition-all duration-200 hover:scale-105"
							>
								<Eye class_names="h-4 w-4" />
								View Components
							</a>
							<a
								href="/examples/unit"
								class="btn btn-outline gap-2 transition-all duration-200 hover:scale-105"
							>
								<ArrowLongRight class_names="h-4 w-4" />
								Unit Tests
							</a>
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
					<h2 class="mb-4 text-2xl font-bold">
						Ready for End-to-End Testing?
					</h2>
					<p class="text-base-content/70 mb-6">
						Take your testing to the next level with comprehensive E2E
						testing patterns and real browser automation
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/examples/e2e"
							class="btn btn-accent gap-2 transition-all duration-200 hover:scale-105"
						>
							<LightningBolt class_names="h-4 w-4" />
							E2E Testing Examples
						</a>
						<a
							href="/docs"
							class="btn btn-outline gap-2 transition-all duration-200 hover:scale-105"
						>
							<ArrowLongRight class_names="h-4 w-4" />
							View Documentation
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
