import { flushSync, untrack } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { create_form_state } from './form-state.svelte.ts';

// Mock the validation utility
vi.mock('../utils/validation.ts', () => ({
	validate_field: vi.fn((value: string, rules: any) => {
		// Mock validation logic for testing
		if (rules.required && !value.trim()) {
			return {
				is_valid: false,
				error_message: 'This field is required',
			};
		}
		if (rules.min_length && value.length < rules.min_length) {
			return {
				is_valid: false,
				error_message: `Minimum length is ${rules.min_length}`,
			};
		}
		if (rules.pattern && !rules.pattern.test(value)) {
			return {
				is_valid: false,
				error_message: 'Invalid format',
			};
		}
		return { is_valid: true, error_message: '' };
	}),
}));

describe('create_form_state', () => {
	describe('Initial State Creation', () => {
		test('should create form state with default values', () => {
			const form = create_form_state({
				email: { value: 'test@example.com' },
				password: { value: '' },
			});

			expect(form.form_state.email.value).toBe('test@example.com');
			expect(form.form_state.email.touched).toBe(false);
			expect(form.form_state.email.validation_result?.is_valid).toBe(
				true,
			);

			expect(form.form_state.password.value).toBe('');
			expect(form.form_state.password.touched).toBe(false);
			expect(
				form.form_state.password.validation_result?.is_valid,
			).toBe(true);
		});

		test('should create form state with validation rules', () => {
			const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const form = create_form_state({
				email: {
					value: '',
					validation_rules: {
						required: true,
						pattern: email_pattern,
					},
				},
				password: {
					value: '',
					validation_rules: { required: true, min_length: 8 },
				},
			});

			expect(form.form_state.email.validation_rules).toEqual({
				required: true,
				pattern: email_pattern,
			});
			expect(form.form_state.password.validation_rules).toEqual({
				required: true,
				min_length: 8,
			});
		});

		test.skip('should handle complex validation rule configurations', () => {
			// TODO: Test with nested validation rules, custom validators
		});
	});

	describe('Field Updates', () => {
		test('should update field value and mark as touched', () => {
			const form = create_form_state({
				email: { value: '' },
			});

			form.update_field('email', 'new@example.com');

			expect(form.form_state.email.value).toBe('new@example.com');
			expect(form.form_state.email.touched).toBe(true);
		});

		test('should validate field on update when rules exist', () => {
			const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const form = create_form_state({
				email: {
					value: '',
					validation_rules: {
						required: true,
						pattern: email_pattern,
					},
				},
			});

			// Update with invalid email
			form.update_field('email', 'invalid-email');
			flushSync();

			expect(form.form_state.email.validation_result?.is_valid).toBe(
				false,
			);
			expect(
				form.form_state.email.validation_result?.error_message,
			).toBe('Invalid format');

			// Update with valid email
			form.update_field('email', 'valid@example.com');
			flushSync();

			expect(form.form_state.email.validation_result?.is_valid).toBe(
				true,
			);
		});

		test('should handle updates to non-existent fields gracefully', () => {
			const form = create_form_state({
				email: { value: '' },
			});

			expect(() => {
				form.update_field('non_existent', 'value');
			}).not.toThrow();
		});

		test.skip('should handle concurrent field updates', () => {
			// TODO: Test rapid successive updates, race conditions
		});
	});

	describe('Form Validation', () => {
		test('should validate all fields and return overall validity', () => {
			const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const form = create_form_state({
				email: {
					value: '',
					validation_rules: {
						required: true,
						pattern: email_pattern,
					},
				},
				password: {
					value: 'short',
					validation_rules: { required: true, min_length: 8 },
				},
			});

			const is_valid = form.validate_all_fields();

			expect(is_valid).toBe(false);
			expect(form.form_state.email.touched).toBe(true);
			expect(form.form_state.password.touched).toBe(true);
			expect(form.form_state.email.validation_result?.is_valid).toBe(
				false,
			);
			expect(
				form.form_state.password.validation_result?.is_valid,
			).toBe(false);
		});

		test('should return true when all fields are valid', () => {
			const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const form = create_form_state({
				email: {
					value: 'valid@example.com',
					validation_rules: {
						required: true,
						pattern: email_pattern,
					},
				},
				password: {
					value: 'validpassword123',
					validation_rules: { required: true, min_length: 8 },
				},
			});

			const is_valid = form.validate_all_fields();

			expect(is_valid).toBe(true);
			expect(form.form_state.email.validation_result?.is_valid).toBe(
				true,
			);
			expect(
				form.form_state.password.validation_result?.is_valid,
			).toBe(true);
		});

		test('should handle fields without validation rules', () => {
			const form = create_form_state({
				email: { value: 'test@example.com' },
				optional_field: { value: 'any value' },
			});

			const is_valid = form.validate_all_fields();

			expect(is_valid).toBe(true);
		});

		test.skip('should validate fields in correct order', () => {
			// TODO: Test validation order dependencies
		});
	});

	describe('Form Reset', () => {
		test('should reset all field values and states', () => {
			const form = create_form_state({
				email: { value: 'initial@example.com' },
				password: { value: 'initial' },
			});

			// Make changes
			form.update_field('email', 'changed@example.com');
			form.update_field('password', 'changed');

			// Reset
			form.reset_form();

			expect(form.form_state.email.value).toBe('');
			expect(form.form_state.email.touched).toBe(false);
			expect(form.form_state.email.validation_result?.is_valid).toBe(
				true,
			);
			expect(
				form.form_state.email.validation_result?.error_message,
			).toBe('');

			expect(form.form_state.password.value).toBe('');
			expect(form.form_state.password.touched).toBe(false);
			expect(
				form.form_state.password.validation_result?.is_valid,
			).toBe(true);
			expect(
				form.form_state.password.validation_result?.error_message,
			).toBe('');
		});

		test.skip('should preserve validation rules after reset', () => {
			// TODO: Ensure validation rules remain intact after reset
		});
	});

	describe('Form Data Extraction', () => {
		test('should return current form values as plain object', () => {
			const form = create_form_state({
				email: { value: 'test@example.com' },
				password: { value: 'password123' },
				optional: { value: '' },
			});

			const data = form.get_form_data();

			expect(data).toEqual({
				email: 'test@example.com',
				password: 'password123',
				optional: '',
			});
		});

		test('should return updated values after field changes', () => {
			const form = create_form_state({
				email: { value: 'initial@example.com' },
			});

			form.update_field('email', 'updated@example.com');

			const data = form.get_form_data();

			expect(data.email).toBe('updated@example.com');
		});

		test.skip('should handle special characters and encoding', () => {
			// TODO: Test with special characters, unicode, etc.
		});
	});

	describe('Derived State - Svelte 5 Runes', () => {
		test('should track form validity reactively', () => {
			const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const form = create_form_state({
				email: {
					value: '',
					validation_rules: {
						required: true,
						pattern: email_pattern,
					},
				},
			});

			// Initially valid (fields not validated yet)
			const is_form_valid = form.is_form_valid;
			expect(untrack(() => is_form_valid())).toBe(true);

			// Validate all fields - now should be invalid (empty required field)
			form.validate_all_fields();
			flushSync();
			expect(untrack(() => is_form_valid())).toBe(false);

			// Update to valid value
			form.update_field('email', 'valid@example.com');
			flushSync();

			expect(untrack(() => is_form_valid())).toBe(true);

			// Update to invalid value
			form.update_field('email', 'invalid-email');
			flushSync();

			expect(untrack(() => is_form_valid())).toBe(false);
		});

		test('should track changes reactively', () => {
			const form = create_form_state({
				email: { value: 'initial@example.com' },
			});

			// Initially no changes
			const has_changes = form.has_changes;
			expect(untrack(() => has_changes())).toBe(false);

			// Make a change
			form.update_field('email', 'changed@example.com');
			flushSync();

			expect(untrack(() => has_changes())).toBe(true);

			// Reset form
			form.reset_form();
			flushSync();

			expect(untrack(() => has_changes())).toBe(false);
		});

		test('should track field errors reactively', () => {
			const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const form = create_form_state({
				email: {
					value: '',
					validation_rules: {
						required: true,
						pattern: email_pattern,
					},
				},
				password: {
					value: '',
					validation_rules: { required: true, min_length: 8 },
				},
			});

			// Initially no errors (fields not touched)
			const field_errors = form.field_errors;
			expect(untrack(() => field_errors())).toEqual({});

			// Validate all fields to trigger errors
			form.validate_all_fields();
			flushSync();

			const errors = untrack(() => field_errors());
			expect(errors.email).toBe('This field is required');
			expect(errors.password).toBe('This field is required');

			// Fix one field
			form.update_field('email', 'valid@example.com');
			flushSync();

			const updated_errors = untrack(() => field_errors());
			expect(updated_errors.email).toBeUndefined();
			expect(updated_errors.password).toBe('This field is required');
		});

		test('should handle fields without validation rules in derived state', () => {
			const form = create_form_state({
				email: { value: 'test@example.com' },
				optional: { value: 'any value' },
			});

			const is_form_valid = form.is_form_valid;
			const field_errors = form.field_errors;
			expect(untrack(() => is_form_valid())).toBe(true);
			expect(untrack(() => field_errors())).toEqual({});
		});

		test.skip('should optimize derived state calculations', () => {
			// TODO: Test performance with large forms, memoization
		});
	});

	describe('Edge Cases', () => {
		test('should handle empty form configuration', () => {
			const form = create_form_state({});

			const is_form_valid = form.is_form_valid;
			const has_changes = form.has_changes;
			const field_errors = form.field_errors;

			expect(form.form_state).toEqual({});
			expect(untrack(() => is_form_valid())).toBe(true);
			expect(untrack(() => has_changes())).toBe(false);
			expect(untrack(() => field_errors())).toEqual({});
			expect(form.get_form_data()).toEqual({});
		});

		test('should handle undefined validation rules', () => {
			const form = create_form_state({
				email: {
					value: 'test@example.com',
					validation_rules: undefined,
				},
			});

			form.update_field('email', 'new@example.com');

			expect(form.form_state.email.validation_result?.is_valid).toBe(
				true,
			);
		});

		test.skip('should handle malformed validation rules', () => {
			// TODO: Test with invalid rule configurations
		});

		test.skip('should handle extremely large form data', () => {
			// TODO: Test performance with many fields
		});
	});

	describe('Integration with Validation Module', () => {
		test('should call validation utility with correct parameters', async () => {
			const { validate_field } = await import(
				'../utils/validation.ts'
			);

			const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const form = create_form_state({
				email: {
					value: '',
					validation_rules: {
						required: true,
						pattern: email_pattern,
					},
				},
			});

			form.update_field('email', 'test@example.com');

			expect(validate_field).toHaveBeenCalledWith(
				'test@example.com',
				{
					required: true,
					pattern: email_pattern,
				},
			);
		});

		test.skip('should handle validation utility errors gracefully', () => {
			// TODO: Test when validation utility throws errors
		});
	});
});
