# Publishing

## Before You Publish

- Confirm the package name `create-ai-dev-kit` is available on npm.
- Check `package.json` version, README links, and published file list.
- Make sure no secrets, tokens, `.env` files, or private notes are present in the package.

## Login

```bash
npm login
```

## Dry-Run Publish

```bash
npm publish --dry-run
```

Review the output carefully to confirm only the intended files are included.

## Publish

```bash
npm publish
```

## Use After Publish

```bash
npm create ai-dev-kit@latest
npx create-ai-dev-kit@latest
```

## Package Name Availability

If `create-ai-dev-kit` is already taken, publish a scoped fallback instead:

```bash
npm publish --access public
```

Example scoped name:

```text
@yourname/create-ai-dev-kit
```

Consumers would then run:

```bash
npx @yourname/create-ai-dev-kit@latest
```
