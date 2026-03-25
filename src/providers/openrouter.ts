import chalk from "chalk";
import ora from "ora";

export async function generateWithOpenRouter(
  apiKey: string,
  model: string,
  diff: string
): Promise<string[]> {
  const spinner = ora(chalk.blue(`  Generating suggestions with OpenRouter (${model})...`)).start();

  try {
    const prompt = `Generate exactly 3 clean, concise, and descriptive git commit message suggestions based on the following diff.
Use the conventional commits format (e.g., feat: ..., fix: ..., docs: ...).
Return ONLY the 3 suggestions, one per line, with no numbers, bullets, or extra text.

Diff:
${diff}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/Cat-Div7/commit-suggester",
        "X-Title": "SGT — Smart Git Commit Tool",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[];
    };

    const text = data.choices[0].message.content;

    spinner.succeed(chalk.green("  Suggestions generated!"));

    return text
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 3);
  } catch (err: any) {
    spinner.fail(chalk.red(`  OpenRouter generation failed: ${err.message}`));
    process.exit(1);
  }
}