import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { config } from "dotenv";
import store from "./store.js";
import { ENV_KEY_MAP } from "../constants.js";
import type { Provider } from "../constants.js";

config(); // load .env

function maskKey(key: string): string {
  return key.slice(0, 6) + "..." + key.slice(-4);
}

async function validateKey(provider: Provider, key: string): Promise<boolean> {
  const spinner = ora(`  Validating ${provider} key...`).start();

  try {
    if (provider === "Gemini" && (!key.startsWith("AIza") || key.length < 30))
      throw new Error("Invalid Gemini key format.");

    if (provider === "Claude") {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: key });
      await client.models.list();
    }

    if (provider === "OpenRouter") {
      const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);
    }

    spinner.succeed(chalk.green(`  ${provider} key valid — ${maskKey(key)}`));
    return true;
  } catch (err: any) {
    const status = err?.status ?? err?.response?.status;
    if (status === 401 || status === 403) {
      spinner.fail(chalk.red(`  Invalid key for ${provider}.`));
    } else {
      spinner.fail(chalk.red(`  Validation failed: ${err.message}`));
    }
    return false;
  }
}

export async function getKeys(
  provider: Provider,
  forceNew = false,
): Promise<string[]> {
  if (provider === "Ollama") return [];

  const envKey = process.env[ENV_KEY_MAP[provider]];
  if (envKey && !forceNew) {
    return [envKey];
  }

  const savedKeys: string[] = store.get(`keys.${provider}` as any) ?? [];
  if (savedKeys.length > 0 && !forceNew) {
    return savedKeys;
  }

  // Prompt for new key
  const keys: string[] = [];

  while (true) {
    const { apiKey } = await inquirer.prompt([
      {
        type: "input",
        name: "apiKey",
        message: `  Enter your ${chalk.cyan(provider)} API key:`,
        validate: (input) =>
          input.trim().length > 0 || "API key cannot be empty.",
      },
    ]);

    const trimmed = apiKey.trim();
    const isValid = await validateKey(provider, trimmed);

    if (!isValid) {
      console.log(chalk.yellow("  Please try again.\n"));
      continue;
    }

    keys.push(trimmed);

    const { addAnother } = await inquirer.prompt([
      {
        type: "confirm",
        name: "addAnother",
        message: "  Add a fallback key?",
        default: false,
      },
    ]);

    if (!addAnother) break;
  }

  store.set(`keys.${provider}` as any, keys);
  return keys;
}

export async function addFallbackKey(provider: Provider): Promise<void> {
  const saved: string[] = store.get(`keys.${provider}` as any) ?? [];

  const { apiKey } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: `  Enter fallback key for ${chalk.cyan(provider)}:`,
      validate: (input) =>
        input.trim().length > 0 || "API key cannot be empty.",
    },
  ]);

  const trimmed = apiKey.trim();
  const isValid = await validateKey(provider, trimmed);

  if (isValid) {
    store.set(`keys.${provider}` as any, [...saved, trimmed]);
    console.log(
      chalk.green(`  Fallback key added. Total keys: ${saved.length + 1}\n`),
    );
  } else {
    console.log(chalk.red("  Key not saved.\n"));
  }
}
