# @sveltest/website

## 0.0.2

### Patch Changes

- 9c8240a: Extract Svelte 5 runes testing patterns into dedicated
  documentation file
- 6c235d4: Add command palette for site-wide search (Cmd+K)
  - Native dialog element with DaisyUI styling
  - Remote function for server-side search
  - Keyboard navigation (arrows, enter, escape)
  - Grouped results by type (docs, examples, components)
  - Recent searches tracking

- 1c682a5: Add context testing documentation for wrapper component
  patterns with vitest-browser-svelte
- 519a194: Update docs navigation with grouped categories
  - Restructure topics.ts with category-based organization
  - Add topic_categories export for grouped navigation
  - Update docs page to display grouped navigation with category
    headers
  - Update test mock data to match new structure

- 5238f8f: Add remote functions testing documentation
