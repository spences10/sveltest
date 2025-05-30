<script lang="ts">
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

	// Validation state
	let email_touched = $state(false);
	let password_touched = $state(false);

	// Derived validation results
	const email_validation = $derived(validate_email(email));
	const password_validation = $derived(validate_password(password));

	// Derived error messages
	const email_error = $derived(() => {
		if (submit_attempted || email_touched) {
			return !email_validation.is_valid
				? email_validation.error_message
				: '';
		}
		return '';
	});

	const password_error = $derived(() => {
		if (submit_attempted || password_touched) {
			return !password_validation.is_valid
				? password_validation.error_message
				: '';
		}
		return '';
	});

	const can_submit = $derived(() => {
		return (
			email_validation.is_valid &&
			password_validation.is_valid &&
			!loading
		);
	});

	// Handle form submission
	function handle_submit() {
		submit_attempted = true;

		if (can_submit()) {
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

	// Handle input changes
	function handle_email_input(event: Event) {
		const target = event.target as HTMLInputElement;
		email = target.value;
		email_touched = true;
	}

	function handle_password_input(event: Event) {
		const target = event.target as HTMLInputElement;
		password = target.value;
		password_touched = true;
	}

	// Toggle password visibility
	function toggle_password_visibility() {
		show_password = !show_password;
	}

	// CSS classes
	const form_classes = 'space-y-6 w-full max-w-md mx-auto';
	const remember_me_classes = 'flex items-center justify-between';
	const checkbox_wrapper_classes = 'flex items-center';
	const checkbox_classes =
		'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';
	const checkbox_label_classes = 'ml-2 block text-sm text-gray-900';
	const forgot_password_classes =
		'text-sm text-blue-600 hover:text-blue-500 cursor-pointer';
	const submit_button_classes = 'w-full';
	const register_link_classes = 'text-center text-sm text-gray-600';
	const register_button_classes =
		'text-blue-600 hover:text-blue-500 cursor-pointer font-medium';
	const password_toggle_classes =
		'absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer';
	const password_wrapper_classes = 'relative';
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
	<Input
		type="email"
		label="Email Address"
		placeholder="Enter your email"
		value={email}
		error={email_error()}
		required
		disabled={loading}
		oninput={handle_email_input}
	/>

	<!-- Password Input -->
	<div class={password_wrapper_classes}>
		<Input
			type={show_password ? 'text' : 'password'}
			label="Password"
			placeholder="Enter your password"
			value={password}
			error={password_error()}
			required
			disabled={loading}
			oninput={handle_password_input}
		/>
		<button
			type="button"
			class={password_toggle_classes}
			onclick={toggle_password_visibility}
			data-testid="password-toggle"
			aria-label={show_password ? 'Hide password' : 'Show password'}
		>
			{#if show_password}
				<!-- Eye slash icon -->
				<svg
					class="h-5 w-5 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
					/>
				</svg>
			{:else}
				<!-- Eye icon -->
				<svg
					class="h-5 w-5 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					/>
				</svg>
			{/if}
		</button>
	</div>

	<!-- Remember Me and Forgot Password -->
	<div class={remember_me_classes}>
		{#if remember_me_enabled}
			<div class={checkbox_wrapper_classes}>
				<input
					type="checkbox"
					id="remember-me"
					class={checkbox_classes}
					bind:checked={remember_me}
					disabled={loading}
					data-testid="remember-me-checkbox"
				/>
				<label for="remember-me" class={checkbox_label_classes}>
					Remember me
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
			label="Sign In"
		/>
	</div>

	<!-- Register Link -->
	<div class={register_link_classes}>
		Don't have an account?
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
