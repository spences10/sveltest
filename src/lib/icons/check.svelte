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
	stroke-width="1.5"
	stroke="currentColor"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="m4.5 12.75 6 6 9-13.5"
	/>
</svg>
