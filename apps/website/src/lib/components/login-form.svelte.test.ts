import { describe, expect, test, vi } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-svelte';
import LoginForm from './login-form.svelte';

describe('LoginForm Component', () => {
	describe('Initial Rendering', () => {
		test('should render with default props', async () => {
			await render(LoginForm);

			const form = page.getByTestId('login-form');
			const email_input = page.getByTestId('input');
			const password_input = page.getByTestId('password-input');
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			await expect.element(form).toBeInTheDocument();
			await expect.element(email_input).toBeInTheDocument();
			await expect.element(password_input).toBeInTheDocument();
			await expect.element(submit_button).toBeInTheDocument();
		});

		test('should render with custom props', async () => {
			await render(LoginForm, {
				remember_me_enabled: false,
				forgot_password_enabled: false,
				initial_email: 'test@example.com',
			});

			const email_input = page.getByTestId('input');
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
			await render(LoginForm);

			const email_input = page.getByTestId('input');
			const password_input = page.getByTestId('password-input');

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
			await render(LoginForm);

			const password_input = page.getByTestId('password-input');
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
		test('shows empty-field errors only after each field is blurred', async () => {
			await render(LoginForm);

			const email_input = page.getByRole('textbox', {
				name: /email address/i,
			});
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const email_error = page.getByText('Invalid email format', {
				exact: true,
			});
			const password_error = page.getByText(
				'Password must be at least 8 characters',
				{ exact: true },
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			await expect.element(email_error).not.toBeInTheDocument();
			await expect.element(password_error).not.toBeInTheDocument();
			await expect.element(submit_button).toBeDisabled();

			await email_input.click();
			await password_input.click();

			await expect.element(email_error).toBeVisible();
			await expect.element(password_error).not.toBeInTheDocument();

			await userEvent.tab();

			await expect.element(password_error).toBeVisible();
			await expect.element(submit_button).toBeDisabled();
		});

		test('shows an invalid-email error while entering an address', async () => {
			await render(LoginForm);

			await page
				.getByRole('textbox', { name: /email address/i })
				.fill('invalid-email');

			await expect
				.element(
					page.getByText('Invalid email format', { exact: true }),
				)
				.toBeVisible();
			await expect
				.element(page.getByRole('button', { name: 'Sign In' }))
				.toBeDisabled();
		});

		test('shows a length error while entering a short password', async () => {
			await render(LoginForm);

			await page
				.getByPlaceholder('Enter your password')
				.fill('Abcdef1');

			await expect
				.element(
					page.getByText('Password must be at least 8 characters', {
						exact: true,
					}),
				)
				.toBeVisible();
			await expect
				.element(page.getByRole('button', { name: 'Sign In' }))
				.toBeDisabled();
		});

		test('clears errors and enables sign-in when both fields become valid', async () => {
			await render(LoginForm);

			const email_input = page.getByRole('textbox', {
				name: /email address/i,
			});
			const password_input = page.getByPlaceholder(
				'Enter your password',
			);
			const email_error = page.getByText('Invalid email format', {
				exact: true,
			});
			const password_error = page.getByText(
				'Password must be at least 8 characters',
				{ exact: true },
			);
			const submit_button = page.getByRole('button', {
				name: 'Sign In',
			});

			await email_input.fill('invalid-email');
			await password_input.fill('Abcdef1');

			await expect.element(email_error).toBeVisible();
			await expect.element(password_error).toBeVisible();
			await expect.element(submit_button).toBeDisabled();

			await email_input.fill('test@example.com');

			await expect.element(email_error).not.toBeInTheDocument();
			await expect.element(password_error).toBeVisible();
			await expect.element(submit_button).toBeDisabled();

			await password_input.fill('Abcdefg1');

			await expect.element(password_error).not.toBeInTheDocument();
			await expect.element(submit_button).toBeEnabled();
		});
	});

	describe('User Interactions', () => {
		test('should handle email input correctly', async () => {
			await render(LoginForm);

			const email_input = page.getByTestId('input');
			const test_email = 'user@example.com';

			await email_input.fill(test_email);
			await expect.element(email_input).toHaveValue(test_email);
		});

		test('should handle password input correctly', async () => {
			await render(LoginForm);

			const password_input = page.getByTestId('password-input');
			const test_password = 'mypassword123';

			await password_input.fill(test_password);
			await expect.element(password_input).toHaveValue(test_password);
		});

		test('should handle remember me checkbox', async () => {
			await render(LoginForm);

			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);

			await expect.element(remember_checkbox).not.toBeChecked();
			await remember_checkbox.click();
			await expect.element(remember_checkbox).toBeChecked();
		});

		test.skip('should handle form submission with valid data', async () => {
			const mockSubmit = vi.fn();
			await render(LoginForm, {
				onsubmit: mockSubmit,
			});

			const email_input = page.getByTestId('input');
			const password_input = page.getByTestId('password-input');
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
			await render(LoginForm, {
				onforgot_password: mockForgotPassword,
			});

			const email_input = page.getByTestId('input');
			const forgot_link = page.getByTestId('forgot-password-link');

			await email_input.fill('test@example.com');
			await forgot_link.click();

			expect(mockForgotPassword).toHaveBeenCalledWith({
				email: 'test@example.com',
			});
		});

		test('should handle register click', async () => {
			const mockRegisterClick = vi.fn();
			await render(LoginForm, {
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
			await render(LoginForm, {
				onsubmit: mockSubmit,
			});

			const email_input = page.getByTestId('input');
			const password_input = page.getByTestId('password-input');

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
			await render(LoginForm);

			const password_input = page.getByTestId('password-input');
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
			await render(LoginForm, {
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
			await render(LoginForm, {
				loading: true,
			});

			const email_input = page.getByTestId('input');
			const password_input = page.getByTestId('password-input');
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
			await render(LoginForm, {
				remember_me_enabled: false,
			});

			const remember_checkbox = page.getByTestId(
				'remember-me-checkbox',
			);
			await expect.element(remember_checkbox).not.toBeInTheDocument();
		});

		test('should hide forgot password when disabled', async () => {
			await render(LoginForm, {
				forgot_password_enabled: false,
			});

			const forgot_link = page.getByTestId('forgot-password-link');
			await expect.element(forgot_link).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		test('should have proper form labels', async () => {
			await render(LoginForm);

			const email_input = page.getByLabelText(/^Email Address/);
			const password_input = page.getByTestId('password-input');
			const remember_checkbox = page.getByLabelText('Remember me');

			await expect.element(email_input).toBeInTheDocument();
			await expect.element(password_input).toBeInTheDocument();
			await expect.element(remember_checkbox).toBeInTheDocument();
		});
	});
});
