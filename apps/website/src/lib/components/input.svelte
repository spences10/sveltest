<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<
		HTMLInputAttributes,
		'value' | 'size' | 'id' | 'prefix'
	> {
		// Custom props
		value?: string | number;
		label?: string;
		error?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?:
			| 'default'
			| 'success'
			| 'error'
			| 'primary'
			| 'secondary'
			| 'accent'
			| 'info'
			| 'warning';
		id?: string;
		// Support for additional content
		prefix?: Snippet;
		suffix?: Snippet;
	}

	// Generate SSR-safe unique ID at top level
	const unique_id = $props.id();

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		label = '',
		error = '',
		disabled = false,
		required = false,
		readonly = false,
		size = 'md',
		variant = 'default',
		id,
		name = '',
		autocomplete,
		maxlength,
		minlength,
		pattern,
		prefix,
		suffix,
		...rest
	}: Props = $props();

	const input_id = id || `input-${unique_id}`;

	// DaisyUI classes
	const base_classes = 'input w-full max-w-full';

	const size_classes = {
		xs: 'input-xs',
		sm: 'input-sm',
		md: 'input-md',
		lg: 'input-lg',
		xl: 'input-xl',
	};

	const variant_classes = {
		default: '',
		primary: 'input-primary',
		secondary: 'input-secondary',
		accent: 'input-accent',
		info: 'input-info',
		success: 'input-success',
		warning: 'input-warning',
		error: 'input-error',
	};

	const label_classes = 'label';
	const label_text_classes = 'label-text';
	const error_classes = 'label-text-alt text-error';

	// Enhanced accessibility
	const has_error = $derived(!!error);
	const effective_variant = $derived(has_error ? 'error' : variant);
</script>

{#if label}
	<label class={label_classes} for={input_id}>
		<span class={label_text_classes} data-testid="input-label">
			{label}
			{#if required}
				<span
					class="text-error"
					aria-label="required"
					data-testid="required-indicator">*</span
				>
			{/if}
		</span>
	</label>
{/if}

<div class="relative flex items-center">
	{#if prefix}
		<div class="absolute left-3 z-10">
			{@render prefix()}
		</div>
	{/if}

	<input
		{type}
		id={input_id}
		{name}
		{placeholder}
		{disabled}
		{readonly}
		{required}
		{maxlength}
		{minlength}
		{pattern}
		{autocomplete}
		class={[
			base_classes,
			size_classes[size],
			variant_classes[effective_variant],
			prefix ? 'pl-10' : '',
			suffix ? 'pr-10' : '',
		]}
		bind:value
		data-testid="input"
		aria-invalid={has_error}
		aria-describedby={has_error ? `${input_id}-error` : undefined}
		{...rest}
	/>

	{#if suffix}
		<div class="absolute right-3 z-10">
			{@render suffix()}
		</div>
	{/if}
</div>

{#if has_error}
	<div class={label_classes}>
		<span
			id="{input_id}-error"
			class={error_classes}
			data-testid="input-error"
			role="alert"
			aria-live="polite"
		>
			{error}
		</span>
	</div>
{/if}
