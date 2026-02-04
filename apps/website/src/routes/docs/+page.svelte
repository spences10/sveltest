<script lang="ts">
	import CodeBlock from '$lib/components/code-block.svelte';
	import DocCard from '$lib/components/doc-card.svelte';
	import DocsSearch from '$lib/components/docs-search.svelte';
	import { documentation_examples } from '$lib/examples/code-examples';
	import {
		Arrow,
		BookOpen,
		CheckCircle,
		Clipboard,
		Code,
		Document,
		ExternalLink,
		Eye,
		LightningBolt,
		Settings,
	} from '$lib/icons';
	const { data } = $props();
	const { topics, topic_categories } = data;

	// Icon mapping for topics
	const icon_map = {
		'getting-started': BookOpen,
		'api-reference': Settings,
		'component-testing': Code,
		'ssr-testing': Document,
		'server-testing': Settings,
		'e2e-testing': Eye,
		'context-testing': Code,
		'remote-functions-testing': LightningBolt,
		'runes-testing': LightningBolt,
		'migration-guide': Arrow,
		troubleshooting: CheckCircle,
		'ci-cd': Settings,
		'best-practices': LightningBolt,
	};

	// Color mapping for topics
	const color_map = {
		'getting-started': 'primary',
		'api-reference': 'accent',
		'component-testing': 'secondary',
		'ssr-testing': 'info',
		'server-testing': 'warning',
		'e2e-testing': 'success',
		'context-testing': 'primary',
		'remote-functions-testing': 'accent',
		'runes-testing': 'secondary',
		'migration-guide': 'info',
		troubleshooting: 'success',
		'ci-cd': 'accent',
		'best-practices': 'warning',
	};

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

	let copied_code = $state('');

	// LLM documentation formats configuration
	const llm_formats = {
		standard: [
			{
				title: 'LLMs Index',
				href: '/llms.txt',
				description: 'Standard llms.txt file with navigation links',
				button_class: 'btn-outline',
				icon: BookOpen,
				color: 'primary',
			},
			{
				title: 'Full Documentation',
				href: '/llms-full.txt',
				description:
					'Complete testing documentation with all examples and patterns',
				button_class: 'btn-primary',
				icon: Document,
				color: 'secondary',
			},
		],
	};

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
	class="from-primary/10 via-secondary/5 to-accent/10 bg-linear-to-br px-4 py-24"
>
	<div class="container mx-auto max-w-7xl text-center">
		<div class="mb-8">
			<h1 class="mb-6 text-6xl font-black tracking-tight">
				<span
					class="from-primary to-secondary bg-linear-to-r bg-clip-text text-transparent"
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

		<!-- Search Section -->
		<div class="mx-auto max-w-2xl">
			<DocsSearch />
		</div>
	</div>
</section>

<!-- Documentation Navigation - Prominent Section -->
<section
	class="from-primary/5 to-secondary/5 bg-linear-to-br px-4 py-24"
>
	<div class="container mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2
				class="from-primary to-secondary mb-4 bg-linear-to-r bg-clip-text text-5xl font-bold text-transparent"
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

		<!-- Grouped Documentation Links -->
		{#each topic_categories as category}
			<div class="mb-12">
				<h3 class="text-base-content/80 mb-6 text-2xl font-bold">
					{category.name}
				</h3>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each category.topics as topic}
						<DocCard
							href="/docs/{topic.slug}"
							title={topic.title}
							description={topic.description}
							icon={icon_map[topic.slug as keyof typeof icon_map] ||
								BookOpen}
							color_scheme={color_map[
								topic.slug as keyof typeof color_map
							] || 'primary'}
							test_id="doc-link-{topic.slug}"
						/>
					{/each}
				</div>
			</div>
		{/each}

		<!-- Quick Access Bar -->
		<div
			class="from-primary/5 via-secondary/5 to-accent/5 border-base-300/50 rounded-2xl border bg-linear-to-br p-8 shadow-lg backdrop-blur-sm"
		>
			<div class="flex flex-col gap-6">
				<!-- Content -->
				<div>
					<div
						class="bg-primary/10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
					>
						<Code class_names="text-primary h-4 w-4" />
						<span class="text-primary text-sm font-medium">
							LLM Documentation
						</span>
					</div>
					<h3 class="mb-4 text-3xl font-bold">
						Documentation for LLMs
					</h3>
					<p class="text-base-content/70 mb-4">
						We support the <a
							href="https://llms.txt"
							class="link"
							target="_blank">llms.txt convention</a
						> for making documentation available to large language models
						and the applications that make use of them.
					</p>

					<h4 class="mb-2 text-xl font-semibold">
						Available Formats
					</h4>
					<p class="text-base-content/70 mb-3">
						We provide documentation in two formats following the
						llms.txt standard:
					</p>

					<ul class="text-base-content/70 mb-4 ml-5 list-disc">
						{#each llm_formats.standard as format}
							<li>
								<strong>{format.title}</strong> - {format.description}
							</li>
						{/each}
					</ul>

					<p class="text-base-content/70 mt-4">
						Using the appropriate format helps LLMs provide more
						accurate assistance with less token usage, making
						interactions more efficient and effective.
					</p>
				</div>

				<!-- Buttons underneath -->
				<div
					class="flex flex-col gap-3 sm:justify-center md:flex-row"
				>
					{#each llm_formats.standard as format}
						<a
							href={format.href}
							class="btn {format.button_class} btn-lg flex-1 justify-between transition-all duration-300"
							target="_blank"
						>
							{format.title}
							<ExternalLink class_names="h-5 w-5" />
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Documentation Navigation - Prominent Section -->
<section
	class="from-primary/10 to-secondary/10 bg-linear-to-r px-4 py-20"
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

		<!-- Grouped Documentation Links Grid -->
		{#each topic_categories as category}
			<div class="mb-10">
				<h3 class="text-base-content/80 mb-4 text-xl font-bold">
					{category.name}
				</h3>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each category.topics as topic, index}
						<DocCard
							href="/docs/{topic.slug}"
							title={topic.title}
							description={topic.description}
							icon={icon_map[topic.slug as keyof typeof icon_map] ||
								BookOpen}
							color_scheme={color_map[
								topic.slug as keyof typeof color_map
							] || 'primary'}
							{index}
							test_id="docs-link-{topic.slug}"
						/>
					{/each}
				</div>
			</div>
		{/each}

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
