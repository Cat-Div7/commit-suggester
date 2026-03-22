import { simpleGit } from "simple-git";
import chalk from "chalk";
import ora from "ora";

const git = simpleGit();

export async function getDiff(): Promise<string> {
  const status = await git.status();

  if (status.staged.length === 0) {
    console.log(chalk.yellow("\n  No staged changes found."));
    console.log(chalk.gray('  Stage your changes with "git add <file>" first.\n'));
    process.exit(0);
  }

  const fileDiffs: { file: string; diff: string }[] = [];

  for (const file of status.staged) {
    const spinner = ora(`  Reading ${chalk.cyan(file)}...`).start();
    const diff = await git.diff(["--cached", file]);
    fileDiffs.push({ file, diff });
    spinner.succeed(chalk.green(`  ${file} analyzed`));
  }

  return fileDiffs
    .map((f) => `File: ${f.file}\nDiff:\n${f.diff}`)
    .join("\n\n");
}