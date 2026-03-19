#!/usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import pkg from "../package.json" with { type: "json" };
const { version } = pkg;

function terminalLink(text: string, url: string) {
  return `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`;
}

const renderFiglet = (text: string, font: string) =>
  new Promise<string>((resolve, reject) => {
    figlet.text(text, { font }, (err, result) => {
      if (err) reject(err);
      else resolve(result || "");
    });
  });

export async function welcome() {
  const [line1, line2] = await Promise.all([
    renderFiglet("GIT HAPPENS", "ANSI Shadow"),
    renderFiglet("-- but not today --", "Small"),
  ]);

  console.clear();
  console.log("\n");
  console.log(chalk.bold.yellow(line1));
  console.log(chalk.dim.yellow(line2));

  const width: number = 62;
  const divider: string = chalk.yellow("─".repeat(width));
  const githubLink: string = terminalLink(
    "Omar Ashraf",
    "https://github.com/Cat-Div7",
  );

  console.log("\n" + divider);
  console.log(
    chalk.bold.white("  SGT") +
      chalk.gray("  ·  Smart Git Commit Tool  ·  ") +
      chalk.yellow("AI-Powered"),
  );
  console.log(chalk.gray("  Claude  ·  Openrouter  ·  Gemini  ·  Ollama"));
  console.log(
    chalk.dim(`  v${version}`) +
      chalk.dim("  ·  by  ·  ") +
      chalk.yellow(githubLink),
  );
  console.log(divider + "\n");
}

welcome();
