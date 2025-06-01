import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import Calculator from './calculator.svelte';

// Mock the calculator state for SSR testing
vi.mock('$lib/state/calculator.svelte.ts', () => ({
	calculator_state: {
		current_value: '0',
		clear: vi.fn(),
		input_digit: vi.fn(),
		input_operation: vi.fn(),
		perform_calculation: vi.fn(),
		reset: vi.fn(),
	},
}));

describe('Calculator SSR', () => {
	test('should render without errors', () => {
		expect(() => {
			render(Calculator);
		}).not.toThrow();
	});

	test('should render essential calculator structure for SEO', () => {
		const { body } = render(Calculator);

		// Test core calculator structure is present
		expect(body).toContain('class="space-y-6"'); // Main container
		expect(body).toContain('class="grid grid-cols-4 gap-2"'); // Button grid
		expect(body).toContain('0'); // Default display value
	});

	test('should render all calculator buttons in HTML', () => {
		const { body } = render(Calculator);

		// Test digit buttons are rendered
		for (let i = 0; i <= 9; i++) {
			expect(body).toContain(`>${i}<`);
		}

		// Test operation buttons are rendered
		expect(body).toContain('>+<');
		expect(body).toContain('>−<');
		expect(body).toContain('>×<');
		expect(body).toContain('>÷<');

		// Test control buttons are rendered
		expect(body).toContain('>C<');
		expect(body).toContain('>=<');
		expect(body).toContain('>.<');
	});

	test('should render proper button structure with classes', () => {
		const { body } = render(Calculator);

		// Test button classes are applied
		expect(body).toContain('btn btn-outline btn-sm'); // Clear button
		expect(body).toContain('btn btn-ghost btn-sm'); // Digit buttons
		expect(body).toContain('btn btn-warning btn-sm'); // Operation buttons
		expect(body).toContain('btn btn-primary btn-sm'); // Equals button
	});

	test('should render display area with proper styling', () => {
		const { body } = render(Calculator);

		// Test display area structure
		expect(body).toContain(
			'bg-base-300/50 mb-4 rounded-lg p-4 text-right font-mono text-3xl',
		);
	});

	test('should render disabled buttons correctly', () => {
		const { body } = render(Calculator);

		// Test disabled buttons (± and %) are rendered with disabled attribute
		expect(body).toContain('disabled');
		expect(body).toContain('>±<');
		expect(body).toContain('>%<');
	});

	test('should have proper semantic HTML structure', () => {
		const { body } = render(Calculator);

		// Test semantic button elements
		expect(body).toMatch(/<button[^>]*>C<\/button>/);
		expect(body).toMatch(/<button[^>]*>=<\/button>/);
		expect(body).toMatch(/<button[^>]*>\+<\/button>/);
	});

	test('should render with responsive layout classes', () => {
		const { body } = render(Calculator);

		// Test responsive and layout classes
		expect(body).toContain(
			'bg-base-200/50 border-base-300/50 rounded-xl border p-6',
		);
		expect(body).toContain('col-span-2'); // Zero button spans 2 columns
	});

	test('should not contain client-side JavaScript in SSR output', () => {
		const { body } = render(Calculator);

		// SSR should not contain onclick handlers in the HTML
		// The onclick handlers are added on the client side
		expect(body).not.toContain('onclick');
		expect(body).not.toContain('calculator_state');
	});

	test('should render calculator in a clean state', () => {
		const { body } = render(Calculator);

		// Should show initial state
		expect(body).toContain('0'); // Default display value

		// Should not contain any calculation results or intermediate states
		expect(body).not.toContain('Error');
		expect(body).not.toContain('NaN');
		expect(body).not.toContain('Infinity');
	});
});
