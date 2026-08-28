<script lang="ts">
	import TodoManager from '$lib/components/todo-manager.svelte';
	import {
		BarChart,
		CheckCircle,
		Clipboard,
		Heart,
		LightningBolt,
	} from '$lib/icons';
</script>

<svelte:head>
	<title>Todo Manager - Sveltest</title>
	<meta
		name="description"
		content="Interactive todo management with comprehensive testing examples"
	/>
</svelte:head>

<!-- Modern gradient background with glass morphism -->
<div
	class="min-h-screen bg-linear-to-br from-primary/10 via-secondary/5 to-accent/10"
>
	<div class="container mx-auto max-w-6xl px-4 py-8">
		<!-- Hero Section with Glass Effect -->
		<div class="hero mb-12">
			<div class="hero-content text-center">
				<div class="max-w-2xl">
					<div class="mb-6">
						<div
							class="inline-flex items-center gap-3 rounded-full bg-base-100/80 px-6 py-3 shadow-lg backdrop-blur-sm"
						>
							<div class="text-3xl">✨</div>
							<span
								class="text-sm font-medium tracking-wider text-base-content/70 uppercase"
							>
								Productivity Suite
							</span>
						</div>
					</div>

					<h1
						class="mb-6 bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-6xl leading-normal font-black text-transparent"
					>
						Todo Manager
					</h1>

					<p
						class="mb-8 text-xl leading-relaxed text-base-content/70"
					>
						A modern, feature-rich todo application with local storage
						<br />
						<span class="text-lg text-base-content/60"
							>Perfect for testing user interactions and data
							persistence</span
						>
					</p>

					<!-- Feature highlights -->
					<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div
							class="flex flex-col items-center gap-2 rounded-xl bg-base-100/60 p-4 backdrop-blur-sm"
						>
							<CheckCircle class_names="text-success h-8 w-8" />
							<span class="text-sm font-medium text-base-content/80"
								>Task Management</span
							>
						</div>
						<div
							class="flex flex-col items-center gap-2 rounded-xl bg-base-100/60 p-4 backdrop-blur-sm"
						>
							<Clipboard class_names="text-info h-8 w-8" />
							<span class="text-sm font-medium text-base-content/80"
								>Local Storage</span
							>
						</div>
						<div
							class="flex flex-col items-center gap-2 rounded-xl bg-base-100/60 p-4 backdrop-blur-sm"
						>
							<BarChart class_names="text-warning h-8 w-8" />
							<span class="text-sm font-medium text-base-content/80"
								>Progress Tracking</span
							>
						</div>
						<div
							class="flex flex-col items-center gap-2 rounded-xl bg-base-100/60 p-4 backdrop-blur-sm"
						>
							<LightningBolt class_names="text-accent h-8 w-8" />
							<span class="text-sm font-medium text-base-content/80"
								>Real-time Updates</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Todo Manager Component -->
		<div
			class="rounded-3xl bg-base-100/80 p-8 shadow-2xl backdrop-blur-sm"
		>
			<TodoManager
				title="Personal Task Manager"
				showStats={true}
				enableSampleData={true}
			/>
		</div>

		<!-- Additional Info -->
		<div class="mt-12 text-center">
			<div
				class="mx-auto max-w-2xl rounded-2xl bg-base-100/60 p-6 backdrop-blur-sm"
			>
				<div class="mb-4 flex justify-center">
					<Heart class_names="text-error h-8 w-8" />
				</div>
				<h3 class="mb-2 text-lg font-semibold text-base-content">
					Built for Testing
				</h3>
				<p class="text-sm leading-relaxed text-base-content/70">
					This todo manager includes comprehensive test attributes and
					is designed to demonstrate various testing scenarios
					including user interactions, data persistence, and state
					management.
				</p>
			</div>
		</div>
	</div>
</div>
