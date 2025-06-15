# LLMs.txt Dynamic Generation System

This document explains the new AI-powered system for generating and
evaluating llms.txt documentation variants.

## Overview

We've replaced the previous hardcoded approach (500+ lines of
duplicated content) with a dynamic system that:

- ✅ **Single source of truth** - All content comes from `/copy/`
  markdown files
- ✅ **AI-powered generation** - Uses Anthropic Claude to create
  variants with tailored prompts
- ✅ **Dynamic routing** - One route handles all variants instead of 9
  separate routes
- ✅ **Comprehensive evals** - Quality testing for completeness,
  consistency, usability, and compression
- ✅ **Centralized configuration** - Model and settings managed in one
  place
- ✅ **No maintenance nightmare** - Update source docs, regenerate
  variants as needed

## Architecture

### File Structure

```
src/
├── lib/server/llms.ts          # Core generation logic + prompts + config
├── routes/
│   ├── llms.txt/+server.ts     # Base llms.txt route
│   ├── llms-[variant].txt/     # Dynamic route for all variants
│   └── api/
│       ├── llm-txt-gen/        # Generation endpoint
│       └── llm-txt-eval/       # Evaluation endpoint
├── copy/                       # Source markdown files
└── static/                     # Generated llms.txt files
```

### Centralized Configuration

All Anthropic model settings are centralized in
`src/lib/server/llms.ts`:

```typescript
export const ANTHROPIC_CONFIG = {
	model: 'claude-sonnet-4-20250514',
	generation: {
		max_tokens: 32000,
		stream: true,
	},
	evaluation: {
		max_tokens: 4000,
		stream: false,
	},
} as const;
```

**Benefits:**

- ✅ Update model version in one place
- ✅ Consistent settings across all endpoints
- ✅ Easy to adjust token limits per use case
- ✅ Type-safe configuration with `as const`

### Content Flow

1. **Source** → `/copy/*.md` (single source of truth)
2. **Generate** → POST to `/api/llm-txt-gen` with variant + auth
3. **AI Processing** → Claude uses tailored prompts to create variants
4. **Storage** → Generated content saved to `/static/{variant}.txt`
5. **Serving** → Dynamic routes serve from static files or show
   generation instructions

## Available Variants

| Variant         | Purpose          | Target Size  | Use Case               |
| --------------- | ---------------- | ------------ | ---------------------- |
| `llms`          | Navigation index | Small        | Directory/overview     |
| `llms-full`     | Complete docs    | Large        | Full reference         |
| `llms-medium`   | Compressed docs  | ~50% of full | Medium context windows |
| `llms-small`    | Essential only   | ~10% of full | Small context windows  |
| `llms-api`      | API reference    | Medium       | Technical reference    |
| `llms-examples` | Code examples    | Medium       | Copy-paste patterns    |
| `llms-ctx`      | XML for Claude   | Medium       | AI consumption         |

## Generation

### Environment Setup

```bash
# Required environment variables
export ANTHROPIC_API_KEY="your-anthropic-key"
export LLM_GEN_SECRET="your-secret-for-auth"
```

### Model Configuration

To change the Anthropic model used across the system:

1. **Update centralized config** in `src/lib/server/llms.ts`:

   ```typescript
   export const ANTHROPIC_CONFIG = {
   	model: 'claude-3-5-sonnet-20241022', // ← Update here only
   	// ... rest of config
   };
   ```

2. **Regenerate variants** to use new model:
   ```bash
   # Regenerate with new model
   for variant in llms-medium llms-small llms-api; do
     curl -X POST localhost:5173/api/llm-txt-gen \
       -d "{\"variant\": \"$variant\", \"auth\": \"$LLM_GEN_SECRET\"}"
   done
   ```

### Generate Single Variant

```bash
curl -X POST http://localhost:5173/api/llm-txt-gen \
  -H "Content-Type: application/json" \
  -d '{
    "variant": "llms-medium",
    "auth": "your-secret-here"
  }'
```

**Response:**

```json
{
	"success": true,
	"variant": "llms-medium",
	"filename": "llms-medium.txt",
	"length": 15420
}
```

### Generate Multiple Variants

```bash
# Generate all variants with progress tracking
for variant in llms llms-medium llms-small llms-api llms-examples llms-ctx; do
  echo "Generating $variant..."
  curl -X POST localhost:5173/api/llm-txt-gen \
    -H "Content-Type: application/json" \
    -d "{\"variant\": \"$variant\", \"auth\": \"$LLM_GEN_SECRET\"}" \
    -s | jq '.length // .error'
  sleep 2  # Increased delay to avoid rate limits
done
```

### Generation Scripts

Create a reusable script for batch generation:

```bash
#!/bin/bash
# scripts/generate-llms.sh

if [ -z "$LLM_GEN_SECRET" ]; then
  echo "Error: LLM_GEN_SECRET environment variable is required"
  exit 1
fi

VARIANTS=("llms-medium" "llms-small" "llms-api" "llms-examples" "llms-ctx")

for variant in "${VARIANTS[@]}"; do
  echo "Generating $variant..."

  response=$(curl -X POST localhost:5173/api/llm-txt-gen \
    -H "Content-Type: application/json" \
    -d "{\"variant\": \"$variant\", \"auth\": \"$LLM_GEN_SECRET\"}" \
    -s)

  if echo "$response" | jq -e '.success' > /dev/null; then
    length=$(echo "$response" | jq -r '.length')
    echo "✅ $variant generated ($length chars)"
  else
    error=$(echo "$response" | jq -r '.error // "Unknown error"')
    echo "❌ $variant failed: $error"
  fi

  sleep 2
done

echo "Generation complete!"
```

## Evaluation System

### Evaluation Types

1. **Completeness** - Does each variant cover essential information?
2. **Consistency** - Are variants consistent in terminology and
   approach?
3. **Usability** - Can developers solve real problems with the docs?
4. **Compression Quality** - Do compressed variants preserve critical
   info?

### Run Evaluations

#### Full Evaluation Suite

```bash
curl -X POST http://localhost:5173/api/llm-txt-eval \
  -H "Content-Type: application/json" \
  -d '{
    "type": "full_suite",
    "auth": "your-secret-here"
  }'
```

#### Specific Evaluation Types

```bash
# Test completeness
curl -X POST localhost:5173/api/llm-txt-eval \
  -d '{"type": "completeness", "variants": ["llms-medium", "llms-small"], "auth": "secret"}'

# Test consistency between variants
curl -X POST localhost:5173/api/llm-txt-eval \
  -d '{"type": "consistency", "variants": ["llms-medium", "llms-api"], "auth": "secret"}'

# Test usability with real developer questions
curl -X POST localhost:5173/api/llm-txt-eval \
  -d '{"type": "usability", "variants": ["llms-small"], "auth": "secret"}'

# Test compression quality
curl -X POST localhost:5173/api/llm-txt-eval \
  -d '{"type": "compression", "variants": ["llms-small", "llms-medium"], "auth": "secret"}'
```

#### Evaluation Scripts

Create automated evaluation workflows:

```bash
#!/bin/bash
# scripts/eval-llms.sh

if [ -z "$LLM_GEN_SECRET" ]; then
  echo "Error: LLM_GEN_SECRET environment variable is required"
  exit 1
fi

echo "Running full evaluation suite..."

response=$(curl -X POST localhost:5173/api/llm-txt-eval \
  -H "Content-Type: application/json" \
  -d "{\"type\": \"full_suite\", \"auth\": \"$LLM_GEN_SECRET\"}" \
  -s)

if echo "$response" | jq -e '.success' > /dev/null; then
  echo "✅ Evaluation complete"

  # Extract scores for key variants
  for variant in llms-medium llms-small llms-api; do
    score=$(echo "$response" | jq -r ".results.completeness[\"$variant\"].score // \"N/A\"")
    echo "  $variant completeness: $score/10"
  done
else
  error=$(echo "$response" | jq -r '.error // "Unknown error"')
  echo "❌ Evaluation failed: $error"
fi
```

### Evaluation Output

```json
{
	"success": true,
	"type": "completeness",
	"results": {
		"llms-medium": {
			"evaluation": "Score: 8/10, Feedback: Covers core concepts well...",
			"score": 8,
			"timestamp": "2025-01-09T10:30:00.000Z"
		}
	}
}
```

## Prompt System

Each variant uses a tailored prompt that considers:

- **Target audience** (beginners vs experts)
- **Context window size** (small vs large)
- **Use case** (reference vs examples vs navigation)
- **Cross-variant awareness** (what other formats exist)

### Prompt Optimization Guidelines

1. **Be Specific About Output Format**

   ```
   CRITICAL: You must return ONLY the actual content as markdown.
   Do NOT include meta-commentary or explanations.
   ```

2. **Set Clear Compression Targets**

   ```
   Target: ~50% of full content while keeping essential information.
   ```

3. **Provide Context About Other Variants**

   ```
   Context: This works alongside llms-small.txt (essentials) and llms-api.txt (API only).
   ```

4. **Give Concrete Examples**
   ```
   Include ONLY:
   - Core imports and basic setup
   - Essential testing patterns with examples
   - Critical gotchas with solutions
   ```

### Example Prompt (llms-medium)

```
Create a compressed version for medium context windows.

Context: This works alongside llms-small.txt (essentials) and llms-api.txt (API only).

Your role: Provide comprehensive but compressed content.

Requirements:
- Remove legacy sections and detailed notes
- Keep core concepts and patterns
- Maintain important examples
- Remove playground links and note blocks
- Normalize excessive whitespace

Target: ~50% of full content while keeping essential information.

CRITICAL: Return ONLY the markdown content, no meta-commentary.
```

### Prompt Testing Workflow

1. **Create Test Prompt** in `src/lib/server/llms.ts`
2. **Generate Test Variant**
   ```bash
   curl -X POST localhost:5173/api/llm-txt-gen \
     -d '{"variant": "test-variant", "auth": "secret"}'
   ```
3. **Evaluate Quality**
   ```bash
   curl -X POST localhost:5173/api/llm-txt-eval \
     -d '{"type": "completeness", "variants": ["test-variant"], "auth": "secret"}'
   ```
4. **Compare Against Baseline**
5. **Update Production Prompt** if scores improve

## Usage Patterns

### Development Workflow

1. **Update source docs** in `/copy/`
2. **Regenerate affected variants**
3. **Run evals** to ensure quality
4. **Iterate on prompts** if scores are low
5. **Deploy** updated static files

### Quality Assurance Workflow

```bash
#!/bin/bash
# Complete QA workflow

# 1. Regenerate key variants
echo "Regenerating variants..."
./scripts/generate-llms.sh

# 2. Run evaluations
echo "Running evaluations..."
./scripts/eval-llms.sh

# 3. Check file sizes
echo "Checking compression ratios..."
full_size=$(wc -c < static/llms-full.txt)
for variant in llms-medium llms-small; do
  if [ -f "static/$variant.txt" ]; then
    size=$(wc -c < "static/$variant.txt")
    ratio=$((size * 100 / full_size))
    echo "  $variant: $ratio% of full size"
  fi
done

echo "QA workflow complete!"
```

### A/B Testing Prompts

1. **Create Backup** of current prompt
2. **Update Prompt** in `src/lib/server/llms.ts`
3. **Generate New Version**
   ```bash
   curl -X POST localhost:5173/api/llm-txt-gen \
     -d '{"variant": "llms-medium-test", "auth": "secret"}'
   ```
4. **Compare Scores**
   ```bash
   curl -X POST localhost:5173/api/llm-txt-eval \
     -d '{"type": "consistency", "variants": ["llms-medium", "llms-medium-test"], "auth": "secret"}'
   ```
5. **Keep Better Version**

## Accessing Generated Content

### URLs

- Base: `http://localhost:5173/llms.txt`
- Variants: `http://localhost:5173/llms-{variant}.txt`

Examples:

- `/llms-medium.txt` - Compressed documentation
- `/llms-api.txt` - API reference only
- `/llms-examples.txt` - Code examples only

### Behavior

- **If generated file exists** → Serves from `/static/`
- **If file missing** → Shows generation instructions
- **llms-full.txt** → Always generated dynamically from source

### Content Verification

```bash
# Check if variants exist and get basic stats
for variant in llms-medium llms-small llms-api; do
  file="static/$variant.txt"
  if [ -f "$file" ]; then
    size=$(wc -c < "$file")
    lines=$(wc -l < "$file")
    echo "✅ $variant: $size chars, $lines lines"
  else
    echo "❌ $variant: Missing"
  fi
done
```

## Performance Optimization

### Token Usage Monitoring

Add token tracking to API calls:

```typescript
// In generation endpoint
const usage = response.usage;
console.log(
	`Generated ${variant}: ${usage.input_tokens} in + ${usage.output_tokens} out`,
);
```

### Caching Strategy

```typescript
// Cache generated content with timestamps
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function getCachedOrGenerate(variant: string) {
	const cache_key = `llms-${variant}`;
	const cached = await redis.get(cache_key);

	if (cached) {
		const { content, timestamp } = JSON.parse(cached);
		if (Date.now() - timestamp < CACHE_DURATION) {
			return content;
		}
	}

	// Generate new content...
}
```

## Benefits

### Before (Hardcoded)

- ❌ 500+ lines of duplicated content
- ❌ Manual updates in multiple places
- ❌ No quality assurance
- ❌ Maintenance nightmare
- ❌ Inconsistent variants

### After (Dynamic)

- ✅ Single source of truth
- ✅ AI-powered intelligent compression
- ✅ Comprehensive quality testing
- ✅ Easy to maintain and update
- ✅ Cross-variant consistency checks
- ✅ Data-driven prompt optimization
- ✅ Centralized model configuration
- ✅ Automated evaluation workflows

## Troubleshooting

### Common Issues

**Generation fails with auth error:**

```bash
# Check environment variable
echo $LLM_GEN_SECRET
# Ensure it matches the auth value in requests

# Test auth with simple request
curl -X POST localhost:5173/api/llm-txt-gen \
  -d "{\"variant\": \"llms-small\", \"auth\": \"$LLM_GEN_SECRET\"}" \
  -v  # Verbose output for debugging
```

**Evaluation fails with "file not found":**

```bash
# Check if static files exist
ls -la static/llms-*.txt

# Generate missing variants first
curl -X POST localhost:5173/api/llm-txt-gen \
  -d '{"variant": "llms-medium", "auth": "secret"}'

# Then run evaluation
curl -X POST localhost:5173/api/llm-txt-eval \
  -d '{"type": "completeness", "variants": ["llms-medium"], "auth": "secret"}'
```

**Poor evaluation scores:**

1. **Review detailed feedback** in eval results
2. **Check source content** in `/copy/` for completeness
3. **Analyze prompt effectiveness**:
   ```bash
   # Get current prompt
   grep -A 20 "llms-medium" src/lib/server/llms.ts
   ```
4. **Test prompt variations** with A/B testing
5. **Adjust compression targets** if content is too sparse

**Rate limiting errors:**

```bash
# Add delays between requests
sleep 3

# Reduce batch sizes
VARIANTS=("llms-medium" "llms-small")  # Instead of all variants

# Check Anthropic API usage
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
  https://api.anthropic.com/v1/usage
```

**Model configuration issues:**

```bash
# Verify centralized config is being used
grep -r "claude-sonnet" src/routes/api/  # Should return no hardcoded models

# Check current model in use
grep "model:" src/lib/server/llms.ts
```

### Debug Mode

Enable detailed logging for troubleshooting:

```typescript
// In generation endpoint
console.log('Generation request:', {
	variant,
	model: ANTHROPIC_CONFIG.model,
});
console.log('Prompt length:', prompt.length);
console.log('Generated length:', generated_content.length);
```

### File Locations

- **Generated files**: `static/llms-{variant}.txt`
- **Source files**: `src/copy/*.md`
- **Prompts**: `src/lib/server/llms.ts` → `VARIANT_PROMPTS`
- **Eval prompts**: `src/routes/api/llm-txt-eval/+server.ts` →
  `EVAL_PROMPTS`
- **Config**: `src/lib/server/llms.ts` → `ANTHROPIC_CONFIG`

## Future Enhancements

- **Automated regeneration** on source file changes with file watchers
- **Performance metrics** (generation time, token usage, compression
  ratios)
- **Version tracking** for generated content with git integration
- **Webhook integration** for CI/CD pipelines
- **Custom eval criteria** for specific use cases
- **Multi-model support** (GPT, Gemini) with provider abstraction
- **Content diff tracking** to see what changed between generations
- **Prompt template system** for easier prompt management
