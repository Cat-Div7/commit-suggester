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

export { args };
