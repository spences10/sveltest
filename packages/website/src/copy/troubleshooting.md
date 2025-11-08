# Troubleshooting

## Common Errors & Solutions

### Client-Server Mismatch Issues

**Cause**: Client and server expecting different data formats or field
names, often hidden by heavy mocking in tests.

**Example Scenarios**:

- Client sends `email` but server expects `user_email`
- Form sends `FormData` but server expects JSON
- Client uses different validation rules than server

**Solution**: Use the **Client-Server Alignment Strategy**:

```typescript
// ❌ BRITTLE: Mocking hides real mismatches
const mock_request = {
	formData: vi.fn().mockResolvedValue({
		get: vi.fn().mockReturnValue('test@example.com'),
	}),
};

// ✅ ROBUST: Real FormData catches field name issues
const form_data = new FormData();
form_data.append('email', 'test@example.com'); // Must match server expectations
const request = new Request('http://localhost/api/register', {
	method: 'POST',
	body: form_data,
});
```

**Prevention**:

- Share validation logic between client and server
- Use real `FormData`/`Request` objects in server tests
- Add E2E tests for critical form flows

### "Expected 2 arguments, but got 0"

**Cause**: Mock function signature doesn't match the actual function
being mocked.

**Example Error**:

```
TypeError: Expected 2 arguments, but got 0
```

**Solution**: Update your mock to accept the correct number of
arguments:

```typescript
// ❌ Incorrect - no arguments expected
const util_function = vi.fn(() => 'result');

// ✅ Correct - accepts expected arguments
const util_function = vi.fn(
	(input: string, options: object) => 'result',
);
```

**Debugging Steps**:

1. Check the actual function signature in your code
2. Update the mock to match the expected parameters
3. Use `vi.fn().mockImplementation()` for complex logic

### "lifecycle_outside_component"

**Cause**: Attempting to use Svelte context functions like
`getContext()` outside of a component.

**Example Error**:

```
Error: getContext can only be called during component initialisation
```

**Solution**: Skip context-dependent tests and plan for Svelte 5
updates:

```typescript
test.skip('context dependent feature', () => {
	// TODO: Update for Svelte 5 context handling
	// This test requires component context
});
```

**Alternative Approach**:

```typescript
// Mock the context instead
vi.mock('svelte', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		getContext: vi.fn(() => ({
			subscribe: vi.fn(),
			set: vi.fn(),
			update: vi.fn(),
		})),
	};
});
```

### Element Not Found Errors

**Cause**: Element queries failing due to timing or incorrect
selectors.

**Example Error**:

```
Error: Element not found: getByRole('button')
```

**Solution**: Use proper waits and semantic queries:

```typescript
// ❌ May fail due to timing
const button = page.getByRole('button');
button.click();

// ✅ Wait for element to exist
await expect.element(page.getByRole('button')).toBeInTheDocument();
await page.getByRole('button').click();
```

**Debugging Steps**:

1. Check if the element exists in the DOM
2. Verify the selector is correct
3. Add waits for dynamic content
4. Use browser DevTools to inspect the actual HTML

### Test Hangs or Timeouts

**Cause**: Tests waiting indefinitely for elements or actions that
never complete.

**Common Scenarios**:

- Clicking submit buttons with SvelteKit form enhancement
- Waiting for elements that never appear
- Infinite loading states

**Solution**:

```typescript
// ❌ Can cause hangs with SvelteKit forms
await page.getByRole('button', { name: 'Submit' }).click();

// ✅ Test form state directly
render(Form, { props: { errors: { email: 'Required' } } });
await expect.element(page.getByText('Required')).toBeInTheDocument();

// ✅ Use timeouts for flaky elements
await expect.element(page.getByText('Success')).toBeInTheDocument({
	timeout: 5000,
});
```

### Snippet Type Errors

**Cause**: vitest-browser-svelte has limitations with Svelte 5 snippet
types.

**Example Error**:

```
Type '() => string' is not assignable to type 'Snippet<[]>'
```

**Solution**: Use alternative approaches or `createRawSnippet`:

```typescript
// ❌ Problematic with vitest-browser-svelte
render(Component, {
	children: () => 'Text content',
});

// ✅ Use createRawSnippet
const children = createRawSnippet(() => ({
	render: () => `<span>Text content</span>`,
}));
render(Component, { children });

// ✅ Or use alternative props
render(Component, {
	label: 'Text content', // Instead of children
});
```

### Brittle Tests Breaking After Library Updates

**Cause**: Tests checking exact implementation details instead of user
value.

**Example Error**:

```
Expected: containing "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
Received: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1..."
```

This happens when icon libraries update (Heroicons v1 → v2, Lucide
updates) and SVG path data changes.

**Solution**: Test semantic classes and user experience instead:

```typescript
// ❌ BRITTLE - Breaks when icon library updates
test('should render success icon', () => {
	const { body } = render(StatusIcon, { status: 'success' });
	expect(body).toContain(
		'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
	);
});

// ✅ ROBUST - Tests user-visible styling and accessibility
test('should indicate success to users', async () => {
	render(StatusIcon, { status: 'success' });

	// Test what users see and experience
	await expect
		.element(page.getByRole('img', { name: /success/i }))
		.toBeInTheDocument();
	await expect
		.element(page.getByTestId('status-icon'))
		.toHaveClass('text-success');

	// Test semantic structure (survives library updates)
	const { body } = render(StatusIcon, { status: 'success' });
	expect(body).toContain('text-success'); // Color users see
	expect(body).toContain('h-4 w-4'); // Size users see
	expect(body).toContain('<svg'); // Icon is present
	expect(body).toContain('aria-label'); // Accessible
});
```

**Prevention Strategy**:

- Test CSS classes that control appearance (`text-success`, `h-4 w-4`)
- Test semantic HTML structure (`<svg>`, `role="img"`)
- Test user interactions and accessibility
- Avoid testing exact SVG paths, internal markup, or generated class
  names

**Common Brittle Patterns to Avoid**:

```typescript
// ❌ SVG path coordinates (change with icon library updates)
expect(body).toContain('M9 12l2 2 4-4...');

// ❌ Internal component IDs (change with build tools)
expect(body).toContain('__svelte_component_123');

// ❌ Generated CSS class names (change with CSS-in-JS)
expect(body).toContain('styles__button__abc123');
```

## Browser Environment Issues

### Playwright Installation Problems

**Error**: `browserType.launch: Executable doesn't exist`

**Solution**:

```bash
# Install Playwright browsers
npx playwright install

# Or install specific browser
npx playwright install chromium
```

### Browser Launch Failures

**Error**: `Browser launch failed`

**Common Causes & Solutions**:

1. **Missing dependencies on Linux**:

```bash
# Install required dependencies
npx playwright install-deps
```

2. **Insufficient permissions**:

```bash
# Run with proper permissions
sudo npx playwright install
```

3. **CI/CD environment issues**:

```yaml
# In GitHub Actions
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
```

### Memory Issues

**Error**: `Out of memory` or browser crashes

**Solution**:

```typescript
// vite.config.ts
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: playwright(),
			// Reduce memory usage
			headless: true,
		},
		// Limit parallel workers
		pool: 'threads',
		poolOptions: {
			threads: {
				maxThreads: 2, // Reduce from default
			},
		},
	},
});
```

## Mocking Issues

### Module Not Found in Mocks

**Error**: `Cannot resolve module in mock`

**Solution**: Use correct import paths in mocks:

```typescript
// ❌ Incorrect path
vi.mock('./utils', () => ({
	// mock implementation
}));

// ✅ Correct absolute path
vi.mock('$lib/utils', () => ({
	// mock implementation
}));
```

### Mock Not Being Applied

**Issue**: Mock functions not being called or real implementation
running.

**Solution**: Ensure mocks are hoisted:

```typescript
// ✅ Mocks at top of file, before other imports
vi.mock('$lib/api', () => ({
	fetch_data: vi.fn(() => Promise.resolve({})),
}));

import { render } from 'vitest-browser-svelte';
import Component from './component.svelte';
```

### Partial Mock Issues

**Problem**: Need to mock only part of a module.

**Solution**: Use `importOriginal`:

```typescript
vi.mock('$lib/utils', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		// Only mock specific functions
		validate_email: vi.fn(() => true),
	};
});
```

## Component Testing Issues

### Props Not Updating

**Problem**: Component props don't update in tests.

**Solution**: Re-render with new props:

```typescript
// ❌ Props won't update
const { rerender } = render(Component, { count: 0 });
// count is still 0 internally

// ✅ Re-render with new props
const { rerender } = render(Component, { count: 0 });
rerender({ count: 1 });
```

### Event Handlers Not Firing

**Problem**: Event handlers in tests don't trigger.

**Debugging Steps**:

1. Check event handler prop names (onclick vs onClick)
2. Verify event types match
3. Ensure elements are interactive

```typescript
// ✅ Correct event handler props for Svelte
render(Button, {
	onclick: vi.fn(), // Not onClick
});

// ✅ Ensure element is clickable
await expect.element(page.getByRole('button')).toBeEnabled();
await page.getByRole('button').click();
```

### CSS Classes Not Applied

**Problem**: CSS classes don't appear in tests.

**Solution**: Check if styles are imported and applied:

```typescript
// In component
<style>
	.btn-primary {
		background: blue;
	}
</style>

// In test - check for actual class, not styles
await expect.element(button).toHaveClass('btn-primary');
// Don't test: computed styles in browser tests
```

## Performance Issues

### Slow Test Execution

**Causes & Solutions**:

1. **Too many browser instances**:

```typescript
// Reduce workers
export default defineConfig({
	test: {
		poolOptions: {
			threads: {
				maxThreads: 2,
			},
		},
	},
});
```

2. **Heavy component rendering**:

```typescript
// Mock heavy dependencies
vi.mock('$lib/heavy-chart-component.svelte', () => ({
	default: vi.fn().mockImplementation(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
	})),
}));
```

3. **No test parallelization**:

```typescript
// Use concurrent tests where possible
describe('Independent tests', () => {
	test.concurrent('test 1', async () => {});
	test.concurrent('test 2', async () => {});
});
```

### Memory Leaks

**Symptoms**: Tests become slower over time, memory usage increases.

**Solutions**:

1. **Clean up after tests**:

```typescript
afterEach(() => {
	vi.clearAllMocks();
	// Clear any global state
});
```

2. **Limit test scope**:

```typescript
// Don't render entire app in every test
render(SpecificComponent); // ✅
// render(App); // ❌ Heavy
```

## CI/CD Issues

### Tests Pass Locally, Fail in CI

**Common Causes**:

1. **Timing differences**:

```typescript
// Add longer timeouts for CI
await expect.element(element).toBeInTheDocument({
	timeout: process.env.CI ? 10000 : 5000,
});
```

2. **Missing browser dependencies**:

```yaml
# .github/workflows/test.yml
- name: Install dependencies
  run: npx playwright install --with-deps
```

3. **Different viewport sizes**:

```typescript
// Set consistent viewport
export default defineConfig({
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			viewport: { width: 1280, height: 720 },
		},
	},
});
```

### Flaky Tests

**Symptoms**: Tests pass/fail randomly.

**Solutions**:

1. **Avoid hard-coded timeouts**:

```typescript
// ❌ Flaky
await page.waitForTimeout(1000);

// ✅ Reliable
await expect.element(page.getByText('Loaded')).toBeInTheDocument();
```

2. **Use force clicks for overlays**:

```typescript
// ❌ May fail if element is covered
await button.click();

// ✅ Reliable for covered elements
await button.click({ force: true });
```

3. **Wait for specific states**:

```typescript
// ❌ Race condition
await page.getByRole('button').click();
await page.getByText('Success').click();

// ✅ Wait for state
await page.getByRole('button').click();
await expect.element(page.getByText('Success')).toBeInTheDocument();
await page.getByText('Success').click();
```

## Debugging Strategies

### Visual Debugging

```typescript
// Take screenshots for debugging
test('debug test', async () => {
	render(Component);

	// Take screenshot
	await page.screenshot({ path: 'debug.png' });

	// Or in CI
	if (process.env.CI) {
		await page.screenshot({ path: 'debug.png' });
	}
});
```

### Console Debugging

```typescript
// View page content
test('debug content', async () => {
	render(Component);

	// Log current HTML
	const html = await page.innerHTML('body');
	console.log(html);

	// Check console messages
	page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
});
```

### Step-by-Step Debugging

```typescript
// Slow down tests for debugging
export default defineConfig({
	test: {
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			slowMo: 1000, // 1 second between actions
			headless: false, // Show browser
		},
	},
});
```

## Quick Reference

### Error Patterns

- **"Expected 2 arguments"** → Fix mock function signatures
- **"lifecycle_outside_component"** → Skip context tests or mock
  context
- **"Element not found"** → Add waits, check selectors
- **Test hangs** → Avoid SvelteKit form submits, add timeouts
- **"Snippet type error"** → Use createRawSnippet or alternative props
- **Tests break after library updates** → Don't test SVG paths, test
  semantic classes instead

### Performance Red Flags

- Tests taking >30s → Mock heavy dependencies
- Memory increasing → Clean up mocks, limit scope
- Flaky tests → Remove hard timeouts, add proper waits

### Debugging Steps

1. Check browser console for errors
2. Take screenshots of failing tests
3. Log HTML content to verify DOM state
4. Slow down tests with `slowMo` option
5. Run tests in non-headless mode for visual debugging
