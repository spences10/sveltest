import { describe, expect, it } from 'vitest';
import type {
	FormValidationScenario,
	ValidationRule,
} from './+server';
import { GET, POST } from './+server';

/**
 * Meta-Example: Testing the Form Validation Endpoint
 *
 * This test demonstrates:
 * - Server-side testing with real Request and FormData objects
 * - Testing both GET (documentation) and POST (validation) endpoints
 * - Client-Server Alignment: using real FormData like the client would
 *
 * Pattern: Minimal Mocking with Real Web APIs
 * - Uses native Request and FormData objects
 * - Tests actual validation logic
 * - Validates both success and error cases
 */

describe('Form Validation Endpoint', () => {
	describe('GET - Documentation Endpoint', () => {
		it('should return valid JSON response', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toContain(
				'application/json',
			);
			expect(data).toBeDefined();
		});

		it('should include all required fields', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data).toHaveProperty('title');
			expect(data).toHaveProperty('description');
			expect(data).toHaveProperty('source_file');
			expect(data).toHaveProperty('validation_rules');
			expect(data).toHaveProperty('form_lifecycle_patterns');
			expect(data).toHaveProperty('testing_patterns');
			expect(data).toHaveProperty('meta');
			expect(data).toHaveProperty('usage_example');
		});

		it('should have correct metadata', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.meta.component).toBe('LoginForm');
			expect(data.meta.test_type).toBe('Form Testing (Browser)');
			expect(data.meta.framework).toBe('vitest-browser-svelte');
		});
	});

	describe('Validation Rules Data', () => {
		it('should return validation rules for email and password', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(Array.isArray(data.validation_rules)).toBe(true);
			expect(data.validation_rules.length).toBeGreaterThan(0);

			const fields = data.validation_rules.map(
				(r: ValidationRule) => r.field,
			);
			expect(fields).toContain('email');
			expect(fields).toContain('password');
		});

		it('should have valid validation rule structure', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const rule: ValidationRule = data.validation_rules[0];
			expect(rule).toHaveProperty('field');
			expect(rule).toHaveProperty('rule_type');
			expect(rule).toHaveProperty('validation');
			expect(rule).toHaveProperty('error_message');
			expect(rule).toHaveProperty('test_cases');
			expect(rule.test_cases).toHaveProperty('valid');
			expect(rule.test_cases).toHaveProperty('invalid');
		});

		it('should include email format validation', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const emailFormatRule = data.validation_rules.find(
				(r: ValidationRule) =>
					r.field === 'email' && r.rule_type === 'format',
			);

			expect(emailFormatRule).toBeDefined();
			expect(emailFormatRule.error_message).toBe('Invalid format');
			expect(emailFormatRule.test_cases.valid).toContain(
				'user@example.com',
			);
			expect(emailFormatRule.test_cases.invalid).toContain(
				'invalid-email',
			);
		});

		it('should include password min length validation', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const passwordLengthRule = data.validation_rules.find(
				(r: ValidationRule) =>
					r.field === 'password' && r.rule_type === 'min_length',
			);

			expect(passwordLengthRule).toBeDefined();
			expect(passwordLengthRule.validation).toContain('8 characters');
			expect(passwordLengthRule.test_cases.invalid).toContain('123');
		});
	});

	describe('Form Lifecycle Patterns', () => {
		it('should include lifecycle pattern categories', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(Array.isArray(data.form_lifecycle_patterns)).toBe(true);

			const categories = data.form_lifecycle_patterns.map(
				(p: FormValidationScenario) => p.category,
			);

			expect(categories).toContain('Initial State');
			expect(categories).toContain('User Input Handling');
			expect(categories).toContain('Validation Lifecycle');
			expect(categories).toContain('Error Message Display');
			expect(categories).toContain('Keyboard Navigation');
			expect(categories).toContain('Loading States');
			expect(categories).toContain('Conditional Features');
			expect(categories).toContain('Accessibility');
		});

		it('should emphasize forms start valid', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const initialState = data.form_lifecycle_patterns.find(
				(p: FormValidationScenario) => p.category === 'Initial State',
			);

			expect(initialState.patterns).toContain(
				'Forms should NOT be invalid by default',
			);
		});

		it('should include code examples', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const userInput = data.form_lifecycle_patterns.find(
				(p: FormValidationScenario) =>
					p.category === 'User Input Handling',
			);

			expect(userInput.test_examples).toBeDefined();
			expect(userInput.test_examples[0]).toHaveProperty('code');
			expect(userInput.test_examples[0].code).toContain('.fill(');
		});
	});

	describe('Testing Patterns', () => {
		it('should include critical patterns', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.testing_patterns.critical_patterns).toBeDefined();
			expect(data.testing_patterns.critical_patterns).toContain(
				'Forms start VALID by default - not invalid',
			);
		});

		it('should include client-server alignment patterns', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(
				data.testing_patterns.client_server_alignment,
			).toBeDefined();
			expect(data.testing_patterns.client_server_alignment).toContain(
				'Use real FormData objects in server tests',
			);
		});
	});

	describe('POST - Validation Endpoint', () => {
		it('should accept valid email and password', async () => {
			const formData = new FormData();
			formData.append('email', 'user@example.com');
			formData.append('password', 'Password123');

			const request = new Request(
				'http://localhost/api/examples/form-validation',
				{
					method: 'POST',
					body: formData,
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.valid).toBe(true);
			expect(data.message).toBe('Validation passed');
		});

		it('should reject empty email', async () => {
			const formData = new FormData();
			formData.append('email', '');
			formData.append('password', 'Password123');

			const request = new Request(
				'http://localhost/api/examples/form-validation',
				{
					method: 'POST',
					body: formData,
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.valid).toBe(false);
			expect(data.errors).toContain('Email is required');
		});

		it('should reject invalid email format', async () => {
			const formData = new FormData();
			formData.append('email', 'invalid-email');
			formData.append('password', 'Password123');

			const request = new Request(
				'http://localhost/api/examples/form-validation',
				{
					method: 'POST',
					body: formData,
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.valid).toBe(false);
			expect(data.errors).toContain('Email must be valid format');
		});

		it('should reject empty password', async () => {
			const formData = new FormData();
			formData.append('email', 'user@example.com');
			formData.append('password', '');

			const request = new Request(
				'http://localhost/api/examples/form-validation',
				{
					method: 'POST',
					body: formData,
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.valid).toBe(false);
			expect(data.errors).toContain('Password is required');
		});

		it('should reject password shorter than 8 characters', async () => {
			const formData = new FormData();
			formData.append('email', 'user@example.com');
			formData.append('password', 'Pass1');

			const request = new Request(
				'http://localhost/api/examples/form-validation',
				{
					method: 'POST',
					body: formData,
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.valid).toBe(false);
			expect(data.errors).toContain(
				'Password must be at least 8 characters',
			);
		});

		it('should handle multiple validation errors', async () => {
			const formData = new FormData();
			formData.append('email', 'invalid');
			formData.append('password', '123');

			const request = new Request(
				'http://localhost/api/examples/form-validation',
				{
					method: 'POST',
					body: formData,
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.valid).toBe(false);
			expect(data.errors.length).toBe(2);
			expect(data.errors).toContain('Email must be valid format');
			expect(data.errors).toContain(
				'Password must be at least 8 characters',
			);
		});

		it('should handle missing form fields', async () => {
			const formData = new FormData();
			// No fields added

			const request = new Request(
				'http://localhost/api/examples/form-validation',
				{
					method: 'POST',
					body: formData,
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.valid).toBe(false);
			expect(data.errors).toContain('Email is required');
			expect(data.errors).toContain('Password is required');
		});

		it('should trim whitespace in email validation', async () => {
			const formData = new FormData();
			formData.append('email', '   ');
			formData.append('password', 'Password123');

			const request = new Request(
				'http://localhost/api/examples/form-validation',
				{
					method: 'POST',
					body: formData,
				},
			);

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.errors).toContain('Email is required');
		});
	});

	describe('Usage Example', () => {
		it('should include curl example', async () => {
			const request = new Request(
				'http://localhost/api/examples/form-validation',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.usage_example).toBeDefined();
			expect(data.usage_example.method).toBe('POST');
			expect(data.usage_example.example_curl).toContain('curl');
			expect(data.usage_example.example_curl).toContain('-X POST');
			expect(data.usage_example.example_curl).toContain('-F');
		});
	});
});
