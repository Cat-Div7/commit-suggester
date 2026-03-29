import chalk from "chalk";
import inquirer from "inquirer";
import store from "./store.js";
import {
  OPENROUTER_MODELS,
  DEFAULT_MODELS,
  OPENROUTER_MODELS_URL,
} from "../constants.js";
import type { Provider } from "../constants.js";
import { terminalLink } from "../ui/welcome.js";

export async function getModel(
  provider: Provider,
  forceNew = false,
): Promise<string> {
  const savedModel: string | undefined = store.get(`model.${provider}` as any);

  if (savedModel && !forceNew) {
    return savedModel;
  }

  let model: string;

  if (provider === "OpenRouter") {
    const savedCustomModels: string[] =
      store.get("customModels.OpenRouter" as any) ?? [];

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

    if (selected === "__custom__") {
      console.log(
        chalk.dim("\n  Browse models at ") +
          chalk.cyan(
            terminalLink("openrouter.ai/models", OPENROUTER_MODELS_URL),
          ),
      );
      console.log(
        chalk.dim(
          "  Copy the exact model ID — e.g. google/gemma-3-4b-it:free\n",
        ),
      );

      const { customModel } = await inquirer.prompt([
        {
          type: "input",
          name: "customModel",
          message: "  Enter model name (e.g. org/model-name):",
          validate: (input) =>
            input.trim().length > 0 || "Model name cannot be empty.",
        },
      ]);

      model = customModel.trim();

      // Ask if user wants to save custom model to list
      const { save } = await inquirer.prompt([
        {
          type: "confirm",
          name: "save",
          message: "  Save this model to your list for future runs?",
          default: true,
        },
      ]);

      if (save) {
        store.set("customModels.OpenRouter" as any, [
          ...savedCustomModels,
          model,
        ]);
        console.log(chalk.green(`  Model saved to your list.\n`));
      }
    } else {
      model = selected;
    }
  } else {
    // Gemini, Claude, Ollama — use default, confirm or override
    const defaultModel = DEFAULT_MODELS[provider];

    const { confirmed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: `  Use default model ${chalk.cyan(defaultModel)}?`,
        default: true,
      },
    ]);

    if (confirmed) {
      model = defaultModel;
    } else {
      const { customModel } = await inquirer.prompt([
        {
          type: "input",
          name: "customModel",
          message: "  Enter model name:",
          validate: (input) =>
            input.trim().length > 0 || "Model name cannot be empty.",
        },
      ]);
      model = customModel.trim();
    }
  }

  store.set(`model.${provider}` as any, model);
  return model;
}
