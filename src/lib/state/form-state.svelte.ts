import { z } from 'zod';
import {
	validate_with_schema,
	type ValidationResult,
	type ValidationRule,
} from '../utils/validation.ts';

export interface FormField {
	value: string;
	validation_rules?: ValidationRule;
	validation_result?: ValidationResult;
	touched: boolean;
}

export interface FormState {
	[key: string]: FormField;
}

// Helper function to convert legacy rules to Zod schema
function create_schema_from_rules(
	rules: ValidationRule,
): z.ZodSchema<any> {
	if (rules.schema) {
		return rules.schema;
	}

	// Convert legacy rules to Zod schema
	let schema: z.ZodSchema<any> = z.string();

	if (rules.required) {
		schema = schema.min(1, 'This field is required');
	} else {
		schema = schema.optional().or(z.literal(''));
	}

	if (rules.min_length) {
		schema = schema.min(
			rules.min_length,
			`Must be at least ${rules.min_length} characters`,
		);
	}

	if (rules.max_length) {
		schema = schema.max(
			rules.max_length,
			`Must be no more than ${rules.max_length} characters`,
		);
	}

	if (rules.pattern) {
		schema = schema.regex(rules.pattern, 'Invalid format');
	}

	return schema;
}

export function create_form_state(
	initial_fields: Record<
		string,
		{ value?: string; validation_rules?: ValidationRule }
	>,
) {
	// Initialize form state with runes
	const form_state = $state<FormState>({});

	// Initialize fields
	for (const [field_name, config] of Object.entries(initial_fields)) {
		form_state[field_name] = {
			value: config.value || '',
			validation_rules: config.validation_rules,
			validation_result: { is_valid: true, error_message: '' },
			touched: false,
		};
	}

	function update_field(field_name: string, value: string) {
		if (!form_state[field_name]) return;

		form_state[field_name].value = value;
		form_state[field_name].touched = true;

		// Validate if rules exist
		if (form_state[field_name].validation_rules) {
			const schema = create_schema_from_rules(
				form_state[field_name].validation_rules!,
			);
			form_state[field_name].validation_result = validate_with_schema(
				schema,
				value,
			);
		}
	}

	function validate_all_fields(): boolean {
		let all_valid = true;

		for (const field_name of Object.keys(form_state)) {
			const field = form_state[field_name];
			if (field.validation_rules) {
				const schema = create_schema_from_rules(
					field.validation_rules,
				);
				field.validation_result = validate_with_schema(
					schema,
					field.value,
				);
				field.touched = true;

				if (!field.validation_result.is_valid) {
					all_valid = false;
				}
			}
		}

		return all_valid;
	}

	function reset_form() {
		for (const field_name of Object.keys(form_state)) {
			form_state[field_name].value = '';
			form_state[field_name].touched = false;
			form_state[field_name].validation_result = {
				is_valid: true,
				error_message: '',
			};
		}
	}

	function get_form_data(): Record<string, string> {
		const data: Record<string, string> = {};
		for (const [field_name, field] of Object.entries(form_state)) {
			data[field_name] = field.value;
		}
		return data;
	}

	// Derived state using runes
	const is_form_valid = $derived(() => {
		return Object.values(form_state).every(
			(field) =>
				!field.validation_rules || field.validation_result?.is_valid,
		);
	});

	const has_changes = $derived(() => {
		return Object.values(form_state).some((field) => field.touched);
	});

	const field_errors = $derived(() => {
		const errors: Record<string, string> = {};
		for (const [field_name, field] of Object.entries(form_state)) {
			if (
				field.touched &&
				field.validation_result &&
				!field.validation_result.is_valid
			) {
				errors[field_name] = field.validation_result.error_message;
			}
		}
		return errors;
	});

	return {
		// State
		get form_state() {
			return form_state;
		},

		// Derived state
		get is_form_valid() {
			return is_form_valid;
		},
		get has_changes() {
			return has_changes;
		},
		get field_errors() {
			return field_errors;
		},

		// Actions
		update_field,
		validate_all_fields,
		reset_form,
		get_form_data,
	};
}
