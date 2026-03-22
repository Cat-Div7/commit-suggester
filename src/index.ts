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

(async () => {
  await welcome();
  await main(flags);
})();