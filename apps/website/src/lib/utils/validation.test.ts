import * as v from 'valibot';
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vite-plus/test';
import {
	debounce,
	format_currency,
	validate_email,
	validate_password,
	validate_with_schema,
} from './validation';

describe('Validation Utilities', () => {
	describe('email format compatibility', () => {
		it.each([
			"o'connor@example.com",
			'_name@example.com',
			'user@two--hyphens.example',
		])('accepts %s', (email) => {
			expect(validate_email(email)).toEqual({
				is_valid: true,
				error_message: '',
			});
		});

		it.each([
			'.user@example.com',
			'user..name@example.com',
			'user.@example.com',
			'user@-domain.com',
			'user@domain.c',
		])('rejects %s', (email) => {
			expect(validate_email(email)).toEqual({
				is_valid: false,
				error_message: 'Invalid email format',
			});
		});
	});

	describe('validate_with_schema', () => {
		const name_schema = v.pipe(
			v.string(),
			v.minLength(3, 'Name must have at least three characters'),
		);

		it('maps successful validation to an empty error message', () => {
			expect(validate_with_schema(name_schema, 'Ada')).toEqual({
				is_valid: true,
				error_message: '',
			});
		});

		it('preserves the custom schema error message', () => {
			expect(validate_with_schema(name_schema, 'Al')).toEqual({
				is_valid: false,
				error_message: 'Name must have at least three characters',
			});
		});
	});

	describe('validate_email', () => {
		it.each([
			{ case_name: 'a simple address', email: 'test@example.com' },
			{ case_name: 'a subdomain', email: 'user.name@domain.co.uk' },
			{ case_name: 'a plus tag', email: 'user+tag@example.org' },
			{ case_name: 'a numeric local part', email: '123@numbers.com' },
		])('accepts $case_name', ({ email }) => {
			expect(validate_email(email)).toEqual({
				is_valid: true,
				error_message: '',
			});
		});

		it.each([
			{ case_name: 'an empty address', email: '' },
			{ case_name: 'a missing domain', email: 'invalid' },
			{ case_name: 'a missing local part', email: '@domain.com' },
			{ case_name: 'an empty domain after @', email: 'user@' },
			{
				case_name: 'a domain without a suffix',
				email: 'user@domain',
			},
			{
				case_name: 'a missing @ separator',
				email: 'user.domain.com',
			},
			{ case_name: 'an empty domain suffix', email: 'user@domain.' },
			{
				case_name: 'a space in the local part',
				email: 'user name@domain.com',
			},
			{ case_name: 'trailing garbage', email: 'user@example.com!' },
		])('rejects $case_name', ({ email }) => {
			expect(validate_email(email)).toEqual({
				is_valid: false,
				error_message: 'Invalid email format',
			});
		});
	});

	describe('validate_password', () => {
		it('accepts passwords meeting the configured rules', () => {
			const valid_passwords = [
				'Password123',
				'MySecure1Pass',
				'Complex9Password',
				'StrongP@ss1',
			];

			valid_passwords.forEach((password) => {
				const result = validate_password(password);
				expect(result.is_valid).toBe(true);
				expect(result.error_message).toBe('');
			});
		});

		it('should require password to be provided', () => {
			const result = validate_password('');

			expect(result.is_valid).toBe(false);
			expect(result.error_message).toBe(
				'Password must be at least 8 characters',
			);
		});

		it.each([
			{
				password: 'Abcdef1',
				is_valid: false,
				error_message: 'Password must be at least 8 characters',
			},
			{
				password: 'Abcdefg1',
				is_valid: true,
				error_message: '',
			},
		])(
			'checks the length boundary for $password',
			({ password, is_valid, error_message }) => {
				expect(validate_password(password)).toEqual({
					is_valid,
					error_message,
				});
			},
		);

		it('should require at least one uppercase letter', () => {
			const result = validate_password('lowercase123');

			expect(result.is_valid).toBe(false);
			expect(result.error_message).toBe(
				'Password must contain at least one uppercase letter',
			);
		});

		it('should require at least one lowercase letter', () => {
			const result = validate_password('UPPERCASE123');

			expect(result.is_valid).toBe(false);
			expect(result.error_message).toBe(
				'Password must contain at least one lowercase letter',
			);
		});

		it('should require at least one number', () => {
			const result = validate_password('NoNumbers');

			expect(result.is_valid).toBe(false);
			expect(result.error_message).toBe(
				'Password must contain at least one number',
			);
		});
	});

	describe('format_currency', () => {
		it('should format USD currency by default', () => {
			const result = format_currency(1234.56);

			expect(result).toBe('$1,234.56');
		});

		it('should format different currencies', () => {
			expect(format_currency(1000, 'EUR')).toBe('€1,000.00');
			expect(format_currency(1000, 'GBP')).toBe('£1,000.00');
			expect(format_currency(1000, 'JPY')).toBe('¥1,000');
		});
	});

	describe('debounce', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it.each([100, 250])('delays execution until %i ms', (wait) => {
			const mock_fn = vi.fn();
			const debounced = debounce(mock_fn, wait);

			debounced('test');
			expect(mock_fn).not.toHaveBeenCalled();

			vi.advanceTimersByTime(wait - 1);
			expect(mock_fn).not.toHaveBeenCalled();

			vi.advanceTimersByTime(1);
			expect(mock_fn).toHaveBeenCalledExactlyOnceWith('test');
		});

		it('cancels earlier calls and resets the delay after the last call', () => {
			const mock_fn = vi.fn();
			const debounced = debounce(mock_fn, 100);

			debounced('first');
			vi.advanceTimersByTime(50);
			debounced('second');
			vi.advanceTimersByTime(50);
			debounced('third');

			vi.advanceTimersByTime(99);
			expect(mock_fn).not.toHaveBeenCalled();

			vi.advanceTimersByTime(1);

			expect(mock_fn).toHaveBeenCalledTimes(1);
			expect(mock_fn).toHaveBeenCalledWith('third');
		});

		it('should handle multiple arguments', () => {
			const mock_fn = vi.fn();
			const debounced = debounce(mock_fn, 100);

			debounced('arg1', 'arg2', 'arg3');
			vi.advanceTimersByTime(100);

			expect(mock_fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
		});
	});
});
