<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		label?: string;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		label = '',
		onclick,
		...rest_props
	}: Props = $props();

	function handle_click(event: MouseEvent) {
		if (disabled || loading) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}

	// Derived CSS classes
	const base_classes =
		'btn font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';

	const variant_classes = {
		primary:
			'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
		secondary:
			'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
		danger:
			'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
	};

	const size_classes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg',
	};

	const disabled_classes = 'opacity-50 cursor-not-allowed';

	const computed_classes = [
		base_classes,
		variant_classes[variant],
		size_classes[size],
		(disabled || loading) && disabled_classes,
	]
		.filter(Boolean)
		.join(' ');

	// Compute the actual disabled state
	const is_disabled = disabled || loading;
</script>

<button
	{type}
	class={computed_classes}
	disabled={is_disabled}
	data-testid="button"
	onclick={handle_click}
	{...rest_props}
>
	{#if loading}
		<svg
			class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			data-testid="loading-spinner"
		>
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	{label}
</button>
