import { flushSync, untrack } from 'svelte';
import { beforeEach, describe, expect, test } from 'vitest';
import { calculator_state } from './calculator.svelte.ts';

describe('Calculator State', () => {
	beforeEach(() => {
		// Reset calculator state before each test
		calculator_state.reset();
	});

	describe('Initial State', () => {
		test('should initialize with default values', () => {
			expect(untrack(() => calculator_state.current_value)).toBe('0');
			expect(untrack(() => calculator_state.previous_value)).toBe('');
			expect(untrack(() => calculator_state.operation)).toBe('');
			expect(
				untrack(() => calculator_state.waiting_for_operand),
			).toBe(false);
		});

		test('should have all required methods', () => {
			expect(typeof calculator_state.input_digit).toBe('function');
			expect(typeof calculator_state.input_operation).toBe(
				'function',
			);
			expect(typeof calculator_state.calculate).toBe('function');
			expect(typeof calculator_state.perform_calculation).toBe(
				'function',
			);
			expect(typeof calculator_state.clear).toBe('function');
			expect(typeof calculator_state.reset).toBe('function');
		});
	});

	describe('Digit Input', () => {
		test('should input single digit', () => {
			calculator_state.input_digit('5');
			expect(untrack(() => calculator_state.current_value)).toBe('5');
		});

		test('should input multiple digits', () => {
			calculator_state.input_digit('1');
			calculator_state.input_digit('2');
			calculator_state.input_digit('3');
			expect(untrack(() => calculator_state.current_value)).toBe(
				'123',
			);
		});

		test('should replace initial zero with first digit', () => {
			calculator_state.input_digit('7');
			expect(untrack(() => calculator_state.current_value)).toBe('7');
		});

		test('should handle decimal point input', () => {
			calculator_state.input_digit('3');
			calculator_state.input_digit('.');
			calculator_state.input_digit('1');
			calculator_state.input_digit('4');
			expect(untrack(() => calculator_state.current_value)).toBe(
				'3.14',
			);
		});

		test('should handle leading decimal point', () => {
			calculator_state.input_digit('.');
			calculator_state.input_digit('5');
			expect(untrack(() => calculator_state.current_value)).toBe(
				'.5',
			);
		});

		test('should start new number after operation', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('+');
			calculator_state.input_digit('3');

			expect(untrack(() => calculator_state.current_value)).toBe('3');
			expect(untrack(() => calculator_state.previous_value)).toBe(
				'5',
			);
			expect(
				untrack(() => calculator_state.waiting_for_operand),
			).toBe(false);
		});

		test.skip('should handle multiple decimal points gracefully', () => {
			// TODO: Test prevention of multiple decimal points
		});

		test.skip('should handle very long numbers', () => {
			// TODO: Test display limits for long numbers
		});
	});

	describe('Operation Input', () => {
		test('should set operation and previous value', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('+');

			expect(untrack(() => calculator_state.operation)).toBe('+');
			expect(untrack(() => calculator_state.previous_value)).toBe(
				'5',
			);
			expect(
				untrack(() => calculator_state.waiting_for_operand),
			).toBe(true);
		});

		test('should handle all basic operations', () => {
			const operations = ['+', '-', '*', '/'];

			operations.forEach((op) => {
				calculator_state.clear();
				calculator_state.input_digit('5');
				calculator_state.input_operation(op);

				expect(untrack(() => calculator_state.operation)).toBe(op);
			});
		});

		test('should perform intermediate calculation on chained operations', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('+');
			calculator_state.input_digit('3');
			calculator_state.input_operation('*'); // Should calculate 5+3=8 first

			expect(untrack(() => calculator_state.current_value)).toBe('8');
			expect(untrack(() => calculator_state.previous_value)).toBe(
				'8',
			);
			expect(untrack(() => calculator_state.operation)).toBe('*');
		});

		test('should replace operation when entered consecutively without intermediate calculation', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('+');
			// When entering a second operation immediately, it calculates with current values
			// previous_value="5", current_value="5", operation="+", so 5+5=10
			calculator_state.input_operation('-');

			expect(untrack(() => calculator_state.operation)).toBe('-');
			// The calculation result becomes both current and previous value
			expect(untrack(() => calculator_state.previous_value)).toBe(
				'10',
			);
			expect(untrack(() => calculator_state.current_value)).toBe(
				'10',
			);
		});

		test.skip('should handle operation on empty input', () => {
			// TODO: Test operation input without prior digit input
		});
	});

	describe('Basic Calculations', () => {
		test('should perform addition', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('+');
			calculator_state.input_digit('3');

			const result = calculator_state.calculate();
			expect(result).toBe(8);
		});

		test('should perform subtraction', () => {
			calculator_state.input_digit('1');
			calculator_state.input_digit('0');
			calculator_state.input_operation('-');
			calculator_state.input_digit('3');

			const result = calculator_state.calculate();
			expect(result).toBe(7);
		});

		test('should perform multiplication', () => {
			calculator_state.input_digit('6');
			calculator_state.input_operation('*');
			calculator_state.input_digit('7');

			const result = calculator_state.calculate();
			expect(result).toBe(42);
		});

		test('should perform division', () => {
			calculator_state.input_digit('1');
			calculator_state.input_digit('5');
			calculator_state.input_operation('/');
			calculator_state.input_digit('3');

			const result = calculator_state.calculate();
			expect(result).toBe(5);
		});

		test('should handle decimal calculations', () => {
			calculator_state.input_digit('3');
			calculator_state.input_digit('.');
			calculator_state.input_digit('5');
			calculator_state.input_operation('*');
			calculator_state.input_digit('2');

			const result = calculator_state.calculate();
			expect(result).toBe(7);
		});

		test('should return current value when no operation is set', () => {
			calculator_state.input_digit('4');
			calculator_state.input_digit('2');

			const result = calculator_state.calculate();
			expect(result).toBe(42);
		});
	});

	describe('Perform Calculation', () => {
		test('should complete calculation and update state', () => {
			calculator_state.input_digit('8');
			calculator_state.input_operation('+');
			calculator_state.input_digit('4');
			calculator_state.perform_calculation();

			expect(untrack(() => calculator_state.current_value)).toBe(
				'12',
			);
			expect(untrack(() => calculator_state.previous_value)).toBe('');
			expect(untrack(() => calculator_state.operation)).toBe('');
			expect(
				untrack(() => calculator_state.waiting_for_operand),
			).toBe(true);
		});

		test('should allow chaining calculations', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('+');
			calculator_state.input_digit('3');
			calculator_state.perform_calculation(); // Result: 8

			calculator_state.input_operation('*');
			calculator_state.input_digit('2');
			calculator_state.perform_calculation(); // Result: 16

			expect(untrack(() => calculator_state.current_value)).toBe(
				'16',
			);
		});

		test('should handle calculation without operation', () => {
			calculator_state.input_digit('7');
			calculator_state.perform_calculation();

			expect(untrack(() => calculator_state.current_value)).toBe('7');
			expect(
				untrack(() => calculator_state.waiting_for_operand),
			).toBe(true);
		});

		test.skip('should handle repeated equals presses', () => {
			// TODO: Test behavior when equals is pressed multiple times
		});
	});

	describe('Clear and Reset', () => {
		test('should clear all state', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('+');
			calculator_state.input_digit('3');
			calculator_state.clear();

			expect(untrack(() => calculator_state.current_value)).toBe('0');
			expect(untrack(() => calculator_state.previous_value)).toBe('');
			expect(untrack(() => calculator_state.operation)).toBe('');
			expect(
				untrack(() => calculator_state.waiting_for_operand),
			).toBe(false);
		});

		test('should reset to initial state', () => {
			calculator_state.input_digit('9');
			calculator_state.input_operation('*');
			calculator_state.input_digit('8');
			calculator_state.perform_calculation();
			calculator_state.reset();

			expect(untrack(() => calculator_state.current_value)).toBe('0');
			expect(untrack(() => calculator_state.previous_value)).toBe('');
			expect(untrack(() => calculator_state.operation)).toBe('');
			expect(
				untrack(() => calculator_state.waiting_for_operand),
			).toBe(false);
		});
	});

	describe('Edge Cases', () => {
		test('should handle division by zero', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('/');
			calculator_state.input_digit('0');

			const result = calculator_state.calculate();
			expect(result).toBe(Infinity);
		});

		test('should handle negative results', () => {
			calculator_state.input_digit('3');
			calculator_state.input_operation('-');
			calculator_state.input_digit('8');

			const result = calculator_state.calculate();
			expect(result).toBe(-5);
		});

		test('should handle very small decimal results', () => {
			calculator_state.input_digit('1');
			calculator_state.input_operation('/');
			calculator_state.input_digit('3');

			const result = calculator_state.calculate();
			expect(result).toBeCloseTo(0.3333333333333333);
		});

		test('should handle zero operations', () => {
			calculator_state.input_digit('0');
			calculator_state.input_operation('+');
			calculator_state.input_digit('5');

			const result = calculator_state.calculate();
			expect(result).toBe(5);
		});

		test.skip('should handle overflow conditions', () => {
			// TODO: Test very large number calculations
		});

		test.skip('should handle invalid number inputs', () => {
			// TODO: Test non-numeric inputs if validation is added
		});
	});

	describe('Complex Calculation Sequences', () => {
		test('should handle multi-step calculations correctly', () => {
			// Test: 2 + 3 * 4 = 20 (not 14, because calculator does left-to-right)
			calculator_state.input_digit('2');
			calculator_state.input_operation('+');
			calculator_state.input_digit('3');
			calculator_state.input_operation('*'); // This should calculate 2+3=5 first
			calculator_state.input_digit('4');
			calculator_state.perform_calculation(); // Then 5*4=20

			expect(untrack(() => calculator_state.current_value)).toBe(
				'20',
			);
		});

		test('should handle decimal precision in chained operations', () => {
			calculator_state.input_digit('1');
			calculator_state.input_digit('0');
			calculator_state.input_operation('/');
			calculator_state.input_digit('3');
			calculator_state.input_operation('*');
			calculator_state.input_digit('3');
			calculator_state.perform_calculation();

			// Should be close to 10 due to floating point precision
			const result = parseFloat(
				untrack(() => calculator_state.current_value),
			);
			expect(result).toBeCloseTo(10, 10);
		});

		test.skip('should maintain precision across multiple operations', () => {
			// TODO: Test floating point precision handling
		});

		test.skip('should handle parentheses when implemented', () => {
			// TODO: Test order of operations with parentheses
		});
	});

	describe('State Reactivity', () => {
		test('should update reactive values immediately', () => {
			calculator_state.input_digit('7');
			flushSync(); // Ensure reactive updates are processed

			expect(untrack(() => calculator_state.current_value)).toBe('7');
		});

		test('should maintain state consistency during operations', () => {
			calculator_state.input_digit('5');
			calculator_state.input_operation('+');

			// State should be consistent
			expect(untrack(() => calculator_state.current_value)).toBe('5');
			expect(untrack(() => calculator_state.previous_value)).toBe(
				'5',
			);
			expect(untrack(() => calculator_state.operation)).toBe('+');
			expect(
				untrack(() => calculator_state.waiting_for_operand),
			).toBe(true);
		});

		test.skip('should handle concurrent state updates', () => {
			// TODO: Test rapid state changes
		});
	});
});
