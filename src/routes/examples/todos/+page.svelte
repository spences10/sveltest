<script lang="ts">
	import TodoManager from '$lib/components/todo-manager.svelte';
	import { ArrowLeft, Document } from '$lib/icons';
</script>

<svelte:head>
	<title>Form Actions Testing - Sveltest</title>
	<meta
		name="description"
		content="Interactive todo demonstration for testing form actions with server-side validation"
	/>
</svelte:head>

<div class="min-h-screen px-4 py-12">
	<div class="container mx-auto max-w-4xl">
		<!-- Page Header -->
		<div class="mb-12 text-center">
			<div
				class="bg-base-100/80 border-base-300/50 mb-8 inline-flex items-center gap-3 rounded-full border px-6 py-3 shadow-lg backdrop-blur-sm"
			>
				<div
					class="from-success to-success/70 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br"
				>
					<Document class_names="text-success-content h-4 w-4" />
				</div>
				<span
					class="text-base-content/70 text-sm font-medium tracking-wider uppercase"
				>
					Form Actions Testing
				</span>
			</div>

			<h1
				class="from-success via-success/80 to-success/60 mb-4 bg-gradient-to-r bg-clip-text text-5xl font-black text-transparent"
			>
				Form Actions Testing
			</h1>
			<p
				class="text-base-content/70 mx-auto max-w-2xl text-lg leading-relaxed"
			>
				Interactive todo demonstration for testing form actions
				<br />
				<span class="text-base-content/60 text-base"
					>Now using local storage with comprehensive testing
					capabilities</span
				>
			</p>
		</div>

		<!-- Todo Manager Component -->
		<div
			class="bg-base-100/80 rounded-3xl p-8 shadow-2xl backdrop-blur-sm"
		>
			<TodoManager
				title="Form Actions Demo"
				showStats={true}
				enableSampleData={true}
			/>
		</div>

		<!-- Navigation -->
		<div class="mt-8 text-center">
			<a href="/examples" class="btn btn-outline gap-2">
				<ArrowLeft class_names="h-4 w-4" />
				Back to Examples
			</a>
		</div>
	</div>
</div>
