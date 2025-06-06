// Code examples for the testing documentation
// These are stored as strings to avoid Vite import resolution issues

export const unit_test_examples = {
	basic_function_test: `// calculator.test.ts
import { expect, test } from 'vitest';
import { add } from './calculator.js';

test('adds two numbers', () => {
  // Arrange
  const a = 2;
  const b = 3;
  
  // Act
  const result = add(a, b);
  
  // Assert
  expect(result).toBe(5);
});`,

	component_test: `// button.svelte.test.ts
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test, vi } from 'vitest';
import Button from './button.svelte';

test('calls on_click when clicked', async () => {
  const on_click = vi.fn();
  render(Button, {
    props: { on_click }
  });
  
  const button = page.getByRole('button');
  await button.click();
  expect(on_click).toHaveBeenCalled();
});`,

	state_test: `// todo-state.test.ts
import { expect, test } from 'vitest';
import { untrack } from 'svelte';
import { todo_store } from './todo-state.svelte.js';

test('should add new todo', () => {
  // Arrange
  const initial_count = untrack(() => todo_store.todos()).length;
  
  // Act
  todo_store.add_todo('New task');
  
  // Assert
  const new_count = untrack(() => todo_store.todos()).length;
  expect(new_count).toBe(initial_count + 1);
});`,

	form_validation_test: `// form-validation.test.ts
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test } from 'vitest';
import { untrack } from 'svelte';
import LoginForm from './login-form.svelte';

test('form validation lifecycle', async () => {
  render(LoginForm);
  
  const email_input = page.getByRole('textbox', { name: /email/i });
  const submit_button = page.getByRole('button', { name: /submit/i });
  
  // Form starts valid (no validation triggered yet)
  await expect.element(page.getByText('Invalid email')).not.toBeInTheDocument();
  
  // Trigger validation with invalid input
  await email_input.fill('invalid-email');
  await submit_button.click();
  
  // Now should show validation error
  await expect.element(page.getByText('Invalid email')).toBeInTheDocument();
  
  // Fix the input
  await email_input.fill('valid@email.com');
  await submit_button.click();
  
  // Error should be gone
  await expect.element(page.getByText('Invalid email')).not.toBeInTheDocument();
});`,

	async_test: `// async-component.test.ts
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test } from 'vitest';
import AsyncComponent from './async-component.svelte';

test('handles async data loading', async () => {
  render(AsyncComponent);
  
  // Should show loading state initially
  await expect.element(page.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for data to load
  await expect.element(page.getByText('Data loaded')).toBeInTheDocument();
  
  // Loading state should be gone
  await expect.element(page.getByText('Loading...')).not.toBeInTheDocument();
});`,

	accessibility_test: `// accessibility.test.ts
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test } from 'vitest';
import Button from './button.svelte';

test('button has proper accessibility attributes', async () => {
  render(Button, { 
    props: { 
      text: 'Save Changes',
      disabled: false 
    } 
  });
  
  const button = page.getByRole('button', { name: 'Save Changes' });
  
  await expect.element(button).toBeInTheDocument();
  await expect.element(button).toBeEnabled();
  await expect.element(button).toHaveAccessibleName('Save Changes');
});`,
};

export const integration_test_examples = {
	component_integration: `// login-form.integration.test.ts
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test } from 'vitest';
import LoginForm from './login-form.svelte';

test('should handle complete login flow', async () => {
  render(LoginForm);
  
  // Fill form
  await page.getByRole('textbox', { name: /email/i }).fill('user@example.com');
  await page.getByRole('textbox', { name: /password/i }).fill('password123');
  
  // Submit
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Verify success
  await expect.element(page.getByText('Welcome back!')).toBeVisible();
});`,

	api_integration: `// api-integration.test.ts
import { expect, test } from 'vitest';
import { POST } from './+page.server.ts';

test('should handle form submission', async () => {
  const form_data = new FormData();
  form_data.append('email', 'test@example.com');
  
  const response = await POST({ request: { formData: () => form_data } });
  const result = await response.json();
  
  expect(result.success).toBe(true);
});`,

	state_management: `// state-integration.test.ts
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test } from 'vitest';
import TodoApp from './todo-app.svelte';

test('should sync state across components', async () => {
  render(TodoApp);
  
  // Add todo in one component
  await page.getByRole('textbox').fill('New task');
  await page.getByRole('button', { name: /add/i }).click();
  
  // Verify it appears in list component
  await expect.element(page.getByText('New task')).toBeVisible();
});`,

	form_workflows: `// multi-step-form.test.ts
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test } from 'vitest';
import MultiStepForm from './multi-step-form.svelte';

test('should complete multi-step workflow', async () => {
  render(MultiStepForm);
  
  // Step 1: Personal info
  await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
  await page.getByRole('button', { name: /next/i }).click();
  
  // Step 2: Contact info
  await page.getByRole('textbox', { name: /email/i }).fill('john@example.com');
  await page.getByRole('button', { name: /next/i }).click();
  
  // Step 3: Review and submit
  await expect.element(page.getByText('John Doe')).toBeVisible();
  await expect.element(page.getByText('john@example.com')).toBeVisible();
  
  await page.getByRole('button', { name: /submit/i }).click();
  await expect.element(page.getByText('Form submitted successfully')).toBeVisible();
});`,
};

export const e2e_test_examples = {
	quick_start: `// basic-e2e.test.ts
import { expect, test } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.getByRole('heading', { name: 'Sveltest' })).toBeVisible();
  await expect(page.getByText('Modern testing patterns')).toBeVisible();
});`,

	user_journey: `// user-journey.test.ts
import { expect, test } from '@playwright/test';

test('complete user workflow', async ({ page }) => {
  // Navigate to app
  await page.goto('/');
  await page.getByRole('link', { name: 'Todo Manager' }).click();
  
  // Add new todo
  await page.getByRole('textbox', { name: /add todo/i }).fill('Buy groceries');
  await page.getByRole('button', { name: /add/i }).click();
  
  // Mark as complete
  await page.getByRole('checkbox').check();
  
  // Verify completion
  await expect(page.getByText('Buy groceries')).toHaveClass(/line-through/);
});`,

	cross_browser: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } }
  ]
});`,

	performance: `// performance.test.ts
import { expect, test } from '@playwright/test';

test('page loads within performance budget', async ({ page }) => {
  await page.goto('/');
  
  // Check Core Web Vitals
  const performance_metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const metrics = {};
        
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
          }
          if (entry.name === 'largest-contentful-paint') {
            metrics.lcp = entry.startTime;
          }
        });
        
        resolve(metrics);
      }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    });
  });
  
  expect(performance_metrics.fcp).toBeLessThan(2000); // 2s budget
  expect(performance_metrics.lcp).toBeLessThan(2500); // 2.5s budget
});`,

	accessibility: `// accessibility.test.ts
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibility_scan_results = await new AxeBuilder({ page }).analyze();
  
  expect(accessibility_scan_results.violations).toEqual([]);
});`,
};

export const component_examples = {
	calculator_usage: `<script>
  import Calculator from './calculator.svelte';
  
  let result = 0;
  
  const handle_calculation = (event) => {
    result = event.detail.result;
  };
</script>

<Calculator on:calculate={handle_calculation} />
<p>Result: {result}</p>`,

	modal_props: `<script>
  import Modal from './modal.svelte';
  
  let show_modal = false;
</script>

<button on:click={() => show_modal = true}>
  Open Modal
</button>

<Modal bind:show={show_modal}>
  <h2 slot="title">Confirmation</h2>
  <p>Are you sure you want to continue?</p>
  <div slot="actions">
    <button on:click={() => show_modal = false}>Cancel</button>
    <button on:click={() => show_modal = false}>Confirm</button>
  </div>
</Modal>`,

	card_usage: `<script>
  import Card from './card.svelte';
  
  const handle_click = () => {
    console.log('Card clicked!');
  };
</script>

<Card clickable on:click={handle_click}>
  <h3>Interactive Card</h3>
  <p>Click me to see the interaction!</p>
</Card>`,

	login_form_usage: `<script>
  import LoginForm from './login-form.svelte';
  
  const handle_submit = (event) => {
    const { email, password } = event.detail;
    console.log('Login attempt:', { email, password });
  };
</script>

<LoginForm on:submit={handle_submit} />`,
};

export const ssr_test_examples = {
	basic_ssr: `// button.ssr.test.ts
import { expect, test } from 'vitest';
import { render } from 'svelte/server';
import Button from './button.svelte';

test('should render without errors', () => {
  expect(() => render(Button)).not.toThrow();
});

test('should render button text', () => {
  const { body } = render(Button, {
    props: { text: 'Click me' }
  });
  expect(body).toContain('Click me');
});`,
};

export const documentation_examples = {
	essential_imports: `import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';`,

	first_test: `import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test } from 'vitest';
import Button from './button.svelte';

test('renders button with correct text', async () => {
  render(Button, { props: { text: 'Click me' } });
  
  await expect.element(page.getByRole('button')).toHaveText('Click me');
});`,

	component_testing: `import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test, vi } from 'vitest';
import Button from './button.svelte';

test('calls on_click when clicked', async () => {
  const on_click = vi.fn();
  render(Button, { props: { on_click } });
  
  await page.getByRole('button').click();
  expect(on_click).toHaveBeenCalled();
});`,

	form_testing: `test('form validation works', async () => {
  render(LoginForm);
  
  const email_input = page.getByRole('textbox', { name: /email/i });
  const submit_button = page.getByRole('button', { name: /submit/i });
  
  await email_input.fill('invalid-email');
  await submit_button.click();
  
  await expect.element(page.getByText('Invalid email')).toBeInTheDocument();
});`,

	state_testing: `test('component state updates', async () => {
  render(Counter, { initial_count: 0 });
  
  const button = page.getByRole('button', { name: 'Increment' });
  const display = page.getByTestId('count-display');
  
  await expect.element(display).toHaveTextContent('0');
  
  await button.click();
  await expect.element(display).toHaveTextContent('1');
});`,

	ssr_testing: `import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import Page from './+page.svelte';

test('renders page content', () => {
  const { body } = render(Page);
  expect(body).toContain('Welcome');
});`,

	server_testing: `import { expect, test } from 'vitest';
import { GET } from './+server.ts';

test('returns correct response', async () => {
  const response = await GET();
  const data = await response.json();
  
  expect(data.success).toBe(true);
});`,
};

// Legacy export for backward compatibility
export const code_examples = unit_test_examples;
