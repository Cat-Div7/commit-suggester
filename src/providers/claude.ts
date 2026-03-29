import Anthropic from "@anthropic-ai/sdk";
import { createSpinner, failSpinner, succeedSpinner } from "../ui/spinner.js";

export async function generateWithClaude(
  apiKey: string,
  model: string,
  diff: string,
): Promise<string[]> {
  const spinner = createSpinner(
    `  Generating suggestions with Claude (${model})...`,
  ).start();

  try {
    const client = new Anthropic({ apiKey });

    const prompt = `Generate exactly 3 clean, concise, and descriptive git commit message suggestions based on the following diff.
Use the conventional commits format (e.g., feat: ..., fix: ..., docs: ...).
Return ONLY the 3 suggestions, one per line, with no numbers, bullets, or extra text.

Diff:
${diff}`;

    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (response.content[0] as { text: string }).text;

    succeedSpinner(spinner, "  Suggestions generated!");

    return text
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 3);
  } catch (err: any) {
    failSpinner(spinner, `  Claude generation failed: ${err.message}`);
    process.exit(1);
  }
}

export async function generateRawWithClaude(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  if (!block || block.type !== "text") throw new Error("Unexpected response.");
  return block.text;
}
