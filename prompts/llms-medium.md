Create a compressed version for medium context windows by processing
the provided documentation.

CRITICAL: You must return ONLY the actual compressed documentation
content as markdown. Do NOT include any meta-commentary, explanations
of what you did, or descriptions of the process.

TARGET: Exactly 8,000-12,000 characters (50% of ~20k full content)

- If over 12k chars: Remove verbose examples and redundant
  explanations
- If under 8k chars: Add missing essential patterns

Context: This works alongside llms-small.txt (essentials) and
llms-api.txt (API only).

REQUIRED CONTENT (must include all):

- Complete setup and installation instructions
- Core testing patterns with DO/DON'T examples
- Essential imports and basic test structure
- Form testing patterns and common pitfalls
- SSR testing basics
- Error handling and troubleshooting
- Cross-references to other documentation formats
- Async/await patterns and loading states
- Brief mocking examples

QUALITY REQUIREMENTS:

- Every code example must be complete with all imports
- All assertions must use `await expect.element()` syntax
- Must emphasize locators (`page.getBy*()`) over containers
- All examples must be runnable (describe/test structure)
- Include at least 3 DO/DON'T comparison examples

Processing requirements:

- Remove legacy sections and detailed notes
- Keep core concepts and patterns
- Maintain important examples (but shorten verbose ones)
- Remove playground links and note blocks
- Normalize excessive whitespace
- Combine related sections where appropriate

Start with the title "# Sveltest Testing Documentation" and provide
the actual markdown content.
