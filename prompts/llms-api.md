Create comprehensive API reference documentation from the provided
content.

CRITICAL: You must return ONLY the actual API reference content as
markdown. Do NOT include any meta-commentary or explanations of what
you did.

TARGET: 10,000-15,000 characters of pure API documentation

- Complete function signatures with types
- Every API method documented with examples

REQUIRED SECTIONS (must include all):

- Essential imports and setup
- Locator methods and queries (complete signatures)
- Assertion patterns with type definitions
- User interaction methods (click, type, etc.)
- Mocking patterns and setup functions
- SSR testing methods and utilities
- Configuration and setup options

QUALITY REQUIREMENTS:

- Include parameter types and return values
- Show complete function signatures
- Provide practical usage examples for each method
- Include optional parameters and their defaults
- Document error types and exception handling
- Show configuration object structures

API DOCUMENTATION FORMAT:

```typescript
// Function signature with types
render<T>(
  component: ComponentType<T>,
  props?: T,
  options?: { context?: Map<any, any> }
): RenderResult

// Usage example
render(MyComponent, { title: 'Hello' });
```

TECHNICAL REQUIREMENTS:

- No conceptual explanations - technical reference only
- Include import paths and module information
- Document both sync and async patterns
- Show error handling and timeout options
- Include browser configuration options
- Reference TypeScript interfaces where applicable

COVERAGE AREAS:

- vitest-browser-svelte API
- @vitest/browser/context methods
- Svelte testing utilities (flushSync, untrack)
- Mock functions and setup patterns
- Assertion library integration

Start with "# Sveltest API Reference" and provide the actual technical
reference content.
