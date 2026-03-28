#!/usr/bin/env node

import { welcome } from "./ui/welcome.js";
import { main } from "./main.js";

const args = process.argv.slice(2);

export const flags = {
  changeModel: args.includes("--change-model"),
  changeKey: args.includes("--change-key"),
  changeProvider: args.includes("--change-provider"),
  addKey: args.includes("--add-key"),
  reset: args.includes("--reset"),
  config: args.includes("--config"),
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
    sgt --help, -h           Show this help message
  `);
  process.exit(0);
}

(async () => {
  await welcome();
  await main(flags);
})();
