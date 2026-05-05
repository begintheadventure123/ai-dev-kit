# Local Testing

## Install Dependencies

```bash
cd /path/to/create-ai-dev-kit
npm install
```

## Link The CLI Locally

```bash
npm link
```

## Create A Temporary Target Repo

```bash
mkdir -p /tmp/ai-dev-kit-sandbox
cd /tmp/ai-dev-kit-sandbox
git init
```

## Run The Initializer

From the temp repo, run:

```bash
create-ai-dev-kit --project "Sandbox Repo" --stack "node,sql,react" --type fullstack
```

## Test Dry-Run Mode

```bash
create-ai-dev-kit --project "Sandbox Repo" --stack "node,sql,react" --type fullstack --dry-run
```

Verify that the command prints planned files and does not write anything new.

## Test Force Mode

Run the initializer once, then run it again with force:

```bash
create-ai-dev-kit --project "Sandbox Repo" --stack "node,sql,react" --type fullstack --force
```

Verify that existing files are overwritten only when `--force` is present.
