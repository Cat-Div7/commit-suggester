import chalk from "chalk";
import { checkGitRepo } from "./git/checkRepo.js";
import { getDiff } from "./git/getDiff.js";
import { generate } from "./providers/index.js";
import { getKeys, addFallbackKey } from "./config/keys.js";
import { getModel } from "./config/models.js";
import { PROVIDERS } from "./constants.js";
import type { Provider } from "./constants.js";
import store from "./config/store.js";
import {
  promptCommitChoice,
  promptManualCommit,
  promptProvider,
} from "./ui/prompts.js";

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
    store.clear();
    console.log(chalk.yellow("\n  Config reset. Run sgt to start fresh.\n"));
    process.exit(0);
  }

  // --config
  if (flags.config) {
    const data = store.store as any;
    console.log(chalk.bold.white("\n  Current SGT config:\n"));
    console.log(chalk.dim(`  Provider : ${data.provider ?? "not set"}`));
    console.log(chalk.dim(`  Model    : ${JSON.stringify(data.model ?? {})}`));

    const keys = data.keys ?? {};
    for (const [p, val] of Object.entries(keys)) {
      const arr = Array.isArray(val) ? val : [val];
      const masked = (arr as string[]).map(
        (k) => k.slice(0, 6) + "..." + k.slice(-4),
      );
      console.log(chalk.dim(`  ${p} keys : ${masked.join(", ")}`));
    }
    console.log();
    process.exit(0);
  }

  console.log(chalk.bold.magenta("  Initializing SGT...\n"));

  await checkGitRepo();

  // --change-provider or no saved provider
  let provider = store.get("provider" as any) as Provider | undefined;
  if (!provider || flags.changeProvider) {
    provider = await promptProvider();
    store.set("provider" as any, provider);
  } else {
    console.log(chalk.dim(`  Provider : ${provider}`));
  }

  // --add-key
  if (flags.addKey) {
    await addFallbackKey(provider);
    process.exit(0);
  }

  // --change-model or --change-key
  const model = await getModel(provider, flags.changeModel);
  const keys = await getKeys(provider, flags.changeKey);

  console.log(chalk.dim(`  Model    : ${model}`));

  // Get staged diff
  const diff = await getDiff();

  // Generate suggestions
  const suggestions = await generate(provider, model, keys, diff);

  // Present suggestions
  const selectedMessage = await promptCommitChoice(suggestions);

  if (selectedMessage === "cancel") {
    console.log(chalk.yellow("\n  Commit cancelled.\n"));
    process.exit(0);
  }

  let finalMessage = selectedMessage;

  if (selectedMessage === "edit") {
    finalMessage = await promptManualCommit();
  }

  // Commit
  const { simpleGit } = await import("simple-git");
  const git = simpleGit();
  try {
    await git.commit(finalMessage);
    console.log(chalk.bold.green("\n  Committed successfully!"));
    console.log(chalk.gray(`  Message: "${finalMessage}"\n`));
  } catch (err: any) {
    console.log(chalk.red(`\n  Commit failed: ${err.message}\n`));
    process.exit(1);
  }
}
