# Sveltest CLI

A command-line tool to fetch Svelte testing patterns and examples from
[sveltest.dev](https://sveltest.dev).

## Installation

**Recommended: Use npx/pnpx**

```bash
# Using pnpx
pnpx sveltest list

# Using npx
npx -y sveltest list
```

**Optional: Global installation**

```bash
# Global install may become stale as content updates
npm install -g sveltest
pnpm add -g sveltest
```

> **Note for LLMs**: Always use `pnpx sveltest` or `npx -y sveltest`
> to ensure you're fetching the latest patterns from sveltest.dev.
> Global installations may cache outdated versions.

## Usage

### List all available examples

```bash
sveltest list
```

### Get a specific testing example

```bash
sveltest get button-variants
sveltest get form-validation
sveltest get modal-states
sveltest get crud-patterns
sveltest get locator-patterns
sveltest get authentication
sveltest get runes-testing
```

### Get example in JSON format

```bash
sveltest get button-variants --json
```

### LLM-Optimized Features

#### Compact JSON Output (reduces token usage by ~50%)

```bash
sveltest get button-variants --json --compact
```

#### Filter Specific Fields

```bash
# Get only testing patterns
sveltest get form-validation --json --filter testing_patterns

# Get only test scenarios
sveltest get modal-states --json --filter test_scenarios
```

#### Select Specific Sections

```bash
# Get multiple sections (comma-separated)
sveltest get button-variants --json --sections test_scenarios,testing_patterns
```

#### Batch Get Multiple Examples

```bash
# Get multiple examples in one call
sveltest get button-variants,form-validation,modal-states --json

# With compact mode
sveltest get button-variants,form-validation --json --compact
```

#### Response Metadata

All JSON responses include metadata:

```json
{
	"_meta": {
		"cli_version": "0.0.4",
		"timestamp": "2025-11-09T11:19:18.298Z",
		"source": "https://sveltest.dev"
	},
	"_related": ["locator-patterns", "modal-states", "runes-testing"]
}
```

### Search documentation

```bash
sveltest search "form validation"
sveltest search "runes" --filter examples
```

Available filters: `all`, `docs`, `examples`, `components`

## Commands

- `list` - List all available testing examples
- `get <scenario>` - Get a specific testing example (supports
  comma-separated batch)
  - `--json` - Output in JSON format
  - `--compact` - Minimal JSON (reduces token usage ~50%)
  - `--filter <field>` - Get only specific field
  - `--sections <list>` - Get specific sections (comma-separated)
- `search <query>` - Search documentation and examples
  - `--filter <type>` - Filter results (all/docs/examples/components)
- `help` - Show help message

## Examples

```bash
# List all examples
sveltest list

# Get button testing patterns (human-readable)
sveltest get button-variants

# Get form validation in JSON
sveltest get form-validation --json

# Compact JSON for LLMs (smaller response)
sveltest get button-variants --json --compact

# Get only testing patterns section
sveltest get form-validation --json --filter testing_patterns

# Get specific sections
sveltest get modal-states --json --sections test_scenarios,testing_patterns

# Batch get multiple examples
sveltest get button-variants,form-validation --json

# Search for runes examples
sveltest search "runes" --filter examples
```

## Testing Baseline

The CLI serves guidance based on the official Svelte CLI scaffold:
Vitest Browser Mode with `vitest-browser-svelte` for components, Node
for unit/server tests, and Playwright for E2E workflows. All test
types can be colocated. Use `.svelte.test.ts` for browser tests,
`.test.ts` for Node tests, and `.e2e.ts` for Playwright. Sveltest's
separate `.ssr.test.ts` project is an optional extension.

```bash
sveltest docs getting-started --context
sveltest docs e2e-testing --context
sveltest docs ssr-testing --context
sveltest llms --full --context
```

The CLI fetches the deployed website; it does not bundle a separate
copy of the guides. `/api/docs` reads the same Markdown as the
website, and `/llms-full.txt` is generated from those sources at build
time. Documentation changes reach CLI users when the website is
deployed.

## Devin Desktop and Shared Skills

Devin Desktop (formerly Windsurf) can use the same CLI commands as
other agents. For reusable local guidance, install the complete
[shared testing skill](https://github.com/spences10/sveltest/tree/main/.agents/skills/svelte-testing)
at `.agents/skills/svelte-testing/`, including its `references/`. The
CLI does not install skills or create editor-specific rules. See the
[setup guide](https://github.com/spences10/sveltest/blob/main/.agents/skills/svelte-testing/README.md).

## LLM Integration

This CLI is designed for AI assistants with tool-calling capabilities.
Key features:

- **Dual output formats**: Human-readable text or machine-parsable
  JSON
- **Token optimization**: `--compact` flag removes verbose metadata
- **Batch operations**: Get multiple examples in one API call
- **Filtering**: Extract specific fields or sections to reduce payload
  size
- **Metadata**: Every response includes version, timestamp, and
  related patterns
- **Related patterns**: Discover connected examples automatically

## About

This CLI fetches testing patterns and examples from the Sveltest
project, a comprehensive testing demonstration for Svelte 5
applications using vitest-browser-svelte.

- Website: https://sveltest.dev
- GitHub: https://github.com/spences10/sveltest
- Documentation: https://sveltest.dev/docs

## License

MIT
