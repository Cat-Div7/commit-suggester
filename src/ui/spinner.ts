import ora from "ora";
import type { Ora } from "ora";
import chalk from "chalk";

export function createSpinner(text: string): Ora {
  return ora(chalk.blue(text)).start();
}

export function succeedSpinner(spinner: Ora, text: string): void {
  spinner.succeed(chalk.green(text));
}

export function failSpinner(spinner: Ora, text: string): void {
  spinner.fail(chalk.red(text));
}

export function warnSpinner(spinner: Ora, text: string): void {
  spinner.warn(chalk.yellow(text));
}