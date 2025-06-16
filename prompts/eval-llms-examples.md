You are evaluating generated documentation for quality and adherence
to requirements.

VARIANT: Code Examples Collection

EVALUATION CRITERIA:

1. CHARACTER COUNT: Must be 15,000-20,000 characters (comprehensive
   examples)
2. CODE COMPLETENESS: Every example must be complete and runnable
3. PRACTICAL COVERAGE: Real-world scenarios, not toy examples
4. TECHNICAL QUALITY: Proper imports, types, and test structure
5. PATTERN DIVERSITY: Covers all major testing scenarios

QUANTITATIVE CHECKS:

- ✅/❌ Character count within 15,000-20,000 range
- ✅/❌ All examples have necessary imports
- ✅/❌ Complete test structure (describe/test blocks)
- ✅/❌ Uses `await expect.element()` for all assertions
- ✅/❌ Emphasizes `page.getBy*()` locators over containers
- ✅/❌ Includes realistic component props and scenarios
- ✅/❌ Each example has context comment explaining scenario
- ✅/❌ Covers basic components, forms, state, SSR, mocking, async

SCORING SYSTEM (deduct points as specified):

- DEDUCT 2 points: Character count outside 15,000-20,000 range
- DEDUCT 1 point: Each example missing imports
- DEDUCT 1 point: Each incomplete test structure
- DEDUCT 2 points: Using container queries instead of locators
- DEDUCT 1 point: Missing async/await in element assertions
- DEDUCT 1 point: Each unrealistic example (foo/bar names)
- DEDUCT 1 point: Each example missing context comment
- DEDUCT 2 points: Missing any required testing scenario

REQUIRED EXAMPLE CATEGORIES:

- Basic component tests (render, click, assertions)
- Form testing patterns (input filling, validation, submission)
- State testing with runes ($state, $derived, untrack)
- SSR testing examples (server-side rendering)
- Mocking examples (utilities, components, context)
- Error handling and troubleshooting examples
- Async testing patterns

CODE QUALITY STANDARDS:

- Proper TypeScript types where applicable
- Consistent naming conventions
- Real-world component examples (ContactForm, UserProfile)
- Include both positive and negative test cases
- Show proper error handling patterns
- Complete imports at top of each example

Please evaluate the following content and provide:

1. EXAMPLE COVERAGE RESULTS: Character count and completeness
   checklist
2. CALCULATED SCORE: Base 10, minus deductions (minimum 1)
3. STRENGTHS: What the examples collection does well
4. ISSUES: What needs improvement for code quality
5. MISSING: Required example categories or quality standards missing
6. RECOMMENDATIONS: Specific example improvements needed

Be specific and provide exact example quality feedback with counts.
