import * as v from 'valibot';

// Preserve the existing email policy rather than changing accepted formats.
export const email_schema = v.pipe(
	v.string(),
	v.regex(
		/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/,
		'Invalid email format',
	),
);

export const password_schema = v.pipe(
	v.string(),
	v.minLength(8, 'Password must be at least 8 characters'),
	v.regex(
		/[A-Z]/,
		'Password must contain at least one uppercase letter',
	),
	v.regex(
		/[a-z]/,
		'Password must contain at least one lowercase letter',
	),
	v.regex(/[0-9]/, 'Password must contain at least one number'),
);

// Legacy ValidationRule interface for backward compatibility
export interface ValidationRule {
	schema?: v.GenericSchema;
	required?: boolean;
	min_length?: number;
	max_length?: number;
	pattern?: RegExp;
}

export interface ValidationResult {
	is_valid: boolean;
	error_message: string;
}

export function validate_with_schema<T>(
	schema: v.GenericSchema<unknown, T>,
	value: unknown,
): ValidationResult {
	const result = v.safeParse(schema, value);
	return {
		is_valid: result.success,
		error_message: result.success
			? ''
			: result.issues[0]?.message || 'Invalid input',
	};
}

// Simplified validation functions
export function validate_email(email: string): ValidationResult {
	return validate_with_schema(email_schema, email);
}

export function validate_password(
	password: string,
): ValidationResult {
	return validate_with_schema(password_schema, password);
}

// Utility functions (not validation-related)
export function format_currency(
	amount: number,
	currency = 'USD',
): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(amount);
}

export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}
