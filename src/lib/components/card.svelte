<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		variant?: 'default' | 'elevated' | 'outlined' | 'filled';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
		clickable?: boolean;
		disabled?: boolean;
		title?: string;
		subtitle?: string;
		content_text?: string; // Workaround for snippet limitation
		footer_text?: string; // Workaround for snippet limitation
		image_src?: string;
		image_alt?: string;
	}

	let {
		variant = 'default',
		padding = 'md',
		rounded = 'md',
		clickable = false,
		disabled = false,
		title = '',
		subtitle = '',
		content_text = '',
		footer_text = '',
		image_src = '',
		image_alt = '',
		...rest_props
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		click: MouseEvent;
		focus: FocusEvent;
		blur: FocusEvent;
	}>();

	function handle_click(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			return;
		}
		if (clickable) {
			dispatch('click', event);
		}
	}

	function handle_focus(event: FocusEvent) {
		if (clickable && !disabled) {
			dispatch('focus', event);
		}
	}

	function handle_blur(event: FocusEvent) {
		if (clickable && !disabled) {
			dispatch('blur', event);
		}
	}

	// CSS classes
	const base_classes = 'block w-full transition-colors';

	const variant_classes = {
		default: 'bg-white border border-gray-200',
		elevated: 'bg-white shadow-md border border-gray-100',
		outlined: 'bg-white border-2 border-gray-300',
		filled: 'bg-gray-50 border border-gray-200',
	};

	const padding_classes = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6',
	};

	const rounded_classes = {
		none: '',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
	};

	const clickable_classes =
		'cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
	const disabled_classes = 'opacity-50 cursor-not-allowed';

	const computed_classes = [
		base_classes,
		variant_classes[variant],
		padding_classes[padding],
		rounded_classes[rounded],
		clickable && !disabled && clickable_classes,
		disabled && disabled_classes,
	]
		.filter(Boolean)
		.join(' ');

	// Content classes
	const title_classes = 'text-lg font-semibold text-gray-900 mb-1';
	const subtitle_classes = 'text-sm text-gray-600 mb-3';
	const content_classes = 'text-gray-700 mb-4';
	const footer_classes =
		'text-sm text-gray-500 border-t border-gray-200 pt-3 mt-4';
	const image_classes = 'w-full h-48 object-cover mb-4';
</script>

<div
	class={computed_classes}
	data-testid="card"
	role={clickable ? 'button' : undefined}
	tabindex={clickable && !disabled ? 0 : undefined}
	aria-disabled={disabled ? 'true' : undefined}
	onclick={handle_click}
	onfocus={handle_focus}
	onblur={handle_blur}
	{...rest_props}
>
	{#if image_src}
		<img
			src={image_src}
			alt={image_alt}
			class={image_classes}
			data-testid="card-image"
		/>
	{/if}

	{#if title}
		<h3 class={title_classes} data-testid="card-title">
			{title}
		</h3>
	{/if}

	{#if subtitle}
		<p class={subtitle_classes} data-testid="card-subtitle">
			{subtitle}
		</p>
	{/if}

	{#if content_text}
		<div class={content_classes} data-testid="card-content">
			<p>{content_text}</p>
		</div>
	{/if}

	{#if footer_text}
		<div class={footer_classes} data-testid="card-footer">
			<p>{footer_text}</p>
		</div>
	{/if}
</div>
