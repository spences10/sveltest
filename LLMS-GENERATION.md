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
- ✅ **No maintenance nightmare** - Update source docs, regenerate
  variants as needed

## Architecture

### File Structure

```
src/
├── lib/server/llms.ts          # Core generation logic + prompts
├── routes/
│   ├── llms.txt/+server.ts     # Base llms.txt route
│   ├── llms-[variant].txt/     # Dynamic route for all variants
│   └── api/
│       ├── llm-txt-gen/        # Generation endpoint
│       └── llm-txt-eval/       # Evaluation endpoint
├── copy/                       # Source markdown files
└── static/                     # Generated llms.txt files
```

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
| `llms-ctx-full` | Full XML         | Large        | Complete AI context    |

## Generation

### Environment Setup

```bash
# Required environment variables
export ANTHROPIC_API_KEY="your-anthropic-key"
export LLM_GEN_SECRET="your-secret-for-auth"
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
# Generate all variants
for variant in llms llms-medium llms-small llms-api llms-examples llms-ctx llms-ctx-full; do
  curl -X POST localhost:5173/api/llm-txt-gen \
    -H "Content-Type: application/json" \
    -d "{\"variant\": \"$variant\", \"auth\": \"$LLM_GEN_SECRET\"}"
  sleep 1
done
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
```

## Usage Patterns

### Development Workflow

1. **Update source docs** in `/copy/`
2. **Regenerate affected variants**
3. **Run evals** to ensure quality
4. **Iterate on prompts** if scores are low
5. **Deploy** updated static files

### Quality Assurance

```bash
# After updating source docs, regenerate and test
export LLM_GEN_SECRET="your-secret"

# Regenerate key variants
curl -X POST localhost:5173/api/llm-txt-gen -d '{"variant": "llms-medium", "auth": "'$LLM_GEN_SECRET'"}'
curl -X POST localhost:5173/api/llm-txt-gen -d '{"variant": "llms-small", "auth": "'$LLM_GEN_SECRET'"}'

# Run quality checks
curl -X POST localhost:5173/api/llm-txt-eval -d '{"type": "full_suite", "auth": "'$LLM_GEN_SECRET'"}'
```

### A/B Testing Prompts

1. **Modify prompt** in `src/lib/server/llms.ts`
2. **Generate variant** with new prompt
3. **Run evals** to compare scores
4. **Keep better performing version**

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

## Troubleshooting

### Common Issues

**Generation fails with auth error:**

```bash
# Check environment variable
echo $LLM_GEN_SECRET
# Ensure it matches the auth value in requests
```

**Evaluation fails with "file not found":**

```bash
# Generate the variant first
curl -X POST localhost:5173/api/llm-txt-gen -d '{"variant": "llms-medium", "auth": "secret"}'
# Then run evaluation
```

**Poor evaluation scores:**

1. Review the detailed feedback in eval results
2. Adjust prompts in `src/lib/server/llms.ts`
3. Regenerate and re-evaluate
4. Iterate until scores improve

### File Locations

- **Generated files**: `static/llms-{variant}.txt`
- **Source files**: `src/copy/*.md`
- **Prompts**: `src/lib/server/llms.ts` → `VARIANT_PROMPTS`
- **Eval prompts**: `src/routes/api/llm-txt-eval/+server.ts` →
  `EVAL_PROMPTS`

## Future Enhancements

- **Automated regeneration** on source file changes
- **Performance metrics** (generation time, token usage)
- **Version tracking** for generated content
- **Webhook integration** for CI/CD pipelines
- **Custom eval criteria** for specific use cases
