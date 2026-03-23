import { GoogleGenerativeAI } from "@google/generative-ai";
import chalk from "chalk";
import ora from "ora";

export async function generateWithGemini(
  apiKey: string,
  model: string,
  diff: string
): Promise<string[]> {
  const spinner = ora(chalk.blue(`  Generating suggestions with Gemini (${model})...`)).start();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    const prompt = `Generate exactly 3 clean, concise, and descriptive git commit message suggestions based on the following diff.
Use the conventional commits format (e.g., feat: ..., fix: ..., docs: ...).
Return ONLY the 3 suggestions, one per line, with no numbers, bullets, or extra text.

Diff:
${diff}`;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    spinner.succeed(chalk.green("  Suggestions generated!"));

    return text
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 3);
  } catch (err: any) {
    spinner.fail(chalk.red(`  Gemini generation failed: ${err.message}`));
    process.exit(1);
  }
}