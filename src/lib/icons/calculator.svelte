<script lang="ts">
	interface Props {
		height?: string;
		width?: string;
		class_names?: string;
	}

	let {
		height = '24px',
		width = '24px',
		class_names,
	}: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{height}
	{width}
	class={class_names}
	fill="none"
	viewBox="0 0 24 24"
	stroke="currentColor"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
	/>
</svg>
