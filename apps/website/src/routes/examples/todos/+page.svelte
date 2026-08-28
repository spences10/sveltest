<script lang="ts">
	import TodoManager from '$lib/components/todo-manager.svelte';
	import { Arrow, Document } from '$lib/icons';
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
				class="mb-8 inline-flex items-center gap-3 rounded-full border border-base-300/50 bg-base-100/80 px-6 py-3 shadow-lg backdrop-blur-sm"
			>
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-success to-success/70"
				>
					<Document class_names="text-success-content h-4 w-4" />
				</div>
				<span
					class="text-sm font-medium tracking-wider text-base-content/70 uppercase"
				>
					Form Actions Testing
				</span>
			</div>

			<h1
				class="mb-4 bg-linear-to-r from-success via-success/80 to-success/60 bg-clip-text text-5xl leading-normal font-black text-transparent"
			>
				Form Actions Testing
			</h1>
			<p
				class="mx-auto max-w-2xl text-lg leading-relaxed text-base-content/70"
			>
				Interactive todo demonstration for testing form actions
				<br />
				<span class="text-base text-base-content/60"
					>Now using local storage with comprehensive testing
					capabilities</span
				>
			</p>
		</div>

		<!-- Todo Manager Component -->
		<div
			class="rounded-3xl bg-base-100/80 p-8 shadow-2xl backdrop-blur-sm"
		>
			<TodoManager
				title="Form Actions Demo"
				showStats={true}
				enableSampleData={true}
			/>
		</div>

		<!-- Navigation -->
		<div class="mt-8 text-center">
			<a href="/examples" class="btn gap-2 btn-outline">
				<Arrow direction="left" class_names="h-4 w-4" />
				Back to Examples
			</a>
		</div>
	</div>
</div>
