import { page, userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LoginForm from './login-form.svelte';

describe('LoginForm Component', () => {
	describe('Initial Rendering', () => {
		test('should render with default props', async () => {
			render(LoginForm);

			const form = page.getByTestId('login-form');
			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			await expect.element(form).toBeInTheDocument();
			await expect.element(email_input).toBeInTheDocument();
			await expect.element(password_input).toBeInTheDocument();
			await expect.element(submit_button).toBeInTheDocument();
		});

		test('should render with custom props', async () => {
			render(LoginForm, {
				remember_me_enabled: false,
				forgot_password_enabled: false,
				initial_email: 'test@example.com',
			});

			const email_input = page.getByLabelText('Email Address');
			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);
			const forgot_link = page.getByTestId('forgot-password-link');

			await expect
				.element(email_input)
				.toHaveValue('test@example.com');
			await expect.element(remember_checkbox).not.toBeInTheDocument();
			await expect.element(forgot_link).not.toBeInTheDocument();
		});
	});

	describe('Form Elements', () => {
		test('should have proper form structure and accessibility', async () => {
			render(LoginForm);

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);

			await expect
				.element(email_input)
				.toHaveAttribute('type', 'email');
			await expect.element(email_input).toHaveAttribute('required');
			await expect
				.element(password_input)
				.toHaveAttribute('type', 'password');
			await expect
				.element(password_input)
				.toHaveAttribute('required');
		});

		test.skip('should have password toggle functionality', async () => {
			render(LoginForm);

			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const toggle_button = page.getByTestId('password-toggle');

			await expect
				.element(password_input)
				.toHaveAttribute('type', 'password');
			await expect.element(toggle_button).toBeInTheDocument();

			await toggle_button.click();
			await expect
				.element(password_input)
				.toHaveAttribute('type', 'text');

			await toggle_button.click();
			await expect
				.element(password_input)
				.toHaveAttribute('type', 'password');
		});
	});

	describe('Form Validation', () => {
		test.skip('should show validation errors for empty fields', async () => {
			render(LoginForm);

			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});
			await submit_button.click({ force: true });

			await expect
				.element(page.getByText('This field is required'))
				.toBeInTheDocument();
		});

		test.skip('should show validation error for invalid email', async () => {
			render(LoginForm);

			const email_input = page.getByLabelText('Email Address');
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			await email_input.fill('invalid-email');
			await submit_button.click({ force: true });

			await expect
				.element(page.getByText('Invalid format'))
				.toBeInTheDocument();
		});

		test.skip('should show validation error for short password', async () => {
			render(LoginForm);

			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			await password_input.fill('123');
			await submit_button.click({ force: true });

			await expect
				.element(page.getByText('Must be at least 8 characters'))
				.toBeInTheDocument();
		});

		test.skip('should clear validation errors when valid input is provided', async () => {
			render(LoginForm);

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			// First trigger validation errors
			await submit_button.click({ force: true });
			await expect
				.element(page.getByText('This field is required'))
				.toBeInTheDocument();

			// Then provide valid input
			await email_input.fill('test@example.com');
			await password_input.fill('Password123');

			// Errors should be cleared
			await expect
				.element(page.getByText('This field is required'))
				.not.toBeInTheDocument();
		});
	});

	describe('User Interactions', () => {
		test('should handle email input correctly', async () => {
			render(LoginForm);

			const email_input = page.getByLabelText('Email Address');
			const test_email = 'user@example.com';

			await email_input.fill(test_email);
			await expect.element(email_input).toHaveValue(test_email);
		});

		test('should handle password input correctly', async () => {
			render(LoginForm);

			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const test_password = 'mypassword123';

			await password_input.fill(test_password);
			await expect.element(password_input).toHaveValue(test_password);
		});

		test('should handle remember me checkbox', async () => {
			render(LoginForm);

			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);

			await expect.element(remember_checkbox).not.toBeChecked();
			await remember_checkbox.click();
			await expect.element(remember_checkbox).toBeChecked();
		});

		test.skip('should handle form submission with valid data', async () => {
			const mockSubmit = vi.fn();
			render(LoginForm, {
				onsubmit: mockSubmit,
			});

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			await email_input.fill('test@example.com');
			await password_input.fill('Password123');
			await submit_button.click();

			expect(mockSubmit).toHaveBeenCalledWith({
				email: 'test@example.com',
				password: 'Password123',
				remember_me: false,
			});
		});

		test('should handle forgot password click', async () => {
			const mockForgotPassword = vi.fn();
			render(LoginForm, {
				onforgot_password: mockForgotPassword,
			});

			const email_input = page.getByLabelText('Email Address');
			const forgot_link = page.getByTestId('forgot-password-link');

			await email_input.fill('test@example.com');
			await forgot_link.click();

			expect(mockForgotPassword).toHaveBeenCalledWith({
				email: 'test@example.com',
			});
		});

		test('should handle register click', async () => {
			const mockRegisterClick = vi.fn();
			render(LoginForm, {
				onregister_click: mockRegisterClick,
			});

			const register_link = page.getByTestId('register-link');
			await register_link.click();

			expect(mockRegisterClick).toHaveBeenCalled();
		});
	});

	describe('Keyboard Navigation', () => {
		test.skip('should submit form on Enter key in password field', async () => {
			const mockSubmit = vi.fn();
			render(LoginForm, {
				onsubmit: mockSubmit,
			});

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);

			await email_input.fill('test@example.com');
			await password_input.fill('Password123');
			await password_input.click();
			await userEvent.keyboard('{Enter}');

			expect(mockSubmit).toHaveBeenCalledWith({
				email: 'test@example.com',
				password: 'Password123',
				remember_me: false,
			});
		});

		test.skip('should toggle password visibility with Space key on toggle button', async () => {
			render(LoginForm);

			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const toggle_button = page.getByTestId('password-toggle');

			await toggle_button.click();
			await userEvent.keyboard('{Space}');
			await expect
				.element(password_input)
				.toHaveAttribute('type', 'text');
		});
	});

	describe('Loading States', () => {
		test('should show loading state during form submission', async () => {
			render(LoginForm, {
				loading: true,
			});

			// When loading is true, the button shows "Loading..." text
			const submit_button = page.getByRole('button', {
				name: 'Loading...',
			});
			await expect.element(submit_button).toBeInTheDocument();
			await expect.element(submit_button).toBeDisabled();
		});

		test('should disable form elements during loading', async () => {
			render(LoginForm, {
				loading: true,
			});

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);

			await expect.element(email_input).toBeDisabled();
			await expect.element(password_input).toBeDisabled();
			await expect.element(remember_checkbox).toBeDisabled();
		});
	});

	describe('Conditional Features', () => {
		test('should hide remember me when disabled', async () => {
			render(LoginForm, {
				remember_me_enabled: false,
			});

			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);
			await expect.element(remember_checkbox).not.toBeInTheDocument();
		});

		test('should hide forgot password when disabled', async () => {
			render(LoginForm, {
				forgot_password_enabled: false,
			});

			const forgot_link = page.getByTestId('forgot-password-link');
			await expect.element(forgot_link).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		test('should have proper form labels', async () => {
			render(LoginForm);

			const email_input = page.getByLabelText('Email Address');
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const remember_checkbox = page.getByLabelText('Remember me');

			await expect.element(email_input).toBeInTheDocument();
			await expect.element(password_input).toBeInTheDocument();
			await expect.element(remember_checkbox).toBeInTheDocument();
		});
	});
});
