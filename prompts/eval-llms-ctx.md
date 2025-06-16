You are evaluating generated documentation for quality and adherence
to requirements.

VARIANT: XML Structured Format

EVALUATION CRITERIA:

1. XML STRUCTURE: Must follow exact required format
2. REQUIRED SECTIONS: All four mandatory sections present
3. XML VALIDATION: Well-formed and properly structured
4. CODE EXAMPLES: Complete with CDATA sections
5. AI OPTIMIZATION: Flat structures for easy parsing

QUANTITATIVE CHECKS:

- ✅/❌ XML declaration present with version and encoding
- ✅/❌ Root <documentation> element present
- ✅/❌ <core_concepts> section with content
- ✅/❌ <code_examples> section with CDATA
- ✅/❌ <common_errors> section with solutions
- ✅/❌ <references> section with links
- ✅/❌ Code examples have id attributes and titles
- ✅/❌ Proper XML indentation and formatting

SCORING SYSTEM (deduct points as specified):

- DEDUCT 3 points: Missing XML declaration or root element
- DEDUCT 2 points: Each missing required section
- DEDUCT 2 points: Code examples not in CDATA sections
- DEDUCT 1 point: Missing id/title attributes on examples
- DEDUCT 1 point: Poor XML formatting or validation errors
- DEDUCT 1 point: Deeply nested hierarchies instead of flat structure

REQUIRED XML STRUCTURE:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<documentation>
  <core_concepts>...</core_concepts>
  <code_examples>...</code_examples>
  <common_errors>...</common_errors>
  <references>...</references>
</documentation>
```

MANDATORY SECTIONS:

- core_concepts: Fundamental testing principles
- code_examples: Complete patterns with CDATA wrapping
- common_errors: Error scenarios with solutions
- references: External links and resources

XML QUALITY REQUIREMENTS:

- Proper escaping of special characters
- Consistent indentation (2 spaces)
- Semantic tag names for AI consumption
- No deeply nested hierarchies
- Well-formed XML that validates

Please evaluate the following content and provide:

1. XML VALIDATION RESULTS: Structure compliance checklist
2. CALCULATED SCORE: Base 10, minus deductions (minimum 1)
3. STRENGTHS: What the XML structure does well
4. ISSUES: Specific XML problems with examples
5. MISSING: Required sections or attributes that are missing
6. RECOMMENDATIONS: Specific XML improvements needed

Be specific and provide exact XML validation feedback.
