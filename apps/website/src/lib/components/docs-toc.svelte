<script lang="ts">
	import { page } from '$app/state';
	import { topics } from '$lib/data/topics';
	import { Document } from '$lib/icons';

	interface Props {
		current_topic?: string;
	}

	let { current_topic = '' }: Props = $props();

	const is_active = (topic_slug: string) => {
		return (
			current_topic === topic_slug ||
			(page?.url?.pathname === '/docs' &&
				topic_slug === 'getting-started')
		);
	};
</script>

<aside
	class="fixed top-42 right-4 z-10 my-3 hidden max-h-[50vh] w-62.5 rounded-lg bg-base-100 p-3 text-base leading-7 shadow-lg lg:block"
>
	<div>
		<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
			<Document class_names="h-5 w-5 text-primary" />
			Documentation
		</h3>

		<nav>
			<ul class="space-y-1">
				{#each topics as topic}
					<li>
						<a
							href="/docs/{topic.slug}"
							data-sveltekit-preload-data="hover"
							class="block cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-base-200 {is_active(
								topic.slug,
							)
								? 'border-l-2 border-primary bg-primary/10 font-medium text-primary'
								: 'text-base-content/70'}"
							title={topic.description}
							style="pointer-events: auto;"
						>
							{topic.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</aside>

<style>
	aside {
		overflow-y: auto;
		pointer-events: auto;
	}

	aside a {
		pointer-events: auto !important;
		display: block;
	}
</style>
