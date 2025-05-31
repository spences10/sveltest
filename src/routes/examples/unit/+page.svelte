<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="min-h-screen px-4 py-12">
	<div class="container mx-auto max-w-4xl">
		<!-- Page Header -->
		<div class="mb-12 text-center">
			<div
				class="bg-base-100/80 border-base-300/50 mb-8 inline-flex items-center gap-3 rounded-full border px-6 py-3 shadow-lg backdrop-blur-sm"
			>
				<div
					class="from-info to-info/70 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="text-info-content h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<span
					class="text-base-content/70 text-sm font-medium tracking-wider uppercase"
				>
					Unit Testing Examples
				</span>
			</div>

			<h1
				class="from-info via-info/80 to-info/60 mb-4 bg-gradient-to-r bg-clip-text text-5xl font-black text-transparent"
			>
				Unit Testing Examples
			</h1>
			<p
				class="text-base-content/70 mx-auto max-w-2xl text-lg leading-relaxed"
			>
				Interactive calculator demonstrating unit testing patterns
				<br />
				<span class="text-base-content/60 text-base"
					>Test utility functions and business logic</span
				>
			</p>
		</div>

		<!-- Calculator Demo Card -->
		<div
			class="card bg-base-100/80 border-base-300/50 mb-8 border shadow-2xl backdrop-blur-sm"
		>
			<div class="card-body p-8">
				<div class="mb-8 flex items-center gap-4">
					<div
						class="from-info/20 to-info/10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="text-info h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div>
						<h2 class="text-3xl font-bold">Calculator Example</h2>
						<p class="text-base-content/70">
							Test-driven development demonstration
						</p>
					</div>
				</div>

				<form
					method="POST"
					action="?/calculate"
					use:enhance
					class="space-y-6"
				>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="form-control">
							<label class="label" for="num1">
								<span class="label-text text-base font-medium"
									>First Number</span
								>
								<span class="label-text-alt text-base-content/50"
									>Enter any number</span
								>
							</label>
							<div class="relative">
								<input
									type="number"
									name="num1"
									id="num1"
									class="input input-bordered input-lg bg-base-200/50 border-base-300 focus:border-info focus:bg-base-100 w-full pl-12 transition-all duration-200"
									placeholder="0"
									required
								/>
								<div
									class="text-base-content/40 absolute top-1/2 left-4 -translate-y-1/2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div class="form-control">
							<label class="label" for="num2">
								<span class="label-text text-base font-medium"
									>Second Number</span
								>
								<span class="label-text-alt text-base-content/50"
									>Enter any number</span
								>
							</label>
							<div class="relative">
								<input
									type="number"
									name="num2"
									id="num2"
									class="input input-bordered input-lg bg-base-200/50 border-base-300 focus:border-info focus:bg-base-100 w-full pl-12 transition-all duration-200"
									placeholder="0"
									required
								/>
								<div
									class="text-base-content/40 absolute top-1/2 left-4 -translate-y-1/2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<div class="flex justify-center">
						<button
							type="submit"
							class="btn btn-info btn-lg gap-3 px-8 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Calculate Sum
						</button>
					</div>
				</form>

				<!-- Results Section -->
				{#if form?.error}
					<div class="alert alert-error mt-8 shadow-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span class="font-medium">{form.error}</span>
					</div>
				{:else if form?.result !== undefined}
					<div class="alert alert-success mt-8 shadow-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<div class="font-bold">Calculation Complete!</div>
							<div class="text-sm">
								Result: <span class="font-mono text-lg"
									>{form.result}</span
								>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Testing Information Cards -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Test Coverage Card -->
			<div
				class="card from-success/10 to-success/5 border-success/20 border bg-gradient-to-br shadow-lg backdrop-blur-sm"
			>
				<div class="card-body p-6">
					<div class="mb-4 flex items-center gap-3">
						<div
							class="bg-success/20 flex h-10 w-10 items-center justify-center rounded-xl"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-success h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-bold">Test Coverage</h3>
					</div>
					<p class="text-base-content/70 mb-4">
						This calculator function is fully tested with
						comprehensive unit tests covering:
					</p>
					<ul class="space-y-2">
						<li class="flex items-center gap-2">
							<div class="bg-success h-2 w-2 rounded-full"></div>
							<span class="text-sm">Positive numbers</span>
						</li>
						<li class="flex items-center gap-2">
							<div class="bg-success h-2 w-2 rounded-full"></div>
							<span class="text-sm">Negative numbers</span>
						</li>
						<li class="flex items-center gap-2">
							<div class="bg-success h-2 w-2 rounded-full"></div>
							<span class="text-sm">Zero values</span>
						</li>
						<li class="flex items-center gap-2">
							<div class="bg-success h-2 w-2 rounded-full"></div>
							<span class="text-sm">Decimal numbers</span>
						</li>
					</ul>
				</div>
			</div>

			<!-- Testing Tools Card -->
			<div
				class="card from-info/10 to-info/5 border-info/20 border bg-gradient-to-br shadow-lg backdrop-blur-sm"
			>
				<div class="card-body p-6">
					<div class="mb-4 flex items-center gap-3">
						<div
							class="bg-info/20 flex h-10 w-10 items-center justify-center rounded-xl"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-info h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-bold">Testing Tools</h3>
					</div>
					<p class="text-base-content/70 mb-4">
						Built with modern testing tools and best practices:
					</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge badge-info badge-sm">Vitest</div>
						<div class="badge badge-primary badge-sm">TypeScript</div>
						<div class="badge badge-secondary badge-sm">
							SvelteKit
						</div>
						<div class="badge badge-accent badge-sm">
							Form Actions
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="mt-12 text-center">
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="/examples" class="btn btn-outline btn-lg gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Back to Examples
				</a>
				<a
					href="/examples/todos"
					class="btn btn-primary btn-lg gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 7l5 5m0 0l-5 5m5-5H6"
						/>
					</svg>
					Try Form Actions
				</a>
			</div>
		</div>
	</div>
</div>
