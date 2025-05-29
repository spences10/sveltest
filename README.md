## Migration Guide: @testing-library/svelte → vitest-browser-svelte

This repository documents a complete migration from
`@testing-library/svelte` to `vitest-browser-svelte`, providing a
real-world example for teams looking to modernize their Svelte testing
setup.

### Why Migrate?

- **Real Browser Environment**: Tests run in actual Playwright
  browsers instead of jsdom
- **Better Svelte 5 Support**: Native support for runes and modern
  Svelte patterns
- **Improved Developer Experience**: Better error messages and
  debugging capabilities
- **Future-Proof**: Official Svelte team recommendation for testing

## Getting Started with Migration

Follow these exact steps to begin documenting your migration:

### Step 1: Create Migration Branch

```bash
# Create and switch to migration branch
git checkout -b migrate-to-vitest-browser-svelte

# Commit current state as baseline
git add .
git commit -m "baseline: current state before vitest-browser-svelte migration

This commit represents the starting point with @testing-library/svelte.
All subsequent commits will document the migration process."
```

### Step 2: Install Dependencies

```bash
# Install vitest-browser-svelte and related packages
pnpm add -D @vitest/browser vitest-browser-svelte playwright

# Commit dependency changes
git add package.json pnpm-lock.yaml
git commit -m "feat: install vitest-browser-svelte dependencies

Added packages:
- @vitest/browser: Browser testing environment
- vitest-browser-svelte: Svelte-specific browser testing utilities
- playwright: Browser automation for tests

Keeping @testing-library/svelte during migration for comparison."
```

### Step 3: Update Vitest Configuration

```bash
# Edit vitest.config.ts to enable browser mode
# (See configuration example below)

git add vitest.config.ts
git commit -m "config: enable browser mode in vitest configuration

Changes:
- Added browser: { enabled: true, name: 'chromium' }
- Configured test patterns for browser tests
- Updated environment settings for Playwright integration"
```

### Step 4: Migrate Tests One by One

```bash
# For each component you migrate, commit separately:

git add src/components/Button.test.ts
git commit -m "test: migrate Button component to vitest-browser-svelte

Migration changes:
- Import: '@testing-library/svelte' → 'vitest-browser-svelte'
- Queries: screen.getByRole() → page.getByRole()
- Assertions: expect().toBeInTheDocument() → expect.element().toBeInTheDocument()
- Removed: waitFor() calls (auto-retry built-in)

Metrics:
- Code reduction: 15 lines → 8 lines (47% less)
- Test speed: 2.1s → 0.8s (62% faster)
- Flaky tests: eliminated race conditions"
```

### Step 5: Document Patterns

```bash
# After migrating several components, document common patterns
git add docs/migration-patterns.md
git commit -m "docs: document common migration patterns

Patterns documented:
- Container queries → Locator patterns
- Event simulation → Real browser interactions
- Async handling improvements
- Mock strategy updates"
```

### Step 6: Tag Milestones

```bash
# Tag major achievements
git tag -a "migration-phase-1" -m "Dependencies and configuration complete"
git tag -a "migration-phase-2" -m "Core components migrated"
git tag -a "migration-complete" -m "Full migration to vitest-browser-svelte"
```

### Example Vitest Configuration

Update your `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Enable browser mode
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
		},
		// Include browser test files
		include: [
			'src/**/*.{test,spec}.{js,ts}',
			'src/**/*.{svelte.test,svelte.spec}.{js,ts}',
		],
	},
});
```

### Migration Strategy

We're using git to document each step of the migration process:

#### Phase 1: Setup & Configuration

```bash
# Create migration branch
git checkout -b migrate-to-vitest-browser-svelte

# Each major step gets its own commit with detailed message
git commit -m "feat: install vitest-browser-svelte dependencies

- Add @vitest/browser and vitest-browser-svelte
- Add playwright for browser automation
- Update vitest config for browser mode
- Keep existing @testing-library/svelte for comparison"
```

#### Phase 2: Configuration Updates

```bash
git commit -m "config: update vitest.config.ts for browser testing

- Enable browser mode with playwright
- Configure test environment settings
- Add browser-specific test patterns
- Update TypeScript configuration"
```

#### Phase 3: Test Migration (Component by Component)

```bash
# Migrate one component at a time for clear comparison
git commit -m "test: migrate Button component tests to vitest-browser-svelte

Before: @testing-library/svelte with jsdom
After: vitest-browser-svelte with real browser

Key changes:
- Replace render() import source
- Use page.getBy*() locators instead of screen queries
- Add await to all assertions with expect.element()
- Remove unnecessary waitFor() calls (auto-retry built-in)"
```

#### Phase 4: Pattern Documentation

```bash
git commit -m "docs: document common migration patterns

- Container queries → Locator patterns
- Event simulation → Real browser interactions
- Async handling improvements
- Mock strategy updates"
```

### Git Workflow for Documentation

#### 1. **Branching Strategy**

```bash
# Main migration branch
git checkout -b migrate-to-vitest-browser-svelte

# Feature branches for specific components/patterns
git checkout -b migrate-component-button
git checkout -b migrate-form-validation
git checkout -b migrate-async-patterns
```

#### 2. **Commit Message Format**

Use conventional commits to categorize changes:

```bash
# Configuration changes
git commit -m "config: update vitest config for browser mode"

# Test migrations
git commit -m "test: migrate UserProfile component to vitest-browser-svelte"

# Documentation updates
git commit -m "docs: add migration patterns for form testing"

# Bug fixes during migration
git commit -m "fix: resolve locator timing issues in async tests"

# Performance improvements
git commit -m "perf: optimize test setup with better mocking strategy"
```

#### 3. **Detailed Commit Messages**

Each commit should include:

```bash
git commit -m "test: migrate ContactForm component tests

Migration changes:
- Replace @testing-library/svelte render with vitest-browser-svelte
- Convert screen.getByRole() to page.getByRole()
- Add await to all expect.element() assertions
- Remove manual waitFor() - locators auto-retry
- Update form interaction patterns

Before: 15 lines of test code with manual waiting
After: 8 lines with built-in retry logic

Performance: Test execution time reduced by 40%"
```

#### 4. **Create Migration Checkpoints**

```bash
# Tag major milestones
git tag -a "migration-phase-1" -m "Configuration and setup complete"
git tag -a "migration-phase-2" -m "Core components migrated"
git tag -a "migration-complete" -m "Full migration to vitest-browser-svelte"
```

### Documentation Structure

#### Before/After Comparisons

Each migrated test file should include comments showing the
transformation:

```typescript
// BEFORE: @testing-library/svelte
/*
import { render, screen } from '@testing-library/svelte';
import { waitFor } from '@testing-library/dom';

test('form submission', async () => {
  render(ContactForm);
  const button = screen.getByRole('button');
  await button.click();
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
*/

// AFTER: vitest-browser-svelte
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';

test('form submission', async () => {
	render(ContactForm);
	const button = page.getByRole('button');
	await button.click();
	await expect.element(page.getByText('Success')).toBeInTheDocument();
});
```

#### Migration Metrics Tracking

Document the improvements in each commit:

```bash
git commit -m "test: migrate TodoList component - 60% less code

Metrics:
- Lines of code: 45 → 18 (60% reduction)
- Test execution time: 2.3s → 0.8s (65% faster)
- Flaky test rate: 15% → 0% (eliminated race conditions)
- Developer experience: Manual waiting → Automatic retry"
```

### Viewing the Migration History

After completion, others can follow the migration by:

```bash
# See all migration commits
git log --oneline --grep="migrate"

# View specific migration step
git show <commit-hash>

# Compare before/after for specific file
git diff HEAD~10 HEAD -- src/components/Button.test.ts

# See migration timeline
git log --graph --oneline migrate-to-vitest-browser-svelte
```

### Benefits of This Approach

1. **Step-by-Step Learning**: Each commit shows one focused change
2. **Rollback Capability**: Can revert specific changes if needed
3. **Pattern Documentation**: Clear examples of common transformations
4. **Performance Tracking**: Measurable improvements at each step
5. **Team Knowledge Sharing**: Complete migration history for future
   reference

### Quick Start for Your Migration

1. **Clone this repository**
2. **Check out the migration branch**:
   `git checkout migrate-to-vitest-browser-svelte`
3. **Follow commit history**: `git log --oneline`
4. **Apply patterns to your project**: Use the documented
   transformations

See `TESTING_STRATEGY.md` for comprehensive testing patterns and best
practices with vitest-browser-svelte.
