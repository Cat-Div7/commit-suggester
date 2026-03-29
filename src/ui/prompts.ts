import inquirer from "inquirer";
import chalk from "chalk";
import { PROVIDERS, OPENROUTER_MODELS } from "../constants.js";
import type { Provider } from "../constants.js";

export async function promptProvider(): Promise<Provider> {
  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message: "  Select a provider:",
      choices: PROVIDERS,
    },
  ]);
  return selected as Provider;
}

export async function promptOpenRouterModel(
  savedCustomModels: string[],
): Promise<string> {
  const allModels = [...OPENROUTER_MODELS, ...savedCustomModels];

  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message: "  Select an OpenRouter model:",
      choices: [
        ...allModels,
        new inquirer.Separator(),
        { name: "  Enter custom model", value: "__custom__" },
      ],
    },
  ]);

  return selected;
}

export async function promptCustomModel(): Promise<string> {
  const { customModel } = await inquirer.prompt([
    {
      type: "input",
      name: "customModel",
      message: "  Enter model name (e.g. org/model-name):",
      validate: (input) =>
        input.trim().length > 0 || "Model name cannot be empty.",
    },
  ]);
  return customModel.trim();
}

export async function promptSaveCustomModel(): Promise<boolean> {
  const { save } = await inquirer.prompt([
    {
      type: "confirm",
      name: "save",
      message: "  Save this model to your list for future runs?",
      default: true,
    },
  ]);
  return save;
}

export async function promptDefaultModel(
  provider: Provider,
  defaultModel: string,
): Promise<string> {
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: `  Use default model ${chalk.cyan(defaultModel)}?`,
      default: true,
    },
  ]);

  if (confirmed) return defaultModel;

  const { customModel } = await inquirer.prompt([
    {
      type: "input",
      name: "customModel",
      message: "  Enter model name:",
      validate: (input) =>
        input.trim().length > 0 || "Model name cannot be empty.",
    },
  ]);
  return customModel.trim();
}

export async function promptApiKey(provider: Provider): Promise<string> {
  const { apiKey } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: `  Enter your ${chalk.cyan(provider)} API key:`,
      validate: (input) =>
        input.trim().length > 0 || "API key cannot be empty.",
    },
  ]);
  return apiKey.trim();
}

export async function promptAddFallbackKey(): Promise<boolean> {
  const { addAnother } = await inquirer.prompt([
    {
      type: "confirm",
      name: "addAnother",
      message: "  Add a fallback key?",
      default: false,
    },
  ]);
  return addAnother;
}

export async function promptCommitChoice(
  suggestions: string[],
): Promise<string> {
  const { selectedMessage } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedMessage",
      message: "  Choose a commit message:",
      choices: [
        ...suggestions,
        new inquirer.Separator(),
        { name: "  Edit manually", value: "edit" },
        { name: "  Cancel", value: "cancel" },
      ],
    },
  ]);
  return selectedMessage;
}

export async function promptManualCommit(): Promise<string> {
  const { manualMessage } = await inquirer.prompt([
    {
      type: "input",
      name: "manualMessage",
      message: "  Enter your commit message:",
      validate: (input) =>
        input.trim().length > 0 || "Message cannot be empty.",
    },
  ]);
  return manualMessage.trim();
}
