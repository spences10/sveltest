<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/logo.svelte';
	import {
		BarChart,
		Calculator,
		CheckCircle,
		Clipboard,
		Document,
		ExternalLink,
		GitHub,
		Home,
		Menu,
	} from '$lib/icons';
	import { github_status } from '$lib/state/github-status.svelte';
	import * as Fathom from 'fathom-client';

	const nav_links = [
		{ href: '/', title: 'Home', icon: Home, color: 'primary' },
		{
			href: '/docs',
			title: 'Docs',
			icon: Document,
			color: 'secondary',
		},
		{
			href: '/components',
			title: 'Components',
			icon: Clipboard,
			color: 'secondary',
		},
		{
			href: '/examples',
			title: 'Examples',
			icon: BarChart,
			color: 'accent',
		},
		{
			href: '/examples/unit',
			title: 'Unit Tests',
			icon: Calculator,
			color: 'info',
		},
		{
			href: '/examples/todos',
			title: 'Form Actions',
			icon: Document,
			color: 'success',
		},
		{
			href: '/todos',
			title: 'Todo Manager',
			icon: CheckCircle,
			color: 'info',
		},
		{
			href: 'https://github.com/spences10/sveltest',
			title: 'GitHub Repository',
			icon: GitHub,
			external: true,
		},
	];

	// Main nav items (shown in desktop navbar center)
	const main_nav_items = nav_links.slice(0, 2); // Home, Docs

	const is_active = (path: string) => {
		// Handle SSR case where page might not be available
		if (!page?.url?.pathname) return false;
		return path === '/'
			? page.url.pathname === '/'
			: page.url.pathname.startsWith(path);
	};
</script>

<!-- Desktop Navigation -->
<header class="sticky top-0 z-60 w-full md:h-0">
	<nav
		class="navbar bg-base-100/60 border-base-300/50 h-16 border-b shadow-lg backdrop-blur-md"
		aria-label="Main navigation"
	>
		<!-- Navbar Start - Brand -->
		<div class="navbar-start">
			<a
				href="/"
				class="btn btn-ghost text-xl font-black"
				aria-label="Sveltest home"
			>
				<Logo
					height="32px"
					width="32px"
					class_names="mr-2 text-primary"
				/>
				<span
					class="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent"
				>
					Sveltest
				</span>
			</a>
		</div>

		<!-- Navbar Center - Main Navigation (Desktop) -->
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal gap-1 px-1" role="menubar">
				<!-- Main Navigation Links -->
				{#each main_nav_items as link (link.href)}
					<li role="none">
						<a
							href={link.href}
							class="gap-2 {is_active(link.href)
								? `bg-${link.color}/10 text-${link.color}`
								: ''}"
							title={link.title}
							role="menuitem"
						>
							<link.icon class_names="h-4 w-4" />
							{link.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Navbar End - Actions -->
		<div class="navbar-end">
			<!-- Menu Dropdown (Both Mobile and Desktop) -->
			<div class="dropdown dropdown-end">
				<div
					tabindex="0"
					role="button"
					class="btn btn-ghost btn-circle"
					aria-label="Open navigation menu"
					aria-haspopup="true"
					aria-expanded="false"
				>
					<Menu class_names="h-5 w-5" />
				</div>
				<ul
					tabindex="0"
					class="dropdown-content menu bg-base-100/95 rounded-box border-base-300/50 z-50 w-64 border p-2 shadow-xl backdrop-blur-sm"
					role="menu"
					aria-label="Navigation menu"
				>
					{#each nav_links as link (link.href)}
						<li role="none">
							<a
								href={link.href}
								class="gap-2 {is_active(link.href)
									? `bg-${link.color}/10 text-${link.color}`
									: ''}"
								{...link.external
									? { target: '_blank', rel: 'noopener noreferrer' }
									: {}}
								role="menuitem"
								onclick={() => {
									if (link.external) {
										Fathom.trackEvent(
											`nav_${link.title.toLowerCase().replace(/\s+/g, '_')}_clicked`,
										);
									}
								}}
							>
								<link.icon class_names="h-4 w-4" />
								{link.title}
								{#if link.external}
									<ExternalLink class_names="h-3 w-3 opacity-60" />
								{/if}
							</a>
						</li>
					{/each}

					<div class="divider my-2" role="separator"></div>

					<!-- Status -->
					<li class="menu-title" role="none">
						<span>Status</span>
					</li>

					<!-- Status Display -->
					<li class="disabled" role="none">
						<!-- svelte-ignore a11y_missing_attribute -->
						<a class="gap-2">
							{#if github_status.loading}
								<div
									class="flex items-center gap-2 text-xs opacity-70"
								>
									<div
										class="loading loading-spinner loading-xs"
									></div>
									<span>Loading status...</span>
								</div>
							{:else if github_status.error}
								<div
									class="flex items-center gap-2 text-xs opacity-70"
								>
									<div
										class="bg-warning h-1.5 w-1.5 rounded-full"
										aria-hidden="true"
									></div>
									<span>Status unavailable</span>
								</div>
							{:else if github_status.data}
								<div class="flex flex-col gap-1 text-xs opacity-70">
									<div class="flex items-center gap-2">
										<div
											class="{github_status.data.unit_tests.status ===
											'passing'
												? 'bg-success'
												: github_status.data.unit_tests.status ===
													  'failing'
													? 'bg-error'
													: 'bg-warning'} h-1.5 w-1.5 rounded-full"
											aria-hidden="true"
										></div>
										<span>
											Unit Tests: {github_status.data.unit_tests
												.status}
										</span>
									</div>
									<div class="flex items-center gap-2">
										<div
											class="{github_status.data.e2e_tests.status ===
											'passing'
												? 'bg-success'
												: github_status.data.e2e_tests.status ===
													  'failing'
													? 'bg-error'
													: 'bg-warning'} h-1.5 w-1.5 rounded-full"
											aria-hidden="true"
										></div>
										<span>
											E2E Tests: {github_status.data.e2e_tests.status}
										</span>
									</div>
								</div>
							{:else}
								<div
									class="flex items-center gap-2 text-xs opacity-70"
								>
									<div
										class="bg-warning h-1.5 w-1.5 rounded-full"
										aria-hidden="true"
									></div>
									<span>Status unknown</span>
								</div>
							{/if}
						</a>
					</li>

					<!-- Refresh Button (when there's an error) -->
					{#if github_status.error}
						<li role="none">
							<button
								class="gap-2 text-xs"
								onclick={() => github_status.refresh()}
								role="menuitem"
							>
								<div
									class="loading loading-spinner loading-xs"
									class:hidden={!github_status.loading}
								></div>
								<span>Retry</span>
							</button>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</nav>
</header>

<!-- Mobile Navigation Dock (Bottom) -->
<nav
	class="fixed right-0 bottom-0 left-0 z-30 lg:hidden"
	aria-label="Mobile navigation dock"
>
	<div
		class="dock bg-primary rounded-box mx-auto mb-4 max-w-[95vw] shadow-xl"
		role="tablist"
	>
		{#each main_nav_items as link (link.href)}
			<a
				href={link.href}
				class="text-primary-content flex flex-col items-center gap-1 {is_active(
					link.href,
				)
					? 'dock-active'
					: ''}"
				role="tab"
				aria-selected={is_active(link.href)}
				aria-label="{link.title} page"
			>
				<link.icon height="24" width="24" />
				<span class="text-xs">{link.title}</span>
			</a>
		{/each}
	</div>
</nav>
