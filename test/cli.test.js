import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(testDir, "..", "bin", "ai-dev-init.js");

function createTarget() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ai-dev-kit-"));
}

function runCli(cwd, extraArgs = []) {
  return execFileSync(
    process.execPath,
    [
      cliPath,
      "--project",
      "Test Project",
      "--stack",
      "node,sql,react",
      "--type",
      "fullstack",
      ...extraArgs
    ],
    { cwd, encoding: "utf8" }
  );
}

test("generates durable project context and scoped Copilot instructions", () => {
  const target = createTarget();

  try {
    runCli(target);

    for (const name of [
      "project-context.md",
      "decisions.md",
      "current-state.md",
      "open-questions.md"
    ]) {
      assert.equal(fs.existsSync(path.join(target, "docs", "ai", name)), true);
    }

    const sqlInstructions = fs.readFileSync(
      path.join(target, ".github", "instructions", "sql.instructions.md"),
      "utf8"
    );
    assert.match(sqlInstructions, /^---\napplyTo: "\*\*\/\*\.sql"\n---/);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test("protects accumulated project knowledge unless force-context is explicit", () => {
  const target = createTarget();
  const decisionPath = path.join(target, "docs", "ai", "decisions.md");

  try {
    runCli(target);
    fs.writeFileSync(decisionPath, "team decision\n", "utf8");

    const forceOutput = runCli(target, ["--force"]);
    assert.equal(fs.readFileSync(decisionPath, "utf8"), "team decision\n");
    assert.match(forceOutput, /Project knowledge files were preserved/);

    runCli(target, ["--force", "--force-context"]);
    assert.match(fs.readFileSync(decisionPath, "utf8"), /^# Decision Log/);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

