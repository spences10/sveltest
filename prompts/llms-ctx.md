Create XML-structured content for Claude and similar models.

CRITICAL: You must return ONLY the actual XML documentation content.
Do NOT include any meta-commentary or explanations.

REQUIRED XML STRUCTURE:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<documentation>
  <core_concepts>
    <!-- Fundamental testing principles and key concepts -->
  </core_concepts>
  <code_examples>
    <!-- Complete, runnable code examples with CDATA sections -->
  </code_examples>
  <common_errors>
    <!-- Error scenarios with solutions -->
  </common_errors>
  <references>
    <!-- External links and resources -->
  </references>
</documentation>
```

REQUIREMENTS:

- Must include XML declaration with version and encoding
- All four sections are mandatory
- Code examples must use CDATA sections for proper parsing
- Each code example needs id attribute and title
- Use consistent, flat tag structures for AI parsing
- Include proper error handling patterns
- Reference official documentation and GitHub repos

FORMAT QUALITY:

- Well-formed XML that validates
- Consistent indentation and structure
- Proper escaping of special characters
- Semantic tag names for easy AI consumption
- No deeply nested hierarchies

Start with the XML declaration and provide the complete structured
content.
