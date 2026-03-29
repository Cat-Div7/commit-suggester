import figlet from "figlet";
import chalk from "chalk";
import { createRequire } from "module";
import { terminalLink } from "../utils/terminalLink";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const renderFiglet = (text: string, font: string): Promise<string> =>
  new Promise((resolve, reject) => {
    figlet.text(text, { font }, (err, result) => {
      if (err) reject(err);
      else resolve(result || "");
    });
  });

export async function welcome(): Promise<void> {
  const [line1] = await Promise.all([
    renderFiglet("GIT HAPPENS", "ANSI Shadow"),
    // renderFiglet("-- but not today --", "Small"),
  ]);

  console.clear();
  console.log("\n");
  console.log(chalk.bold.yellow(line1));
  // console.log(chalk.dim.yellow(line2));

  const width = 62;
  const divider = chalk.yellow("─".repeat(width));
  const githubLink = terminalLink("Omar Ashraf", "https://github.com/Cat-Div7");

  console.log("\n" + divider);
  console.log(
    chalk.bold.white("  SGT") +
      chalk.gray("  ·  Smart Git Commit Tool  ·  ") +
      chalk.yellow("AI-Powered"),
  );
  console.log(chalk.gray("  Claude  ·  OpenRouter  ·  Gemini  ·  Ollama"));
  console.log(
    chalk.dim(`  v${version}`) +
      chalk.dim("  ·  by  ·  ") +
      chalk.yellow(githubLink),
  );
  console.log(divider + "\n");
}