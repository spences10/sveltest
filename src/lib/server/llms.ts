import type { Topic } from '$lib/data/topics';
import { topics } from '$lib/data/topics';

interface GenerateLlmContentOptions {
	topics: Topic[];
	variant?:
		| 'index'
		| 'full'
		| 'medium'
		| 'small'
		| 'ctx'
		| 'ctx-full'
		| 'api'
		| 'examples';
	include_full_content?: boolean;
	minimize?: {
		remove_legacy?: boolean;
		remove_note_blocks?: boolean;
		remove_details_blocks?: boolean;
		remove_playground_links?: boolean;
		normalize_whitespace?: boolean;
		xml_format?: boolean;
		code_only?: boolean;
	};
}

export { topics };

export async function generate_llm_content(
	options: GenerateLlmContentOptions,
): Promise<string> {
	// Handle variant-based generation
	if (options.variant) {
		switch (options.variant) {
			case 'medium':
				return generate_medium_content(options.topics);
			case 'small':
				return generate_small_content(options.topics);
			case 'ctx':
				return generate_ctx_content(options.topics, false);
			case 'ctx-full':
				return generate_ctx_content(options.topics, true);
			case 'api':
				return generate_api_content(options.topics);
			case 'examples':
				return generate_examples_content(options.topics);
			case 'full':
				return generate_full_content(options.topics);
			case 'index':
			default:
				return generate_llms_index(options.topics);
		}
	}

	// Legacy support
	if (options.include_full_content) {
		return generate_full_content(options.topics);
	} else {
		return generate_llms_index(options.topics);
	}
}

async function generate_full_content(
	topics: Topic[],
): Promise<string> {
	// Generate llms-full.txt with all content
	let content = '# Sveltest Testing Documentation\n\n';
	content +=
		'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

	for (const topic of topics) {
		try {
			// Import the markdown file and extract its content
			const markdownModule = await import(
				`../../copy/${topic.slug}.md?raw`
			);
			content += `\n# ${topic.title}\n\n`;
			content += markdownModule.default;
			content += '\n';
		} catch (error) {
			console.warn(
				`Could not load content for ${topic.slug}:`,
				error,
			);
		}
	}

	return content;
}

async function generate_medium_content(
	topics: Topic[],
): Promise<string> {
	// Generate compressed documentation for medium context windows
	let content =
		'# Sveltest Testing Documentation (Medium Context)\n\n';
	content +=
		'> Compressed documentation for medium context window LLMs - Core testing patterns for Svelte 5 with vitest-browser-svelte\n\n';

	for (const topic of topics) {
		try {
			// Import the markdown file and extract its content
			const markdownModule = await import(
				`../../copy/${topic.slug}.md?raw`
			);
			content += `\n# ${topic.title}\n\n`;

			// Process content to remove non-essential parts
			let topicContent = markdownModule.default;

			// Remove legacy content sections
			topicContent = topicContent.replace(
				/## Legacy Support[\s\S]*?(?=##|$)/,
				'',
			);

			// Remove detailed note blocks
			topicContent = topicContent.replace(/:::note[\s\S]*?:::/g, '');

			// Remove playground links
			topicContent = topicContent.replace(
				/\[Try it in the playground\]\(.*?\)/g,
				'',
			);

			// Normalize whitespace
			topicContent = topicContent.replace(/\n\s*\n\s*\n/g, '\n\n');

			content += topicContent;
			content += '\n';
		} catch (error) {
			console.warn(
				`Could not load content for ${topic.slug}:`,
				error,
			);
		}
	}

	return content;
}

async function generate_small_content(
	topics: Topic[],
): Promise<string> {
	// Generate highly compressed documentation for small context windows
	let content =
		'# Sveltest Testing Documentation (Small Context)\n\n';
	content +=
		'> Ultra-compressed essential testing patterns for small context window LLMs\n\n';

	// Add core concepts section
	content += '## Core Testing Concepts\n\n';
	content +=
		'- **Use locators, never containers**: `page.getByRole()`, `page.getByText()`, never use `container.querySelector()`\n';
	content +=
		'- **Always await assertions**: `await expect.element(locator).toBeVisible()`\n';
	content +=
		'- **Use semantic queries**: Test accessibility with `getByRole`, `getByLabel`\n';
	content +=
		'- **Foundation First approach**: Write test structure first, implement incrementally\n\n';

	// Add essential code examples
	content += '## Essential Code Examples\n\n';
	content += '```typescript\n';
	content += '// Essential imports\n';
	content += "import { describe, expect, test } from 'vitest';\n";
	content += "import { render } from 'vitest-browser-svelte';\n";
	content += "import { page } from '@vitest/browser/context';\n\n";

	content += '// Basic component test\n';
	content += "test('renders button with text', async () => {\n";
	content += "  render(Button, { text: 'Click me' });\n";
	content +=
		"  await expect.element(page.getByRole('button', { name: 'Click me' })).toBeVisible();\n";
	content += '});\n\n';

	content += '// User interactions\n';
	content += "test('handles click event', async () => {\n";
	content += '  const { component } = render(Counter);\n';
	content +=
		"  await page.getByRole('button', { name: '+' }).click();\n";
	content +=
		"  await expect.element(page.getByText('Count: 1')).toBeVisible();\n";
	content += '});\n';
	content += '```\n\n';

	// Add critical patterns
	content += '## Critical Patterns\n\n';
	content +=
		"1. **SSR Testing**: `import { render } from 'svelte/server';`\n";
	content +=
		'2. **Svelte 5 Runes**: Use `untrack()` when accessing `$derived` values\n';
	content +=
		'3. **Form Testing**: Test form state directly, avoid clicking submit buttons\n';
	content +=
		"4. **Mocking**: `vi.mock('$lib/utils', () => ({ util: vi.fn() }))`\n\n";

	// Add common errors
	content += '## Common Errors\n\n';
	content +=
		'- **Test Hangs**: Avoid clicking SvelteKit form submits\n';
	content +=
		'- **Animations**: Use `{ force: true }` for clicking animated elements\n';
	content +=
		'- **Svelte 5**: Handle `lifecycle_outside_component` errors with mocks\n\n';

	// Add reference links
	content += '## Reference\n\n';
	content += '- [Full Documentation](/llms-full.txt)\n';
	content += '- [Medium Context](/llms-medium.txt)\n';

	return content;
}

async function generate_ctx_content(
	topics: Topic[],
	includeFull: boolean,
): Promise<string> {
	// The references section is conditionally included based on includeFull
	const referencesSection = includeFull
		? `  <references>
    <reference name="full_documentation" url="/llms-full.txt" />
    <reference name="medium_context" url="/llms-medium.txt" />
    <reference name="small_context" url="/llms-small.txt" />
  </references>`
		: '';

	// Return the complete XML document as a template literal
	const content = `<?xml version="1.0" encoding="UTF-8"?>
<documentation>
  <title>Sveltest Testing Documentation</title>
  <description>Testing patterns for Svelte 5 with vitest-browser-svelte</description>
  
  <core_concepts>
    <concept name="locators">
      <principle>Use locators, never containers</principle>
      <example>page.getByRole('button', { name: 'Submit' })</example>
      <anti_pattern>container.querySelector('button')</anti_pattern>
    </concept>
    <concept name="assertions">
      <principle>Always await element assertions</principle>
      <example>await expect.element(locator).toBeVisible()</example>
      <anti_pattern>expect(element).toBeVisible()</anti_pattern>
    </concept>
    <concept name="accessibility">
      <principle>Use semantic queries for accessibility</principle>
      <example>page.getByRole('button'), page.getByLabelText('Email')</example>
      <anti_pattern>page.getByTestId('submit-btn')</anti_pattern>
    </concept>
  </core_concepts>
  
  <code_examples>
    <example name="basic_component_test">
      <code>
        import { describe, expect, test } from 'vitest';
        import { render } from 'vitest-browser-svelte';
        import { page } from '@vitest/browser/context';
        import Button from './Button.svelte';

        test('renders button with text', async () => {
          render(Button, { text: 'Click me' });
          await expect.element(page.getByRole('button', { name: 'Click me' })).toBeVisible();
        });
      </code>
    </example>
    <example name="user_interaction">
      <code>
        test('handles click event', async () => {
          const { component } = render(Counter);
          await page.getByRole('button', { name: '+' }).click();
          await expect.element(page.getByText('Count: 1')).toBeVisible();
        });
      </code>
    </example>
  </code_examples>
  
  <common_errors>
    <error name="test_hangs">
      <cause>Clicking submit buttons with SvelteKit enhance</cause>
      <solution>Test form state directly instead of clicking submit</solution>
    </error>
    <error name="animations">
      <cause>Elements with CSS animations may not be clickable</cause>
      <solution>Use { force: true } for clicking animated elements</solution>
    </error>
  </common_errors>
  ${referencesSection}
</documentation>`;

	return content;
}

async function generate_api_content(
	topics: Topic[],
): Promise<string> {
	// Generate API-focused documentation
	let content = '# Sveltest API Reference\n\n';
	content +=
		'> Core testing utilities and functions for Svelte 5 with vitest-browser-svelte\n\n';

	// Essential imports
	content += '## Essential Imports\n\n';
	content += '```typescript\n';
	content += "import { describe, expect, test, vi } from 'vitest';\n";
	content += "import { render } from 'vitest-browser-svelte';\n";
	content += "import { page } from '@vitest/browser/context';\n";
	content += "import { createRawSnippet } from 'svelte';\n";
	content += "import { flushSync, untrack } from 'svelte';\n";
	content += '```\n\n';

	// Locators
	content += '## Locator Methods\n\n';
	content += '### Semantic Queries (Preferred)\n\n';
	content += '```typescript\n';
	content += "page.getByRole('button', { name: 'Submit' });\n";
	content += "page.getByRole('textbox', { name: 'Email' });\n";
	content += "page.getByLabel('Email address');\n";
	content += "page.getByText('Welcome');\n";
	content += '```\n\n';

	content +=
		"### Test IDs (When semantic queries aren't possible)\n\n";
	content += '```typescript\n';
	content += "page.getByTestId('submit-button');\n";
	content += '```\n\n';

	// Assertions
	content += '## Assertions\n\n';
	content += '```typescript\n';
	content += '// Always await assertions\n';
	content += 'await expect.element(element).toBeInTheDocument();\n';
	content += 'await expect.element(element).toBeVisible();\n';
	content += 'await expect.element(element).toBeDisabled();\n';
	content +=
		"await expect.element(element).toHaveClass('btn-primary');\n";
	content +=
		"await expect.element(element).toHaveTextContent('Hello');\n";
	content += "await expect.element(element).toHaveValue('text');\n";
	content += '```\n\n';

	// User interactions
	content += '## User Interactions\n\n';
	content += '```typescript\n';
	content += '// Click events\n';
	content += 'await element.click();\n';
	content +=
		'await element.click({ force: true }); // For animations\n\n';

	content += '// Form interactions\n';
	content += "await element.fill('text');\n";
	content += "await element.selectOption('value');\n";
	content += 'await element.check(); // Checkboxes\n';
	content += 'await element.uncheck();\n\n';

	content += '// Keyboard events\n';
	content += "await element.press('Enter');\n";
	content += "await userEvent.keyboard('{Escape}');\n";
	content += '```\n\n';

	// Mocking
	content += '## Mocking\n\n';
	content += '```typescript\n';
	content += '// Mock functions\n';
	content += 'const mockFn = vi.fn();\n';
	content += "mockFn.mockReturnValue('result');\n\n";

	content += '// Mock modules\n';
	content += "vi.mock('$lib/utils/module', () => ({\n";
	content +=
		"  utilFunction: vi.fn(() => [{ value: 'option1', label: 'Option 1' }]),\n";
	content +=
		'  anotherUtil: vi.fn((input) => `processed-${input}`),\n';
	content += '}));\n\n';

	content += '// Mock Svelte context\n';
	content += "vi.mock('svelte', async (importOriginal) => {\n";
	content += '  const actual = (await importOriginal()) as any;\n';
	content += '  return {\n';
	content += '    ...actual,\n';
	content += '    getContext: vi.fn(() => ({\n';
	content += '      subscribe: vi.fn(),\n';
	content += '      set: vi.fn(),\n';
	content += '      update: vi.fn(),\n';
	content += '    })),\n';
	content += '  };\n';
	content += '});\n';
	content += '```\n\n';

	// Svelte 5 Runes
	content += '## Svelte 5 Runes Testing\n\n';
	content += '```typescript\n';
	content += '// Testing reactive state with runes\n';
	content += "test('reactive state with runes', () => {\n";
	content += '  let count = $state(0);\n';
	content += '  let doubled = $derived(count * 2);\n\n';

	content += '  expect(untrack(() => doubled)).toBe(0);\n\n';

	content += '  count = 5;\n';
	content +=
		'  flushSync(); // Still needed for derived state evaluation\n\n';

	content += '  expect(untrack(() => doubled)).toBe(10);\n';
	content += '});\n';
	content += '```\n\n';

	// SSR Testing
	content += '## SSR Testing\n\n';
	content += '```typescript\n';
	content += "import { render } from 'svelte/server';\n\n";

	content += "test('should render without errors', () => {\n";
	content += '  expect(() => {\n';
	content += '    render(ComponentName);\n';
	content += '  }).not.toThrow();\n';
	content += '});\n\n';

	content +=
		"test('should render essential content for SEO', () => {\n";
	content += '  const { body } = render(ComponentName);\n\n';

	content += "  expect(body).toContain('Primary heading');\n";
	content +=
		'  expect(body).toContain(\'href="/important-link"\');\n';
	content += '});\n';
	content += '```\n\n';

	return content;
}

async function generate_examples_content(
	topics: Topic[],
): Promise<string> {
	// Generate code examples collection
	let content = '# Sveltest Code Examples\n\n';
	content +=
		'> Ready-to-use testing patterns and code snippets for Svelte 5\n\n';

	// Basic component test
	content += '## Basic Component Test\n\n';
	content += '```typescript\n';
	content += "import { describe, expect, test } from 'vitest';\n";
	content += "import { render } from 'vitest-browser-svelte';\n";
	content += "import { page } from '@vitest/browser/context';\n";
	content += "import Button from './Button.svelte';\n\n";

	content += "describe('Button', () => {\n";
	content += "  test('renders button with text', async () => {\n";
	content += "    render(Button, { text: 'Click me' });\n";
	content +=
		"    await expect.element(page.getByRole('button', { name: 'Click me' })).toBeVisible();\n";
	content += '  });\n\n';

	content += "  test('handles click event', async () => {\n";
	content += '    const onClick = vi.fn();\n';
	content += "    render(Button, { text: 'Click me', onClick });\n";
	content += "    await page.getByRole('button').click();\n";
	content += '    expect(onClick).toHaveBeenCalled();\n';
	content += '  });\n\n';

	content +=
		"  test('applies correct style variants', async () => {\n";
	content +=
		"    render(Button, { text: 'Click me', variant: 'primary' });\n";
	content +=
		"    await expect.element(page.getByRole('button')).toHaveClass('btn-primary');\n";
	content += '  });\n';
	content += '});\n';
	content += '```\n\n';

	// Form testing
	content += '## Form Testing\n\n';
	content += '```typescript\n';
	content += "import { describe, expect, test } from 'vitest';\n";
	content += "import { render } from 'vitest-browser-svelte';\n";
	content += "import { page } from '@vitest/browser/context';\n";
	content += "import LoginForm from './LoginForm.svelte';\n\n";

	content += "describe('LoginForm', () => {\n";
	content += "  test('validates required fields', async () => {\n";
	content += '    const onSubmit = vi.fn();\n';
	content += '    render(LoginForm, { onSubmit });\n\n';

	content += '    // Submit without filling required fields\n';
	content +=
		"    await page.getByRole('button', { name: 'Submit' }).click();\n\n";

	content += '    // Check for validation messages\n';
	content +=
		"    await expect.element(page.getByText('Email is required')).toBeVisible();\n";
	content +=
		"    await expect.element(page.getByText('Password is required')).toBeVisible();\n";
	content += '    expect(onSubmit).not.toHaveBeenCalled();\n';
	content += '  });\n\n';

	content += "  test('submits form with valid data', async () => {\n";
	content += '    const onSubmit = vi.fn();\n';
	content += '    render(LoginForm, { onSubmit });\n\n';

	content += '    // Fill form fields\n';
	content +=
		"    await page.getByLabel('Email').fill('test@example.com');\n";
	content +=
		"    await page.getByLabel('Password').fill('password123');\n\n";

	content += '    // Submit form\n';
	content +=
		"    await page.getByRole('button', { name: 'Submit' }).click();\n\n";

	content += '    // Check form submission\n';
	content += '    expect(onSubmit).toHaveBeenCalledWith({\n';
	content += "      email: 'test@example.com',\n";
	content += "      password: 'password123'\n";
	content += '    });\n';
	content += '  });\n';
	content += '});\n';
	content += '```\n\n';

	// State testing
	content += '## State Testing with Runes\n\n';
	content += '```typescript\n';
	content += "import { describe, expect, test } from 'vitest';\n";
	content += "import { render } from 'vitest-browser-svelte';\n";
	content += "import { page } from '@vitest/browser/context';\n";
	content += "import { untrack, flushSync } from 'svelte';\n";
	content += "import Counter from './Counter.svelte';\n\n";

	content += "describe('Counter', () => {\n";
	content += "  test('increments counter value', async () => {\n";
	content += '    render(Counter, { initialValue: 0 });\n\n';

	content += '    // Check initial state\n';
	content +=
		"    await expect.element(page.getByText('Count: 0')).toBeVisible();\n\n";

	content += '    // Increment counter\n';
	content +=
		"    await page.getByRole('button', { name: '+' }).click();\n\n";

	content += '    // Check updated state\n';
	content +=
		"    await expect.element(page.getByText('Count: 1')).toBeVisible();\n";
	content += '  });\n\n';

	content += "  test('decrements counter value', async () => {\n";
	content += '    render(Counter, { initialValue: 5 });\n\n';

	content += '    // Check initial state\n';
	content +=
		"    await expect.element(page.getByText('Count: 5')).toBeVisible();\n\n";

	content += '    // Decrement counter\n';
	content +=
		"    await page.getByRole('button', { name: '-' }).click();\n\n";

	content += '    // Check updated state\n';
	content +=
		"    await expect.element(page.getByText('Count: 4')).toBeVisible();\n";
	content += '  });\n';
	content += '});\n';
	content += '```\n\n';

	// SSR Testing
	content += '## SSR Testing\n\n';
	content += '```typescript\n';
	content += "import { describe, expect, test } from 'vitest';\n";
	content += "import { render } from 'svelte/server';\n";
	content += "import Card from './Card.svelte';\n\n";

	content += "describe('Card SSR', () => {\n";
	content += "  test('renders without errors', () => {\n";
	content += '    expect(() => {\n';
	content += '      render(Card, {\n';
	content += "        title: 'Test Card',\n";
	content += "        description: 'Card description\n";
	content += '      });\n';
	content += '    }).not.toThrow();\n';
	content += '  });\n\n';

	content += "  test('renders expected content for SEO', () => {\n";
	content += '    const { body } = render(Card, {\n';
	content += "      title: 'Test Card',\n";
	content += "      description: 'Card description',\n";
	content += "      imageSrc: '/test.jpg'\n";
	content += '    });\n\n';

	content += "    expect(body).toContain('Test Card');\n";
	content += "    expect(body).toContain('Card description');\n";
	content += "    expect(body).toContain('/test.jpg');\n";
	content += '  });\n';
	content += '});\n';
	content += '```\n\n';

	// Mocking examples
	content += '## Mocking Examples\n\n';
	content += '```typescript\n';
	content += "import { describe, expect, test, vi } from 'vitest';\n";
	content += "import { render } from 'vitest-browser-svelte';\n";
	content += "import { page } from '@vitest/browser/context';\n";
	content += "import UserProfile from './UserProfile.svelte';\n\n";

	content += '// Mock API module\n';
	content += "vi.mock('$lib/api', () => ({\n";
	content += '  fetchUserData: vi.fn().mockResolvedValue({\n';
	content += "    name: 'Test User',\n";
	content += "    email: 'test@example.com',\n";
	content += "    role: 'admin'\n";
	content += '  })\n';
	content += '}));\n\n';

	content += "describe('UserProfile', () => {\n";
	content += "  test('displays user data from API', async () => {\n";
	content += "    render(UserProfile, { userId: '123' });\n\n";

	content += '    // Check loading state\n';
	content +=
		"    await expect.element(page.getByText('Loading...')).toBeVisible();\n\n";

	content += '    // Wait for data to load\n';
	content +=
		"    await expect.element(page.getByText('Test User')).toBeVisible();\n";
	content +=
		"    await expect.element(page.getByText('test@example.com')).toBeVisible();\n";
	content +=
		"    await expect.element(page.getByText('admin')).toBeVisible();\n";
	content += '  });\n';
	content += '});\n';
	content += '```\n\n';

	return content;
}

function generate_llms_index(topics: Topic[]): string {
	let content = '# Sveltest Testing Documentation\n\n';
	content +=
		'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

	content += '## Getting Started\n\n';
	content +=
		'- [Installation & Setup](/docs/getting-started): Initial project setup, dependencies, and configuration\n';
	content +=
		'- [Your First Test](/docs/getting-started#first-test): Writing your first component test\n';
	content +=
		'- [Project Structure](/docs/getting-started#structure): Recommended file organization\n\n';

	content += '## Testing Patterns\n\n';
	content +=
		'- [Component Testing](/docs/testing-patterns#component): Real browser testing with vitest-browser-svelte\n';
	content +=
		'- [SSR Testing](/docs/testing-patterns#ssr): Server-side rendering validation\n';
	content +=
		'- [Server Testing](/docs/testing-patterns#server): API routes, hooks, and server functions\n';
	content +=
		'- [Integration Testing](/docs/testing-patterns#integration): End-to-end testing patterns\n\n';

	content += '## API Reference\n\n';
	content +=
		'- [Essential Imports](/docs/api-reference#imports): Core testing utilities and functions\n';
	content +=
		'- [Locators & Queries](/docs/api-reference#locators): Finding elements with semantic queries\n';
	content +=
		'- [Assertions](/docs/api-reference#assertions): Testing element states and properties\n';
	content +=
		'- [User Interactions](/docs/api-reference#interactions): Simulating user events\n\n';

	content += '## Migration Guide\n\n';
	content +=
		'- [From @testing-library/svelte](/docs/migration-guide): Complete step-by-step migration process\n';
	content +=
		'- [Common Patterns](/docs/migration-guide#patterns): Before/after code examples\n';
	content +=
		'- [Troubleshooting Migration](/docs/migration-guide#troubleshooting): Solving common migration issues\n\n';

	content += '## Best Practices\n\n';
	content +=
		'- [Foundation First Approach](/docs/best-practices#foundation-first): 100% test coverage strategy\n';
	content +=
		'- [Accessibility Testing](/docs/best-practices#accessibility): Semantic queries and ARIA testing\n';
	content +=
		'- [Performance Optimization](/docs/best-practices#performance): Fast test execution patterns\n';
	content +=
		'- [Team Collaboration](/docs/best-practices#team): AI assistant rules and conventions\n\n';

	content += '## Troubleshooting\n\n';
	content +=
		'- [Common Errors](/docs/troubleshooting#errors): Solutions for frequent issues\n';
	content +=
		'- [Environment Setup](/docs/troubleshooting#environment): Configuration problems\n';
	content +=
		'- [Browser Issues](/docs/troubleshooting#browser): Playwright and browser-specific fixes\n\n';

	content += '## Optional\n\n';
	content +=
		'- [Example Components](/examples): Live component implementations\n';
	content +=
		'- [GitHub Repository](https://github.com/spences10/sveltest): Full source code\n';
	content +=
		'- [Blog Post](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte): Migration story\n';

	content += '\n## Available LLM Documentation Formats\n\n';
	content +=
		'- [Index](/llms.txt): Navigation links and structure overview\n';
	content +=
		'- [Full Documentation](/llms-full.txt): Complete content in one file\n';
	content +=
		'- [Medium Context](/llms-medium.txt): Compressed for medium context windows\n';
	content +=
		'- [Small Context](/llms-small.txt): Highly compressed for small context windows\n';
	content +=
		'- [API Reference](/llms-api.txt): Testing utilities and functions only\n';
	content +=
		'- [Code Examples](/llms-examples.txt): Curated code patterns\n';
	content +=
		'- [Context Format](/llms-ctx.txt): XML structure without optional content\n';
	content +=
		'- [Full Context Format](/llms-ctx-full.txt): Complete XML structure\n';

	return content;
}
