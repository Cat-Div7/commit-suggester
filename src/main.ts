import chalk from "chalk";
import { checkGitRepo } from "./git/checkRepo.js";
import { getDiff } from "./git/getDiff.js";

export interface Flags {
  changeModel: boolean;
  changeKey: boolean;
  changeProvider: boolean;
  addKey: boolean;
  reset: boolean;
  config: boolean;
}

export async function main(flags: Flags): Promise<void> {
  // --reset
  if (flags.reset) {
    const store = (await import("./config/store.js")).default;
    store.clear();
    console.log(chalk.yellow("\n  Config reset. Run sgt to start fresh.\n"));
    process.exit(0);
  }

  // --config
  if (flags.config) {
    const store = (await import("./config/store.js")).default;
    console.log(chalk.bold.white("\n  Current config:\n"));
    console.log(chalk.dim(JSON.stringify(store.store, null, 2)));
    process.exit(0);
  }

  console.log(chalk.bold.magenta("  Initializing SGT...\n"));

  await checkGitRepo();
  const diff = await getDiff();

  console.log(chalk.dim("\n  diff is ready — generation coming soon \n"));
}