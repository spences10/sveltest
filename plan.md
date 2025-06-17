# Simplified LLMs.txt + AI Rules Generation Plan

## Current State Analysis

- Over-engineered with 13+ prompt variants that don't follow llms.txt
  standard
- Need: Simple `/llms.txt` + `/llms-full.txt` + AI rules generation

## Goals

1. **Follow llms.txt standard properly** - Single `/llms.txt` file
2. **Generate AI rules files** - For Cursor/Windsurf (6000 char max)
3. **Use Anthropic SDK** - Programmatic generation with evaluation

## Phase 1: Cleanup & Simplify

- [ ] Delete all prompt files except core ones
- [ ] Create proper `/llms.txt` following standard
- [ ] Create `/llms-full.txt` (expanded version)
- [ ] Clean up static files

## Phase 2: AI Rules Generator

- [ ] Node.js script using Anthropic SDK
- [ ] Prompt for generating AI rules from documentation
- [ ] Evaluation prompt for rules quality
- [ ] Character limit enforcement (6000 max)
- [ ] Output: `.cursorrules` and `.windsurfrules` files

## File Structure

```
/
├── llms.txt                    # Standard compliant
├── llms-full.txt              # Expanded version
├── scripts/
│   ├── generate-ai-rules.js   # Anthropic SDK script
│   ├── prompts/
│   │   ├── ai-rules.md        # Rules generation prompt
│   │   └── eval-ai-rules.md   # Rules evaluation prompt
│   └── package.json           # Dependencies
├── .cursorrules               # Generated AI rules
└── .windsurfrules             # Generated AI rules
```

## Implementation Details

### AI Rules Generator Features

- Read existing documentation
- Generate rules for Svelte 5 + vitest-browser-svelte testing
- Enforce 6000 character limit
- Include evaluation and scoring
- Support both Cursor and Windsurf formats

### Technology Stack

- Node.js + Anthropic SDK
- Markdown processing
- File system operations
- Character counting and truncation

## Success Criteria

- [ ] Single `/llms.txt` follows standard
- [ ] AI rules under 6000 characters
- [ ] Rules work in Cursor/Windsurf
- [ ] Automated generation + evaluation
- [ ] Clean, maintainable codebase
