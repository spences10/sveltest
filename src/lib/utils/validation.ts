import { z } from 'zod';

export const email_schema = z.string().email('Invalid email format');

export const password_schema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.regex(
		/[A-Z]/,
		'Password must contain at least one uppercase letter',
	)
	.regex(
		/[a-z]/,
		'Password must contain at least one lowercase letter',
	)
	.regex(/[0-9]/, 'Password must contain at least one number');

// Legacy ValidationRule interface for backward compatibility
export interface ValidationRule {
	schema?: z.ZodSchema<any>;
	required?: boolean;
	min_length?: number;
	max_length?: number;
	pattern?: RegExp;
}

export interface ValidationResult {
	is_valid: boolean;
	error_message: string;
}

// Helper to convert Zod results to ValidationResult format
export function validate_with_schema<T>(
	schema: z.ZodSchema<T>,
	value: unknown,
): ValidationResult {
	const result = schema.safeParse(value);
	return {
		is_valid: result.success,
		error_message: result.success
			? ''
			: result.error.issues[0]?.message || 'Invalid input',
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
