import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import autolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import slugPlugin from 'rehype-slug';

// Determine if we're building for Cloudflare
const is_cloudflare_pages =
	process.env.CF_PAGES === '1' || process.env.CLOUDFLARE === '1';

const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			smartypants: true,
			rehypePlugins: [
				slugPlugin,
				[
					autolinkHeadings,
					{
						behavior: 'wrap',
					},
				],
				[
					rehypeExternalLinks,
					{ target: '_blank', rel: 'noopener noreferrer' },
				],
			],
		}),
	],
	kit: {
		adapter: adapter(),
		// Exclude LLM API routes when building for Cloudflare
		...(is_cloudflare_pages && {
			routes: {
				exclude: ['/api/llm-txt-gen/**', '/api/llm-txt-eval/**'],
			},
		}),
	},
	extensions: ['.svelte', '.md'],
};

export default config;
