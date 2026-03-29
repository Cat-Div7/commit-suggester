import chalk from "chalk";

export function showHelp(): void {
  console.log(`
  ${chalk.bold.white("SGT — Smart Git Commit Tool")}

  ${chalk.gray("Usage:")}
    ${chalk.cyan("sgt")}                       Run with saved provider, model, and keys
    ${chalk.cyan("sgt --change-model")}        Re-select model for current provider
    ${chalk.cyan("sgt --change-key")}          Re-enter API key for current provider
    ${chalk.cyan("sgt --change-provider")}     Re-select provider
    ${chalk.cyan("sgt --add-key")}             Add a fallback key for current provider
    ${chalk.cyan("sgt --reset")}               Clear all saved config
    ${chalk.cyan("sgt --config")}              Show current saved config
    ${chalk.cyan("sgt --auto-commit")}         Auto pick best suggestion and commit
    ${chalk.cyan("sgt --toggle-welcome")}      Toggle the GIT HAPPENS header on/off
    ${chalk.cyan("sgt --help, -h")}            Show this help message
  `);
}
