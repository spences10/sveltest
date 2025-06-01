<script lang="ts">
	import { Button, Calculator, Card, LoginForm, Modal } from '$lib';
	import CodeBlock from '$lib/components/code-block.svelte';
	import {
		Calculator as CalculatorIcon,
		Clipboard,
		Eye,
		Settings,
	} from '$lib/icons';

	// Code examples configuration
	const code_examples = {
		calculator_usage: `<Calculator />`,
		modal_props: `is_open: boolean
title?: string
size?: 'sm' | 'md' | 'lg' | 'xl'
close_on_backdrop_click?: boolean
close_on_escape?: boolean
onclose?: () => void`,
		card_usage: `<Card
  variant="elevated"
  clickable={true}
  title="Card Title"
  subtitle="Optional subtitle"
  content_text="Card content goes here"
  onclick={handle_click}
/>`,
		login_form_usage: `<LoginForm
  loading={false}
  remember_me_enabled={true}
  forgot_password_enabled={true}
  onsubmit={handle_login}
  onforgot_password={handle_forgot}
  onregister_click={handle_register}
/>`,
	};

	// Component showcase state
	let modal_open = $state(false);
	let modal_size = $state<'sm' | 'md' | 'lg' | 'xl'>('md');
	let modal_title = $state('Example Modal');
	let modal_content = $state(
		'This is an example modal with customizable props. Try changing the size and other options!',
	);

	let card_variant = $state<
		'default' | 'elevated' | 'outlined' | 'filled'
	>('default');
	let card_clickable = $state(false);
	let card_title = $state('Example Card');
	let card_subtitle = $state('This is a subtitle');
	let card_content = $state(
		'This is the main content of the card. You can customize all the props to see how it changes.',
	);

	let login_loading = $state(false);
	let login_remember_enabled = $state(true);
	let login_forgot_enabled = $state(true);

	// Component data for the showcase
	const components = [
		{
			id: 'calculator',
			name: 'Calculator',
			description:
				'Interactive calculator with state management using Svelte 5 runes',
			icon: CalculatorIcon,
			color: 'primary',
			features: [
				'Reactive state',
				'Mathematical operations',
				'Clear functionality',
				'Keyboard support',
			],
			testFile: 'calculator.svelte.test.ts',
		},
		{
			id: 'modal',
			name: 'Modal',
			description:
				'Accessible modal with focus management and keyboard navigation',
			icon: Eye,
			color: 'secondary',
			features: [
				'Focus management',
				'Keyboard navigation',
				'Backdrop click',
				'Multiple sizes',
			],
			testFile: 'modal.svelte.test.ts',
		},
		{
			id: 'card',
			name: 'Card',
			description:
				'Flexible card component with multiple variants and slots',
			icon: Clipboard,
			color: 'accent',
			features: [
				'Multiple variants',
				'Clickable option',
				'Image support',
				'Flexible content',
			],
			testFile: 'card.svelte.test.ts',
		},
		{
			id: 'login-form',
			name: 'Login Form',
			description:
				'Complex form with validation, password toggle, and accessibility',
			icon: Settings,
			color: 'info',
			features: [
				'Real-time validation',
				'Password visibility toggle',
				'Remember me',
				'Accessibility',
			],
			testFile: 'login-form.svelte.test.ts',
		},
	];

	// Handle component interactions
	function handle_modal_open() {
		modal_open = true;
	}

	function handle_modal_close() {
		modal_open = false;
	}

	function handle_card_click() {
		if (card_clickable) {
			alert('Card clicked!');
		}
	}

	function handle_login_submit(data: {
		email: string;
		password: string;
		remember_me: boolean;
	}) {
		login_loading = true;
		console.log('Login submitted:', data);

		// Simulate API call
		setTimeout(() => {
			login_loading = false;
			alert(
				`Login submitted!\nEmail: ${data.email}\nRemember me: ${data.remember_me}`,
			);
		}, 2000);
	}

	function handle_forgot_password(data: { email: string }) {
		alert(`Forgot password for: ${data.email}`);
	}

	function handle_register_click() {
		alert('Register clicked!');
	}
</script>

<svelte:head>
	<title>Components - TestSuite Pro</title>
	<meta
		name="description"
		content="Interactive component library showcasing all available UI components with live examples and customizable props."
	/>
</svelte:head>

<!-- Hero Section -->
<div
	class="from-primary/10 via-secondary/5 to-accent/10 bg-gradient-to-br px-4 py-24"
>
	<div class="container mx-auto max-w-7xl text-center">
		<div class="mb-8">
			<h1 class="mb-6 text-6xl font-black tracking-tight">
				<span
					class="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent"
				>
					Component Library
				</span>
			</h1>
			<p
				class="text-base-content/70 mx-auto max-w-3xl text-xl leading-relaxed"
			>
				Explore our comprehensive collection of interactive UI
				components. Each component is fully tested, accessible, and
				built with Svelte 5 runes for optimal performance.
			</p>
		</div>

		<!-- Stats -->
		<div
			class="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4"
		>
			<div class="text-center">
				<div class="text-primary text-3xl font-bold">
					{components.length}
				</div>
				<div class="text-base-content/60 text-sm">Components</div>
			</div>
			<div class="text-center">
				<div class="text-secondary text-3xl font-bold">100%</div>
				<div class="text-base-content/60 text-sm">Test Coverage</div>
			</div>
			<div class="text-center">
				<div class="text-accent text-3xl font-bold">A11y</div>
				<div class="text-base-content/60 text-sm">Accessible</div>
			</div>
			<div class="text-center">
				<div class="text-info text-3xl font-bold">TS</div>
				<div class="text-base-content/60 text-sm">TypeScript</div>
			</div>
		</div>
	</div>
</div>

<!-- Component Showcase -->
<div class="px-4 py-24">
	<div class="container mx-auto max-w-7xl">
		<!-- Calculator Component -->
		<section id="calculator" class="mb-24">
			<div class="mb-12 text-center">
				<div class="mb-4 flex items-center justify-center gap-3">
					<div
						class="bg-primary/10 border-primary/20 flex h-12 w-12 items-center justify-center rounded-xl border"
					>
						<CalculatorIcon class_names="text-primary h-6 w-6" />
					</div>
					<h2 class="text-4xl font-bold">Calculator</h2>
				</div>
				<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
					Interactive calculator demonstrating Svelte 5 state
					management with reactive calculations and keyboard support.
				</p>
			</div>

			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Live Demo -->
				<div class="space-y-4">
					<h3 class="text-xl font-semibold">Live Demo</h3>
					<div class="bg-base-200/30 rounded-xl p-6">
						<Calculator />
					</div>
				</div>

				<!-- Features & Info -->
				<div class="space-y-6">
					<div>
						<h3 class="mb-3 text-xl font-semibold">Features</h3>
						<ul class="space-y-2">
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Reactive state with Svelte 5 runes</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Mathematical operations (+, -, ×, ÷)</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Clear and reset functionality</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Responsive button layout</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 class="mb-3 text-xl font-semibold">Usage</h3>
						<CodeBlock
							code={code_examples.calculator_usage}
							lang="svelte"
							theme="night-owl"
						/>
					</div>

					<div>
						<h3 class="mb-3 text-xl font-semibold">Test Coverage</h3>
						<p class="text-base-content/70 text-sm">
							Comprehensive tests available in <code
								class="bg-base-300/50 rounded px-2 py-1"
								>calculator.svelte.test.ts</code
							>
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Modal Component -->
		<section id="modal" class="mb-24">
			<div class="mb-12 text-center">
				<div class="mb-4 flex items-center justify-center gap-3">
					<div
						class="bg-secondary/10 border-secondary/20 flex h-12 w-12 items-center justify-center rounded-xl border"
					>
						<Eye class_names="text-secondary h-6 w-6" />
					</div>
					<h2 class="text-4xl font-bold">Modal</h2>
				</div>
				<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
					Accessible modal component with focus management, keyboard
					navigation, and customizable sizes.
				</p>
			</div>

			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Live Demo -->
				<div class="space-y-4">
					<h3 class="text-xl font-semibold">Live Demo</h3>
					<div class="bg-base-200/30 rounded-xl p-6">
						<div class="space-y-4">
							<Button variant="secondary" onclick={handle_modal_open}>
								Open Modal
							</Button>

							<!-- Props Configuration -->
							<div class="space-y-3">
								<div>
									<label class="label" for="modal-size-select">
										<span class="label-text">Size</span>
									</label>
									<select
										id="modal-size-select"
										class="select select-bordered w-full"
										bind:value={modal_size}
									>
										<option value="sm">Small</option>
										<option value="md">Medium</option>
										<option value="lg">Large</option>
										<option value="xl">Extra Large</option>
									</select>
								</div>
								<div>
									<label class="label" for="modal-title-input">
										<span class="label-text">Title</span>
									</label>
									<input
										id="modal-title-input"
										type="text"
										class="input input-bordered w-full"
										bind:value={modal_title}
									/>
								</div>
								<div>
									<label class="label" for="modal-content-textarea">
										<span class="label-text">Content</span>
									</label>
									<textarea
										id="modal-content-textarea"
										class="textarea textarea-bordered w-full"
										bind:value={modal_content}
									></textarea>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Features & Info -->
				<div class="space-y-6">
					<div>
						<h3 class="mb-3 text-xl font-semibold">Features</h3>
						<ul class="space-y-2">
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Focus management and restoration</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Keyboard navigation (ESC to close)</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Backdrop click to close</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Multiple sizes (sm, md, lg, xl)</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Body scroll prevention</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 class="mb-3 text-xl font-semibold">Props</h3>
						<CodeBlock
							code={code_examples.modal_props}
							lang="typescript"
							theme="night-owl"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- Card Component -->
		<section id="card" class="mb-24">
			<div class="mb-12 text-center">
				<div class="mb-4 flex items-center justify-center gap-3">
					<div
						class="bg-accent/10 border-accent/20 flex h-12 w-12 items-center justify-center rounded-xl border"
					>
						<Clipboard class_names="text-accent h-6 w-6" />
					</div>
					<h2 class="text-4xl font-bold">Card</h2>
				</div>
				<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
					Flexible card component with multiple variants, clickable
					options, and customizable content areas.
				</p>
			</div>

			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Live Demo -->
				<div class="space-y-4">
					<h3 class="text-xl font-semibold">Live Demo</h3>
					<div class="bg-base-200/30 rounded-xl p-6">
						<div class="space-y-4">
							<Card
								variant={card_variant}
								clickable={card_clickable}
								title={card_title}
								subtitle={card_subtitle}
								content_text={card_content}
								onclick={handle_card_click}
							/>

							<!-- Props Configuration -->
							<div class="space-y-3">
								<div>
									<label class="label" for="card-variant-select">
										<span class="label-text">Variant</span>
									</label>
									<select
										id="card-variant-select"
										class="select select-bordered w-full"
										bind:value={card_variant}
									>
										<option value="default">Default</option>
										<option value="elevated">Elevated</option>
										<option value="outlined">Outlined</option>
										<option value="filled">Filled</option>
									</select>
								</div>
								<div class="form-control">
									<label class="label cursor-pointer">
										<span class="label-text">Clickable</span>
										<input
											type="checkbox"
											class="checkbox"
											bind:checked={card_clickable}
										/>
									</label>
								</div>
								<div>
									<label class="label" for="card-title-input">
										<span class="label-text">Title</span>
									</label>
									<input
										id="card-title-input"
										type="text"
										class="input input-bordered w-full"
										bind:value={card_title}
									/>
								</div>
								<div>
									<label class="label" for="card-subtitle-input">
										<span class="label-text">Subtitle</span>
									</label>
									<input
										id="card-subtitle-input"
										type="text"
										class="input input-bordered w-full"
										bind:value={card_subtitle}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Features & Info -->
				<div class="space-y-6">
					<div>
						<h3 class="mb-3 text-xl font-semibold">Features</h3>
						<ul class="space-y-2">
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Multiple visual variants</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Clickable with hover effects</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Image support</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Flexible content areas</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Keyboard accessible</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 class="mb-3 text-xl font-semibold">Variants</h3>
						<div class="grid grid-cols-2 gap-2 text-sm">
							<div class="bg-base-300/30 rounded p-2">Default</div>
							<div class="bg-base-300/30 rounded p-2 shadow-md">
								Elevated
							</div>
							<div class="rounded border-2 border-gray-300 p-2">
								Outlined
							</div>
							<div
								class="rounded border border-gray-200 bg-gray-50 p-2"
							>
								Filled
							</div>
						</div>
					</div>

					<div>
						<h3 class="mb-3 text-xl font-semibold">Usage</h3>
						<CodeBlock
							code={code_examples.card_usage}
							lang="svelte"
							theme="night-owl"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- Login Form Component -->
		<section id="login-form" class="mb-24">
			<div class="mb-12 text-center">
				<div class="mb-4 flex items-center justify-center gap-3">
					<div
						class="bg-info/10 border-info/20 flex h-12 w-12 items-center justify-center rounded-xl border"
					>
						<Settings class_names="text-info h-6 w-6" />
					</div>
					<h2 class="text-4xl font-bold">Login Form</h2>
				</div>
				<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
					Complex form component with real-time validation, password
					visibility toggle, and comprehensive accessibility features.
				</p>
			</div>

			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Live Demo -->
				<div class="space-y-4">
					<h3 class="text-xl font-semibold">Live Demo</h3>
					<div class="bg-base-200/30 rounded-xl p-6">
						<LoginForm
							loading={login_loading}
							remember_me_enabled={login_remember_enabled}
							forgot_password_enabled={login_forgot_enabled}
							onsubmit={handle_login_submit}
							onforgot_password={handle_forgot_password}
							onregister_click={handle_register_click}
						/>
					</div>

					<!-- Props Configuration -->
					<div class="space-y-3">
						<h4 class="text-lg font-medium">Demo Configuration</h4>
						<div class="bg-base-300/20 space-y-3 rounded-lg p-4">
							<div class="form-control">
								<label class="label cursor-pointer">
									<span class="label-text"
										>Enable Remember Me Option</span
									>
									<input
										type="checkbox"
										class="checkbox"
										bind:checked={login_remember_enabled}
									/>
								</label>
							</div>
							<div class="form-control">
								<label class="label cursor-pointer">
									<span class="label-text"
										>Enable Forgot Password Link</span
									>
									<input
										type="checkbox"
										class="checkbox"
										bind:checked={login_forgot_enabled}
									/>
								</label>
							</div>
						</div>
					</div>
				</div>

				<!-- Features & Info -->
				<div class="space-y-6">
					<div>
						<h3 class="mb-3 text-xl font-semibold">Features</h3>
						<ul class="space-y-2">
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Real-time email & password validation</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Password visibility toggle</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Remember me functionality</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Forgot password handling</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Loading states</span>
							</li>
							<li class="flex items-center gap-2">
								<div class="bg-success h-2 w-2 rounded-full"></div>
								<span>Accessibility compliant</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 class="mb-3 text-xl font-semibold">
							Validation Rules
						</h3>
						<div class="space-y-2 text-sm">
							<div class="bg-base-300/30 rounded p-2">
								<strong>Email:</strong> Valid email format required
							</div>
							<div class="bg-base-300/30 rounded p-2">
								<strong>Password:</strong> Minimum 8 characters, uppercase,
								lowercase, number
							</div>
						</div>
					</div>

					<div>
						<h3 class="mb-3 text-xl font-semibold">Usage</h3>
						<CodeBlock
							code={code_examples.login_form_usage}
							lang="svelte"
							theme="night-owl"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- Component Overview Grid -->
		<section class="mb-24">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-4xl font-bold">Component Overview</h2>
				<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
					Quick reference for all available components with their key
					features and test coverage.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each components as component}
					<div
						class="bg-base-200/30 border-base-300/50 rounded-xl border p-6 transition-all hover:shadow-lg"
					>
						<div class="mb-4 flex items-center gap-3">
							<div
								class="bg-{component.color}/10 border-{component.color}/20 flex h-10 w-10 items-center justify-center rounded-lg border"
							>
								<component.icon
									class_names="text-{component.color} h-5 w-5"
								/>
							</div>
							<h3 class="text-lg font-semibold">{component.name}</h3>
						</div>

						<p class="text-base-content/70 mb-4 text-sm">
							{component.description}
						</p>

						<div class="mb-4">
							<h4 class="mb-2 text-sm font-medium">Key Features:</h4>
							<ul class="space-y-1">
								{#each component.features.slice(0, 3) as feature}
									<li class="flex items-center gap-2 text-xs">
										<div
											class="bg-success h-1.5 w-1.5 rounded-full"
										></div>
										<span>{feature}</span>
									</li>
								{/each}
							</ul>
						</div>

						<div class="flex items-center justify-between">
							<a
								href="#{component.id}"
								class="btn btn-{component.color} btn-sm"
							>
								View Demo
							</a>
							<div class="text-success text-xs">✓ Tested</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<!-- Modal Instance -->
<Modal
	is_open={modal_open}
	title={modal_title}
	size={modal_size}
	content_text={modal_content}
	onclose={handle_modal_close}
/>
