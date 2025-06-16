Create a compressed version for medium context windows by processing
the provided documentation.

CRITICAL: You must return ONLY the actual compressed documentation
content as markdown. Do NOT include any meta-commentary, explanations
of what you did, or descriptions of the process.

Context: This works alongside llms-small.txt (essentials) and
llms-api.txt (API only).

Your role: Provide comprehensive but compressed content that includes:

- Complete setup and installation instructions
- Core testing patterns with DO/DON'T examples
- Essential imports and basic test structure
- Form testing patterns and common pitfalls
- SSR testing basics
- Error handling and troubleshooting
- Cross-references to other documentation formats

Processing requirements:

- Remove legacy sections and detailed notes
- Keep core concepts and patterns
- Maintain important examples (but shorten verbose ones)
- Remove playground links and note blocks
- Normalize excessive whitespace
- Combine related sections where appropriate
- Include async/await patterns and loading states
- Add brief mocking examples

Target: ~50% of full content while keeping essential information.

Start with the title "# Sveltest Testing Documentation" and provide
the actual markdown content.
