import chalk from "chalk";
import { createSpinner, failSpinner, succeedSpinner } from "../ui/spinner.js";

export async function generateWithOllama(
  model: string,
  diff: string,
): Promise<string[]> {
  const spinner = createSpinner(
    `  Generating suggestions with Ollama (${model})...`,
  ).start();

  try {
    const prompt = `Generate exactly 3 clean, concise, and descriptive git commit message suggestions based on the following diff.
Use the conventional commits format (e.g., feat: ..., fix: ..., docs: ...).
Return ONLY the 3 suggestions, one per line, with no numbers, bullets, or extra text.

Diff:
${diff}`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { response?: string };

    const text = data.response;
    if (!text) {
      throw new Error("Empty response from Ollama.");
    }

    succeedSpinner(spinner, "  Suggestions generated!");

    return text
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 3);
  } catch (err: any) {
    failSpinner(spinner, `  Ollama generation failed: ${err.message}`);
    console.log(chalk.gray("  Is Ollama running? Try: ollama serve"));
    process.exit(1);
  }
}
