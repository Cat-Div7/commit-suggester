#!/usr/bin/env node

import { welcomeFull, welcomeBar } from "./ui/welcome.js";
import { main } from "./main.js";
import { flags, args } from "./cli/flags.js";
import { showHelp } from "./cli/help.js";
import store from "./config/store.js";
import chalk from "chalk";

if (args.includes("--help") || args.includes("-h")) {
  showHelp();
  process.exit(0);
}

// TODO: Prevent multiple flags
(async () => {
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
