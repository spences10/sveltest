<script lang="ts">
	import FeatureCard from '$lib/components/feature-card.svelte';
	import GitHubStatusPills from '$lib/components/github-status-pills.svelte';
	import Logo from '$lib/components/logo.svelte';
	import {
		BarChart,
		BookOpen,
		Calculator,
		CheckCircle,
		CircleDot,
		Claude,
		Clipboard,
		Cursor,
		ExternalLink,
		GitHub,
		GitHubFork,
		Heart,
		LightningBolt,
		Windsurf,
	} from '$lib/icons';
	import * as Fathom from 'fathom-client';
</script>

<svelte:head>
	<title>Sveltest - Comprehensive Testing Suite for Svelte</title>
	<meta
		name="description"
		content="A comprehensive collection of testing patterns and examples for modern Svelte applications"
	/>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1"
	/>
</svelte:head>

<!-- Hero section with enhanced design -->
<div class="relative overflow-hidden">
	<!-- Background decorative elements -->
	<div
		class="absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/5 to-accent/10"
	></div>
	<div
		class="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
	></div>
	<div
		class="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-secondary/5 blur-3xl"
	></div>

	<div class="relative hero flex min-h-screen items-center">
		<div class="hero-content mx-auto max-w-6xl px-4 text-center">
			<div class="space-y-8">
				<!-- Badge and Status Pills -->
				<div class="space-y-3">
					<div
						class="inline-flex items-center gap-3 rounded-full border border-success/20 bg-linear-to-r from-success/10 via-base-100/80 to-success/10 px-6 py-3 shadow-lg backdrop-blur-sm"
					>
						<CheckCircle class_names="h-4 w-4 text-success" />
						<span
							class="text-xs font-medium tracking-wider text-base-content/70 uppercase text-shadow-2xs sm:text-sm"
						>
							Battle-Tested in Production
						</span>
					</div>

					<GitHubStatusPills />
				</div>

				<!-- Main heading -->
				<div class="space-y-4">
					<!-- Mobile layout: Logo above text -->
					<div class="flex flex-col items-center gap-4 sm:hidden">
						<Logo
							height="64px"
							width="64px"
							class_names="text-primary"
						/>
						<h1
							class="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-6xl leading-tight font-black text-transparent"
						>
							Sveltest
						</h1>
					</div>

					<!-- Desktop layout: Logo beside text -->
					<h1
						class="hidden items-center justify-center gap-4 bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-7xl leading-tight font-black text-transparent sm:flex lg:text-8xl"
					>
						Sveltest
						<Logo
							height="80px"
							width="80px"
							class_names="lg:h-24 lg:w-24 text-primary"
						/>
					</h1>

					<p
						class="mx-auto max-w-4xl text-2xl leading-relaxed font-light text-base-content/80 lg:text-3xl"
					>
						A comprehensive collection of testing patterns and
						examples
						<br />
						<span class="text-xl text-base-content/60">
							for modern Svelte applications
						</span>
					</p>
				</div>

				<!-- CTA Buttons -->
				<div
					class="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row"
				>
					<a
						href="/docs/getting-started"
						class="btn gap-3 px-8 shadow-xl transition-all duration-300 btn-lg btn-primary hover:scale-105 hover:shadow-2xl"
						onclick={() => Fathom.trackEvent('get_started_clicked')}
					>
						<BookOpen class_names="h-6 w-6" />
						Get Started
					</a>
					<a
						href="/examples"
						class="btn gap-3 btn-outline px-8 backdrop-blur-sm transition-all duration-300 btn-lg hover:bg-base-100/10"
						onclick={() =>
							Fathom.trackEvent('explore_examples_clicked')}
					>
						<LightningBolt class_names="h-6 w-6" />
						Explore Examples
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Community Contribution Section -->
<div class="bg-base-200/30 px-4 py-24">
	<div class="container mx-auto max-w-6xl">
		<div class="mb-16 text-center">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2"
			>
				<GitHub class_names="text-accent h-4 w-4" />
				<span class="text-sm font-medium text-accent"
					>Open Source</span
				>
			</div>
			<h2
				class="mb-4 bg-linear-to-r from-base-content to-base-content/70 bg-clip-text text-5xl leading-normal font-black text-transparent"
			>
				Community Driven
			</h2>
			<p class="mx-auto max-w-3xl text-xl text-base-content/70">
				Sveltest is a community resource built by developers, for
				developers. Your contributions help make testing better for
				everyone in the Svelte ecosystem.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			<!-- Contribute Code -->
			<FeatureCard
				icon={GitHub}
				title="Contribute Code"
				description="Add new testing examples, improve existing patterns, or help with documentation. Every contribution makes the resource better."
				href="https://github.com/spences10/sveltest"
				button_text="View on GitHub"
				color_scheme="primary"
				onclick_event={() =>
					Fathom.trackEvent('contribute_code_clicked')}
			/>

			<!-- Report Issues -->
			<FeatureCard
				icon={CircleDot}
				title="Report Issues"
				description="Found a bug or have a suggestion? Open an issue on GitHub. Your feedback helps us improve the testing experience."
				href="https://github.com/spences10/sveltest/issues"
				button_text="Report Issue"
				color_scheme="secondary"
				onclick_event={() =>
					Fathom.trackEvent('community_report_issue_clicked')}
			/>

			<!-- Share Knowledge -->
			<div class="md:col-span-2 lg:col-span-1">
				<FeatureCard
					icon={Heart}
					title="Share Knowledge"
					description="Share your testing patterns, contribute examples from your projects, or help others learn through discussions."
					href="https://github.com/spences10/sveltest/discussions"
					button_text="Join Discussion"
					color_scheme="accent"
					onclick_event={() =>
						Fathom.trackEvent('join_discussion_clicked')}
				/>
			</div>
		</div>

		<!-- GitHub Stats -->
		<div class="mt-16">
			<div
				class="card mx-auto max-w-4xl border border-base-300/50 bg-linear-to-br from-base-100/60 to-base-100/40 shadow-xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<div class="mb-6 text-center">
						<h3 class="mb-2 text-2xl font-bold">
							Join the Community
						</h3>
						<p class="text-base-content/70">
							Help us build the most comprehensive Svelte testing
							resource
						</p>
					</div>
					<div
						class="flex flex-col items-center justify-center gap-4 sm:flex-row"
					>
						<a
							href="https://github.com/spences10/sveltest"
							target="_blank"
							rel="noopener noreferrer"
							class="btn gap-3 btn-outline px-8 backdrop-blur-sm transition-all duration-300 btn-lg hover:bg-base-100/10"
							onclick={() =>
								Fathom.trackEvent('star_on_github_clicked')}
						>
							<GitHub class_names="h-6 w-6" />
							Star on GitHub
							<ExternalLink class_names="h-4 w-4 opacity-60" />
						</a>
						<a
							href="https://github.com/spences10/sveltest/fork"
							target="_blank"
							rel="noopener noreferrer"
							class="btn gap-3 px-8 shadow-xl transition-all duration-300 btn-lg btn-primary hover:scale-105"
							onclick={() =>
								Fathom.trackEvent('fork_and_contribute_clicked')}
						>
							<GitHubFork class_names="h-6 w-6" />
							Fork & Contribute
							<ExternalLink class_names="h-4 w-4 opacity-60" />
						</a>
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
				class="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
			>
				<BarChart class_names="text-primary h-4 w-4" />
				<span class="text-sm font-medium text-primary">Features</span>
			</div>
			<h2
				class="mb-4 bg-linear-to-r from-base-content to-base-content/70 bg-clip-text text-5xl leading-normal font-black text-transparent"
			>
				Everything You Need
			</h2>
			<p class="mx-auto max-w-2xl text-xl text-base-content/70">
				Comprehensive testing tools and examples for building robust
				Svelte applications
			</p>
		</div>

		<!-- AI Testing Rules Row -->
		<div
			class="mb-12 grid auto-rows-fr grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
		>
			<!-- Cursor Rules Card -->
			<FeatureCard
				icon={Cursor}
				title="Cursor Rules"
				description="Pre-configured AI assistant rules for Cursor that enforce testing best practices automatically when editing test files"
				href="https://github.com/spences10/sveltest/blob/main/.cursor/rules/testing.mdc"
				button_text="View Rules"
				color_scheme="info"
				button_icon={GitHub}
				button_size="btn-lg"
				button_classes="w-full text-lg"
				button_icon_classes="h-5 w-5"
				onclick_event={() =>
					Fathom.trackEvent('cursor_rules_clicked')}
			/>

			<!-- Windsurf Rules Card -->
			<FeatureCard
				icon={Windsurf}
				title="Windsurf Rules"
				description="Modern rule system with trigger-based activation for Windsurf. Same comprehensive patterns optimized for advanced AI capabilities"
				href="https://github.com/spences10/sveltest/blob/main/.windsurf/rules/testing.md"
				button_text="View Rules"
				color_scheme="info"
				button_icon={GitHub}
				button_size="btn-lg"
				button_classes="w-full text-lg"
				button_icon_classes="h-5 w-5"
				onclick_event={() =>
					Fathom.trackEvent('windsurf_rules_clicked')}
			/>

			<!-- Claude Code Rules Card -->
			<FeatureCard
				icon={Claude}
				title="CLAUDE.md"
				description="Comprehensive guidance for Claude Code with personas, testing patterns, and project-specific rules for optimal AI assistance"
				href="https://github.com/spences10/sveltest/blob/main/CLAUDE.md"
				button_text="View Guide"
				color_scheme="info"
				button_icon={GitHub}
				button_size="btn-lg"
				button_classes="w-full text-lg"
				button_icon_classes="h-5 w-5"
				onclick_event={() =>
					Fathom.trackEvent('claude_guide_clicked')}
			/>

			<!-- Claude Skill Card -->
			<FeatureCard
				icon={Claude}
				title="Claude Code Skill"
				description="Comprehensive testing tools and examples for building robust Svelte applications. Auto-invoked skill for Claude Code with complete test patterns"
				href="https://github.com/spences10/sveltest/tree/main/.agents/skills/svelte-testing"
				button_text="View Skill"
				color_scheme="info"
				button_icon={GitHub}
				button_size="btn-lg"
				button_classes="w-full text-lg"
				button_icon_classes="h-5 w-5"
				onclick_event={() =>
					Fathom.trackEvent('claude_skill_clicked')}
			/>
		</div>

		<!-- Feature grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			<!-- Testing Types Card -->
			<div class="group relative">
				<div
					class="hover:shadow-3xl card border border-base-300/50 bg-base-100/80 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div
							class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 transition-transform duration-300 group-hover:scale-110"
						>
							<Calculator class_names="text-primary h-8 w-8" />
						</div>
						<h3 class="mb-4 text-2xl font-bold">Testing Types</h3>
						<p class="mb-6 leading-relaxed text-base-content/70">
							Unit, integration, and component testing examples using
							Vitest and vitest-browser-svelte
						</p>
						<div class="flex flex-wrap gap-2">
							<div class="badge badge-sm badge-primary">
								Unit Tests
							</div>
							<div class="badge badge-sm badge-secondary">
								Integration
							</div>
							<div class="badge badge-sm badge-accent">E2E</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Best Practices Card -->
			<div class="group relative">
				<div
					class="hover:shadow-3xl card border border-base-300/50 bg-base-100/80 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div
							class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-secondary/20 to-secondary/10 transition-transform duration-300 group-hover:scale-110"
						>
							<CheckCircle class_names="text-secondary h-8 w-8" />
						</div>
						<h3 class="mb-4 text-2xl font-bold">Best Practices</h3>
						<p class="mb-6 leading-relaxed text-base-content/70">
							Learn testing best practices and patterns specific to
							Svelte applications
						</p>
						<div class="flex flex-wrap gap-2">
							<div class="badge badge-sm badge-success">Patterns</div>
							<div class="badge badge-sm badge-info">Guidelines</div>
							<div class="badge badge-sm badge-warning">Tips</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Real-world Examples Card -->
			<div class="group relative md:col-span-2 lg:col-span-1">
				<div
					class="hover:shadow-3xl card border border-base-300/50 bg-base-100/80 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
				>
					<div class="card-body p-8">
						<div
							class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-accent/20 to-accent/10 transition-transform duration-300 group-hover:scale-110"
						>
							<BarChart class_names="text-accent h-8 w-8" />
						</div>
						<h3 class="mb-4 text-2xl font-bold">
							Real-world Examples
						</h3>
						<p class="mb-6 leading-relaxed text-base-content/70">
							Practical testing scenarios you'll encounter in
							production applications
						</p>
						<div class="flex flex-wrap gap-2">
							<div class="badge badge-sm badge-primary">Forms</div>
							<div class="badge badge-sm badge-secondary">APIs</div>
							<div class="badge badge-sm badge-accent">
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
				class="card mx-auto max-w-4xl border border-primary/20 bg-linear-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-12">
					<h2 class="mb-4 text-3xl font-bold">
						Ready to Start Testing?
					</h2>
					<p
						class="mx-auto mb-8 max-w-2xl text-lg text-base-content/70"
					>
						Dive into our comprehensive examples and start building
						more reliable Svelte applications today.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/docs/getting-started"
							class="btn gap-2 px-8 btn-lg btn-primary"
							onclick={() =>
								Fathom.trackEvent('bottom_get_started_clicked')}
						>
							<BookOpen class_names="h-5 w-5" />
							Get Started
						</a>
						<a
							href="/examples"
							class="btn gap-2 px-8 btn-lg btn-secondary"
							onclick={() =>
								Fathom.trackEvent('bottom_explore_examples_clicked')}
						>
							<LightningBolt class_names="h-5 w-5" />
							Explore Examples
						</a>
						<a
							href="/todos"
							class="btn gap-2 btn-outline px-8 btn-lg"
							onclick={() =>
								Fathom.trackEvent('try_todo_manager_clicked')}
						>
							<Clipboard class_names="h-5 w-5" />
							Try Todo Manager
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
