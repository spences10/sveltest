<script lang="ts">
	import { page } from '$app/state';
	import {
		BarChart,
		Calculator,
		CheckCircle,
		Clipboard,
		Document,
		Home,
		Menu,
		MoreVertical,
	} from '$lib/icons';

	const main_links = [
		{ href: '/', title: 'Home', icon: Home, color: 'primary' },
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
			href: '/todos',
			title: 'Todo Manager',
			icon: CheckCircle,
			color: 'info',
		},
	];

	const testing_links = [
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
	];

	const settings_links = [
		{ href: '/docs', title: 'Documentation', icon: Document },
	];

	const is_active = (path: string) => {
		// Handle SSR case where page might not be available
		if (!page?.url?.pathname) return false;
		return path === '/'
			? page.url.pathname === '/'
			: page.url.pathname.startsWith(path);
	};
</script>

<!-- Desktop Navigation -->
<nav
	class="navbar bg-base-100/90 border-base-300/50 sticky top-0 z-40 border-b shadow-lg backdrop-blur-md"
>
	<!-- Navbar Start - Brand -->
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost text-xl font-black">
			<div
				class="from-primary to-secondary mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-md"
			>
				<CheckCircle class_names="text-primary-content h-5 w-5" />
			</div>
			<span
				class="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent"
			>
				Sveltest
			</span>
		</a>
	</div>

	<!-- Navbar Center - Main Navigation (Desktop) -->
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal gap-1 px-1">
			<!-- Main Navigation Links -->
			{#each main_links as link}
				<li>
					<a
						href={link.href}
						class="gap-2 {is_active(link.href)
							? `bg-${link.color}/10 text-${link.color}`
							: ''}"
						title={link.title}
					>
						<link.icon class_names="h-4 w-4" />
						{link.title}
					</a>
				</li>
			{/each}

			<!-- Testing Section Dropdown -->
			<li>
				<details>
					<summary class="gap-2">
						<BarChart class_names="h-4 w-4" />
						Testing
					</summary>
					<ul
						class="bg-base-100/95 rounded-box border-base-300/50 z-50 w-48 border p-2 shadow-xl backdrop-blur-sm"
					>
						{#each testing_links as link}
							<li>
								<a
									href={link.href}
									class="gap-2 {is_active(link.href)
										? `bg-${link.color}/10 text-${link.color}`
										: ''}"
								>
									<link.icon class_names="h-4 w-4" />
									{link.title}
								</a>
							</li>
						{/each}
					</ul>
				</details>
			</li>
		</ul>
	</div>

	<!-- Navbar End - Status & Actions -->
	<div class="navbar-end">
		<!-- Status Indicator (Desktop) -->
		<div class="mr-4 hidden items-center gap-2 lg:flex">
			<div
				class="bg-success/10 border-success/20 flex items-center gap-2 rounded-lg border px-3 py-1"
			>
				<div
					class="bg-success h-2 w-2 animate-pulse rounded-full"
				></div>
				<span class="text-success text-xs font-medium">
					All tests passing
				</span>
			</div>
		</div>

		<!-- Mobile Menu Dropdown -->
		<div class="dropdown dropdown-end lg:hidden">
			<div
				role="button"
				class="btn btn-ghost btn-circle"
				aria-label="Open mobile menu"
			>
				<Menu class_names="h-5 w-5" />
			</div>
			<ul
				class="dropdown-content menu bg-base-100/95 rounded-box border-base-300/50 z-50 w-64 border p-2 shadow-xl backdrop-blur-sm"
			>
				<!-- Mobile Navigation -->
				<li class="menu-title">
					<span>Navigation</span>
				</li>
				{#each main_links as link}
					<li>
						<a
							href={link.href}
							class="gap-2 {is_active(link.href)
								? `bg-${link.color}/10 text-${link.color}`
								: ''}"
						>
							<link.icon class_names="h-4 w-4" />
							{link.title}
						</a>
					</li>
				{/each}

				<li class="menu-title">
					<span>Testing</span>
				</li>
				{#each testing_links as link}
					<li>
						<a
							href={link.href}
							class="gap-2 {is_active(link.href)
								? `bg-${link.color}/10 text-${link.color}`
								: ''}"
						>
							<link.icon class_names="h-4 w-4" />
							{link.title}
						</a>
					</li>
				{/each}

				<div class="divider my-2"></div>

				<!-- Mobile Status -->
				<li class="menu-title">
					<span>Status</span>
				</li>
				<li class="disabled">
					<div class="flex items-center gap-2">
						<div
							class="bg-success h-2 w-2 animate-pulse rounded-full"
						></div>
						<span class="text-success text-xs">
							All tests passing
						</span>
					</div>
				</li>
			</ul>
		</div>

		<!-- Settings Dropdown -->
		<div class="dropdown dropdown-end">
			<div
				role="button"
				class="btn btn-ghost btn-circle"
				aria-label="Open settings menu"
			>
				<MoreVertical class_names="h-5 w-5" />
			</div>
			<ul
				class="dropdown-content menu bg-base-100/95 rounded-box border-base-300/50 z-50 w-52 border p-2 shadow-xl backdrop-blur-sm"
			>
				{#each settings_links as link}
					<li>
						<a href={link.href} class="gap-2">
							<link.icon class_names="h-4 w-4" />
							{link.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>

<!-- Mobile Navigation Dock (Bottom) -->
<div class="fixed right-0 bottom-0 left-0 z-30 lg:hidden">
	<div
		class="dock bg-primary rounded-box mx-auto mb-4 max-w-[95vw] shadow-xl"
	>
		{#each main_links as link}
			<button class={is_active(link.href) ? 'dock-active' : ''}>
				<a
					href={link.href}
					class="text-primary-content flex flex-col items-center gap-1"
				>
					<link.icon height="24" width="24" />
					<span class="text-xs">{link.title}</span>
				</a>
			</button>
		{/each}

		<!-- Testing Dropdown in Dock -->
		<div class="dropdown dropdown-top dropdown-end">
			<button class="text-primary-content">
				<div class="flex flex-col items-center gap-1">
					<BarChart height="24" width="24" />
					<span class="text-xs">Testing</span>
				</div>
			</button>
			<ul
				class="dropdown-content menu bg-base-100 rounded-box z-50 mb-2 w-48 p-2 shadow-xl"
			>
				{#each testing_links as link}
					<li>
						<a href={link.href} class="gap-2">
							<link.icon class_names="h-4 w-4" />
							{link.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
