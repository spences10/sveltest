<script lang="ts">
	import {
		ArrowLongRight,
		BarChart,
		BookOpen,
		Calculator,
		CheckCircle,
		Code,
		Eye,
		LightningBolt,
		Settings,
	} from '$lib/icons';

	// Calculator logic for testing examples
	let current_value = $state('0');
	let previous_value = $state('');
	let operation = $state('');
	let waiting_for_operand = $state(false);

	function input_digit(digit: string) {
		if (waiting_for_operand) {
			current_value = digit;
			waiting_for_operand = false;
		} else {
			current_value =
				current_value === '0' ? digit : current_value + digit;
		}
	}

	function input_operation(next_operation: string) {
		const input_value = parseFloat(current_value);

		if (previous_value === '') {
			previous_value = current_value;
		} else if (operation) {
			const current_result = calculate();
			current_value = String(current_result);
			previous_value = current_value;
		}

		waiting_for_operand = true;
		operation = next_operation;
	}

	function calculate() {
		const prev = parseFloat(previous_value);
		const current = parseFloat(current_value);

		if (operation === '+') return prev + current;
		if (operation === '-') return prev - current;
		if (operation === '*') return prev * current;
		if (operation === '/') return prev / current;
		return current;
	}

	function perform_calculation() {
		const result = calculate();
		current_value = String(result);
		previous_value = '';
		operation = '';
		waiting_for_operand = true;
	}

	function clear() {
		current_value = '0';
		previous_value = '';
		operation = '';
		waiting_for_operand = false;
	}
</script>

<svelte:head>
	<title>Unit Testing Examples - TestSuite Pro</title>
	<meta
		name="description"
		content="Learn unit testing with practical examples using Vitest and Testing Library"
	/>
</svelte:head>

<!-- Unit Testing Examples Page -->
<div class="min-h-screen px-4 py-8">
	<div class="container mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-12 text-center">
			<div
				class="bg-info/10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
			>
				<Calculator class_names="text-info h-4 w-4" />
				<span class="text-info text-sm font-medium">Unit Testing</span
				>
			</div>
			<h1
				class="from-info via-primary to-secondary mb-4 bg-gradient-to-r bg-clip-text text-6xl font-black text-transparent"
			>
				Unit Testing Examples
			</h1>
			<p class="text-base-content/70 mx-auto max-w-3xl text-xl">
				Learn unit testing fundamentals with practical examples using
				Vitest and Testing Library
			</p>
		</div>

		<!-- Interactive Calculator Demo -->
		<div class="mb-16">
			<div
				class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="bg-info/20 flex h-12 w-12 items-center justify-center rounded-xl"
						>
							<Calculator class_names="text-info h-6 w-6" />
						</div>
						<div>
							<h2 class="text-2xl font-bold">
								Interactive Calculator
							</h2>
							<p class="text-base-content/60 text-sm">
								A working calculator with comprehensive unit tests
							</p>
						</div>
					</div>

					<div class="grid gap-8 lg:grid-cols-2">
						<!-- Calculator Interface -->
						<div class="space-y-6">
							<div
								class="bg-base-200/50 border-base-300/50 rounded-xl border p-6"
							>
								<div
									class="bg-base-300/50 mb-4 rounded-lg p-4 text-right font-mono text-3xl"
								>
									{current_value}
								</div>

								<div class="grid grid-cols-4 gap-2">
									<button
										class="btn btn-outline btn-sm"
										onclick={clear}
									>
										C
									</button>
									<button class="btn btn-outline btn-sm" disabled>
										±
									</button>
									<button class="btn btn-outline btn-sm" disabled>
										%
									</button>
									<button
										class="btn btn-warning btn-sm"
										onclick={() => input_operation('/')}
									>
										÷
									</button>

									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('7')}
									>
										7
									</button>
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('8')}
									>
										8
									</button>
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('9')}
									>
										9
									</button>
									<button
										class="btn btn-warning btn-sm"
										onclick={() => input_operation('*')}
									>
										×
									</button>

									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('4')}
									>
										4
									</button>
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('5')}
									>
										5
									</button>
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('6')}
									>
										6
									</button>
									<button
										class="btn btn-warning btn-sm"
										onclick={() => input_operation('-')}
									>
										−
									</button>

									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('1')}
									>
										1
									</button>
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('2')}
									>
										2
									</button>
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('3')}
									>
										3
									</button>
									<button
										class="btn btn-warning btn-sm"
										onclick={() => input_operation('+')}
									>
										+
									</button>

									<button
										class="btn btn-ghost btn-sm col-span-2"
										onclick={() => input_digit('0')}
									>
										0
									</button>
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => input_digit('.')}
									>
										.
									</button>
									<button
										class="btn btn-primary btn-sm"
										onclick={perform_calculation}
									>
										=
									</button>
								</div>
							</div>
						</div>

						<!-- Test Information -->
						<div class="space-y-6">
							<div
								class="bg-success/10 border-success/20 rounded-xl border p-6"
							>
								<h3
									class="mb-4 flex items-center gap-2 text-lg font-bold"
								>
									<CheckCircle class_names="text-success h-5 w-5" />
									Test Coverage
								</h3>
								<div class="space-y-3">
									<div class="flex items-center justify-between">
										<span class="text-sm">Basic Operations</span>
										<div class="badge badge-success badge-sm">
											100%
										</div>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm">Edge Cases</span>
										<div class="badge badge-success badge-sm">
											95%
										</div>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm">Error Handling</span>
										<div class="badge badge-success badge-sm">
											90%
										</div>
									</div>
								</div>
							</div>

							<div
								class="bg-info/10 border-info/20 rounded-xl border p-6"
							>
								<h3
									class="mb-4 flex items-center gap-2 text-lg font-bold"
								>
									<Code class_names="text-info h-5 w-5" />
									Testing Tools
								</h3>
								<div class="space-y-2">
									<div class="badge badge-outline badge-sm">
										Vitest
									</div>
									<div class="badge badge-outline badge-sm">
										Testing Library
									</div>
									<div class="badge badge-outline badge-sm">
										User Events
									</div>
									<div class="badge badge-outline badge-sm">
										Mock Functions
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Testing Concepts -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Testing Concepts
			</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<!-- Arrange, Act, Assert -->
				<div
					class="card bg-base-100/80 border-base-300/50 border shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div
							class="bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
						>
							<LightningBolt class_names="text-primary h-6 w-6" />
						</div>
						<h3 class="mb-3 text-xl font-bold">
							Arrange, Act, Assert
						</h3>
						<p class="text-base-content/70 mb-4 text-sm">
							The fundamental pattern for structuring unit tests
						</p>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="bg-primary h-2 w-2 rounded-full"></div>
								<span class="text-xs">Setup test data</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="bg-secondary h-2 w-2 rounded-full"></div>
								<span class="text-xs">Execute function</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="bg-accent h-2 w-2 rounded-full"></div>
								<span class="text-xs">Verify results</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Mocking -->
				<div
					class="card bg-base-100/80 border-base-300/50 border shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div
							class="bg-secondary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
						>
							<Settings class_names="text-secondary h-6 w-6" />
						</div>
						<h3 class="mb-3 text-xl font-bold">Mocking</h3>
						<p class="text-base-content/70 mb-4 text-sm">
							Isolate units by mocking dependencies
						</p>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-3 w-3" />
								<span class="text-xs">Mock functions</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-3 w-3" />
								<span class="text-xs">Mock modules</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckCircle class_names="text-success h-3 w-3" />
								<span class="text-xs">Spy on calls</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Test Coverage -->
				<div
					class="card bg-base-100/80 border-base-300/50 border shadow-xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div
							class="bg-accent/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
						>
							<BarChart class_names="text-accent h-6 w-6" />
						</div>
						<h3 class="mb-3 text-xl font-bold">Test Coverage</h3>
						<p class="text-base-content/70 mb-4 text-sm">
							Measure and improve test coverage
						</p>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span class="text-xs">Line coverage</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="bg-info h-2 w-2 rounded-full"></div>
								<span class="text-xs">Branch coverage</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="bg-warning h-2 w-2 rounded-full"></div>
								<span class="text-xs">Function coverage</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Code Examples -->
		<div class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-bold">
				Code Examples
			</h2>
			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Basic Test Example -->
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div class="mb-4 flex items-center gap-3">
							<div
								class="bg-success/20 flex h-10 w-10 items-center justify-center rounded-lg"
							>
								<Code class_names="text-success h-5 w-5" />
							</div>
							<h3 class="text-xl font-bold">Basic Function Test</h3>
						</div>
						<div
							class="bg-base-200/50 rounded-lg p-4 font-mono text-sm"
						>
							<pre><code
									>{`// calculator.test.js
import { add } from './calculator.js';

test('adds two numbers', () => {
  // Arrange
  const a = 2;
  const b = 3;
  
  // Act
  const result = add(a, b);
  
  // Assert
  expect(result).toBe(5);
});`}</code
								></pre>
						</div>
					</div>
				</div>

				<!-- Component Test Example -->
				<div
					class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
				>
					<div class="card-body p-6">
						<div class="mb-4 flex items-center gap-3">
							<div
								class="bg-info/20 flex h-10 w-10 items-center justify-center rounded-lg"
							>
								<BookOpen class_names="text-info h-5 w-5" />
							</div>
							<h3 class="text-xl font-bold">Component Test</h3>
						</div>
						<div
							class="bg-base-200/50 rounded-lg p-4 font-mono text-sm"
						>
							<pre><code
									>{`// Button.test.js
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

test('calls onClick when clicked', async () => {
  const onClick = vi.fn();
  const { getByRole } = render(Button, {
    props: { onClick }
  });
  
  await fireEvent.click(getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});`}</code
								></pre>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Best Practices -->
		<div class="mb-16">
			<div
				class="card from-primary/10 via-secondary/5 to-accent/10 border-primary/20 border bg-gradient-to-br shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl"
						>
							<LightningBolt class_names="text-primary h-6 w-6" />
						</div>
						<h2 class="text-3xl font-bold">
							Unit Testing Best Practices
						</h2>
					</div>

					<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<div class="space-y-3">
							<h3 class="flex items-center gap-2 font-semibold">
								<CheckCircle class_names="text-success h-4 w-4" />
								Test Structure
							</h3>
							<ul class="text-base-content/70 space-y-1 text-sm">
								<li>• Use descriptive test names</li>
								<li>• Follow AAA pattern</li>
								<li>• One assertion per test</li>
								<li>• Group related tests</li>
							</ul>
						</div>

						<div class="space-y-3">
							<h3 class="flex items-center gap-2 font-semibold">
								<Settings class_names="text-info h-4 w-4" />
								Test Quality
							</h3>
							<ul class="text-base-content/70 space-y-1 text-sm">
								<li>• Test behavior, not implementation</li>
								<li>• Use meaningful assertions</li>
								<li>• Avoid test interdependence</li>
								<li>• Keep tests simple</li>
							</ul>
						</div>

						<div class="space-y-3">
							<h3 class="flex items-center gap-2 font-semibold">
								<BarChart class_names="text-warning h-4 w-4" />
								Coverage Goals
							</h3>
							<ul class="text-base-content/70 space-y-1 text-sm">
								<li>• Aim for 80%+ coverage</li>
								<li>• Focus on critical paths</li>
								<li>• Test edge cases</li>
								<li>• Don't chase 100%</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="text-center">
			<div
				class="card bg-base-100/90 border-base-300/50 border shadow-2xl backdrop-blur-sm"
			>
				<div class="card-body p-8">
					<h2 class="mb-4 text-2xl font-bold">
						Explore More Examples
					</h2>
					<p class="text-base-content/70 mb-6">
						Continue learning with more advanced testing patterns
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/examples/todos"
							class="btn btn-primary gap-2 transition-all duration-200 hover:scale-105"
						>
							<Eye class_names="h-4 w-4" />
							Form Testing Examples
						</a>
						<a
							href="/todos"
							class="btn btn-outline gap-2 transition-all duration-200 hover:scale-105"
						>
							<ArrowLongRight class_names="h-4 w-4" />
							Try Live Demo
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
