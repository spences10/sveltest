<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
		value?: string | number;
		placeholder?: string;
		label?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		readonly?: boolean;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'success' | 'error';
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
		...rest_props
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		input: Event;
		change: Event;
		focus: FocusEvent;
		blur: FocusEvent;
	}>();

	function handle_input(event: Event) {
		const target = event.target as HTMLInputElement;
		if (type === 'number') {
			value = target.valueAsNumber || 0;
		} else {
			value = target.value;
		}
		dispatch('input', event);
	}

	function handle_change(event: Event) {
		dispatch('change', event);
	}

	function handle_focus(event: FocusEvent) {
		dispatch('focus', event);
	}

	function handle_blur(event: FocusEvent) {
		dispatch('blur', event);
	}

	// CSS classes
	const base_classes =
		'block w-full rounded-md border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset transition-colors';

	const size_classes = {
		sm: 'px-2.5 py-1.5 text-sm',
		md: 'px-3 py-2 text-base',
		lg: 'px-4 py-3 text-lg',
	};

	const variant_classes = {
		default:
			'ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600',
		success:
			'ring-green-300 placeholder:text-gray-400 focus:ring-green-600',
		error:
			'ring-red-300 placeholder:text-gray-400 focus:ring-red-600',
	};

	const disabled_classes =
		'bg-gray-50 text-gray-500 cursor-not-allowed';
	const readonly_classes = 'bg-gray-50';

	const computed_input_classes = [
		base_classes,
		size_classes[size],
		variant_classes[error ? 'error' : variant],
		disabled && disabled_classes,
		readonly && readonly_classes,
	]
		.filter(Boolean)
		.join(' ');

	const label_classes =
		'block text-sm font-medium leading-6 text-gray-900 mb-2';
	const error_classes = 'mt-2 text-sm text-red-600';

	// Generate unique ID if not provided
	const input_id =
		id || `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

{#if label}
	<label
		for={input_id}
		class={label_classes}
		data-testid="input-label"
	>
		{label}
		{#if required}
			<span class="text-red-500" data-testid="required-indicator"
				>*</span
			>
		{/if}
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
	<p
		id="{input_id}-error"
		class={error_classes}
		data-testid="input-error"
	>
		{error}
	</p>
{/if}
