<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import {
		BarChart,
		Calculator,
		CheckCircle,
		Clipboard,
		Document,
		Home,
		Menu,
		MoreVertical,
		Settings,
	} from '$lib/icons';
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
						<Menu class_names="inline-block h-6 w-6 stroke-current" />
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
							<MoreVertical class_names="h-5 w-5" />
						</div>
						<ul
							tabindex="0"
							class="dropdown-content menu bg-base-100/90 rounded-box border-base-300/50 z-[1] w-52 border p-2 shadow-xl backdrop-blur-sm"
						>
							<li>
								<a href="/docs" class="gap-2">
									<Document class_names="h-4 w-4" />
									Documentation
								</a>
							</li>
							<li>
								<a href="/settings" class="gap-2">
									<Settings class_names="h-4 w-4" />
									Settings
								</a>
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
							<CheckCircle
								class_names="text-primary-content h-6 w-6"
							/>
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
											<Home class_names="text-primary h-4 w-4" />
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
											<BarChart
												class_names="text-secondary h-4 w-4"
											/>
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
											<Clipboard class_names="text-accent h-4 w-4" />
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
											<Calculator class_names="text-info h-4 w-4" />
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
											<Document class_names="text-success h-4 w-4" />
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

		<!-- Desktop Sidebar -->
		<div class="drawer-side hidden lg:block">
			<Sidebar />
		</div>
	</div>
</div>
