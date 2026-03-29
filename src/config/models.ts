import chalk from "chalk";
import store from "./store.js";
import {
  DEFAULT_MODELS,
  OPENROUTER_MODELS_URL,
} from "../constants.js";
import type { Provider } from "../constants.js";
import { terminalLink } from "../utils/terminalLink.js";
import {
  promptCustomModel,
  promptDefaultModel,
  promptOpenRouterModel,
  promptSaveCustomModel,
} from "../ui/prompts.js";

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

    const selected = await promptOpenRouterModel(savedCustomModels);

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

      model = await promptCustomModel();

      // Ask if user wants to save custom model to list
      const save = await promptSaveCustomModel();

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
    model = await promptDefaultModel(provider, DEFAULT_MODELS[provider]);
  }

  store.set(`model.${provider}` as any, model);
  return model;
}
