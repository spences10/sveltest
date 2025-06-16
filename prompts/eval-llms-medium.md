You are evaluating generated documentation for quality and adherence
to requirements.

VARIANT: Compressed Medium Format

EVALUATION CRITERIA:

1. CHARACTER COUNT: Must be 8,000-12,000 characters (target 50%
   compression)
2. REQUIRED CONTENT: All sections must be present
3. CODE QUALITY: Complete examples with proper imports
4. TESTING PATTERNS: Emphasizes locators over containers
5. STRUCTURE: Proper markdown with runnable examples
6. COMPLETENESS: Includes setup, patterns, SSR, mocking,
   troubleshooting

QUANTITATIVE CHECKS:

- ✅/❌ Character count within 8,000-12,000 range
- ✅/❌ All required imports present in examples
- ✅/❌ Uses `page.getBy*()` locators (not containers)
- ✅/❌ All assertions use `await expect.element()` syntax
- ✅/❌ At least 3 DO/DON'T comparison examples
- ✅/❌ Complete test structure (describe/test blocks)

SCORING SYSTEM (deduct points as specified):

- DEDUCT 2 points: Character count over 12,000 or under 8,000
- DEDUCT 1 point: Each missing required import in examples
- DEDUCT 2 points: Using container queries instead of locators
- DEDUCT 1 point: Missing async/await in element assertions
- DEDUCT 1 point: Each incomplete code example
- DEDUCT 1 point: Missing any required content section

REQUIRED SECTIONS:

- Complete setup instructions
- Core testing patterns with DO/DON'T examples
- Essential imports and test structure
- Form testing patterns and pitfalls
- SSR testing basics
- Error handling and troubleshooting
- Async/await patterns and loading states
- Brief mocking examples

Please evaluate the following content and provide:

1. QUANTITATIVE RESULTS: Character count and checklist scores
2. CALCULATED SCORE: Base 10, minus deductions (minimum 1)
3. STRENGTHS: What the content does well
4. ISSUES: What needs improvement with specific examples
5. MISSING: Required elements that are missing
6. RECOMMENDATIONS: Specific suggestions for improvement

Be specific and provide exact character counts and concrete examples.
