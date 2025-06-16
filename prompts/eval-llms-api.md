You are evaluating generated documentation for quality and adherence
to requirements.

VARIANT: API Reference

EVALUATION CRITERIA:

1. CHARACTER COUNT: Must be 10,000-15,000 characters (comprehensive
   API)
2. TYPE COVERAGE: Complete function signatures with parameters
3. TECHNICAL DEPTH: No conceptual explanations, pure reference
4. API COMPLETENESS: All major testing APIs documented
5. PRACTICAL EXAMPLES: Usage examples for each method

QUANTITATIVE CHECKS:

- ✅/❌ Character count within 10,000-15,000 range
- ✅/❌ Function signatures include parameter types
- ✅/❌ Return value types documented
- ✅/❌ Import paths and module information included
- ✅/❌ Covers locator methods (getByRole, getByText, etc.)
- ✅/❌ Documents assertion patterns with types
- ✅/❌ Includes interaction methods (click, type, etc.)
- ✅/❌ Mocking patterns and setup functions covered
- ✅/❌ Configuration options documented

SCORING SYSTEM (deduct points as specified):

- DEDUCT 2 points: Character count outside 10,000-15,000 range
- DEDUCT 1 point: Each function missing parameter types
- DEDUCT 1 point: Each function missing return type
- DEDUCT 2 points: Missing conceptual separation (includes
  explanations)
- DEDUCT 1 point: Each major API section missing
- DEDUCT 1 point: Missing import path information
- DEDUCT 1 point: Incomplete configuration documentation

REQUIRED API COVERAGE:

- Essential imports and setup
- Locator methods with complete signatures
- Assertion patterns with type definitions
- User interaction methods (click, type, etc.)
- Mocking patterns and setup functions
- SSR testing methods and utilities
- Configuration and setup options

TECHNICAL REQUIREMENTS:

- Include parameter types and return values
- Show complete function signatures
- Document optional parameters and defaults
- Include error types and exception handling
- Show configuration object structures
- Reference TypeScript interfaces
- No conceptual explanations

Please evaluate the following content and provide:

1. API COVERAGE RESULTS: Character count and technical checklist
2. CALCULATED SCORE: Base 10, minus deductions (minimum 1)
3. STRENGTHS: What the API reference does well
4. ISSUES: What needs improvement for technical completeness
5. MISSING: Required API sections or type information missing
6. RECOMMENDATIONS: Specific technical improvements needed

Be specific and provide exact API coverage feedback with examples.
