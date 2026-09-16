# Shared Svelte Testing Skill

Sveltest keeps its testing skill in `.agents/skills/svelte-testing/`,
using the [Agent Skills format](https://agentskills.io). The skill and
its reference files are shared rather than copied into each editor's
configuration directory.

## Devin Desktop (Formerly Windsurf)

Windsurf became Devin Desktop on June 2, 2026. Devin Desktop discovers
workspace skills in `.agents/skills/` and loads relevant skills based
on their description. You can also explicitly mention a skill in
Cascade.

### Setup

1. Copy this **entire directory**, including `SKILL.md` and
   `references/`, into your project's
   `.agents/skills/svelte-testing/`.
2. Open the project in Devin Desktop.
3. Ask for help writing or fixing Svelte tests, or mention
   `@svelte-testing` in Cascade to select the skill explicitly.

```text
.agents/skills/svelte-testing/
├── SKILL.md
├── README.md
└── references/
```

Do not copy only `SKILL.md`: its linked references provide the
detailed patterns. No editor-specific skill copy is needed. Keep
project-specific commands and conventions in `AGENTS.md`; they serve a
different purpose from the reusable testing skill.

Official references:
[Devin Desktop changelog](https://docs.devin.ai/desktop/changelog),
[skills](https://docs.devin.ai/desktop/cascade/skills), and
[AGENTS.md](https://docs.devin.ai/desktop/cascade/agents-md).

## Other Clients

Use this same directory with clients that discover `.agents/skills/`.
For Claude Code, this repository provides
`.claude/skills/svelte-testing` as a symlink to the shared directory.
Check your client's discovery settings rather than assuming every
client reads the same directories.
