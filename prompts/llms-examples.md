Extract and curate code examples only from the provided documentation.

CRITICAL: You must return ONLY the actual code examples content as
markdown. Do NOT include any meta-commentary or explanations of what
you did.

TARGET: 15,000-20,000 characters of pure code examples

- Focus on complete, runnable patterns
- Every example must be immediately usable

REQUIRED SECTIONS (must include all):

- Basic component tests (render, click, assertions)
- Form testing patterns (input filling, validation, submission)
- State testing with runes ($state, $derived, untrack)
- SSR testing examples (server-side rendering)
- Mocking examples (utilities, components, context)
- Error handling and troubleshooting examples
- Async testing patterns

QUALITY REQUIREMENTS:

- Every example must be complete and runnable
- All examples need necessary imports at the top
- Full test structure (describe/test blocks)
- Use `await expect.element()` for all element assertions
- Emphasize `page.getBy*()` locators over containers
- Include realistic component props and scenarios
- Add brief context comment explaining each scenario

CODE STANDARDS:

- Proper TypeScript types where applicable
- Consistent naming conventions
- Real-world component examples (not foo/bar)
- Include both positive and negative test cases
- Show proper error handling patterns

EXAMPLE FORMAT:

```typescript
// Testing a contact form component
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import ContactForm from './ContactForm.svelte';

describe('ContactForm', () => {
  test('should submit form with valid data', async () => {
    // ... complete test
  });
});
```

Start with "# Sveltest Code Examples" and provide the actual markdown
content.
