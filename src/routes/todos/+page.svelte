<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="todos">
	<h1>Todos</h1>

	<form method="POST" action="?/add_todo">
		<input name="title" type="text" placeholder="Add todo" />
		<button type="submit">Add</button>
	</form>

	<ul>
		{#each data.todos as todo}
			<li class="todo-item">
				{todo.title}
			</li>
		{/each}
	</ul>
</div>
