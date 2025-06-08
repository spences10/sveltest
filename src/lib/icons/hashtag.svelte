<script lang="ts">
	interface Props {
		height?: string;
		width?: string;
		class_names?: string;
		aria_label?: string;
	}

	let {
		height = '24px',
		width = '24px',
		class_names,
		aria_label = 'Hashtag icon',
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
	aria-label={aria_label}
	role="img"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
	/>
</svg>
