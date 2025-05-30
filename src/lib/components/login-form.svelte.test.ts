import { page, userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LoginForm from './login-form.svelte';

describe('LoginForm Component', () => {
	describe('Initial Rendering', () => {
		test('should render with default props', async () => {
			render(LoginForm, {});

			const form = page.getByTestId('login-form');
			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});
			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);

			await expect.element(form).toBeInTheDocument();
			await expect.element(email_input).toBeInTheDocument();
			await expect.element(password_input).toBeInTheDocument();
			await expect.element(submit_button).toBeInTheDocument();
			await expect.element(remember_checkbox).toBeInTheDocument();
		});

		test('should render with custom props', async () => {
			render(LoginForm, {
				loading: true,
				remember_me_enabled: false,
				forgot_password_enabled: false,
				initial_email: 'test@example.com',
			});

			const email_input = page.getByLabelText('Email Address');
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			await expect
				.element(email_input)
				.toHaveValue('test@example.com');
			await expect.element(submit_button).toBeDisabled();

			// Should not render remember me checkbox
			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);
			await expect.element(remember_checkbox).not.toBeInTheDocument();

			// Should not render forgot password link
			const forgot_link = page.getByTestId('forgot-password-link');
			await expect.element(forgot_link).not.toBeInTheDocument();
		});
	});

	describe('Form Validation with Utility Dependencies', () => {
		test('should validate email using utility function', async () => {
			render(LoginForm, {});

			const email_input = page.getByLabelText('Email Address');
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			// Type invalid email to trigger oninput events
			await userEvent.type(email_input, 'invalid-email');

			// Check that the input has the invalid value
			await expect.element(email_input).toHaveValue('invalid-email');

			// Try to submit - this should trigger validation
			await submit_button.click();

			// The form should not submit successfully (no onsubmit event fired)
			// Instead, we can check that the input is marked as invalid
			await expect
				.element(email_input)
				.toHaveAttribute('aria-invalid', 'true');
		});

		test('should validate password using utility function', async () => {
			render(LoginForm, {});

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			// Enter valid email and short password using type to trigger events
			await userEvent.type(email_input, 'test@example.com');
			await userEvent.type(password_input, '123');

			// Check values are set
			await expect
				.element(email_input)
				.toHaveValue('test@example.com');
			await expect.element(password_input).toHaveValue('123');

			// Try to submit
			await submit_button.click();

			// Password should be marked as invalid due to length
			await expect
				.element(password_input)
				.toHaveAttribute('aria-invalid', 'true');
		});

		test('should enable submit when form is valid', async () => {
			render(LoginForm, {});

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			// Enter valid credentials using type to trigger events
			await userEvent.type(email_input, 'test@example.com');
			await userEvent.type(password_input, 'validpassword123');

			// Submit button should be enabled
			await expect.element(submit_button).not.toBeDisabled();
		});
	});

	describe('Component Dependencies', () => {
		test('should use Input component for form fields', async () => {
			render(LoginForm, {});

			// Check that Input components are rendered with correct props
			const email_input = page.getByTestId('input').first();
			const password_input = page.getByTestId('input').nth(1);

			await expect
				.element(email_input)
				.toHaveAttribute('type', 'email');
			await expect
				.element(password_input)
				.toHaveAttribute('type', 'password');
		});

		test('should use Button component for submit', async () => {
			render(LoginForm, {});

			const submit_button = page.getByTestId('button');
			await expect.element(submit_button).toBeInTheDocument();
			await expect
				.element(submit_button)
				.toHaveAttribute('type', 'submit');
		});
	});

	describe('Svelte 5 Runes State Management', () => {
		test('should manage form state with runes', async () => {
			render(LoginForm, {
				initial_email: 'user@example.com',
			});

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);

			// Test reactive state updates
			await expect
				.element(email_input)
				.toHaveValue('user@example.com');

			await userEvent.type(password_input, 'mypassword');
			await expect.element(password_input).toHaveValue('mypassword');
		});

		test('should manage password visibility state', async () => {
			render(LoginForm, {});

			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const toggle_button = page.getByTestId('password-toggle');

			// Initially password should be hidden
			await expect
				.element(password_input)
				.toHaveAttribute('type', 'password');

			// Click toggle to show password
			await toggle_button.click();

			// Wait for the state to update
			await expect
				.element(password_input)
				.toHaveAttribute('type', 'text');

			// Click again to hide password
			await toggle_button.click();

			// Wait for the state to update
			await expect
				.element(password_input)
				.toHaveAttribute('type', 'password');
		});

		test('should manage remember me state', async () => {
			render(LoginForm, {});

			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);

			// Initially unchecked
			await expect.element(remember_checkbox).not.toBeChecked();

			// Check the box
			await remember_checkbox.click();
			await expect.element(remember_checkbox).toBeChecked();

			// Uncheck the box
			await remember_checkbox.click();
			await expect.element(remember_checkbox).not.toBeChecked();
		});

		test('should dispatch submit event with form data', async () => {
			let submitted_data: any = null;

			render(LoginForm, {
				onsubmit: (data) => {
					submitted_data = data;
				},
			});

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			// Fill form with valid data using type to trigger events
			await userEvent.type(email_input, 'test@example.com');
			await userEvent.type(password_input, 'validpassword123');
			await remember_checkbox.click();

			// Submit form
			await submit_button.click();

			// Check dispatched data
			expect(submitted_data).toEqual({
				email: 'test@example.com',
				password: 'validpassword123',
				remember_me: true,
			});
		});
	});

	describe('Event Dispatching', () => {
		test('should dispatch forgot password event', async () => {
			let forgot_password_data: any = null;

			render(LoginForm, {
				initial_email: 'user@example.com',
				onforgot_password: (data) => {
					forgot_password_data = data;
				},
			});

			const forgot_link = page.getByTestId('forgot-password-link');
			await forgot_link.click();

			expect(forgot_password_data).toEqual({
				email: 'user@example.com',
			});
		});

		test('should dispatch register click event', async () => {
			let register_clicked = false;

			render(LoginForm, {
				onregister_click: () => {
					register_clicked = true;
				},
			});

			const register_link = page.getByTestId('register-link');
			await register_link.click();

			expect(register_clicked).toBe(true);
		});
	});

	describe('Loading State', () => {
		test('should disable form when loading', async () => {
			render(LoginForm, { loading: true });

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});
			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);

			await expect.element(email_input).toBeDisabled();
			await expect.element(password_input).toBeDisabled();
			await expect.element(submit_button).toBeDisabled();
			await expect.element(remember_checkbox).toBeDisabled();
		});

		test('should show loading state on submit button', async () => {
			render(LoginForm, { loading: true });

			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			// Button should be disabled when loading
			await expect.element(submit_button).toBeDisabled();
		});
	});

	describe('Accessibility', () => {
		test('should have proper form structure', async () => {
			render(LoginForm, {});

			const form = page.getByTestId('login-form');
			await expect.element(form).toBeInTheDocument();
		});

		test('should have proper labels and associations', async () => {
			render(LoginForm, {});

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);

			await expect.element(email_input).toBeInTheDocument();
			await expect.element(password_input).toBeInTheDocument();
		});

		test('should have proper ARIA labels for password toggle', async () => {
			render(LoginForm, {});

			const toggle_button = page.getByTestId('password-toggle');

			// Initially should show "Show password"
			await expect
				.element(toggle_button)
				.toHaveAttribute('aria-label', 'Show password');

			// After clicking, should show "Hide password"
			await toggle_button.click();

			// Wait for the state to update
			await expect
				.element(toggle_button)
				.toHaveAttribute('aria-label', 'Hide password');
		});
	});

	describe('Edge Cases', () => {
		test('should handle empty form submission', async () => {
			render(LoginForm, {});

			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});
			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);

			// Try to submit empty form
			await submit_button.click();

			// Should show validation state on inputs
			await expect
				.element(email_input)
				.toHaveAttribute('aria-invalid', 'true');
			await expect
				.element(password_input)
				.toHaveAttribute('aria-invalid', 'true');
		});

		test('should handle initial email prop', async () => {
			render(LoginForm, {
				initial_email: 'preset@example.com',
			});

			const email_input = page.getByLabelText('Email Address');
			await expect
				.element(email_input)
				.toHaveValue('preset@example.com');
		});

		test('should handle disabled features', async () => {
			render(LoginForm, {
				remember_me_enabled: false,
				forgot_password_enabled: false,
			});

			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);
			const forgot_link = page.getByTestId('forgot-password-link');

			await expect.element(remember_checkbox).not.toBeInTheDocument();
			await expect.element(forgot_link).not.toBeInTheDocument();
		});
	});
});
