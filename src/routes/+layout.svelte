<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content">
		<!-- Navbar -->
		<div class="navbar bg-base-100 lg:hidden">
			<div class="flex-none">
				<label
					for="my-drawer"
					class="btn btn-square btn-ghost drawer-button"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-5 w-5 stroke-current"
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
				<a href="/" class="btn btn-ghost text-xl normal-case">
					Svelte Testing
				</a>
			</div>
		</div>

		<!-- Page content -->
		<main class="p-4">
			{@render children?.()}
		</main>
	</div>

	<!-- Sidebar -->
	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay"></label>
		<aside class="min-h-screen w-80 bg-base-200">
			<div class="p-4">
				<h1 class="mb-4 text-2xl font-bold">Svelte Testing</h1>
				<ul class="menu menu-vertical">
					<li><a href="/" class="font-medium">Home</a></li>
					<li>
						<a href="/examples" class="font-medium">Examples</a>
					</li>
				</ul>
			</div>
		</aside>
	</div>
</div>
