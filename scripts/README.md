# Sveltest Validation & Generation Scripts

This directory contains scripts for validating test files and
generating documentation/rules.

## 🧪 Test Validation System

**Purpose**: Validate all test files against official documentation
from Vitest, Playwright, Svelte, and SvelteKit.

### Quick Start

```bash
# Validate all test files (first run - fetches docs)
pnpm validate:tests

# Subsequent runs (uses cached docs - faster)
pnpm validate:tests:cached

# Validate a specific file
pnpm validate:tests --file apps/website/src/lib/components/button.svelte.test.ts

# Validate a specific directory
pnpm validate:tests --dir apps/website/src/lib/components
```

### What It Does

1. **Fetches Official Documentation** (Haiku 4.5 - fast &
   cost-effective)
   - Vitest Browser Mode
   - vitest-browser-svelte
   - Playwright Locators
   - Svelte 5 Testing
   - SvelteKit Testing

2. **Analyzes Each Test File** (Sonnet 4.5 - accurate & thorough)
   - API usage correctness
   - Anti-pattern detection
   - Deprecation warnings
   - Accessibility compliance
   - Best practice adherence
   - Performance issues

3. **Generates Report** (Markdown format)
   - Summary statistics
   - Critical issues (must fix)
   - Warnings (should fix)
   - Suggestions (nice to have)
   - Specific fixes with code examples

### Output

Reports are saved to `validation-reports/`:

- `validation-report-YYYY-MM-DD.md` - Full report with all issues
- `cached-official-docs.md` - Cached documentation for faster re-runs

### Issue Severity Levels

- 🔴 **CRITICAL** - Code uses deprecated/incorrect APIs or will fail
- 🟡 **WARNING** - Code works but uses anti-patterns
- 🔵 **SUGGESTION** - Code is fine but could be improved

### Example Report

```markdown
# Test Validation Report

## Summary

| Metric               | Count |
| -------------------- | ----- |
| Total Files Analyzed | 49    |
| Valid Files          | ✅ 42 |
| Invalid Files        | ❌ 7  |
| Critical Issues      | 🔴 3  |
| Warning Issues       | 🟡 12 |
| Suggestion Issues    | 🔵 8  |

## Files Requiring Attention

### button.svelte.test.ts

#### 🔴 CRITICAL - API Usage

**Line:** 23

**Issue:** Using deprecated container selector

**Current Code:** \`\`\`typescript const { container } =
render(Button); const button = container.querySelector('button');
\`\`\`

**Recommended Fix:** \`\`\`typescript render(Button); const button =
page.getByRole('button', { name: /click/i }); \`\`\`

**Reference:** https://vitest.dev/guide/browser/#locators
```

## 📁 Directory Structure

```
scripts/
├── config/
│   └── anthropic.ts              # API config (Haiku/Sonnet 4.5)
│
├── utils/
│   ├── logger.ts                 # Pretty console output
│   └── file-helpers.ts           # File system utilities
│
├── validation/
│   ├── validate-tests.ts         # Main orchestrator
│   ├── fetch-official-docs.ts    # Fetch docs (Haiku 4.5)
│   ├── analyze-test-file.ts      # Analyze code (Sonnet 4.5)
│   └── generate-report.ts        # Create markdown reports
│
└── generation/                   # Future: AI rules, llms.txt, etc.
    └── (coming soon)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# .env
ANTHROPIC_API_KEY=your-api-key-here
```

The scripts automatically load environment variables using
`dotenv/config`.

Get your API key from: https://console.anthropic.com/

### Model Strategy

```typescript
// Fast operations (fetching, parsing)
Haiku 4.5: claude-haiku-4-5-20251001
- 8K tokens
- Temperature: 0.2
- Cost: $1/$5 per million tokens

// Deep analysis (validation)
Sonnet 4.5: claude-sonnet-4-5-20250929
- 16K tokens
- Temperature: 0.3
- Higher quality, slower
```

## 🚀 CLI Options

### Main Validation Script

```bash
tsx scripts/validation/validate-tests.ts [options]

Options:
  --file <path>              Validate a specific test file
  --dir <path>               Validate all tests in directory
  --skip-docs-fetch          Skip fetching official docs
  --cached-docs <path>       Use cached documentation file
  --help, -h                 Show help message
```

### Standalone Scripts

```bash
# Fetch official docs only
tsx scripts/validation/fetch-official-docs.ts

# Analyze a single file (requires cached docs)
tsx scripts/validation/analyze-test-file.ts <file-path>
```

## 💡 Best Practices

### First Run

Always do a full validation first to cache documentation:

```bash
pnpm validate:tests
```

This will:

- Fetch latest official docs
- Cache them to `validation-reports/cached-official-docs.md`
- Validate all test files
- Generate a report

### Subsequent Runs

Use cached docs for faster validation:

```bash
pnpm validate:tests:cached
```

This is ~80% faster since it skips doc fetching.

### Targeted Validation

When working on specific files:

```bash
# Single file
pnpm validate:tests --file path/to/test.ts

# Specific directory
pnpm validate:tests --dir apps/website/src/lib/components
```

### CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Validate Tests
  run: pnpm validate:tests
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Exit code is `1` if critical issues are found.

## 🔄 Validation Workflow

### Phase 0: Validation (Before Scenario Split)

1. **Run full validation**

   ```bash
   pnpm validate:tests
   ```

2. **Review report**

   ```bash
   cat validation-reports/validation-report-$(date +%Y-%m-%d).md
   ```

3. **Fix critical issues**
   - Address each 🔴 critical issue
   - Update code based on recommended fixes
   - Reference official documentation

4. **Re-validate**

   ```bash
   pnpm validate:tests:cached
   ```

5. **Iterate until clean**
   - Fix critical issues first
   - Then warnings
   - Then suggestions (optional)

### Once Validated

When all tests pass validation:

- Tests are confirmed as best practices
- Safe to use as examples
- Ready to generate rules/skills from
- Can break into scenarios

## 📊 Success Criteria

Tests are considered **validated** when:

- ✅ Zero critical issues
- ✅ All APIs match official documentation
- ✅ No deprecated patterns
- ✅ Follow accessibility guidelines
- ✅ Use recommended locator strategies
- ✅ Proper async/await handling
- ✅ Real FormData/Request objects (not heavy mocking)

## 🐛 Troubleshooting

### API Rate Limiting

If you hit rate limits:

```bash
# Add delays between files (modify validate-tests.ts)
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds
```

### Incorrect Analysis

If Sonnet misidentifies an issue:

1. Check official documentation yourself
2. Update the validation prompt in `analyze-test-file.ts`
3. Re-run validation

### Out of Date Documentation

Re-fetch documentation periodically:

```bash
# Delete cached docs
rm validation-reports/cached-official-docs.md

# Re-run full validation
pnpm validate:tests
```

## 🔮 Future Enhancements

- [ ] Agent SDK integration for complex multi-file analysis
- [ ] Automatic fix application (--fix flag)
- [ ] Validation of specific patterns (runes, forms, etc.)
- [ ] Compare against community examples
- [ ] Integration with scenario organization
- [ ] Generate rules from validated tests
- [ ] Generate skill references from validated tests

## 📚 References

- [Vitest Browser Mode Docs](https://vitest.dev/guide/browser/)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Svelte 5 Docs](https://svelte.dev/docs)
- [SvelteKit Testing](https://kit.svelte.dev/docs)
- [vitest-browser-svelte](https://github.com/vitest-dev/vitest-browser-svelte)

## 🤝 Contributing

When adding new validation checks:

1. Update `analyze-test-file.ts` with new categories
2. Update documentation with examples
3. Test against known good/bad examples
4. Update this README
