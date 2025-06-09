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
		aria_label = 'Cursor',
	}: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{height}
	{width}
	class={class_names}
	fill="none"
	viewBox="0 0 32 32"
	aria-label={aria_label}
	role="img"
	><path
		fill="color-mix(in srgb, currentColor 80%, black)"
		d="M3.75 9v14h24.5V9L16 2"
	/><path
		fill="color-mix(in srgb, currentColor 60%, black)"
		d="M16 16V2L3.75 9l24.5 14L16 30L3.75 23"
	/><path
		fill="color-mix(in srgb, currentColor 30%, white)"
		d="M28.25 9H16v21"
	/><path
		fill="color-mix(in srgb, currentColor 10%, white)"
		d="M3.75 9h24.5L16 16"
	/></svg
>
