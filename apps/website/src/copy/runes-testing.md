# Svelte 5 Runes Testing Patterns

## Overview

This guide covers testing patterns specific to Svelte 5's runes system
(`$state`, `$derived`, `$effect`). For general testing patterns, see
[Testing Patterns](./testing-patterns).

**Key Rule**: Always use `untrack()` when accessing `$derived` values
in tests.

## $state and $derived Testing

```typescript
describe('Reactive State Component', () => {
	it('should handle $state updates', async () => {
		render(CounterComponent);

		const count_display = page.getByTestId('count');
		const increment_button = page.getByRole('button', {
			name: 'Increment',
		});

		// Initial state
		await expect.element(count_display).toHaveTextContent('0');

		// Update state
		await increment_button.click();
		await expect.element(count_display).toHaveTextContent('1');
	});

	it('should handle $derived values with untrack', () => {
		let count = $state(0);
		let doubled = $derived(count * 2);

		// ✅ Always use untrack() when accessing $derived values
		expect(untrack(() => doubled)).toBe(0);

		count = 5;
		flushSync(); // Ensure derived state is evaluated

		expect(untrack(() => doubled)).toBe(10);
	});

	it('should handle $derived from object getters', () => {
		const state_object = {
			get computed_value() {
				return $derived(() => some_calculation());
			},
		};

		// ✅ Get the $derived function first, then use untrack
		const derived_fn = state_object.computed_value;
		expect(untrack(() => derived_fn())).toBe(expected_value);
	});
});
```

## Untrack Patterns

### Why untrack() is Required

Svelte 5's `$derived` values track their dependencies. In tests,
accessing them without `untrack()` can cause unexpected reactivity
issues. Always wrap access in `untrack()`.

### Basic Pattern

```typescript
import { flushSync, untrack } from 'svelte';

// ✅ CORRECT
expect(untrack(() => derived_value)).toBe(expected);

// ❌ WRONG - may cause reactivity issues
expect(derived_value).toBe(expected);
```

### Real-World Examples

#### Testing Form State with Multiple $derived Values

```typescript
// From form-state.test.ts - Testing complex derived state
describe('Form State Derived Values', () => {
	it('should validate form state correctly', () => {
		const form = create_form_state({
			email: { value: '', validation_rules: { required: true } },
			password: {
				value: '',
				validation_rules: { required: true, min_length: 8 },
			},
		});

		// Test initial state
		expect(untrack(() => form.is_form_valid())).toBe(true);
		expect(untrack(() => form.has_changes())).toBe(false);
		expect(untrack(() => form.field_errors())).toEqual({});

		// Update field and test derived state changes
		form.update_field('email', 'invalid');
		flushSync();

		expect(untrack(() => form.is_form_valid())).toBe(false);
		expect(untrack(() => form.has_changes())).toBe(true);

		const errors = untrack(() => form.field_errors());
		expect(errors.email).toBe('Invalid format');
	});
});
```

#### Testing Calculator State Transitions

```typescript
// From calculator.test.ts - Testing state getters
describe('Calculator State Management', () => {
	it('should handle calculator state transitions', () => {
		// Test initial state
		expect(untrack(() => calculator_state.current_value)).toBe('0');
		expect(untrack(() => calculator_state.previous_value)).toBe('');
		expect(untrack(() => calculator_state.operation)).toBe('');
		expect(untrack(() => calculator_state.waiting_for_operand)).toBe(
			false,
		);

		// Perform operation and test state changes
		calculator_state.input_digit('5');
		calculator_state.input_operation('+');
		flushSync();

		expect(untrack(() => calculator_state.current_value)).toBe('5');
		expect(untrack(() => calculator_state.operation)).toBe('+');
		expect(untrack(() => calculator_state.waiting_for_operand)).toBe(
			true,
		);
	});
});
```

## flushSync Usage

Use `flushSync()` to ensure reactive state updates are processed
before assertions:

```typescript
import { flushSync } from 'svelte';

it('should update derived state after flushSync', () => {
	let count = $state(0);
	let doubled = $derived(count * 2);

	count = 5;
	// Without flushSync, derived might not be updated yet
	flushSync();

	expect(untrack(() => doubled)).toBe(10);
});
```

### When to Use flushSync

- After updating `$state` values
- Before asserting on `$derived` values
- When testing state transitions

## Creating $derived State in Tests

**Key Discovery**: Runes can only be used in `.test.svelte.ts` files,
not regular `.ts` files!

```typescript
// From untrack-validation.test.svelte.ts - PROVEN WORKING PATTERN
describe('Untrack Usage Validation', () => {
	it('should access $derived values using untrack', () => {
		// ✅ Create reactive state directly in test (.test.svelte.ts file)
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
		// ✅ Recreate component logic in test
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

	it('should test state transitions with untrack', () => {
		// ✅ Test reactive state changes
		let count = $state(0);
		let doubled = $derived(count * 2);
		let is_even = $derived(count % 2 === 0);

		// Initial state
		expect(untrack(() => count)).toBe(0);
		expect(untrack(() => doubled)).toBe(0);
		expect(untrack(() => is_even)).toBe(true);

		// Update state
		count = 3;
		flushSync();

		// Test all derived values
		expect(untrack(() => count)).toBe(3);
		expect(untrack(() => doubled)).toBe(6);
		expect(untrack(() => is_even)).toBe(false);
	});

	it('should handle form validation patterns', () => {
		// ✅ Recreate login form validation logic
		let email = $state('');
		let password = $state('');
		let loading = $state(false);

		const email_validation = $derived(validate_email(email));
		const password_validation = $derived(validate_password(password));
		const form_is_valid = $derived(
			email_validation.is_valid && password_validation.is_valid,
		);
		const can_submit = $derived(form_is_valid && !loading);

		// Test form validation chain
		email = 'test@example.com';
		password = 'ValidPassword123';
		flushSync();

		expect(untrack(() => email_validation.is_valid)).toBe(true);
		expect(untrack(() => password_validation.is_valid)).toBe(true);
		expect(untrack(() => form_is_valid)).toBe(true);
		expect(untrack(() => can_submit)).toBe(true);

		// Test loading state
		loading = true;
		flushSync();

		expect(untrack(() => can_submit)).toBe(false);
	});
});
```

## Testing Component $derived Values

Component internals are encapsulated in Svelte 5. Test through UI:

```typescript
describe('LoginForm Derived State', () => {
	it('should validate email and show errors through UI', async () => {
		render(LoginForm);

		// ✅ Test through UI interactions
		const email_input = page.getByLabelText('Email');
		await email_input.fill('invalid-email');
		await email_input.element().blur();

		await expect
			.element(page.getByText('Invalid format'))
			.toBeInTheDocument();
	});
});
```

## Form Validation Lifecycle Pattern

Forms typically start valid (not yet validated), become invalid on
validation, then valid again when fixed:

```typescript
describe('Form Validation Component', () => {
	it('should follow validation lifecycle', () => {
		const form_state = create_form_state({
			email: {
				value: '',
				validation_rules: { required: true },
			},
		});

		// ✅ CORRECT: Forms typically start valid (not validated yet)
		const is_form_valid = form_state.is_form_valid;
		expect(untrack(() => is_form_valid())).toBe(true);

		// Trigger validation - now should be invalid
		form_state.validate_all_fields();
		flushSync();
		expect(untrack(() => is_form_valid())).toBe(false);

		// Fix the field - should become valid again
		form_state.update_field('email', 'valid@example.com');
		flushSync();
		expect(untrack(() => is_form_valid())).toBe(true);
	});

	it('should handle field-level validation', async () => {
		render(FormComponent);

		const email_input = page.getByLabelText('Email');

		// Initially no error
		await expect
			.element(page.getByText('Email is required'))
			.not.toBeInTheDocument();

		// Trigger validation by focusing and blurring
		await email_input.element().focus();
		await email_input.element().blur();

		// Error should appear
		await expect
			.element(page.getByText('Email is required'))
			.toBeInTheDocument();

		// Fix the error
		await email_input.fill('valid@example.com');
		await email_input.element().blur();

		// Error should disappear
		await expect
			.element(page.getByText('Email is required'))
			.not.toBeInTheDocument();
	});
});
```

## Quick Reference

### Essential Rules

- ✅ Use `untrack()` for `$derived`:
  `expect(untrack(() => derived_value))`
- ✅ Use `flushSync()` after state updates before assertions
- ✅ Use `.test.svelte.ts` files to create runes in tests
- ✅ Test component derived values through UI, not internals
- ✅ Forms start valid (not validated) → validate → fix

### Common Pattern

```typescript
import { flushSync, untrack } from 'svelte';

let state = $state(initial);
let derived = $derived(compute(state));

state = new_value;
flushSync();
expect(untrack(() => derived)).toBe(expected);
```
