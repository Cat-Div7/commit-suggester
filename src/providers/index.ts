import chalk from "chalk";
import { generateWithGemini } from "./gemini.js";
import { generateWithClaude } from "./claude.js";
import { generateWithOpenRouter } from "./openrouter.js";
import { generateWithOllama } from "./ollama.js";
import type { Provider } from "../constants.js";

export async function generate(
  provider: Provider,
  model: string,
  keys: string[],
  diff: string,
): Promise<string[]> {
  // Ollama is local — no key needed
  if (provider === "Ollama") {
    return generateWithOllama(model, diff);
  }

  if (!keys || keys.length === 0) {
    console.log(chalk.red("  No API keys found for provider."));
    process.exit(1);
  }

  // Try each key in order — fallback on quota/auth errors
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const isLast = i === keys.length - 1;

    if (!key) continue;

    try {
      if (provider === "Gemini")
        return await generateWithGemini(key, model, diff);
      if (provider === "Claude")
        return await generateWithClaude(key, model, diff);
      if (provider === "OpenRouter")
        return await generateWithOpenRouter(key, model, diff);
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      const isQuota = status === 429;
      const isAuth = status === 401 || status === 403;

      if ((isQuota || isAuth) && !isLast) {
        console.log(
          chalk.yellow(
            `\n  Key ${i + 1} failed (${status}) — trying fallback key...\n`,
          ),
        );
        continue;
      }

      // Last key or non-retryable error
      console.log(chalk.red(`\n  Generation failed: ${err.message}\n`));
      process.exit(1);
    }
  }

  // Should never reach here
  console.log(chalk.red("  All keys exhausted."));
  process.exit(1);
}
