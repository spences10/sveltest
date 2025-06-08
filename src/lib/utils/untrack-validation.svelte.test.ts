import { flushSync, untrack } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import { validate_email, validate_password } from './validation.ts';

// Mock the validation utilities
vi.mock('../utils/validation.ts', () => ({
	validate_email: vi.fn((email: string) => {
		const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim()) {
			return {
				is_valid: false,
				error_message: 'This field is required',
			};
		}
		if (!email_pattern.test(email)) {
			return { is_valid: false, error_message: 'Invalid format' };
		}
		return { is_valid: true, error_message: '' };
	}),
	validate_password: vi.fn((password: string) => {
		if (!password.trim()) {
			return {
				is_valid: false,
				error_message: 'This field is required',
			};
		}
		if (password.length < 8) {
			return {
				is_valid: false,
				error_message: 'Must be at least 8 characters',
			};
		}
		return { is_valid: true, error_message: '' };
	}),
}));

describe('Untrack Usage Validation', () => {
	describe('Basic $derived with untrack', () => {
		it('should access $derived values using untrack', () => {
			// Create reactive state in test
			let email = $state('');
			const email_validation = $derived(validate_email(email));

			// Test invalid email
			email = 'invalid-email';
			flushSync();

			// ✅ CORRECT: Use untrack to access $derived value
			const result = untrack(() => email_validation);
			expect(result.is_valid).toBe(false);
			expect(result.error_message).toBe('Invalid format');

			// Test valid email
			email = 'test@example.com';
			flushSync();

			const valid_result = untrack(() => email_validation);
			expect(valid_result.is_valid).toBe(true);
			expect(valid_result.error_message).toBe('');
		});

		it('should handle complex derived logic', () => {
			// Recreate login form logic in test
			let email = $state('');
			let submit_attempted = $state(false);
			let email_touched = $state(false);

			const email_validation = $derived(validate_email(email));
			const show_email_error = $derived(
				submit_attempted || email_touched,
			);
			const email_error = $derived(
				show_email_error && !email_validation.is_valid
					? email_validation.error_message
					: '',
			);

			// Initially no errors shown
			expect(untrack(() => show_email_error)).toBe(false);
			expect(untrack(() => email_error)).toBe('');

			// After touching field with invalid email
			email = 'invalid';
			email_touched = true;
			flushSync();

			expect(untrack(() => show_email_error)).toBe(true);
			expect(untrack(() => email_error)).toBe('Invalid format');
		});

		it('should validate form validity calculation', () => {
			let email = $state('');
			let password = $state('');

			const email_validation = $derived(validate_email(email));
			const password_validation = $derived(
				validate_password(password),
			);
			const form_is_valid = $derived(
				email_validation.is_valid && password_validation.is_valid,
			);

			// Initially invalid
			expect(untrack(() => form_is_valid)).toBe(false);

			// Valid email, invalid password
			email = 'test@example.com';
			password = '123';
			flushSync();

			expect(untrack(() => form_is_valid)).toBe(false);

			// Both valid
			password = 'validpassword123';
			flushSync();

			expect(untrack(() => form_is_valid)).toBe(true);
		});
	});

	describe('Why untrack is necessary', () => {
		it('should demonstrate untrack prevents reactive dependencies', () => {
			let count = $state(0);
			let doubled = $derived(count * 2);

			// ✅ Use untrack to read without creating dependencies
			expect(untrack(() => doubled)).toBe(0);

			count = 5;
			flushSync();

			expect(untrack(() => doubled)).toBe(10);
		});
	});
});
