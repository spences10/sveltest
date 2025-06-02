// Code examples for the testing documentation
// These are stored as strings to avoid Vite import resolution issues

export const unit_test_examples = {
	basic_function_test: `// calculator.test.js
import { add } from './calculator.js';
// testing vite import resolution issues
import { render, fireEvent } from '@testing-library/svelte';

test('adds two numbers', () => {
  // Arrange
  const a = 2;
  const b = 3;
  
  // Act
  const result = add(a, b);
  
  // Assert
  expect(result).toBe(5);
});`,

	component_test: `// Button.test.js
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';

test('calls onClick when clicked', async () => {
  const onClick = vi.fn();
  render(Button, {
    props: { onClick }
  });
  
  const button = page.getByRole('button');
  await button.click();
  expect(onClick).toHaveBeenCalled();
});`,

	state_test: `// todo-state.test.js
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

	form_validation_test: `// form-validation.test.js
import { untrack } from 'svelte';
import { create_form_state } from './form-state.svelte.js';

test('should validate required field', () => {
  // Arrange
  const form = create_form_state({
    email: { 
      value: '', 
      validation_rules: { required: true } 
    }
  });
  
  // Initially valid (no validation triggered)
  expect(untrack(() => form.is_form_valid())).toBe(true);
  
  // Act - trigger validation
  form.validate_all_fields();
  
  // Assert - now invalid
  expect(untrack(() => form.is_form_valid())).toBe(false);
});`,
};

export const integration_test_examples = {
	component_integration: `// login-form.integration.test.js
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

	api_integration: `// api-integration.test.js
import { expect, test } from 'vitest';
import { POST } from './+page.server.ts';

test('should handle form submission', async () => {
  const formData = new FormData();
  formData.append('email', 'test@example.com');
  
  const response = await POST({ request: { formData: () => formData } });
  const result = await response.json();
  
  expect(result.success).toBe(true);
});`,

	state_management: `// state-integration.test.js
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

	form_workflows: `// multi-step-form.test.js
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest-browser/context';
import { expect, test } from 'vitest';
import MultiStepForm from './multi-step-form.svelte';

test('should navigate through form steps', async () => {
  render(MultiStepForm);
  
  // Step 1
  await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
  await page.getByRole('button', { name: /next/i }).click();
  
  // Step 2
  await page.getByRole('textbox', { name: /email/i }).fill('john@example.com');
  await page.getByRole('button', { name: /submit/i }).click();
  
  // Verify completion
  await expect.element(page.getByText('Form submitted!')).toBeVisible();
});`,
};

export const e2e_test_examples = {
	quick_start: `// basic-e2e.test.js
import { expect, test } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.getByRole('heading', { name: 'TestSuite Pro' })).toBeVisible();
  await expect(page.getByText('Modern testing patterns')).toBeVisible();
});`,

	user_journey: `// user-journey.test.js
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

	cross_browser: `// cross-browser.config.js
import { test, devices } from '@playwright/test';

const config = {
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } }
  ]
};

export default config;`,

	performance: `// performance.test.js
import { expect, test } from '@playwright/test';

test('page loads within performance budget', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => performance.getEntriesByType('navigation')[0]);
  
  expect(metrics.loadEventEnd - metrics.loadEventStart).toBeLessThan(2000);
  expect(metrics.domContentLoadedEventEnd - metrics.domContentLoadedEventStart).toBeLessThan(1000);
});`,

	accessibility: `// accessibility.test.js
import { expect, test } from '@playwright/test';
// import { injectAxe, checkA11y } from 'axe-playwright';

test('page meets accessibility standards', async ({ page }) => {
  await page.goto('/');
  
  // Check for proper heading structure
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  
  // Check for alt text on images
  const images = page.getByRole('img');
  for (const img of await images.all()) {
    await expect(img).toHaveAttribute('alt');
  }
  
  // Check keyboard navigation
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
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
	basic_ssr: `// Button.ssr.test.js
import { render } from 'svelte/server';
import Button from './Button.svelte';

test('should render without errors', () => {
  expect(() => render(Button)).not.toThrow();
});

test('should render button text', () => {
  const { body } = render(Button, {
    props: { children: 'Click me' }
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
import { expect, test } from 'vitest';
import Button from './button.svelte';

test('calls onClick when clicked', async () => {
  const onClick = vi.fn();
  render(Button, { props: { onClick } });
  
  await page.getByRole('button').click();
  expect(onClick).toHaveBeenCalled();
});`,

	form_testing: `test('form validation works', async () => {
  render(LoginForm);
  
  const emailInput = page.getByLabelText('Email');
  const submitButton = page.getByRole('button', { name: 'Submit' });
  
  await emailInput.fill('invalid-email');
  await submitButton.click();
  
  await expect.element(page.getByText('Invalid email')).toBeInTheDocument();
});`,

	state_testing: `test('component state updates', async () => {
  render(Counter, { initialCount: 0 });
  
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
