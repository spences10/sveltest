import { topics } from '$lib/data/topics';
import {
	component_examples,
	documentation_examples,
	e2e_test_examples,
	integration_test_examples,
	unit_test_examples,
} from '$lib/examples/code-examples';

export interface SearchIndexItem {
	id: string;
	title: string;
	description: string;
	url: string;
	type: 'topic' | 'example' | 'code';
	category: string;
	content: string; // Full searchable content
	excerpt?: string; // Short preview
	keywords: string[]; // Additional searchable terms
}

export interface SearchResult extends SearchIndexItem {
	score: number;
}

export interface SearchIndex {
	items: SearchIndexItem[];
	generated_at: string;
	total_items: number;
}

export async function generate_search_index(): Promise<SearchIndex> {
	const items: SearchIndexItem[] = [];

	// Add documentation topics with full markdown content
	for (const topic of topics) {
		try {
			// Import the markdown file and extract its content
			const markdown_module = await import(
				`../../copy/${topic.slug}.md?raw`
			);
			const full_content = markdown_module.default;

			// Extract keywords from content (common testing terms)
			const keywords = extract_keywords(full_content);

			// Create excerpt from first paragraph
			const excerpt = create_excerpt(full_content);

			items.push({
				id: `topic-${topic.slug}`,
				title: topic.title,
				description: topic.description,
				url: `/docs/${topic.slug}`,
				type: 'topic',
				category: 'Documentation',
				content: full_content,
				excerpt,
				keywords,
			});
		} catch (error) {
			console.warn(
				`Could not load content for ${topic.slug}:`,
				error,
			);
			// Fallback to basic topic info
			items.push({
				id: `topic-${topic.slug}`,
				title: topic.title,
				description: topic.description,
				url: `/docs/${topic.slug}`,
				type: 'topic',
				category: 'Documentation',
				content: `${topic.title}\n\n${topic.description}`,
				excerpt: topic.description,
				keywords: [],
			});
		}
	}

	// Mapping of documentation examples to their specific page sections
	const documentation_example_urls: Record<string, string> = {
		essential_imports: '/docs/getting-started#essential-imports',
		first_test: '/docs/getting-started#step-2-write-your-first-test',
		component_testing:
			'/docs/getting-started#common-patterns-youll-use-daily',
		form_testing: '/docs/getting-started#testing-form-inputs',
		state_testing: '/docs/getting-started#testing-svelte-5-runes',
		ssr_testing: '/docs/testing-patterns#ssr-testing',
		server_testing: '/docs/testing-patterns#server-testing',
	};

	// Add code examples with full content
	const example_categories = [
		{
			examples: unit_test_examples,
			category: 'Unit Testing',
			base_url: '/examples/unit',
		},
		{
			examples: integration_test_examples,
			category: 'Integration Testing',
			base_url: '/examples/integration',
		},
		{
			examples: e2e_test_examples,
			category: 'E2E Testing',
			base_url: '/examples/e2e',
		},
		{
			examples: component_examples,
			category: 'Components',
			base_url: '/components',
		},
	];

	example_categories.forEach(({ examples, category, base_url }) => {
		Object.entries(examples).forEach(([key, code]) => {
			const title = key
				.replace(/_/g, ' ')
				.replace(/\b\w/g, (l) => l.toUpperCase());

			const full_code = typeof code === 'string' ? code : '';
			const keywords = extract_keywords(full_code);
			const excerpt = create_code_excerpt(full_code);

			items.push({
				id: `example-${category.toLowerCase().replace(/\s+/g, '-')}-${key}`,
				title,
				description: `${category} example: ${title}`,
				url: base_url,
				type: 'example',
				category,
				content: full_code,
				excerpt,
				keywords,
			});
		});
	});

	// Add documentation examples with specific URLs
	Object.entries(documentation_examples).forEach(([key, code]) => {
		const title = key
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase());

		const full_code = typeof code === 'string' ? code : '';
		const keywords = extract_keywords(full_code);
		const excerpt = create_code_excerpt(full_code);

		// Use specific URL if available, otherwise fallback to base docs
		const specific_url =
			documentation_example_urls[key] || '/docs/getting-started';

		items.push({
			id: `example-quick-start-${key}`,
			title,
			description: `Quick Start example: ${title}`,
			url: specific_url,
			type: 'example',
			category: 'Quick Start',
			content: full_code,
			excerpt,
			keywords,
		});
	});

	return {
		items,
		generated_at: new Date().toISOString(),
		total_items: items.length,
	};
}

function extract_keywords(content: string): string[] {
	// Extract common testing and development keywords
	const keyword_patterns = [
		// Testing terms
		/\b(mock|mocking|mocked|vi\.fn|vi\.mock)\b/gi,
		/\b(test|testing|spec|describe|it|expect)\b/gi,
		/\b(component|render|page|locator)\b/gi,
		/\b(assertion|toBeInTheDocument|toHaveText|toBeVisible)\b/gi,
		/\b(click|fill|type|press|keyboard)\b/gi,
		/\b(svelte|sveltekit|vitest|playwright)\b/gi,
		/\b(browser|ssr|server|api|route)\b/gi,
		/\b(accessibility|a11y|aria|role)\b/gi,
		/\b(form|input|button|modal|card)\b/gi,
		/\b(state|reactive|derived|effect)\b/gi,
	];

	const keywords = new Set<string>();

	keyword_patterns.forEach((pattern) => {
		const matches = content.match(pattern);
		if (matches) {
			matches.forEach((match) => {
				keywords.add(match.toLowerCase());
			});
		}
	});

	return Array.from(keywords);
}

function create_excerpt(content: string): string {
	// Remove markdown headers and get first meaningful paragraph
	const lines = content.split('\n');
	let excerpt = '';

	for (const line of lines) {
		const trimmed = line.trim();
		// Skip headers, empty lines, and code blocks
		if (
			!trimmed ||
			trimmed.startsWith('#') ||
			trimmed.startsWith('```') ||
			trimmed.startsWith('>')
		) {
			continue;
		}

		excerpt = trimmed;
		break;
	}

	// Limit length and clean up
	return (
		excerpt
			.substring(0, 200)
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') + '...'
	);
}

function create_code_excerpt(code: string): string {
	// Get first few meaningful lines of code
	const lines = code.split('\n').filter((line) => line.trim());
	return lines.slice(0, 3).join('\n').substring(0, 150) + '...';
}

// Server-side search function with full-text capabilities
export function search_full_text(
	query: string,
	index: SearchIndex,
	filter: string = 'all',
): SearchResult[] {
	if (!query.trim()) return [];

	const search_terms = query
		.toLowerCase()
		.split(' ')
		.filter((term) => term.length > 0);

	let filtered_items = index.items;

	// Apply filter
	if (filter !== 'all') {
		filtered_items = index.items.filter((item) => {
			switch (filter) {
				case 'docs':
					return (
						item.type === 'topic' ||
						item.category === 'Documentation' ||
						item.category === 'Quick Start'
					);
				case 'examples':
					return (
						item.type === 'example' &&
						!['Components', 'Documentation', 'Quick Start'].includes(
							item.category,
						)
					);
				case 'components':
					return item.category === 'Components';
				default:
					return true;
			}
		});
	}

	return filtered_items
		.map((item) => {
			let score = 0;
			const searchable_text =
				`${item.title} ${item.description} ${item.category} ${item.content} ${item.keywords.join(' ')}`.toLowerCase();

			// Exact title match gets highest score
			if (item.title.toLowerCase().includes(query.toLowerCase())) {
				score += 100;
			}

			// Description match
			if (
				item.description.toLowerCase().includes(query.toLowerCase())
			) {
				score += 50;
			}

			// Category match
			if (item.category.toLowerCase().includes(query.toLowerCase())) {
				score += 30;
			}

			// Full content match (this is the key improvement!)
			search_terms.forEach((term) => {
				const content_matches = (
					item.content.toLowerCase().match(new RegExp(term, 'g')) ||
					[]
				).length;
				score += content_matches * 5; // Multiple matches in content boost score
			});

			// Keyword matches
			search_terms.forEach((term) => {
				if (item.keywords.some((keyword) => keyword.includes(term))) {
					score += 15;
				}
			});

			// Individual term matches in searchable text
			search_terms.forEach((term) => {
				if (searchable_text.includes(term)) {
					score += 10;
				}
			});

			return { ...item, score };
		})
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, 20); // Increase limit for better results
}
