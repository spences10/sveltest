import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Form Validation Testing Scenarios Endpoint
 *
 * This endpoint provides form validation testing patterns extracted from
 * the login-form.svelte.test.ts file. Demonstrates form validation lifecycle,
 * user input handling, and accessibility patterns.
 *
 * Meta-Example Pattern:
 * - Returns form validation scenario data
 * - Tested with real FormData objects (client-server alignment)
 * - Demonstrates the validation patterns it describes
 */

export interface ValidationRule {
	field: string;
	rule_type: string;
	validation: string;
	error_message: string;
	test_cases: {
		valid: string[];
		invalid: string[];
	};
}

export interface FormValidationScenario {
	category: string;
	description: string;
	patterns: string[];
	test_examples?: any[];
}

const validation_rules: ValidationRule[] = [
	{
		field: 'email',
		rule_type: 'required',
		validation: 'Field must not be empty',
		error_message: 'This field is required',
		test_cases: {
			valid: ['user@example.com', 'test@test.co.uk'],
			invalid: ['', '   ', '\t\n'],
		},
	},
	{
		field: 'email',
		rule_type: 'format',
		validation: 'Must be valid email format',
		error_message: 'Invalid format',
		test_cases: {
			valid: ['user@example.com', 'test.user@domain.co.uk'],
			invalid: [
				'invalid-email',
				'user@',
				'@domain.com',
				'user domain.com',
			],
		},
	},
	{
		field: 'password',
		rule_type: 'required',
		validation: 'Field must not be empty',
		error_message: 'This field is required',
		test_cases: {
			valid: ['Password123', 'mySecureP@ss'],
			invalid: ['', '   ', '\t'],
		},
	},
	{
		field: 'password',
		rule_type: 'min_length',
		validation: 'Must be at least 8 characters',
		error_message: 'Must be at least 8 characters',
		test_cases: {
			valid: ['Password123', 'abcdefgh'],
			invalid: ['123', 'short', 'Pass1'],
		},
	},
];

const form_lifecycle_patterns: FormValidationScenario[] = [
	{
		category: 'Initial State',
		description:
			'Form starts in valid state, no errors shown initially',
		patterns: [
			'Forms should NOT be invalid by default',
			'Error messages hidden until validation triggered',
			'All fields empty but valid initially',
			'Submit button enabled (unless other conditions)',
		],
		test_examples: [
			{
				name: 'Render with default props',
				assertions: [
					'Form exists in DOM',
					'All form fields present',
					'No error messages visible',
					'Submit button exists',
				],
			},
		],
	},
	{
		category: 'User Input Handling',
		description: 'Testing user interactions with form fields',
		patterns: [
			'Use page.getByTestId() or page.getByLabelText()',
			'Use await input.fill() for text input',
			'Use await checkbox.click() for checkboxes',
			'Use await expect.element(input).toHaveValue()',
		],
		test_examples: [
			{
				name: 'Handle email input',
				code: `const email_input = page.getByTestId('input');
await email_input.fill('user@example.com');
await expect.element(email_input).toHaveValue('user@example.com');`,
			},
			{
				name: 'Handle password input',
				code: `const password_input = page.getByTestId('password-input');
await password_input.fill('mypassword123');
await expect.element(password_input).toHaveValue('mypassword123');`,
			},
		],
	},
	{
		category: 'Validation Lifecycle',
		description:
			'Form validation flow from initial to invalid to fixed',
		patterns: [
			'Test: initial (valid) → trigger validation → invalid → provide valid input → valid',
			'Errors appear after validation trigger (submit, blur)',
			'Errors clear when valid input provided',
			'Test both field-level and form-level validation',
		],
		test_examples: [
			{
				name: 'Validation lifecycle pattern',
				steps: [
					'1. Start with empty form (valid)',
					'2. Click submit to trigger validation',
					'3. Verify error messages appear',
					'4. Fill fields with valid data',
					'5. Verify errors clear',
				],
			},
		],
	},
	{
		category: 'Error Message Display',
		description: 'Testing error message visibility and content',
		patterns: [
			'Use page.getByText() to find error messages',
			'Test error appears: toBeInTheDocument()',
			'Test error clears: not.toBeInTheDocument()',
			'Verify specific error message text',
		],
		test_examples: [
			{
				name: 'Show validation errors',
				code: `await submit_button.click({ force: true });
await expect.element(page.getByText('This field is required')).toBeInTheDocument();`,
			},
			{
				name: 'Clear validation errors',
				code: `await email_input.fill('valid@email.com');
await expect.element(page.getByText('This field is required')).not.toBeInTheDocument();`,
			},
		],
	},
	{
		category: 'Keyboard Navigation',
		description: 'Testing keyboard interactions with forms',
		patterns: [
			'Test Enter key in password field submits form',
			'Use userEvent.keyboard() from vitest/browser',
			'Test tab navigation between fields',
			'Test Space key for checkboxes/buttons',
		],
		test_examples: [
			{
				name: 'Submit on Enter key',
				code: `await password_input.fill('Password123');
await password_input.click();
await userEvent.keyboard('{Enter}');
expect(mockSubmit).toHaveBeenCalled();`,
			},
		],
	},
	{
		category: 'Loading States',
		description: 'Testing form behavior during submission',
		patterns: [
			'Disable all form fields during loading',
			'Change submit button text to "Loading..."',
			'Test button state: toBeDisabled()',
			'Test input state: toBeDisabled()',
		],
		test_examples: [
			{
				name: 'Disable form during loading',
				props: { loading: true },
				assertions: [
					'Submit button disabled',
					'Email input disabled',
					'Password input disabled',
					'Remember me checkbox disabled',
				],
			},
		],
	},
	{
		category: 'Conditional Features',
		description: 'Testing optional form features',
		patterns: [
			'Test feature visibility with props',
			'Use not.toBeInTheDocument() for hidden features',
			'Test props like remember_me_enabled, forgot_password_enabled',
		],
		test_examples: [
			{
				name: 'Hide remember me when disabled',
				props: { remember_me_enabled: false },
				assertion: 'Remember me checkbox not in document',
			},
		],
	},
	{
		category: 'Accessibility',
		description: 'Testing form accessibility features',
		patterns: [
			'Use page.getByLabelText() for accessible queries',
			'Test proper label associations',
			'Test required attributes on inputs',
			'Test input types (email, password, text)',
		],
		test_examples: [
			{
				name: 'Proper form labels',
				code: `const email_input = page.getByLabelText('Email Address');
const password_input = page.getByTestId('password-input');
const remember_checkbox = page.getByLabelText('Remember me');`,
			},
			{
				name: 'Input attributes',
				assertions: [
					'Email input has type="email"',
					'Email input has required attribute',
					'Password input has type="password"',
					'Password input has required attribute',
				],
			},
		],
	},
];

const testing_patterns = {
	critical_patterns: [
		'Forms start VALID by default - not invalid',
		'Test validation lifecycle: valid → invalid → valid',
		'Use await expect.element() for all assertions',
		'Use page.getByLabelText() for accessibility',
		'Use await input.fill() for user input',
		'Never click disabled buttons (will timeout)',
	],
	common_mistakes: [
		'Expecting forms to be invalid initially',
		'Not testing error message clearing',
		'Clicking submit buttons in disabled state',
		'Using containers instead of locators',
		'Not testing keyboard navigation',
	],
	best_practices: [
		'Test complete validation lifecycle',
		'Test both happy path and error cases',
		'Use semantic queries (getByLabelText, getByRole)',
		'Test loading states disable all inputs',
		'Test conditional features show/hide correctly',
		'Mock event handlers with vi.fn()',
	],
	client_server_alignment: [
		'Use real FormData objects in server tests',
		'Share validation logic between client and server',
		'Test that server validates same rules as client',
		'Ensure error messages match between layers',
	],
};

export const POST: RequestHandler = async ({ request }) => {
	// This endpoint accepts FormData to demonstrate form validation patterns
	const formData = await request.formData();
	const email = formData.get('email')?.toString() || '';
	const password = formData.get('password')?.toString() || '';

	// Demonstrate validation
	const errors: string[] = [];

	if (!email || email.trim() === '') {
		errors.push('Email is required');
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.push('Email must be valid format');
	}

	if (!password || password.trim() === '') {
		errors.push('Password is required');
	} else if (password.length < 8) {
		errors.push('Password must be at least 8 characters');
	}

	if (errors.length > 0) {
		return json({ valid: false, errors }, { status: 400 });
	}

	return json({ valid: true, message: 'Validation passed' });
};

export const GET: RequestHandler = async () => {
	return json({
		title: 'Form Validation Testing Scenarios',
		description:
			'Testing patterns for form validation, user input, and validation lifecycle using vitest-browser-svelte',
		source_file: 'src/lib/components/login-form.svelte.test.ts',
		validation_rules,
		form_lifecycle_patterns,
		testing_patterns,
		meta: {
			component: 'LoginForm',
			test_type: 'Form Testing (Browser)',
			framework: 'vitest-browser-svelte',
			patterns_demonstrated: [
				'Form validation lifecycle',
				'User input handling',
				'Error message display',
				'Keyboard navigation',
				'Loading states',
				'Accessibility',
			],
		},
		usage_example: {
			description:
				'POST to this endpoint with FormData to test validation',
			method: 'POST',
			body: 'FormData with email and password fields',
			example_curl: `curl -X POST http://localhost:5173/api/examples/form-validation \\
  -F "email=user@example.com" \\
  -F "password=Password123"`,
		},
	});
};
