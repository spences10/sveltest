<script lang="ts">
	import { page } from '$app/state';

	let is_hovered = $state(false);

	// Check if current route matches the href
	function is_active(href: string): boolean {
		if (href === '/') {
			return page.url.pathname === '/';
		}
		return page.url.pathname.startsWith(href);
	}
</script>

<!-- Enhanced Sidebar with Hover Expand -->
<aside
	class="bg-base-100/90 border-base-300/50 min-h-screen border-r shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out {is_hovered
		? 'w-80'
		: 'w-20'} group"
	onmouseenter={() => (is_hovered = true)}
	onmouseleave={() => (is_hovered = false)}
>
	<!-- Sidebar Header -->
	<div
		class="border-base-300/50 flex h-[88px] items-center border-b p-6"
	>
		<div class="flex min-w-0 items-center gap-3">
			<div
				class="from-primary to-secondary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="text-primary-content h-6 w-6"
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
			<div
				class="transition-all duration-300 {is_hovered
					? 'translate-x-0 opacity-100'
					: '-translate-x-4 opacity-0'} overflow-hidden"
			>
				<h1
					class="from-primary to-secondary bg-gradient-to-r bg-clip-text text-xl font-black whitespace-nowrap text-transparent"
				>
					TestSuite Pro
				</h1>
				<p
					class="text-base-content/60 text-xs font-medium whitespace-nowrap"
				>
					Testing Framework
				</p>
			</div>
		</div>
	</div>

	<!-- Navigation Menu -->
	<div class="p-6">
		<nav class="space-y-2">
			<div class="mb-6">
				<div
					class="transition-all duration-300 {is_hovered
						? 'mb-3 translate-x-0 opacity-100'
						: 'mb-1 -translate-x-4 opacity-0'}"
				>
					<h3
						class="text-base-content/50 text-xs font-bold tracking-wider whitespace-nowrap uppercase"
					>
						Navigation
					</h3>
				</div>
				<ul class="space-y-1">
					<li>
						<a
							href="/"
							class="text-base-content hover:bg-primary/10 hover:text-primary group/item relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 {is_active(
								'/',
							)
								? 'bg-primary/10 text-primary'
								: ''}"
							title="Home"
						>
							<div
								class="bg-primary/10 group-hover/item:bg-primary/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 {is_active(
									'/',
								)
									? 'bg-primary/20'
									: ''}"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-primary h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
							</div>
							<span
								class="whitespace-nowrap transition-all duration-300 {is_hovered
									? 'translate-x-0 opacity-100'
									: '-translate-x-4 opacity-0'}">Home</span
							>

							<!-- Tooltip for collapsed state -->
							{#if !is_hovered}
								<div
									class="bg-base-content text-base-100 pointer-events-none absolute left-full z-50 ml-2 rounded px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/item:opacity-100"
								>
									Home
								</div>
							{/if}
						</a>
					</li>
					<li>
						<a
							href="/examples"
							class="text-base-content hover:bg-secondary/10 hover:text-secondary group/item relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 {is_active(
								'/examples',
							)
								? 'bg-secondary/10 text-secondary'
								: ''}"
							title="Examples"
						>
							<div
								class="bg-secondary/10 group-hover/item:bg-secondary/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 {is_active(
									'/examples',
								)
									? 'bg-secondary/20'
									: ''}"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-secondary h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
							<span
								class="whitespace-nowrap transition-all duration-300 {is_hovered
									? 'translate-x-0 opacity-100'
									: '-translate-x-4 opacity-0'}">Examples</span
							>

							{#if !is_hovered}
								<div
									class="bg-base-content text-base-100 pointer-events-none absolute left-full z-50 ml-2 rounded px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/item:opacity-100"
								>
									Examples
								</div>
							{/if}
						</a>
					</li>
					<li>
						<a
							href="/todos"
							class="text-base-content hover:bg-accent/10 hover:text-accent group/item relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 {is_active(
								'/todos',
							)
								? 'bg-accent/10 text-accent'
								: ''}"
							title="Todo Manager"
						>
							<div
								class="bg-accent/10 group-hover/item:bg-accent/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 {is_active(
									'/todos',
								)
									? 'bg-accent/20'
									: ''}"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-accent h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
									/>
								</svg>
							</div>
							<span
								class="whitespace-nowrap transition-all duration-300 {is_hovered
									? 'translate-x-0 opacity-100'
									: '-translate-x-4 opacity-0'}">Todo Manager</span
							>

							{#if !is_hovered}
								<div
									class="bg-base-content text-base-100 pointer-events-none absolute left-full z-50 ml-2 rounded px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/item:opacity-100"
								>
									Todo Manager
								</div>
							{/if}
						</a>
					</li>
				</ul>
			</div>

			<div class="mb-6">
				<div
					class="transition-all duration-300 {is_hovered
						? 'mb-3 translate-x-0 opacity-100'
						: 'mb-1 -translate-x-4 opacity-0'}"
				>
					<h3
						class="text-base-content/50 text-xs font-bold tracking-wider whitespace-nowrap uppercase"
					>
						Testing
					</h3>
				</div>
				<ul class="space-y-1">
					<li>
						<a
							href="/examples/unit"
							class="text-base-content hover:bg-info/10 hover:text-info group/item relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 {is_active(
								'/examples/unit',
							)
								? 'bg-info/10 text-info'
								: ''}"
							title="Unit Tests"
						>
							<div
								class="bg-info/10 group-hover/item:bg-info/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 {is_active(
									'/examples/unit',
								)
									? 'bg-info/20'
									: ''}"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-info h-4 w-4"
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
								class="whitespace-nowrap transition-all duration-300 {is_hovered
									? 'translate-x-0 opacity-100'
									: '-translate-x-4 opacity-0'}">Unit Tests</span
							>

							{#if !is_hovered}
								<div
									class="bg-base-content text-base-100 pointer-events-none absolute left-full z-50 ml-2 rounded px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/item:opacity-100"
								>
									Unit Tests
								</div>
							{/if}
						</a>
					</li>
					<li>
						<a
							href="/examples/todos"
							class="text-base-content hover:bg-success/10 hover:text-success group/item relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 {is_active(
								'/examples/todos',
							)
								? 'bg-success/10 text-success'
								: ''}"
							title="Form Actions"
						>
							<div
								class="bg-success/10 group-hover/item:bg-success/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 {is_active(
									'/examples/todos',
								)
									? 'bg-success/20'
									: ''}"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-success h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<span
								class="whitespace-nowrap transition-all duration-300 {is_hovered
									? 'translate-x-0 opacity-100'
									: '-translate-x-4 opacity-0'}">Form Actions</span
							>

							{#if !is_hovered}
								<div
									class="bg-base-content text-base-100 pointer-events-none absolute left-full z-50 ml-2 rounded px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/item:opacity-100"
								>
									Form Actions
								</div>
							{/if}
						</a>
					</li>
				</ul>
			</div>

			<!-- Status Card -->
			<div
				class="mt-8 transition-all duration-300 {is_hovered
					? 'scale-100 opacity-100'
					: 'pointer-events-none scale-95 opacity-0'}"
			>
				<div
					class="from-primary/10 to-secondary/10 border-primary/20 rounded-xl border bg-gradient-to-br p-4"
				>
					<div class="mb-2 flex items-center gap-3">
						<div
							class="bg-success h-2 w-2 animate-pulse rounded-full"
						></div>
						<span
							class="text-base-content/80 text-sm font-medium whitespace-nowrap"
							>System Status</span
						>
					</div>
					<p class="text-base-content/60 text-xs whitespace-nowrap">
						All tests passing
					</p>
					<div class="mt-2 flex flex-wrap gap-1">
						<div class="badge badge-success badge-xs">✓ Unit</div>
						<div class="badge badge-success badge-xs">✓ E2E</div>
						<div class="badge badge-success badge-xs">
							✓ Integration
						</div>
					</div>
				</div>
			</div>

			<!-- Collapse Indicator -->
			{#if !is_hovered}
				<div class="mt-8 flex justify-center">
					<div
						class="bg-base-200/50 flex h-8 w-8 items-center justify-center rounded-lg"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="text-base-content/40 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			{/if}
		</nav>
	</div>
</aside>
