<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		loading?: boolean;
		onclick?: () => void;
		type?: 'button' | 'submit' | 'reset';
		class_names?: string;
		children?: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		onclick,
		type = 'button',
		class_names = '',
		children,
	}: Props = $props();

	const base_classes = 'btn transition-all duration-200';
	const variant_classes = {
		primary: 'btn-primary hover:scale-105',
		secondary: 'btn-secondary hover:scale-105',
		outline: 'btn-outline hover:scale-105',
		ghost: 'btn-ghost hover:scale-105',
	};
	const size_classes = {
		sm: 'btn-sm',
		md: '',
		lg: 'btn-lg',
	};

	const button_classes = [
		base_classes,
		variant_classes[variant],
		size_classes[size],
		class_names,
	]
		.filter(Boolean)
		.join(' ');
</script>

<button
	{type}
	class={button_classes}
	{disabled}
	{onclick}
	aria-disabled={disabled || loading}
>
	{#if loading}
		<span class="loading loading-spinner loading-sm"></span>
		Loading...
	{:else}
		{@render children?.()}
	{/if}
</button>
