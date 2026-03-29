import chalk from "chalk";
import { createSpinner, succeedSpinner, failSpinner } from "../ui/spinner.js";
import type { Provider } from "../constants.js";
import { generateWithGemini } from "./gemini.js";
import { generateWithClaude } from "./claude.js";
import { generateWithOpenRouter } from "./openrouter.js";

export async function pickBestSuggestion(
  provider: Provider,
  model: string,
  keys: string[],
  diff: string,
  suggestions: string[],
): Promise<{ message: string; reason: string }> {
  const spinner = createSpinner("  Picking best commit message...");

  const prompt = `You previously generated these 3 git commit message suggestions for a diff:

1. ${suggestions[0]}
2. ${suggestions[1]}
3. ${suggestions[2]}

Based on the diff below, pick the single best commit message from the 3 options above.
Return ONLY a JSON object in this exact format with no extra text:
{"best": "<the exact commit message>", "reason": "<one short sentence why>"}

Diff:
${diff}`;

  try {
    let raw = "";

    if (provider === "Gemini") {
      const result = await generateWithGemini(keys[0]!, model, prompt);
      raw = result[0] ?? "";
    } else if (provider === "Claude") {
      const result = await generateWithClaude(keys[0]!, model, prompt);
      raw = result[0] ?? "";
    } else if (provider === "OpenRouter") {
      const result = await generateWithOpenRouter(keys[0]!, model, prompt);
      raw = result[0] ?? "";
    } else {
      // Ollama — just pick first suggestion, no second call
      succeedSpinner(spinner, "  Best suggestion picked.");
      return {
        message: suggestions[0]!,
        reason: "Auto-selected first suggestion.",
      };
    }

    // Strip markdown fences if model wraps in ```json
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean) as { best: string; reason: string };

    succeedSpinner(spinner, "  Best suggestion picked.");
    return { message: parsed.best, reason: parsed.reason };
  } catch {
    // Fallback to first suggestion if parsing fails
    succeedSpinner(spinner, "  Best suggestion picked.");
    return {
      message: suggestions[0]!,
      reason: "Auto-selected first suggestion.",
    };
  }
}
