<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		is_open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		close_on_backdrop_click?: boolean;
		close_on_escape?: boolean;
		show_close_button?: boolean;
		content_text?: string; // Workaround for snippet limitation
	}

	let {
		is_open = false,
		title = '',
		size = 'md',
		close_on_backdrop_click = true,
		close_on_escape = true,
		show_close_button = true,
		content_text = '',
		...rest_props
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		close: void;
		open: void;
		backdrop_click: MouseEvent;
		escape_key: KeyboardEvent;
	}>();

	let modal_element: HTMLDivElement;
	let previous_focus: HTMLElement | null = null;

	// Handle escape key
	function handle_keydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && close_on_escape && is_open) {
			event.preventDefault();
			close_modal();
			dispatch('escape_key', event);
		}
	}

	// Handle backdrop click
	function handle_backdrop_click(event: MouseEvent) {
		if (
			event.target === event.currentTarget &&
			close_on_backdrop_click
		) {
			close_modal();
			dispatch('backdrop_click', event);
		}
	}

	// Close modal function
	function close_modal() {
		dispatch('close');
	}

	// Focus management
	function manage_focus() {
		if (is_open) {
			previous_focus = document.activeElement as HTMLElement;
			// Focus the modal container
			modal_element?.focus();
			dispatch('open');
		} else if (previous_focus) {
			previous_focus.focus();
			previous_focus = null;
		}
	}

	// Watch for is_open changes
	$effect(() => {
		if (typeof window !== 'undefined') {
			manage_focus();
		}
	});

	// Prevent body scroll when modal is open
	$effect(() => {
		if (typeof window !== 'undefined') {
			if (is_open) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}

		// Cleanup on unmount
		return () => {
			if (typeof window !== 'undefined') {
				document.body.style.overflow = '';
			}
		};
	});

	// CSS classes
	const backdrop_classes =
		'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50';
	const container_classes = 'fixed inset-0 z-50 overflow-y-auto';
	const wrapper_classes =
		'flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0';

	const size_classes = {
		sm: 'sm:max-w-sm',
		md: 'sm:max-w-lg',
		lg: 'sm:max-w-2xl',
		xl: 'sm:max-w-4xl',
	};

	const modal_classes = [
		'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
		'sm:my-8 sm:w-full',
		size_classes[size],
	].join(' ');

	const header_classes = 'bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4';
	const title_classes = 'text-lg font-medium leading-6 text-gray-900';
	const content_classes = 'bg-white px-4 pb-4 pt-5 sm:p-6';
	const close_button_classes =
		'absolute right-0 top-0 hidden pr-4 pt-4 sm:block';
	const close_icon_classes =
		'h-6 w-6 text-gray-400 hover:text-gray-500 cursor-pointer';
</script>

<svelte:window onkeydown={handle_keydown} />

{#if is_open}
	<!-- Backdrop -->
	<div class={backdrop_classes} data-testid="modal-backdrop"></div>

	<!-- Modal container -->
	<div
		class={container_classes}
		data-testid="modal-container"
		onclick={handle_backdrop_click}
	>
		<div class={wrapper_classes}>
			<!-- Modal content -->
			<div
				bind:this={modal_element}
				class={modal_classes}
				data-testid="modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? 'modal-title' : undefined}
				tabindex="-1"
				{...rest_props}
			>
				{#if show_close_button}
					<div class={close_button_classes}>
						<button
							type="button"
							class={close_icon_classes}
							onclick={close_modal}
							data-testid="modal-close-button"
							aria-label="Close modal"
						>
							<svg
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				{/if}

				{#if title}
					<div class={header_classes}>
						<h3
							id="modal-title"
							class={title_classes}
							data-testid="modal-title"
						>
							{title}
						</h3>
					</div>
				{/if}

				{#if content_text}
					<div class={content_classes} data-testid="modal-content">
						<p class="text-sm text-gray-500">{content_text}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
