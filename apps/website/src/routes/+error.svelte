<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>404 - Page Not Found | Sveltest</title>
	<meta
		name="description"
		content="The page you're looking for could not be found."
	/>
</svelte:head>

<main class="flex min-h-screen items-center justify-center px-4">
	<div class="max-w-md text-center">
		<div class="mb-8">
			<h1 class="mb-4 text-6xl font-black text-primary">404</h1>
			<h2 class="mb-4 text-2xl font-bold text-base-content">
				Page Not Found
			</h2>
			<p class="mb-8 text-base-content/70">
				The page you're looking for doesn't exist or has been moved.
			</p>
		</div>

		<div class="space-y-4">
			<a href="/" class="btn btn-lg btn-primary"> Go Home </a>
			<div class="text-sm text-base-content/50">
				Error {$page.status}: {$page.error?.message ||
					'Page not found'}
			</div>
		</div>
	</div>
</main>
