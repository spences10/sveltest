# Sveltest CLI

A command-line tool to fetch Svelte testing patterns and examples from
[sveltest.dev](https://sveltest.dev).

## Installation

```bash
# Using npx (no installation required)
npx sveltest list

# Or install globally
npm install -g sveltest

# Or with pnpm
pnpm add -g sveltest
```

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

### Search documentation

```bash
sveltest search "form validation"
sveltest search "runes" --filter examples
```

Available filters: `all`, `docs`, `examples`, `components`

## Commands

- `list` - List all available testing examples
- `get <scenario>` - Get a specific testing example
  - `--json` - Output in JSON format
- `search <query>` - Search documentation and examples
  - `--filter <type>` - Filter results (all/docs/examples/components)
- `help` - Show help message

## Examples

```bash
# List all examples
sveltest list

# Get button testing patterns
sveltest get button-variants

# Get form validation in JSON
sveltest get form-validation --json

# Search for runes examples
sveltest search "runes" --filter examples
```

## About

This CLI fetches testing patterns and examples from the Sveltest
project, a comprehensive testing demonstration for Svelte 5
applications using vitest-browser-svelte.

- Website: https://sveltest.dev
- GitHub: https://github.com/spences10/sveltest
- Documentation: https://sveltest.dev/docs

## License

MIT
