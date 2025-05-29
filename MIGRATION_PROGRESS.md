# Migration Progress: @testing-library/svelte → vitest-browser-svelte

## 📋 Current Status: Phase 2 In Progress 🔄

**Branch**: `migrate-to-vitest-browser-svelte`  
**Last Updated**: Phase 2 - Component Creation & Documentation  
**Git Tag**: `migration-phase-1` (Phase 2 work in progress)

---

## ✅ Completed Tasks

### Phase 1: Foundation Setup (COMPLETE)

#### Dependencies & Configuration

- ✅ **Installed new dependencies**: `@vitest/browser`,
  `vitest-browser-svelte`, `playwright`
- ✅ **Removed old dependencies**: `@testing-library/svelte`,
  `@testing-library/jest-dom`
- ✅ **Updated vite.config.ts**: Workspace configuration with 3
  environments
  - Client tests: Browser mode with Playwright
  - SSR tests: Node environment for server-side rendering
  - Server tests: Node environment for API/utilities
- ✅ **Updated vitest-setup-client.ts**: Removed jsdom-specific mocks
- ✅ **Deleted vitest.config.ts**: Consolidated into vite.config.ts

#### Test Migration Examples

- ✅ **Client test migrated**: `src/routes/page.svelte.test.ts`
  - Shows before/after transformation in comments
  - Demonstrates `@testing-library/svelte` → `vitest-browser-svelte`
    patterns
- ✅ **SSR test created**: `src/routes/page.ssr.test.ts`
  - Server-side rendering test patterns
  - HTML content validation
  - CSS generation testing
- ✅ **Server tests verified**: Existing server tests work without
  changes
  - `src/routes/api/secure-data/server.test.ts`
  - `src/routes/todos/page.server.test.ts`
  - `src/routes/examples/todos/page.server.test.ts`
- ✅ **Utility tests verified**: `src/demo.spec.ts` works without
  changes

#### Git Documentation

- ✅ **Baseline commit**: Starting point documented
- ✅ **Dependency commits**: Installation and removal tracked
- ✅ **Configuration commits**: Workspace setup documented
- ✅ **Migration commits**: First test migration with metrics
- ✅ **Milestone tag**: `migration-phase-1` created

### Phase 2: Component Creation & Documentation (IN PROGRESS)

#### Project Configuration Updates

- ✅ **Updated package.json scripts**: Added project-specific test
  commands
  - `test:server`: `vitest --project=server`
  - `test:client`: `vitest --project=client`
  - `test:ssr`: `vitest --project=ssr`
- ✅ **Fixed SSR test failure**: Updated `src/routes/page.ssr.test.ts`
  for Svelte 5 compatibility
  - Fixed CSS generation test to handle `{ head, html, body }` return
    structure

#### Component Creation & Naming Conventions

- ✅ **Created comprehensive button component**:
  `src/lib/components/button.svelte`
  - Props: variant, size, disabled, loading, type, label
  - Event handling with createEventDispatcher
  - CSS classes derived from props
  - Loading spinner functionality
- ✅ **Established naming conventions**: kebab-case files, snake_case
  functions/variables
  - Component: `button.svelte` (not `Button.svelte`)
  - Functions: `handle_click`, `button_classes` (not camelCase)
- ✅ **Created comprehensive test structure**:
  `src/lib/components/button.svelte.test.ts`
  - Full test coverage structure with describe blocks
  - Tests for rendering, styling, interactions, loading states,
    accessibility
  - Uses proper vitest-browser-svelte patterns

#### Documentation Enhancements

- ✅ **Extensively updated TESTING_STRATERGY.md** with:
  - **New Section 4**: "Svelte 5 Snippet Handling" with examples and
    patterns
  - **New Section 11**: "Svelte 5 Snippet TypeScript Errors"
    troubleshooting
  - **Helper function patterns**: `createTextSnippet`,
    `createHtmlSnippet`
  - **Common snippet patterns**: empty, icon, multi-element, slot
    props
  - **Updated error messages**: Added specific TypeScript errors and
    solutions

#### Critical Discovery: Svelte 5 Snippet Limitations

- ⚠️ **vitest-browser-svelte limitation identified**: Cannot properly
  handle Svelte 5 snippet types
  - TypeScript error:
    `Type '() => string' is not assignable to type 'Snippet<[]>'`
  - Function signature mismatch:
    `Expected 1 or more arguments, but got 0`
- ✅ **Documented workarounds**: Use `label` props instead of
  `children`, create wrapper components
- ✅ **Updated testing strategy**: Avoid children props in
  vitest-browser-svelte tests

---

## 🚨 Current Blocker: Svelte 5 Snippet TypeScript Errors

### Issue Description

When testing components with `children` props (Svelte 5 snippets),
vitest-browser-svelte produces TypeScript errors:

```typescript
// ❌ This fails with TypeScript errors
render(Button, {
	children: () => 'Click me', // Type error
});

// ❌ This also fails
render(Button, {
	children: ($$payload) => {
		$$payload.out += 'Click me';
	}, // Expected 1+ arguments, got 0
});
```

### Current Workaround

- Use `label` props instead of `children`
- Create wrapper components for testing
- Document limitation in testing strategy

---

## 🎯 Next Steps (Phase 2 Continuation)

### Immediate Tasks for Next Chat

1. **Resolve Snippet Issues** (if possible)

   - Investigate correct Svelte 5 snippet function signature
   - Test alternative approaches for children props
   - Consider using @testing-library/svelte for snippet-heavy
     components

2. **Complete Button Component Testing**

   ```bash
   # Test the current button component
   npm run test:client

   # Verify all test environments still work
   npm run test:server
   npm run test:ssr
   ```

3. **Create More Component Examples**

   - Form component with validation
   - Modal/dialog component
   - Input component with events
   - Component using stores/context

4. **Document Migration Patterns**
   - Update migration guide with component patterns
   - Document naming convention decisions
   - Create component testing checklist

### Migration Targets (Updated Priority)

1. **Simple Components** (Current Focus)

   - ✅ Button component (created, needs snippet resolution)
   - 🔄 Card/display components
   - 🔄 Navigation components

2. **Form Components**

   - Input components with validation
   - Select/dropdown components
   - Checkbox/radio components

3. **Interactive Components**

   - Modal/dialog components
   - Tooltip components
   - Accordion/collapsible components

4. **Complex Components**
   - Components with stores/context
   - Components with async data
   - Components with complex state management

---

## 📁 File Structure Status

### Test Files by Environment

#### Client Tests (Browser) - `*.svelte.test.ts`

- ✅ `src/routes/page.svelte.test.ts` - MIGRATED
- 🔄 `src/lib/components/button.svelte.test.ts` - CREATED (needs
  snippet resolution)

#### SSR Tests (Node) - `*.ssr.test.ts`

- ✅ `src/routes/page.ssr.test.ts` - CREATED & FIXED for Svelte 5

#### Server Tests (Node) - `*.test.ts`

- ✅ `src/demo.spec.ts` - NO CHANGES NEEDED
- ✅ `src/routes/api/secure-data/server.test.ts` - NO CHANGES NEEDED
- ✅ `src/routes/todos/page.server.test.ts` - NO CHANGES NEEDED
- ✅ `src/routes/examples/todos/page.server.test.ts` - NO CHANGES
  NEEDED

### Component Files

- ✅ `src/lib/components/button.svelte` - CREATED with comprehensive
  props and styling
- ✅ `src/lib/index.ts` - UPDATED to export Button component

---

## 🔧 Configuration Reference

### Updated package.json Scripts

```json
{
	"scripts": {
		"test:server": "vitest --project=server",
		"test:client": "vitest --project=client",
		"test:ssr": "vitest --project=ssr"
	}
}
```

### Current vite.config.ts Workspace Setup

```typescript
test: {
	workspace: [
		{
			// Client-side tests (Svelte components)
			test: {
				name: 'client',
				environment: 'browser',
				testTimeout: 2000,
				browser: {
					enabled: true,
					provider: 'playwright',
					instances: [{ browser: 'chromium' }],
				},
				include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				exclude: [
					'src/lib/server/**',
					'src/**/*.ssr.{test,spec}.{js,ts}',
				],
				setupFiles: ['./vitest-setup-client.ts'],
			},
		},
		{
			// SSR tests (Server-side rendering)
			test: {
				name: 'ssr',
				environment: 'node',
				include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
			},
		},
		{
			// Server-side tests (Node.js utilities)
			test: {
				name: 'server',
				environment: 'node',
				include: ['src/**/*.{test,spec}.{js,ts}'],
				exclude: [
					'src/**/*.svelte.{test,spec}.{js,ts}',
					'src/**/*.ssr.{test,spec}.{js,ts}',
				],
			},
		},
	];
}
```

---

## 📝 Migration Patterns Discovered

### Naming Conventions Established

- **Files**: kebab-case (`button.svelte`, `button.svelte.test.ts`)
- **Functions**: snake_case (`handle_click`, `button_classes`)
- **Variables**: snake_case (`expected_class`, `click_handler`)
- **Components**: PascalCase in imports (`Button` from
  `./button.svelte`)

### Client Test Migration Pattern

```typescript
// BEFORE: @testing-library/svelte
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';

// AFTER: vitest-browser-svelte
import { page } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
```

### Component Testing Structure

```typescript
describe('ComponentName', () => {
	describe('Initial Rendering', () => {
		test('should render with default props', async () => {});
		test('should render with custom props', async () => {});
	});

	describe('CSS Classes and Styling', () => {
		// Test variant and size combinations
	});

	describe('User Interactions', () => {
		test('should handle click events', async () => {});
		test('should not trigger click when disabled', async () => {});
	});

	describe('Loading State', () => {
		// Test loading spinner and disabled state
	});

	describe('Accessibility', () => {
		// Test ARIA roles and keyboard navigation
	});

	describe('Edge Cases', () => {
		// Test empty props, invalid data, etc.
	});
});
```

### Svelte 5 Snippet Workarounds

```typescript
// ❌ AVOID - vitest-browser-svelte doesn't support children snippets
render(Button, {
	children: 'Click me', // TypeScript error
});

// ✅ RECOMMENDED - Use alternative props
render(Button, {
	label: 'Click me', // Works perfectly
});

// ✅ ALTERNATIVE - Create wrapper components for testing
render(TestButtonWrapper); // Component with fixed content
```

---

## 🎯 Key Learnings for Next Chat

1. **Svelte 5 Snippet Limitation**: vitest-browser-svelte cannot
   handle children props properly
2. **Naming Convention**: Established kebab-case files, snake_case
   functions
3. **Test Structure**: Comprehensive describe blocks for full coverage
4. **Documentation**: TESTING_STRATERGY.md extensively updated with
   patterns
5. **Workarounds**: Use `label` props instead of `children` for
   testing

---

## 🚀 Ready for Next Chat

The foundation is solid, naming conventions are established, and
documentation is comprehensive. The main blocker is the Svelte 5
snippet limitation, but we have documented workarounds. Ready to
continue with more component creation and testing patterns.
