<script lang="ts">
	import CodeBlock from '$lib/components/code-block.svelte';
	import { documentation_examples } from '$lib/examples/code-examples';
	import {
		Arrow,
		BookOpen,
		CheckCircle,
		Clipboard,
		Code,
		Eye,
		LightningBolt,
		Settings,
	} from '$lib/icons';

	const { data } = $props();
	const { topics } = data;

	// Icon mapping for topics
	const icon_map = {
		'getting-started': BookOpen,
		'testing-patterns': Code,
		'api-reference': Settings,
		'migration-guide': Arrow,
		troubleshooting: CheckCircle,
		'best-practices': LightningBolt,
	};

	// Color mapping for topics
	const color_map = {
		'getting-started': 'primary',
		'testing-patterns': 'secondary',
		'api-reference': 'accent',
		'migration-guide': 'info',
		troubleshooting: 'success',
		'best-practices': 'warning',
	};

	// Map topics to sections with icons and colors
	const sections = topics.map((topic) => ({
		id: topic.slug,
		title: topic.title,
		description: topic.description,
		icon: icon_map[topic.slug as keyof typeof icon_map] || BookOpen,
		color:
			color_map[topic.slug as keyof typeof color_map] || 'primary',
	}));

	// Quick start examples
	const quick_start_examples = [
		{
			title: 'Essential Imports',
			description:
				'Core imports for testing with vitest-browser-svelte',
			code: documentation_examples.essential_imports,
		},
		{
			title: 'Your First Test',
			description: 'Simple component test example',
			code: documentation_examples.first_test,
		},
		{
			title: 'Component Testing',
			description: 'Testing component interactions and events',
			code: documentation_examples.component_testing,
		},
		{
			title: 'SSR Testing',
			description: 'Server-side rendering tests',
			code: documentation_examples.ssr_testing,
		},
		{
			title: 'Server Testing',
			description: 'Testing API routes and server functions',
			code: documentation_examples.server_testing,
		},
	];

	// Testing principles
	const testing_principles = [
		{
			title: '100% Test Coverage',
			description:
				'Use the "Foundation First" approach - write all describe blocks first, then implement incrementally',
			icon: CheckCircle,
		},
		{
			title: 'Real Browser Testing',
			description:
				'Test components in actual browser environment with vitest-browser-svelte',
			icon: Eye,
		},
		{
			title: 'Accessibility First',
			description:
				'Use semantic queries and test ARIA attributes for inclusive design',
			icon: Settings,
		},
		{
			title: 'Performance Focused',
			description:
				'Test loading states, animations, and user experience patterns',
			icon: LightningBolt,
		},
	];

	let active_section = $state('getting-started');
	let copied_code = $state('');

	// Additional code examples
	const installation_commands = `pnpm install
pnpm test        # Run all tests
pnpm test:client # Component tests in browser
pnpm test:server # Server-side tests
pnpm test:ssr    # SSR tests`;

	// Additional code examples
	const assertions_example = `await expect.element(element).toBeInTheDocument();
await expect.element(element).toHaveClass('btn-primary');
await expect.element(element).toHaveTextContent('Hello');
await expect.element(element).toBeVisible();`;

	const user_interactions_example = `await element.click();
await element.fill('text');
await element.selectOption('value');
await userEvent.keyboard('{Escape}');`;

	const cypress_migration_example = `// Cypress
cy.get('[data-testid="button"]').click();
cy.contains('Success').should('be.visible');

// vitest-browser-svelte
await page.getByTestId('button').click();
await expect.element(page.getByText('Success')).toBeVisible();`;

	const debugging_example = `// Add debug output
console.log(page.locator('button').innerHTML());

// Take screenshots
await page.screenshot({ path: 'debug.png' });

// Pause execution
await page.pause();`;

	const accessibility_example = `// ✅ Good - tests accessibility
page.getByRole('button', { name: 'Submit' });
page.getByLabelText('Email address');

// ❌ Avoid - doesn't test accessibility
page.getByTestId('submit-btn');
page.locator('#email-input');`;

	const performance_example = `// Use parallel test execution
test.concurrent('fast test 1', async () => {});
test.concurrent('fast test 2', async () => {});

// Mock heavy operations
vi.mock('$lib/heavy-computation', () => ({
  compute: vi.fn(() => 'mocked-result')
}));`;

	function set_active_section(section_id: string) {
		active_section = section_id;
	}

	async function copy_code(code: string, example_title: string) {
		try {
			await navigator.clipboard.writeText(code);
			copied_code = example_title;
			setTimeout(() => {
				copied_code = '';
			}, 2000);
		} catch (err) {
			console.error('Failed to copy code:', err);
		}
	}
</script>

<svelte:head>
	<title>Documentation - Sveltest</title>
	<meta
		name="description"
		content="Comprehensive testing documentation for Svelte 5 + vitest-browser-svelte. Learn testing patterns, best practices, and advanced techniques."
	/>
	<meta
		name="keywords"
		content="svelte testing, vitest, browser testing, component testing, SSR testing, API testing"
	/>
</svelte:head>

<!-- Hero Section -->
<section
	class="from-primary/10 via-secondary/5 to-accent/10 bg-gradient-to-br px-4 py-24"
>
	<div class="container mx-auto max-w-7xl text-center">
		<div class="mb-8">
			<h1 class="mb-6 text-6xl font-black tracking-tight">
				<span
					class="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent"
				>
					Testing Documentation
				</span>
			</h1>
			<p
				class="text-base-content/70 mx-auto max-w-3xl text-xl leading-relaxed"
			>
				Master modern testing with Svelte 5 and vitest-browser-svelte.
				From basic component tests to advanced E2E patterns, this
				guide covers everything you need to build reliable,
				well-tested applications.
			</p>
		</div>

		<!-- Stats -->
		<div
			class="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4"
		>
			<div class="text-center">
				<div
					class="text-primary text-3xl font-bold"
					data-testid="stat-sections"
				>
					6
				</div>
				<div class="text-base-content/60 text-sm">Sections</div>
			</div>
			<div class="text-center">
				<div
					class="text-secondary text-3xl font-bold"
					data-testid="stat-examples"
				>
					50+
				</div>
				<div class="text-base-content/60 text-sm">Examples</div>
			</div>
			<div class="text-center">
				<div
					class="text-accent text-3xl font-bold"
					data-testid="stat-coverage"
				>
					100%
				</div>
				<div class="text-base-content/60 text-sm">Coverage</div>
			</div>
			<div class="text-center">
				<div
					class="text-info text-3xl font-bold"
					data-testid="stat-a11y"
				>
					A11y
				</div>
				<div class="text-base-content/60 text-sm">Accessible</div>
			</div>
		</div>
	</div>
</section>

<!-- Documentation Navigation - Prominent Section -->
<section
	class="from-primary/5 to-secondary/5 bg-gradient-to-br px-4 py-24"
>
	<div class="container mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2
				class="from-primary to-secondary mb-4 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent"
			>
				Documentation Guide
			</h2>
			<p
				class="text-base-content/80 mx-auto max-w-3xl text-xl leading-relaxed"
			>
				Complete testing documentation for Svelte 5 +
				vitest-browser-svelte. Start with any section below - all
				content is dynamically generated and always up-to-date.
			</p>
		</div>

		<!-- Prominent Documentation Links -->
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each sections as section}
				<a
					href="/docs/{section.id}"
					class="group bg-base-100 hover:bg-base-200/80 border-base-300/50 hover:border-{section.color}/30 rounded-2xl border p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
					data-testid="doc-link-{section.id}"
				>
					<div class="mb-6 flex items-center justify-between">
						<div
							class="bg-{section.color}/10 text-{section.color} group-hover:bg-{section.color}/20 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors"
						>
							<section.icon class_names="h-8 w-8" />
						</div>
						<Arrow
							direction="right"
							class_names="h-5 w-5 text-base-content/40 group-hover:text-{section.color} transition-colors group-hover:translate-x-1 transform"
						/>
					</div>
					<h3
						class="text-base-content mb-3 text-2xl font-bold group-hover:text-{section.color} transition-colors"
					>
						{section.title}
					</h3>
					<p class="text-base-content/70 text-base leading-relaxed">
						{section.description}
					</p>
				</a>
			{/each}
		</div>

		<!-- Quick Access Bar -->
		<div
			class="bg-base-100 border-base-300/50 mt-16 rounded-2xl border p-8 shadow-lg"
		>
			<div
				class="flex flex-col items-center justify-between gap-6 lg:flex-row"
			>
				<div>
					<h3 class="mb-2 text-2xl font-bold">Quick Access</h3>
					<p class="text-base-content/70">
						Jump directly to any documentation section or download the
						complete guide
					</p>
				</div>
				<div class="flex flex-wrap gap-3">
					<a
						href="/llms.txt"
						class="btn btn-outline btn-sm"
						target="_blank"
					>
						<Eye class_names="h-4 w-4" />
						LLMs Index
					</a>
					<a
						href="/llms-full.txt"
						class="btn btn-primary btn-sm"
						target="_blank"
					>
						<BookOpen class_names="h-4 w-4" />
						Full Documentation
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Documentation Navigation - Prominent Section -->
<section
	class="from-primary/10 to-secondary/10 bg-gradient-to-r px-4 py-20"
>
	<div class="container mx-auto max-w-7xl">
		<div class="mb-12 text-center">
			<h2 class="text-base-content mb-6 text-5xl font-bold">
				📚 Complete Documentation
			</h2>
			<p
				class="text-base-content/80 mx-auto max-w-3xl text-xl leading-relaxed"
			>
				Jump to any section to master Svelte 5 testing with
				vitest-browser-svelte. Each guide includes practical examples,
				best practices, and real-world patterns.
			</p>
		</div>

		<!-- Prominent Documentation Links Grid -->
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each sections as section, index}
				<a
					href="/docs/{section.id}"
					class="group bg-base-100 hover:bg-base-200 border-base-300/50 hover:border-{section.color}/50 transform rounded-2xl border p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
					data-testid="docs-link-{section.id}"
				>
					<div class="mb-4 flex items-center justify-between">
						<div
							class="bg-{section.color}/10 text-{section.color} flex h-14 w-14 items-center justify-center rounded-xl transition-colors group-hover:bg-{section.color}/20"
						>
							<section.icon class_names="h-7 w-7" />
						</div>
						<div
							class="text-{section.color} bg-{section.color}/10 rounded-full px-3 py-1 text-sm font-medium"
						>
							{index + 1}
						</div>
					</div>

					<h3
						class="text-base-content mb-3 text-2xl font-bold group-hover:text-{section.color} transition-colors"
					>
						{section.title}
					</h3>

					<p
						class="text-base-content/70 mb-4 text-base leading-relaxed"
					>
						{section.description}
					</p>

					<div
						class="flex items-center text-{section.color} font-medium transition-all group-hover:gap-2"
					>
						<span>Read Guide</span>
						<Arrow
							direction="right"
							class_names="h-4 w-4 transition-transform group-hover:translate-x-1"
						/>
					</div>
				</a>
			{/each}
		</div>

		<!-- Quick Access Info -->
		<div class="mt-12 text-center">
			<div
				class="bg-base-100/50 border-base-300/50 rounded-xl border p-6 backdrop-blur-sm"
			>
				<p class="text-base-content/70 mb-4 text-lg">
					🚀 <strong>Need something specific?</strong> All documentation
					pages include:
				</p>
				<div class="flex flex-wrap justify-center gap-4 text-sm">
					<span
						class="bg-primary/10 text-primary rounded-full px-3 py-1"
					>
						📋 Copy-paste examples
					</span>
					<span
						class="bg-secondary/10 text-secondary rounded-full px-3 py-1"
					>
						🔍 Comprehensive API coverage
					</span>
					<span
						class="bg-accent/10 text-accent rounded-full px-3 py-1"
					>
						♿ Accessibility patterns
					</span>
					<span class="bg-info/10 text-info rounded-full px-3 py-1">
						⚡ Performance tips
					</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Quick Start Section -->
<section class="px-4 py-24">
	<div class="container mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">Quick Start</h2>
			<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
				Jump right in with these essential testing patterns. Copy and
				paste these examples to get started immediately.
			</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-3">
			{#each quick_start_examples as example}
				<div
					class="bg-base-100 border-base-300/50 rounded-xl border p-6 shadow-lg"
				>
					<div class="mb-4 flex items-center justify-between">
						<h3
							class="text-xl font-bold"
							data-testid="example-title-{example.title
								.toLowerCase()
								.replace(/\s+/g, '-')}"
						>
							{example.title}
						</h3>
						<button
							class="btn btn-ghost btn-sm"
							onclick={() => copy_code(example.code, example.title)}
							title="Copy code"
							aria-label="Copy {example.title} code"
						>
							{#if copied_code === example.title}
								<CheckCircle class_names="h-4 w-4 text-success" />
							{:else}
								<Clipboard class_names="h-4 w-4" />
							{/if}
						</button>
					</div>
					<p class="text-base-content/70 mb-4 text-sm">
						{example.description}
					</p>
					<CodeBlock
						code={example.code}
						lang="typescript"
						theme="night-owl"
					/>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Testing Principles -->
<section class="bg-base-200/50 px-4 py-24">
	<div class="container mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">Core Testing Principles</h2>
			<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
				Our testing philosophy emphasizes reliability, accessibility,
				and developer experience.
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each testing_principles as principle}
				<div class="bg-base-100 rounded-xl p-6 text-center shadow-lg">
					<div
						class="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
					>
						<principle.icon class_names="h-8 w-8" />
					</div>
					<h3 class="mb-2 text-lg font-bold">{principle.title}</h3>
					<p class="text-base-content/70 text-sm">
						{principle.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Documentation Sections -->
<main class="px-4 py-24">
	<div class="container mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">Documentation Sections</h2>
			<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
				Comprehensive guides covering every aspect of testing with
				Svelte 5 and vitest-browser-svelte.
			</p>
		</div>

		<!-- Section Navigation -->
		<nav class="mb-12">
			<div class="flex flex-wrap justify-center gap-2">
				{#each sections as section}
					<button
						class="btn {active_section === section.id
							? `btn-${section.color}`
							: 'btn-ghost'}"
						onclick={() => set_active_section(section.id)}
						aria-label="Switch to {section.title} section"
					>
						<section.icon class_names="h-4 w-4" />
						{section.title}
					</button>
				{/each}
			</div>
		</nav>

		<!-- Section Content -->
		<div
			class="bg-base-100 border-base-300/50 rounded-xl border p-8 shadow-lg"
		>
			{#if active_section === 'getting-started'}
				<div data-testid="section-getting-started">
					<h3 class="mb-6 text-3xl font-bold">Getting Started</h3>

					<div class="prose prose-lg max-w-none">
						<h4>Installation &amp; Setup</h4>
						<p>
							Sveltest comes pre-configured with everything you need
							for comprehensive testing:
						</p>

						<CodeBlock
							code={installation_commands}
							lang="bash"
							theme="night-owl"
						/>

						<h4>Project Structure</h4>
						<p>Tests are co-located with their source files:</p>
						<ul>
							<li>
								<code>*.svelte.test.ts</code> - Component tests (browser)
							</li>
							<li>
								<code>*.ssr.test.ts</code> - Server-side rendering tests
							</li>
							<li>
								<code>*.test.ts</code> - API routes and utilities
							</li>
						</ul>

						<h4>Your First Test</h4>
						<p>
							Create a simple component test to verify your setup:
						</p>

						<CodeBlock
							code={documentation_examples.first_test}
							lang="typescript"
							theme="night-owl"
						/>
					</div>
				</div>
			{:else if active_section === 'testing-patterns'}
				<div data-testid="section-testing-patterns">
					<h3 class="mb-6 text-3xl font-bold">Testing Patterns</h3>

					<div class="prose prose-lg max-w-none">
						<h4>Component Testing</h4>
						<p>
							Test Svelte components in a real browser environment:
						</p>

						<CodeBlock
							code={documentation_examples.component_testing}
							lang="typescript"
							theme="night-owl"
						/>

						<h4>Form Testing</h4>
						<p>Test form interactions and validation:</p>

						<CodeBlock
							code={documentation_examples.form_testing}
							lang="typescript"
							theme="night-owl"
						/>

						<h4>State Management</h4>
						<p>Test reactive state and component updates:</p>

						<CodeBlock
							code={documentation_examples.state_testing}
							lang="typescript"
							theme="night-owl"
						/>
					</div>
				</div>
			{:else if active_section === 'api-reference'}
				<div data-testid="section-api-reference">
					<h3 class="mb-6 text-3xl font-bold">API Reference</h3>

					<div class="prose prose-lg max-w-none">
						<h4>Essential Imports</h4>
						<CodeBlock
							code={documentation_examples.essential_imports}
							lang="typescript"
							theme="night-owl"
						/>

						<h4>Locator Methods</h4>
						<p>
							Always use locators for element queries (auto-retry
							built-in):
						</p>
						<ul>
							<li>
								<code>page.getByRole('button')</code> - Semantic queries
								(preferred)
							</li>
							<li>
								<code>page.getByText('Hello')</code> - Text content
							</li>
							<li>
								<code>page.getByTestId('submit')</code> - Test IDs
							</li>
							<li>
								<code>page.getByLabelText('Email')</code> - Form labels
							</li>
						</ul>

						<h4>Assertions</h4>
						<p>Always await element assertions:</p>
						<CodeBlock
							code={assertions_example}
							lang="typescript"
							theme="night-owl"
						/>

						<h4>User Interactions</h4>
						<CodeBlock
							code={user_interactions_example}
							lang="typescript"
							theme="night-owl"
						/>
					</div>
				</div>
			{:else if active_section === 'migration-guide'}
				<div data-testid="section-migration-guide">
					<h3 class="mb-6 text-3xl font-bold">Migration Guide</h3>

					<div class="prose prose-lg max-w-none">
						<h4>From @testing-library/svelte</h4>
						<p>
							Key changes when migrating to vitest-browser-svelte:
						</p>

						<div class="overflow-x-auto">
							<table class="table-zebra table">
								<thead>
									<tr>
										<th>@testing-library/svelte</th>
										<th>vitest-browser-svelte</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>screen.getByRole('button')</code></td>
										<td><code>page.getByRole('button')</code></td>
									</tr>
									<tr>
										<td
											><code>expect(element).toBeInTheDocument()</code
											></td
										>
										<td
											><code
												>await
												expect.element(element).toBeInTheDocument()</code
											></td
										>
									</tr>
									<tr>
										<td><code>fireEvent.click(element)</code></td>
										<td><code>await element.click()</code></td>
									</tr>
									<tr>
										<td
											><code
												>render(Component, {'{'} props {'}'})</code
											></td
										>
										<td><code>render(Component, props)</code></td>
									</tr>
								</tbody>
							</table>
						</div>

						<h4>From Jest</h4>
						<p>
							Vitest is largely compatible with Jest, but with better
							performance:
						</p>
						<ul>
							<li>Same assertion API: <code>expect()</code></li>
							<li>
								Same mocking: <code>vi.fn()</code> instead of
								<code>jest.fn()</code>
							</li>
							<li>
								Same lifecycle: <code>beforeEach</code>,
								<code>afterEach</code>
							</li>
							<li>Better TypeScript support out of the box</li>
						</ul>

						<h4>From Cypress</h4>
						<p>Component testing patterns translate well:</p>
						<CodeBlock
							code={cypress_migration_example}
							lang="typescript"
							theme="night-owl"
						/>
					</div>
				</div>
			{:else if active_section === 'troubleshooting'}
				<div data-testid="section-troubleshooting">
					<h3 class="mb-6 text-3xl font-bold">Troubleshooting</h3>

					<div class="prose prose-lg max-w-none">
						<h4>Common Issues</h4>

						<div
							class="bg-error/10 border-error/20 my-4 rounded-lg border p-4"
						>
							<h5 class="text-error font-bold">
								Error: "Expected 2 arguments, but got 0"
							</h5>
							<p>
								<strong>Cause:</strong> Mock function signature doesn't
								match actual function
							</p>
							<p>
								<strong>Solution:</strong> Update mock to accept correct
								number of arguments
							</p>
						</div>

						<div
							class="bg-error/10 border-error/20 my-4 rounded-lg border p-4"
						>
							<h5 class="text-error font-bold">
								Error: "lifecycle_outside_component"
							</h5>
							<p>
								<strong>Cause:</strong> Trying to call
								<code>getContext</code> in test
							</p>
							<p>
								<strong>Solution:</strong> Mock the context or skip the
								test for Svelte 5 migration
							</p>
						</div>

						<div
							class="bg-error/10 border-error/20 my-4 rounded-lg border p-4"
						>
							<h5 class="text-error font-bold">Test Hangs</h5>
							<p>
								<strong>Cause:</strong> Clicking submit buttons with SvelteKit
								enhance
							</p>
							<p>
								<strong>Solution:</strong> Test form state directly instead
								of clicking submit
							</p>
						</div>

						<h4>Performance Tips</h4>
						<ul>
							<li>
								Use <code>force: true</code> for elements that may be animating
							</li>
							<li>
								Set reasonable test timeouts (2000ms for browser
								tests)
							</li>
							<li>
								Use <code>.skip</code> for unimplemented tests during development
							</li>
							<li>Mock heavy dependencies to speed up tests</li>
						</ul>

						<h4>Debugging</h4>
						<CodeBlock
							code={debugging_example}
							lang="typescript"
							theme="night-owl"
						/>
					</div>
				</div>
			{:else if active_section === 'best-practices'}
				<div data-testid="section-best-practices">
					<h3 class="mb-6 text-3xl font-bold">Best Practices</h3>

					<div class="prose prose-lg max-w-none">
						<h4>Test Organization</h4>
						<ul>
							<li>
								<strong>Foundation First:</strong> Write all describe blocks
								first, implement incrementally
							</li>
							<li>
								<strong>Co-location:</strong> Keep tests next to source
								files
							</li>
							<li>
								<strong>Descriptive names:</strong> Test names should describe
								behavior, not implementation
							</li>
						</ul>

						<h4>Accessibility Testing</h4>
						<p>
							Always test with semantic queries to ensure
							accessibility:
						</p>
						<CodeBlock
							code={accessibility_example}
							lang="typescript"
							theme="night-owl"
						/>

						<h4>Mocking Strategy</h4>
						<ul>
							<li>Mock external dependencies, not internal logic</li>
							<li>Use realistic mock data</li>
							<li>Verify mocks are called correctly</li>
							<li>Reset mocks between tests</li>
						</ul>

						<h4>Performance Optimization</h4>
						<CodeBlock
							code={performance_example}
							lang="typescript"
							theme="night-owl"
						/>

						<h4>Coverage Goals</h4>
						<ul>
							<li>
								Aim for 100% test coverage using incremental approach
							</li>
							<li>Test all code paths and edge cases</li>
							<li>Focus on critical user journeys</li>
							<li>Use coverage reports to identify gaps</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>

<!-- Call to Action -->
<section class="bg-primary/5 px-4 py-24">
	<div class="container mx-auto max-w-4xl text-center">
		<h2 class="mb-4 text-4xl font-bold">Ready to Start Testing?</h2>
		<p class="text-base-content/70 mb-8 text-lg">
			Explore our interactive examples and start building reliable,
			well-tested Svelte applications.
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a
				href="/examples"
				class="btn btn-primary btn-lg"
				role="button"
			>
				<Code class_names="h-5 w-5" />
				View Examples
			</a>
			<a
				href="/components"
				class="btn btn-outline btn-lg"
				role="button"
			>
				<Eye class_names="h-5 w-5" />
				Component Library
			</a>
		</div>
	</div>
</section>
