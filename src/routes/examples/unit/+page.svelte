<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="prose max-w-none">
	<h1>Unit Testing Examples</h1>

	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Calculator Example</h2>

			<form method="POST" action="?/calculate" use:enhance>
				<div class="form-control">
					<label class="label" for="num1">
						<span class="label-text">First Number</span>
					</label>
					<input
						type="number"
						name="num1"
						id="num1"
						class="input input-bordered"
						required
					/>
				</div>

				<div class="form-control mt-4">
					<label class="label" for="num2">
						<span class="label-text">Second Number</span>
					</label>
					<input
						type="number"
						name="num2"
						id="num2"
						class="input input-bordered"
						required
					/>
				</div>

				<button class="btn btn-primary mt-6">Calculate Sum</button>
			</form>

			{#if form?.error}
				<div class="alert alert-error mt-4">
					<span>{form.error}</span>
				</div>
			{:else if form?.result !== undefined}
				<div class="alert alert-success mt-4">
					<span>Result: {form.result}</span>
				</div>
			{/if}
		</div>
	</div>
</div>
