<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<!-- Modern gradient background -->
<div
	class="from-primary/5 via-secondary/3 to-accent/5 min-h-screen bg-gradient-to-br"
>
	<div class="drawer lg:drawer-open">
		<input id="my-drawer" type="checkbox" class="drawer-toggle" />

		<div class="drawer-content lg:ml-20">
			<!-- Enhanced Mobile Navbar -->
			<div
				class="navbar bg-base-100/80 border-base-300/50 border-b shadow-lg backdrop-blur-md lg:hidden"
			>
				<div class="flex-none">
					<label
						for="my-drawer"
						class="btn btn-square btn-ghost drawer-button hover:bg-primary/10 transition-all duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block h-6 w-6 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						</svg>
					</label>
				</div>
				<div class="flex-1">
					<a
						href="/"
						class="btn btn-ghost from-primary to-secondary bg-gradient-to-r bg-clip-text text-xl font-black text-transparent transition-transform duration-200 hover:scale-105"
					>
						TestSuite Pro
					</a>
				</div>
				<div class="flex-none">
					<div class="dropdown dropdown-end">
						<div
							tabindex="0"
							role="button"
							class="btn btn-ghost btn-circle"
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
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</div>
						<ul
							tabindex="0"
							class="dropdown-content menu bg-base-100/90 rounded-box border-base-300/50 z-[1] w-52 border p-2 shadow-xl backdrop-blur-sm"
						>
							<li>
								<a href="/docs" class="gap-2"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/></svg
									>Documentation</a
								>
							</li>
							<li>
								<a href="/settings" class="gap-2"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/></svg
									>Settings</a
								>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Page content with enhanced styling -->
			<main class="min-h-screen">
				{@render children?.()}
			</main>
		</div>

		<!-- Mobile Sidebar (Full width on mobile) -->
		<div class="drawer-side lg:hidden">
			<label for="my-drawer" class="drawer-overlay"></label>
			<aside
				class="bg-base-100/90 border-base-300/50 min-h-screen w-80 border-r shadow-2xl backdrop-blur-md"
			>
				<!-- Mobile Sidebar Header -->
				<div class="border-base-300/50 border-b p-6">
					<div class="mb-2 flex items-center gap-3">
						<div
							class="from-primary to-secondary flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg"
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
						<div>
							<h1
								class="from-primary to-secondary bg-gradient-to-r bg-clip-text text-xl font-black text-transparent"
							>
								TestSuite Pro
							</h1>
							<p class="text-base-content/60 text-xs font-medium">
								Testing Framework
							</p>
						</div>
					</div>
				</div>

				<!-- Mobile Navigation Menu -->
				<div class="p-6">
					<nav class="space-y-2">
						<div class="mb-6">
							<h3
								class="text-base-content/50 mb-3 text-xs font-bold tracking-wider uppercase"
							>
								Navigation
							</h3>
							<ul class="space-y-1">
								<li>
									<a
										href="/"
										class="text-base-content hover:bg-primary/10 hover:text-primary group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200"
									>
										<div
											class="bg-primary/10 group-hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
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
										<span>Home</span>
									</a>
								</li>
								<li>
									<a
										href="/examples"
										class="text-base-content hover:bg-secondary/10 hover:text-secondary group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200"
									>
										<div
											class="bg-secondary/10 group-hover:bg-secondary/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
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
										<span>Examples</span>
									</a>
								</li>
								<li>
									<a
										href="/todos"
										class="text-base-content hover:bg-accent/10 hover:text-accent group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200"
									>
										<div
											class="bg-accent/10 group-hover:bg-accent/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
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
										<span>Todo Manager</span>
									</a>
								</li>
							</ul>
						</div>

						<div class="mb-6">
							<h3
								class="text-base-content/50 mb-3 text-xs font-bold tracking-wider uppercase"
							>
								Testing
							</h3>
							<ul class="space-y-1">
								<li>
									<a
										href="/examples/unit"
										class="text-base-content hover:bg-info/10 hover:text-info group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200"
									>
										<div
											class="bg-info/10 group-hover:bg-info/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
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
										<span>Unit Tests</span>
									</a>
								</li>
								<li>
									<a
										href="/examples/todos"
										class="text-base-content hover:bg-success/10 hover:text-success group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200"
									>
										<div
											class="bg-success/10 group-hover:bg-success/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
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
										<span>Form Actions</span>
									</a>
								</li>
							</ul>
						</div>

						<!-- Status Card -->
						<div
							class="from-primary/10 to-secondary/10 border-primary/20 mt-8 rounded-xl border bg-gradient-to-br p-4"
						>
							<div class="mb-2 flex items-center gap-3">
								<div
									class="bg-success h-2 w-2 animate-pulse rounded-full"
								></div>
								<span class="text-base-content/80 text-sm font-medium"
									>System Status</span
								>
							</div>
							<p class="text-base-content/60 text-xs">
								All tests passing
							</p>
							<div class="mt-2 flex gap-1">
								<div class="badge badge-success badge-xs">✓ Unit</div>
								<div class="badge badge-success badge-xs">✓ E2E</div>
								<div class="badge badge-success badge-xs">
									✓ Integration
								</div>
							</div>
						</div>
					</nav>
				</div>
			</aside>
		</div>

		<!-- Desktop Collapsible Sidebar -->
		<div class="fixed top-0 left-0 z-40 hidden lg:block">
			<Sidebar />
		</div>
	</div>
</div>
