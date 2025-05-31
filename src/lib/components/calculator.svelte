<script lang="ts">
	import { calculator_state } from '$lib/state/calculator.svelte.js';
</script>

<div class="space-y-6">
	<div
		class="bg-base-200/50 border-base-300/50 rounded-xl border p-6"
	>
		<div
			class="bg-base-300/50 mb-4 rounded-lg p-4 text-right font-mono text-3xl"
		>
			{calculator_state.current_value}
		</div>

		<div class="grid grid-cols-4 gap-2">
			<button
				class="btn btn-outline btn-sm"
				onclick={() => calculator_state.clear()}
			>
				C
			</button>
			<button class="btn btn-outline btn-sm" disabled> ± </button>
			<button class="btn btn-outline btn-sm" disabled> % </button>
			<button
				class="btn btn-warning btn-sm"
				onclick={() => calculator_state.input_operation('/')}
			>
				÷
			</button>

			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('7')}
			>
				7
			</button>
			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('8')}
			>
				8
			</button>
			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('9')}
			>
				9
			</button>
			<button
				class="btn btn-warning btn-sm"
				onclick={() => calculator_state.input_operation('*')}
			>
				×
			</button>

			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('4')}
			>
				4
			</button>
			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('5')}
			>
				5
			</button>
			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('6')}
			>
				6
			</button>
			<button
				class="btn btn-warning btn-sm"
				onclick={() => calculator_state.input_operation('-')}
			>
				−
			</button>

			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('1')}
			>
				1
			</button>
			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('2')}
			>
				2
			</button>
			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('3')}
			>
				3
			</button>
			<button
				class="btn btn-warning btn-sm"
				onclick={() => calculator_state.input_operation('+')}
			>
				+
			</button>

			<button
				class="btn btn-ghost btn-sm col-span-2"
				onclick={() => calculator_state.input_digit('0')}
			>
				0
			</button>
			<button
				class="btn btn-ghost btn-sm"
				onclick={() => calculator_state.input_digit('.')}
			>
				.
			</button>
			<button
				class="btn btn-primary btn-sm"
				onclick={() => calculator_state.perform_calculation()}
			>
				=
			</button>
		</div>
	</div>
</div>
