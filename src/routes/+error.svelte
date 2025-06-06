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
			<h1 class="text-primary mb-4 text-6xl font-black">404</h1>
			<h2 class="text-base-content mb-4 text-2xl font-bold">
				Page Not Found
			</h2>
			<p class="text-base-content/70 mb-8">
				The page you're looking for doesn't exist or has been moved.
			</p>
		</div>

		<div class="space-y-4">
			<a href="/" class="btn btn-primary btn-lg"> Go Home </a>
			<div class="text-base-content/50 text-sm">
				Error {$page.status}: {$page.error?.message ||
					'Page not found'}
			</div>
		</div>
	</div>
</main>
