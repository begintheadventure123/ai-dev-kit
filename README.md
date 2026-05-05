# create-ai-dev-kit

`create-ai-dev-kit` is an npm initializer that generates practical AI development instruction files for Codex, GitHub Copilot, and shared AI-assisted coding workflows. It creates a lightweight instruction set you can commit into any repository to improve task briefs, reviews, validation, and contributor guidance.

## Install And Use

Run it with the npm initializer flow:

```bash
npm create ai-dev-kit@latest
```

Or run it directly with `npx`:

```bash
npx create-ai-dev-kit@latest
```

You can also pass arguments non-interactively:

```bash
npx create-ai-dev-kit@latest --project "PO Intelligence MCP" --stack "dotnet,sql,mcp,codex,copilot" --type mcp-server
```

## What It Generates

```text
AGENTS.md
.github/
  copilot-instructions.md
  instructions/
    sql.instructions.md
    backend.instructions.md
    frontend.instructions.md
    tests.instructions.md
docs/
  ai/
    project-context.md
    task-brief-template.md
    review-checklist.md
    verification-plan.md
    common-prompts.md
```

Conditional files:
- `AGENTS.md` is generated when Codex output is enabled.
- `.github/copilot-instructions.md` is generated when Copilot output is enabled.
- `sql.instructions.md` is generated only when the stack includes a SQL/database hint.
- `backend.instructions.md` is generated when the stack includes a backend hint.
- `frontend.instructions.md` is generated when the stack includes a frontend hint.
- `tests.instructions.md` and all `docs/ai/*` files are always generated.

## CLI Options

```bash
create-ai-dev-kit --project <name> --stack <comma-separated-list> --type <type> [--codex] [--copilot] [--force] [--dry-run]
```

Options:
- `--project <name>`: Project name used in the generated templates.
- `--stack <list>`: Comma-separated stack tags used to decide which instruction files to create.
- `--type <type>`: One of `backend`, `frontend`, `fullstack`, `mcp-server`, `data`, `library`, `other`.
- `--codex`: Generate `AGENTS.md`.
- `--copilot`: Generate `.github/copilot-instructions.md`.
- `--force`: Overwrite existing files instead of skipping them.
- `--dry-run`: Show what would be created without writing files.

Default behavior:
- If neither `--codex` nor `--copilot` is passed, the CLI generates both.
- Existing files are skipped unless `--force` is used.
- Missing directories are created automatically.

## Examples

```bash
npm create ai-dev-kit@latest
npx create-ai-dev-kit@latest
npx create-ai-dev-kit@latest --project "PO Intelligence MCP" --stack "dotnet,sql,mcp,codex,copilot" --type mcp-server
node ./bin/ai-dev-init.js --dry-run
```

## Local Development

```bash
npm install
npm run dry-run
npm link
```

See [docs/local-testing.md](./docs/local-testing.md) for a full local test workflow.

## Publishing

See [docs/publishing.md](./docs/publishing.md) for publish steps, package name caveats, and a scoped fallback option.

## License

MIT. See [LICENSE](./LICENSE).
