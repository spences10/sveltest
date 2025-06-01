<script lang="ts">
	interface Props {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
		value?: string | number;
		placeholder?: string;
		label?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		readonly?: boolean;
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
		name?: string;
		autocomplete?:
			| 'on'
			| 'off'
			| 'name'
			| 'email'
			| 'username'
			| 'current-password'
			| 'new-password'
			| 'tel'
			| 'url'
			| string;
		maxlength?: number;
		minlength?: number;
		pattern?: string;
		oninput?: (event: Event) => void;
		onchange?: (event: Event) => void;
		onfocus?: (event: FocusEvent) => void;
		onblur?: (event: FocusEvent) => void;
	}

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
		id = '',
		name = '',
		autocomplete = '',
		maxlength,
		minlength,
		pattern,
		oninput,
		onchange,
		onfocus,
		onblur,
		...rest_props
	}: Props = $props();

	function handle_input(event: Event) {
		const target = event.target as HTMLInputElement;
		if (type === 'number') {
			value = target.valueAsNumber || 0;
		} else {
			value = target.value;
		}
		oninput?.(event);
	}

	function handle_change(event: Event) {
		onchange?.(event);
	}

	function handle_focus(event: FocusEvent) {
		onfocus?.(event);
	}

	function handle_blur(event: FocusEvent) {
		onblur?.(event);
	}

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

	const computed_input_classes = [
		base_classes,
		size_classes[size],
		variant_classes[error ? 'error' : variant],
	]
		.filter(Boolean)
		.join(' ');

	const label_classes = 'label';
	const label_text_classes = 'label-text';
	const error_classes = 'label-text-alt text-error';

	// Generate unique ID if not provided
	const input_id =
		id || `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

{#if label}
	<label class={label_classes} for={input_id}>
		<span class={label_text_classes} data-testid="input-label">
			{label}
			{#if required}
				<span class="text-error" data-testid="required-indicator"
					>*</span
				>
			{/if}
		</span>
	</label>
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
	class={computed_input_classes}
	bind:value
	oninput={handle_input}
	onchange={handle_change}
	onfocus={handle_focus}
	onblur={handle_blur}
	data-testid="input"
	aria-invalid={error ? 'true' : 'false'}
	aria-describedby={error ? `${input_id}-error` : undefined}
	{...rest_props}
/>

{#if error}
	<div class={label_classes}>
		<span
			id="{input_id}-error"
			class={error_classes}
			data-testid="input-error"
		>
			{error}
		</span>
	</div>
{/if}
