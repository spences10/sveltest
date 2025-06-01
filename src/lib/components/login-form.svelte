<script lang="ts">
	import { Eye, EyeOff } from '$lib/icons';
	import {
		validate_email,
		validate_password,
	} from '../utils/validation.js';
	import Button from './button.svelte';
	import Input from './input.svelte';

	interface Props {
		loading?: boolean;
		remember_me_enabled?: boolean;
		forgot_password_enabled?: boolean;
		initial_email?: string;
		onsubmit?: (data: {
			email: string;
			password: string;
			remember_me: boolean;
		}) => void;
		onforgot_password?: (data: { email: string }) => void;
		onregister_click?: () => void;
	}

	let {
		loading = false,
		remember_me_enabled = true,
		forgot_password_enabled = true,
		initial_email = '',
		onsubmit,
		onforgot_password,
		onregister_click,
		...rest_props
	}: Props = $props();

	// Form state using Svelte 5 runes
	let email = $state(initial_email);
	let password = $state('');
	let remember_me = $state(false);
	let show_password = $state(false);
	let submit_attempted = $state(false);

	// Track when fields have been touched
	let email_touched = $state(false);
	let password_touched = $state(false);

	// Validation results - these are reactive
	const email_validation = $derived(validate_email(email));
	const password_validation = $derived(validate_password(password));

	// Show errors only after field is touched or submit attempted
	const show_email_error = $derived(
		submit_attempted || email_touched,
	);
	const show_password_error = $derived(
		submit_attempted || password_touched,
	);

	// Error messages
	const email_error = $derived(
		show_email_error && !email_validation.is_valid
			? email_validation.error_message
			: '',
	);
	const password_error = $derived(
		show_password_error && !password_validation.is_valid
			? password_validation.error_message
			: '',
	);

	// Form is valid when both fields are valid
	const form_is_valid = $derived(
		email_validation.is_valid && password_validation.is_valid,
	);

	// Can submit when form is valid and not loading
	const can_submit = $derived(form_is_valid && !loading);

	// Handle form submission
	function handle_submit() {
		submit_attempted = true;
		email_touched = true;
		password_touched = true;

		if (form_is_valid) {
			onsubmit?.({
				email,
				password,
				remember_me,
			});
		}
	}

	// Handle forgot password
	function handle_forgot_password() {
		onforgot_password?.({ email });
	}

	// Handle register click
	function handle_register_click() {
		onregister_click?.();
	}

	// Mark fields as touched on input
	function handle_email_input() {
		email_touched = true;
	}

	function handle_password_input() {
		password_touched = true;
	}

	function handle_email_blur() {
		email_touched = true;
	}

	function handle_password_blur() {
		password_touched = true;
	}

	// Toggle password visibility
	function toggle_password_visibility() {
		show_password = !show_password;
	}

	// DaisyUI CSS classes
	const form_classes = 'space-y-6 w-full max-w-md mx-auto';
	const remember_me_classes = 'flex items-center justify-between';
	const checkbox_wrapper_classes = 'form-control';
	const checkbox_label_classes = 'label cursor-pointer';
	const checkbox_classes = 'checkbox';
	const forgot_password_classes = 'link link-primary text-sm';
	const submit_button_classes = 'w-full';
	const register_link_classes = 'text-center text-sm';
	const register_button_classes = 'link link-primary font-medium';
</script>

<form
	class={form_classes}
	data-testid="login-form"
	onsubmit={(e) => {
		e.preventDefault();
		handle_submit();
	}}
	{...rest_props}
>
	<!-- Email Input -->
	<div class="form-control">
		<Input
			type="email"
			label="Email Address"
			placeholder="Enter your email"
			bind:value={email}
			error={email_error}
			required
			disabled={loading}
			oninput={handle_email_input}
			onblur={handle_email_blur}
		/>
	</div>

	<!-- Password Input with DaisyUI pattern -->
	<div class="form-control">
		<div class="label">
			<span class="label-text">
				Password
				<span class="text-error">*</span>
			</span>
		</div>
		<label
			class="input input-bordered flex w-full items-center gap-2"
		>
			<input
				type={show_password ? 'text' : 'password'}
				class="grow"
				placeholder="Enter your password"
				bind:value={password}
				required
				disabled={loading}
				oninput={handle_password_input}
				onblur={handle_password_blur}
				data-testid="password-input"
			/>
			<button
				type="button"
				class="btn btn-ghost btn-sm p-1"
				onclick={toggle_password_visibility}
				data-testid="password-toggle"
				aria-label={show_password ? 'Hide password' : 'Show password'}
			>
				{#if show_password}
					<EyeOff class_names="h-4 w-4" />
				{:else}
					<Eye class_names="h-4 w-4" />
				{/if}
			</button>
		</label>
		{#if password_error}
			<div class="label">
				<span class="label-text-alt text-error">
					{password_error}
				</span>
			</div>
		{/if}
	</div>

	<!-- Remember Me and Forgot Password -->
	<div class={remember_me_classes}>
		{#if remember_me_enabled}
			<div class={checkbox_wrapper_classes}>
				<label class={checkbox_label_classes}>
					<input
						type="checkbox"
						class={checkbox_classes}
						bind:checked={remember_me}
						disabled={loading}
						data-testid="remember-me-checkbox"
					/>
					<span class="label-text">Remember me</span>
				</label>
			</div>
		{/if}

		{#if forgot_password_enabled}
			<button
				type="button"
				class={forgot_password_classes}
				onclick={handle_forgot_password}
				disabled={loading}
				data-testid="forgot-password-link"
			>
				Forgot password?
			</button>
		{/if}
	</div>

	<!-- Submit Button -->
	<div class={submit_button_classes}>
		<Button
			type="submit"
			variant="primary"
			size="lg"
			disabled={!can_submit}
			{loading}
		>
			Sign In
		</Button>
	</div>

	<!-- Register Link -->
	<div class={register_link_classes}>
		<span class="text-base-content">Don't have an account?</span>
		<button
			type="button"
			class={register_button_classes}
			onclick={handle_register_click}
			disabled={loading}
			data-testid="register-link"
		>
			Sign up
		</button>
	</div>
</form>
