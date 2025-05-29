export interface ValidationRule {
	required?: boolean;
	min_length?: number;
	max_length?: number;
	pattern?: RegExp;
	custom?: (value: string) => string | null;
}

export interface ValidationResult {
	is_valid: boolean;
	error_message: string;
}

export function validate_field(
	value: string,
	rules: ValidationRule,
): ValidationResult {
	// Required validation
	if (rules.required && (!value || value.trim() === '')) {
		return {
			is_valid: false,
			error_message: 'This field is required',
		};
	}

	// Skip other validations if field is empty and not required
	if (!value || value.trim() === '') {
		return {
			is_valid: true,
			error_message: '',
		};
	}

	// Min length validation
	if (rules.min_length && value.length < rules.min_length) {
		return {
			is_valid: false,
			error_message: `Must be at least ${rules.min_length} characters`,
		};
	}

	// Max length validation
	if (rules.max_length && value.length > rules.max_length) {
		return {
			is_valid: false,
			error_message: `Must be no more than ${rules.max_length} characters`,
		};
	}

	// Pattern validation
	if (rules.pattern && !rules.pattern.test(value)) {
		return {
			is_valid: false,
			error_message: 'Invalid format',
		};
	}

	// Custom validation
	if (rules.custom) {
		const custom_error = rules.custom(value);
		if (custom_error) {
			return {
				is_valid: false,
				error_message: custom_error,
			};
		}
	}

	return {
		is_valid: true,
		error_message: '',
	};
}

export function validate_email(email: string): ValidationResult {
	const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return validate_field(email, {
		required: true,
		pattern: email_pattern,
	});
}

export function validate_password(
	password: string,
): ValidationResult {
	return validate_field(password, {
		required: true,
		min_length: 8,
		custom: (value) => {
			if (!/[A-Z]/.test(value)) {
				return 'Password must contain at least one uppercase letter';
			}
			if (!/[a-z]/.test(value)) {
				return 'Password must contain at least one lowercase letter';
			}
			if (!/[0-9]/.test(value)) {
				return 'Password must contain at least one number';
			}
			return null;
		},
	});
}

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
