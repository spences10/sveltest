class CalculatorState {
	private _current_value = $state('0');
	private _previous_value = $state('');
	private _operation = $state('');
	private _waiting_for_operand = $state(false);

	get current_value(): string {
		return this._current_value;
	}

	get previous_value(): string {
		return this._previous_value;
	}

	get operation(): string {
		return this._operation;
	}

	get waiting_for_operand(): boolean {
		return this._waiting_for_operand;
	}

	input_digit(digit: string): void {
		if (this._waiting_for_operand) {
			this._current_value = digit;
			this._waiting_for_operand = false;
		} else {
			this._current_value =
				this._current_value === '0'
					? digit
					: this._current_value + digit;
		}
	}

	input_operation(next_operation: string): void {
		const input_value = parseFloat(this._current_value);

		if (this._previous_value === '') {
			this._previous_value = this._current_value;
		} else if (this._operation) {
			const current_result = this.calculate();
			this._current_value = String(current_result);
			this._previous_value = this._current_value;
		}

		this._waiting_for_operand = true;
		this._operation = next_operation;
	}

	calculate(): number {
		const prev = parseFloat(this._previous_value);
		const current = parseFloat(this._current_value);

		if (this._operation === '+') return prev + current;
		if (this._operation === '-') return prev - current;
		if (this._operation === '*') return prev * current;
		if (this._operation === '/') return prev / current;
		return current;
	}

	perform_calculation(): void {
		const result = this.calculate();
		this._current_value = String(result);
		this._previous_value = '';
		this._operation = '';
		this._waiting_for_operand = true;
	}

	clear(): void {
		this._current_value = '0';
		this._previous_value = '';
		this._operation = '';
		this._waiting_for_operand = false;
	}

	// For testing purposes
	reset(): void {
		this.clear();
	}
}

// Export singleton instance
export const calculator_state = new CalculatorState();
