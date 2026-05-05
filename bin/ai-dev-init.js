#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import prompts from "prompts";
import fs from "fs-extra";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const templatesDir = path.join(packageRoot, "templates");

const PROJECT_TYPES = [
  "backend",
  "frontend",
  "fullstack",
  "mcp-server",
  "data",
  "library",
  "other"
];

const SQL_HINTS = new Set([
  "sql",
  "database",
  "db",
  "azure-sql",
  "postgres",
  "mysql",
  "mssql"
]);

const FRONTEND_HINTS = new Set([
  "react",
  "next",
  "vue",
  "angular",
  "frontend",
  "typescript",
  "javascript"
]);

const BACKEND_HINTS = new Set([
  "dotnet",
  "csharp",
  "node",
  "express",
  "api",
  "backend",
  "java",
  "python",
  "mcp"
]);

const program = new Command();

program
  .name("create-ai-dev-kit")
  .description("Generate AI development instruction files for Codex, Copilot, and shared AI workflows.")
  .option("--project <name>", "project name")
  .option("--stack <comma-separated-list>", "tech stack, for example: dotnet,sql,mcp")
  .option("--type <type>", "project type")
  .option("--codex", "generate Codex AGENTS.md")
  .option("--copilot", "generate GitHub Copilot instructions")
  .option("--force", "overwrite existing files")
  .option("--dry-run", "print planned file operations without writing files")
  .parse(process.argv);

async function main() {
  const options = program.opts();
  const answers = await collectAnswers(options);
  const generationPlan = buildGenerationPlan(answers);
  const results = [];

  for (const item of generationPlan) {
    results.push(await writeTemplateFile(item, answers));
  }

  printSummary(results, answers);
}

async function collectAnswers(options) {
  const needsPrompt =
    !options.project ||
    !options.stack ||
    !options.type;

  const promptAnswers = needsPrompt
    ? await prompts(
        [
          !options.project
            ? {
                type: "text",
                name: "project",
                message: "Project name",
                initial: path.basename(process.cwd()),
                validate: (value) => (value.trim() ? true : "Project name is required.")
              }
            : null,
          !options.stack
            ? {
                type: "text",
                name: "stack",
                message: "Tech stack (comma separated)",
                initial: ""
              }
            : null,
          !options.type
            ? {
                type: "select",
                name: "type",
                message: "Project type",
                choices: PROJECT_TYPES.map((value) => ({ title: value, value }))
              }
            : null
        ].filter(Boolean),
        {
          onCancel: () => {
            process.exit(1);
          }
        }
      )
    : {};

  const project = (options.project ?? promptAnswers.project ?? path.basename(process.cwd())).trim();
  const stackInput = options.stack ?? promptAnswers.stack ?? "";
  const type = (options.type ?? promptAnswers.type ?? "other").trim();

  if (!PROJECT_TYPES.includes(type)) {
    console.error(`Invalid project type: ${type}`);
    console.error(`Allowed types: ${PROJECT_TYPES.join(", ")}`);
    process.exit(1);
  }

  const stack = normalizeStack(stackInput);
  const generateCodex = options.codex || (!options.codex && !options.copilot);
  const generateCopilot = options.copilot || (!options.codex && !options.copilot);

  return {
    project,
    projectType: type,
    stack,
    stackDisplay: stack.length ? stack.join(", ") : "not specified",
    dryRun: Boolean(options.dryRun),
    force: Boolean(options.force),
    generateCodex,
    generateCopilot
  };
}

function normalizeStack(value) {
  return [...new Set(
    value
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean)
  )];
}

function hasAny(stack, hints) {
  return stack.some((item) => hints.has(item));
}

function buildGenerationPlan(context) {
  const plan = [];

  if (context.generateCodex) {
    plan.push({
      template: "AGENTS.md.hbs",
      destination: "AGENTS.md"
    });
  }

  if (context.generateCopilot) {
    plan.push({
      template: "copilot-instructions.md.hbs",
      destination: path.join(".github", "copilot-instructions.md")
    });
  }

  if (hasAny(context.stack, SQL_HINTS)) {
    plan.push({
      template: "sql.instructions.md.hbs",
      destination: path.join(".github", "instructions", "sql.instructions.md")
    });
  }

  if (hasAny(context.stack, BACKEND_HINTS)) {
    plan.push({
      template: "backend.instructions.md.hbs",
      destination: path.join(".github", "instructions", "backend.instructions.md")
    });
  }

  if (hasAny(context.stack, FRONTEND_HINTS)) {
    plan.push({
      template: "frontend.instructions.md.hbs",
      destination: path.join(".github", "instructions", "frontend.instructions.md")
    });
  }

  plan.push({
    template: "tests.instructions.md.hbs",
    destination: path.join(".github", "instructions", "tests.instructions.md")
  });

  for (const name of [
    "project-context.md",
    "task-brief-template.md",
    "review-checklist.md",
    "verification-plan.md",
    "common-prompts.md"
  ]) {
    plan.push({
      template: `${name}.hbs`,
      destination: path.join("docs", "ai", name)
    });
  }

  return plan;
}

async function writeTemplateFile(item, context) {
  const destinationPath = path.join(process.cwd(), item.destination);
  const exists = await fs.pathExists(destinationPath);

  if (exists && !context.force) {
    return { status: "skipped", path: item.destination };
  }

  if (context.dryRun) {
    return { status: exists ? "would overwrite" : "would create", path: item.destination };
  }

  const templatePath = path.join(templatesDir, item.template);
  const templateSource = await fs.readFile(templatePath, "utf8");
  const template = Handlebars.compile(templateSource, { noEscape: true });
  const output = template(buildTemplateContext(context));

  await fs.ensureDir(path.dirname(destinationPath));
  await fs.writeFile(destinationPath, output, "utf8");

  return { status: exists ? "overwritten" : "created", path: item.destination };
}

function buildTemplateContext(context) {
  return {
    projectName: context.project,
    projectType: context.projectType,
    stackList: context.stack.length ? context.stack.join(", ") : "Not specified",
    stackBullets: context.stack.length ? context.stack.map((item) => `- ${item}`).join("\n") : "- Add project stack details here"
  };
}

function printSummary(results, context) {
  const created = results.filter((item) => item.status === "created" || item.status === "overwritten");
  const skipped = results.filter((item) => item.status === "skipped");
  const planned = results.filter((item) => item.status === "would create" || item.status === "would overwrite");

  console.log("");
  console.log(context.dryRun ? "Dry run summary" : "Generation summary");
  console.log(`Project: ${context.project}`);
  console.log(`Type: ${context.projectType}`);
  console.log(`Stack: ${context.stackDisplay}`);
  console.log("");

  if (context.dryRun) {
    console.log("Files that would be created:");
    for (const item of planned.filter((entry) => entry.status === "would create")) {
      console.log(`- ${item.path}`);
    }
    const wouldOverwrite = planned.filter((entry) => entry.status === "would overwrite");
    if (wouldOverwrite.length) {
      console.log("");
      console.log("Files that would be overwritten with --force:");
      for (const item of wouldOverwrite) {
        console.log(`- ${item.path}`);
      }
    }
  } else {
    console.log("Created files:");
    if (created.length) {
      for (const item of created) {
        console.log(`- ${item.path}`);
      }
    } else {
      console.log("- none");
    }
  }

  console.log("");
  console.log("Skipped files:");
  if (skipped.length) {
    for (const item of skipped) {
      console.log(`- ${item.path}`);
    }
  } else {
    console.log("- none");
  }

  console.log("");
  console.log("Next steps:");
  console.log("- Review the generated instructions and tailor the placeholders to your repo.");
  console.log("- Commit the files once the guidance matches your team workflow.");
  if (context.dryRun) {
    console.log("- Re-run without --dry-run to write the files.");
  } else if (!context.force) {
    console.log("- Re-run with --force if you need to overwrite existing instruction files.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
