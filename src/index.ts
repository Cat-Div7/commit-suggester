#!/usr/bin/env node

import { welcomeFull, welcomeBar } from "./ui/welcome.js";
import { main } from "./main.js";
import store from "./config/store.js";
import chalk from "chalk";

const args = process.argv.slice(2);

export const flags = {
  changeModel: args.includes("--change-model"),
  changeKey: args.includes("--change-key"),
  changeProvider: args.includes("--change-provider"),
  addKey: args.includes("--add-key"),
  reset: args.includes("--reset"),
  config: args.includes("--config"),
  autoCommit: args.includes("--auto-commit"),
  toggleWelcome: args.includes("--toggle-welcome"),
};

// TODO: add --help flag to show usage instructions in readme file and welcome.ts file
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  SGT — Smart Git Commit Tool

  Usage:
    sgt                      Run with saved provider, model, and keys
    sgt --change-model       Re-select model for current provider
    sgt --change-key         Re-enter API key for current provider
    sgt --change-provider    Re-select provider
    sgt --add-key            Add a fallback key for current provider
    sgt --reset              Clear all saved config
    sgt --config             Show current saved config
    sgt --auto-commit         Auto pick best suggestion and commit
    sgt --toggle-welcome      Toggle the GIT HAPPENS header on/off
    sgt --help, -h           Show this help message
  `);
  process.exit(0);
}

(async () => {
  // --toggle-welcome
  if (flags.toggleWelcome) {
    const current = store.get("showWelcome" as any) ?? true;
    store.set("showWelcome" as any, !current);
    console.log(
      chalk.yellow(
        `\n  GIT HAPPENS header is now ${!current ? "enabled" : "disabled"}.\n`,
      ),
    );
    process.exit(0);
  }

  const showWelcome = store.get("showWelcome" as any) ?? true;
  const isFullWelcome =
    showWelcome && (args.length === 0 || args.includes("--auto-commit"));

  isFullWelcome ? await welcomeFull() : await welcomeBar();
  await main(flags);
})();
