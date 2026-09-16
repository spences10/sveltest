# Repository Conventions

- Use kebab-case filenames and snake_case project-owned variables and
  functions. Preserve framework-required filenames and external API
  names.
- Colocate tests with the code they exercise.
- Use the
  [shared testing skill](.agents/skills/svelte-testing/SKILL.md) for
  testing guidance. Do not duplicate it into editor-specific
  instructions or add legacy-client compatibility copies.
- Distinguish official framework defaults from this project's optional
  conventions when teaching or documenting them.
- Run relevant tests and `pnpm lint` after changes. Report failures
  and validation gaps; do not weaken assertions or skip failures to
  get a green result.

Keep agent instructions limited to durable, non-obvious decisions.
Discover commands, dependencies, configuration, and file layout from
their sources rather than maintaining inventories here. Put
specialized instructions in the narrowest applicable directory.
