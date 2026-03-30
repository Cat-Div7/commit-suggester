```
       ██████╗ ██╗████████╗    ██╗  ██╗ █████╗ ██████╗ ██████╗ ███████╗███╗   ██╗███████╗
      ██╔════╝ ██║╚══██╔══╝    ██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝
      ██║  ███╗██║   ██║       ███████║███████║██████╔╝██████╔╝█████╗  ██╔██╗ ██║███████╗
      ██║   ██║██║   ██║       ██╔══██║██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██║╚██╗██║╚════██║
      ╚██████╔╝██║   ██║       ██║  ██║██║  ██║██║     ██║     ███████╗██║ ╚████║███████║
       ╚═════╝ ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝
```

<p align="center">
  <img alt="npm version" src="https://img.shields.io/npm/v/sgt-cli?style=for-the-badge&color=CB3837&logo=npm&logoColor=white" />
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/sgt-cli?style=for-the-badge&color=2ea043&logo=npm&logoColor=white" />
  <img alt="license" src="https://img.shields.io/github/license/Cat-Div7/commit-suggester?style=for-the-badge&color=blue" />
  <img alt="last commit" src="https://img.shields.io/github/last-commit/Cat-Div7/commit-suggester?style=for-the-badge&color=6e40c9&logo=github&logoColor=white" />
  <img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge&logo=github&logoColor=white" />
</p>

<p align="center">
  SGT is a CLI tool that analyzes your staged git changes and generates AI-powered commit message suggestions.<br/>
  It supports multiple LLM providers, saves your preferences, and handles API key fallbacks automatically.
</p>

---

## Requirements

- Node.js 18 or higher
- At least one API key for Gemini, Claude, or OpenRouter — or Ollama running locally

---

## Installation

Install globally from npm:

```bash
npm install -g sgt-cli
```

Then run from anywhere inside any git project:

```bash
sgt
```

Or clone and build manually:

```bash
# HTTPS
git clone https://github.com/Cat-Div7/commit-suggester.git

# SSH
git clone git@github.com:Cat-Div7/commit-suggester.git

cd commit-suggester
npm install
npm run build
npm link
```

---

## Providers

- Gemini — native SDK via @google/generative-ai — free tier available at aistudio.google.com/app/apikey
- Claude — native SDK via @anthropic-ai/sdk — API keys at console.anthropic.com
- OpenRouter — popular model list + custom model entry — free models available at openrouter.ai/keys
- Ollama — runs locally, no API key required — download at ollama.com/download

---

## First Run

On first run SGT will ask you to:

1. Select a provider
2. Select or enter a model
3. Enter your API key

All of these are saved automatically. From the second run onwards SGT goes straight to analyzing your diff and generating suggestions.

---

## API Keys

SGT checks for API keys in this order:

1. Environment variables (.env file or shell env)
2. Saved config at ~/.config/sgt-cli/config.json
3. Prompt — saved after first entry

You can add multiple fallback keys per provider. If the primary key hits a quota limit or auth error, SGT automatically tries the next one.

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```env
SGT_GEMINI_KEY=
SGT_CLAUDE_KEY=
SGT_OPENROUTER_KEY=
```

---

## OpenRouter Models

On first run with OpenRouter, SGT presents a list of popular models to choose from. You can also type a custom model name manually. If you enter a custom model, SGT will ask if you want to save it to your list for future runs.

Browse all available model IDs at openrouter.ai/models — copy the exact ID including the `:free` suffix for free models, for example `google/gemma-3-4b-it:free`.

Your selected model is saved per provider and reused on the next run.

---

## CLI Flags

| Flag                    | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `sgt`                   | Normal run using saved provider, model, and keys    |
| `sgt --change-model`    | Re-prompt model selection for current provider      |
| `sgt --change-key`      | Re-prompt API key for current provider              |
| `sgt --change-provider` | Re-prompt provider selection                        |
| `sgt --add-key`         | Add a fallback key for the current provider         |
| `sgt --reset`           | Clear all saved config and start fresh              |
| `sgt --config`          | Show current saved provider, model, and masked keys |
| `sgt --auto-commit`     | Auto pick best suggestion and commit silently       |
| `sgt --toggle-welcome`  | Toggle the GIT HAPPENS header on/off                |
| `sgt --help, -h`        | Show usage instructions                             |

> [!IMPORTANT]
> `--auto-commit` sends two requests to your AI provider — one to generate suggestions and one to pick the best one. Keep this in mind if you are on a free tier with rate limits.

---

## Saved Config Structure

SGT stores config at `~/.config/sgt-cli/config.json`:

```json
{
  "provider": "Gemini",
  "model": {
    "Gemini": "gemini-2.5-flash",
    "OpenRouter": "google/gemma-3-4b-it:free",
    "Claude": "claude-3-5-sonnet-20240620",
    "Ollama": "llama3"
  },
  "keys": {
    "Gemini": ["primary-key"],
    "OpenRouter": ["primary-key", "fallback-key"],
    "Claude": ["primary-key"]
  },
  "customModels": {
    "OpenRouter": ["my-org/custom-model-v1"]
  },
  "showWelcome": true
}
```

---

## Project Structure

```
commit-suggester/
├── src/
│   ├── index.ts                  # Entry point
│   ├── main.ts                   # Full flow orchestration
│   ├── constants.ts              # Providers, models, env key map
│   ├── cli/
│   │   ├── flags.ts              # Flag parsing
│   │   └── help.ts               # Help text
│   ├── ui/
│   │   ├── welcome.ts            # Welcome screen — full and bar variants
│   │   ├── prompts.ts            # All inquirer prompts
│   │   └── spinner.ts            # Reusable ora spinner wrapper
│   ├── providers/
│   │   ├── index.ts              # Unified generate() with fallback key retry
│   │   ├── gemini.ts             # Gemini native SDK
│   │   ├── claude.ts             # Claude native SDK
│   │   ├── openrouter.ts         # OpenRouter via fetch
│   │   ├── ollama.ts             # Ollama local
│   │   └── autoCommit.ts        # AI-powered best suggestion picker
│   ├── git/
│   │   ├── checkRepo.ts          # Git repo validation
│   │   └── getDiff.ts            # Staged diff reader
│   ├── config/
│   │   ├── keys.ts               # Key resolution, validation, fallback logic
│   │   ├── models.ts             # Model selection and custom model saving
│   │   └── store.ts              # Single Conf instance
│   └── utils/
│       └── terminalLink.ts       # OSC 8 clickable terminal links
├── dist/                         # Compiled output (gitignored)
├── .env                          # Optional local env (gitignored)
├── .env.example                  # Key names reference
├── package.json
├── tsconfig.json
├── .gitignore
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

---

## Scripts

| Command         | Description                 |
| --------------- | --------------------------- |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start`     | Run the compiled CLI        |
| `npm link`      | Link sgt command globally   |

---

## Roadmap

- Phase 1 — Core foundation (store, constants, git helpers, entry point)
- Phase 2 — Provider integration (Gemini, Claude, OpenRouter, Ollama)
- Phase 3 — Config and key management (fallback keys, model saving, custom models)
- Phase 4 — CLI flags (--change-model, --change-key, --reset, --config, etc.)
- Phase 5 — UX polish (prompts, spinners, provider hints, welcome split, --toggle-welcome)
- Phase 6 — Release (npm publish, versioning, GitHub release)

## Upcoming

- `sgt --setup-alias` — set up `git sgt` alias globally
- `--config` display with formatted table (based on user feedback)
- Web dashboard with AI provider and model usage tracking (post v1.0.0)

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide on forking, branching, and opening a PR.

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

## Author

Omar Ashraf — [Cat-Div7](https://github.com/Cat-Div7)
