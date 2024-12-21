<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<div class="prose max-w-none">
	<h1>Form Actions Testing Example</h1>

	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Todos</h2>

			<form
				method="POST"
				action="?/add_todo"
				use:enhance
				class="my-4"
			>
				<div class="form-control">
					<label class="label" for="title">
						<span class="label-text">Todo Title</span>
					</label>
					<div class="flex gap-2">
						<input
							name="title"
							id="title"
							type="text"
							placeholder="Add todo"
							class="input input-bordered flex-1"
						/>
						<button type="submit" class="btn btn-primary">Add</button>
					</div>
				</div>
			</form>

			{#if form?.error}
				<div class="alert alert-error mt-4">
					<span>{form.error}</span>
				</div>
			{/if}

			<ul class="menu rounded-box bg-base-200">
				{#each data.todos as todo}
					<li class="todo-item">
						<span>{todo.title}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
