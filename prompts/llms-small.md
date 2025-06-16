Create ultra-compressed essentials for small context windows.

CRITICAL: You must return ONLY the actual compressed documentation
content as markdown. Do NOT include any meta-commentary, explanations
of what you did, or descriptions of the process.

TARGET: Under 2,000 characters (<10% of ~20k full content)

- Maximum utility in minimum space
- Every character must add value

Context: Other formats available are llms-medium.txt (detailed) and
llms-api.txt (complete API).

REQUIRED ESSENTIALS (must include all):

- Core imports and basic setup (describe/test structure)
- Essential testing patterns (locators vs containers with clear
  examples)
- Critical gotchas and common errors with solutions
- Basic code examples for first component test
- Form testing warnings and patterns
- Basic assertions (expect.element syntax)
- Links to other formats

QUALITY REQUIREMENTS:

- Every code example must have imports
- Must show locator usage: `page.getBy*()` not containers
- Include at least 1 complete test example
- Must warn about form submission gotchas
- All examples use `await expect.element()` syntax

COMPRESSION RULES:

- Remove all verbose explanations
- Use bullet points over paragraphs
- Combine related concepts
- Show only essential patterns
- No redundant examples

Start with "# Sveltest Testing Documentation" and provide the actual
markdown content.
