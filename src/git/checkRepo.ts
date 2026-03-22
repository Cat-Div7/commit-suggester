import { simpleGit } from "simple-git";
import chalk from "chalk";

const git = simpleGit();

export async function checkGitRepo(): Promise<void> {
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.log(chalk.red("\n  Not a git repository."));
      console.log(chalk.gray('  Run "git init" first or navigate to a git project.\n'));
      process.exit(1);
    }
  } catch (err: any) {
    console.error(chalk.red("  Error checking git repository:"), err.message);
    process.exit(1);
  }
}