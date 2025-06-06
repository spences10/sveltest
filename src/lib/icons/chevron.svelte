<script lang="ts">
	type Direction = 'up' | 'down' | 'left' | 'right';

	interface Props {
		direction?: Direction;
		height?: string;
		width?: string;
		class_names?: string;
	}

	let {
		direction = 'down',
		height = '24px',
		width = '24px',
		class_names,
	}: Props = $props();

	const get_rotation = (dir: Direction): string => {
		const rotations = {
			up: '180deg',
			right: '270deg',
			down: '0deg',
			left: '90deg',
		};
		return rotations[dir];
	};

	const rotation = $derived(get_rotation(direction));
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
	style="transform: rotate({rotation}); transition: transform 0.2s ease;"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="m19.5 8.25-7.5 7.5-7.5-7.5"
	/>
</svg>
