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
		aria_label = 'Menu icon',
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
		stroke-width="2"
		d="M4 6h16M4 12h16M4 18h16"
	/>
</svg>
