<script lang="ts">
	let { data } = $props();
</script>

<div class="prose max-w-none">
	<h1>Testing Examples</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Unit Testing</h2>
				<p>
					Examples of testing utility functions and business logic
				</p>
				<div class="card-actions">
					<a href="/examples/unit" class="btn btn-primary"
						>View Examples</a
					>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Form Actions</h2>
				<p>
					Testing form actions and server-side validation with Todos
				</p>
				<div class="card-actions">
					<a href="/examples/todos" class="btn btn-primary"
						>View Examples</a
					>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Component Testing</h2>
				<p>
					Testing Svelte components with Vitest and Testing Library
				</p>
				<div class="card-actions">
					<a href="/examples/component" class="btn btn-primary"
						>View Examples</a
					>
				</div>
			</div>
		</div>
	</div>
</div>
