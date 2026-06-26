# CopilotQuarantineZone Workspace

Multi-repo workspace containing independent projects. Each subdirectory is its own git repo (or standalone project folder).

## Coding
Never ever ever add any fallbacks to code that hides or disguises errors unless the user has explicitly requested it. If an operation fails, it should fail loudly and clearly so the user can understand what went wrong and fix it. Don't catch exceptions without re-throwing them, don't return null or empty values on failure, and don't add generic error messages that obscure the root cause. Always prioritize transparency and debuggability over "smooth" failure handling.

When adding fixes from comments - you don't need to add the source of the comment (i.e. GitOps PR Assistant)

## Demos and developing
When making a demo or testing that requires creating or using resources - never, ever delete any resources when cleaning up

## Testing
When testing and adding fake urls - use a local host url, never use a random url as that could lead to security concerns

## Doing work
Most project have a docs folder with a journal and a future features md. Journal is used to save notes, thoughts, and progress on the project - it is not meant for polished documentation, but rather a place to dump information that may be useful later. Future features is a place to keep track of future features the user requests for features that are suggested by you to the user but are deferred by the user. Features should not be automatically added there without user approval, but if the user approves a feature but does not want it implemented right now, it can be added to the future features md for tracking. When working on a project, you should regularly update the journal with notes on what you have done, what you are currently working on, and any thoughts or ideas you have. This will help you keep track of your progress and also provide a record of your work that you can refer back to later. When a task or feature is completed, you should also update the journal with a summary of what was done and any important details. This will help you remember the work you have done and also provide context for future work on the project. Update the future features when a feature is completed as well. If a future feature is completed, it can be removed from the future features md and added to the journal with a note on when it was completed and any relevant details. This will help you keep track of what features have been implemented and when, as well as provide a record of your work for future reference.

## Python Environment Rules

- **Always use a venv.** Every Python subproject has its own local `venv/` and `requirements.txt`. Always create/activate the project venv first.
- **Never install packages globally.** No global pip installs, no global npm installs — everything must go into the project-local environment.
- **Ask before installing any packages.** Do not install new pip packages, npm packages, or any other dependencies without asking the user first. Even seemingly harmless packages like linters or formatters must be approved.
- **Check requirements.txt first.** If the package is already listed, just install from requirements.txt. If it's new, you must ask.
- **Python 3.12 is required** for ML projects. Python 3.13+ has PyTorch DLL compatibility issues on Windows.
- **PyTorch 2.5.1+cu124** is the tested working configuration. Do not upgrade PyTorch — 2.10+ fails with DLL errors on Windows.
- **Venvs must NOT be inside OneDrive-synced folders** — causes DLL loading failures.

## Pull Requests
- **Always create new branches as users/rfortuna/feature-name.** Don't commit directly to main or create branches with generic names.
- **Use descriptive PR titles and descriptions.** The title should summarize the change, and the description should explain the why and any important details. Don't leave the description blank.
- **Don't include "Co-authored by Copilot" in commit messages.** Copilot

## Tool Usage Best Practices

### File Operations
- **Always use `edit` for existing files.** Never use `create` on a file that already exists — it will fail with "Path already exists". Check first or use `edit`.
- **Re-read before editing.** If a previous `edit` failed with "No match found" or "Multiple matches found", the file contents don't match. Use `view` to re-read the current content, then retry with the updated `old_str`.
- **Verify paths before accessing.** Use `glob` to confirm a file exists before calling `view` or `grep` on it. Don't guess paths.

### Shell Commands
- **Always verify venv is activated** in the same command chain before running pip, python, or pytest. Chain with `&&`:
  ```
  .\venv\Scripts\activate && pip install -r requirements.txt
  ```
- **Use `--quiet` or `--no-pager` for long-running commands.** Long verbose output causes the user to kill the session. Suppress unnecessary output.
- **Don't reuse expired shell sessions.** If `read_powershell` fails, start a new powershell session instead of retrying the old shellId.
- **Use `Stop-Process -Id <PID>` not `Stop-Process -Name`.** Name-based process killing is blocked.

### Web Fetching
- **Unless user provides URL or is part of tool, do not use**

### Grep/Search
- **Use correct ripgrep file type names.** `rg` does not accept `jsx` as a file type — use `js` instead. Compound types like `py,bicep,astro` are not valid — make separate calls or use glob patterns.

### Retry Behavior
- **Do not retry the same failing operation more than twice.** If `edit`, `grep`, or `powershell` fails twice in a row with the same error, stop and either:
  1. Re-read the source file (for edit failures)
  2. Try a different approach (for command failures)
  3. Ask the user for guidance

## Session Efficiency

- **Batch related file reads.** When you need to read multiple files, call `view` for all of them in parallel in a single response — not one per turn.
- **Don't repeat yourself.** If an explore agent or grep already returned the answer, use that information. Don't call the same tool again for information you already have.
- **Minimize powershell round-trips.** Chain related commands with `&&` instead of separate powershell calls. One `cd dir && activate && pip install` is better than three separate calls.

## Screenshots

When asked to "take a screenshot", "screenshot and check", or similar — use the `screen-look` skill for a standard screenshot. Do NOT use OmniParser unless explicitly asked for element detection or UI parsing.

## Adding Dependencies

Before introducing a new library or tool not already used in the project, ask the user first. Prefer technologies already in use in the codebase. If suggesting something new, briefly explain what it is and why.

## Committing

Do not include Co-authored by Copilot in commit messages.

## Coding
Never ever ever add any fallbacks to code that hides or disguises errors unless the user has explicitly requested it. If an operation fails, it should fail loudly and clearly so the user can understand what went wrong and fix it. Don't catch exceptions without re-throwing them, don't return null or empty values on failure, and don't add generic error messages that obscure the root cause. Always prioritize transparency and debuggability over "smooth" failure handling.

## Demos and developing
When making a demo or testing that requires creating or using resources - never, ever delete any resources when cleaning up