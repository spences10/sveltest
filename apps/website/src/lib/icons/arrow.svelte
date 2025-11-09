<script lang="ts">
	type Direction = 'up' | 'down' | 'left' | 'right' | 'up-right';

	interface Props {
		direction?: Direction;
		height?: string;
		width?: string;
		class_names?: string;
		aria_label?: string;
	}

	let {
		direction = 'right',
		height = '24px',
		width = '24px',
		class_names,
		aria_label,
	}: Props = $props();

	const get_rotation = (dir: Direction): string => {
		const rotations = {
			up: '270deg',
			right: '0deg',
			down: '90deg',
			left: '180deg',
			'up-right': '315deg',
		};
		return rotations[dir];
	};

	const get_default_aria_label = (dir: Direction): string => {
		const labels = {
			up: 'Arrow pointing up',
			right: 'Arrow pointing right',
			down: 'Arrow pointing down',
			left: 'Arrow pointing left',
			'up-right': 'Arrow pointing up-right',
		};
		return labels[dir];
	};

	const rotation = $derived(get_rotation(direction));
	const computed_aria_label = $derived(
		aria_label || get_default_aria_label(direction),
	);
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
	aria-label={computed_aria_label}
	role="img"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
	/>
</svg>
