```
 ██████╗ ██╗████████╗    ██╗  ██╗ █████╗ ██████╗ ██████╗ ███████╗███╗   ██╗███████╗
██╔════╝ ██║╚══██╔══╝    ██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝
██║  ███╗██║   ██║       ███████║███████║██████╔╝██████╔╝█████╗  ██╔██╗ ██║███████╗
██║   ██║██║   ██║       ██╔══██║██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██║╚██╗██║╚════██║
╚██████╔╝██║   ██║       ██║  ██║██║  ██║██║     ██║     ███████╗██║ ╚████║███████║
 ╚═════╝ ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝
```

SGT is a CLI tool that analyzes your staged git changes and generates AI-powered commit message suggestions. It supports multiple LLM providers, saves your preferences, and handles API key fallbacks automatically.

---

## Providers

- Gemini (native SDK via @google/generative-ai)
- Claude (native SDK via @anthropic-ai/sdk)
- OpenRouter (list of popular models + custom model entry)
- Ollama (local — no API key required)

---

## Installation

Clone the repository:

```bash
# HTTPS
git clone https://github.com/Cat-Div7/commit-suggester.git

# SSH
git clone git@github.com:Cat-Div7/commit-suggester.git
```

Install dependencies and build:

```bash
cd commit-suggester
npm install
npm run build
npm link
```

Then run from anywhere:

```bash
sgt
```

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

You can add multiple fallback keys per provider. If the primary key hits a quota limit or fails, SGT automatically tries the next one.

Example .env:

```env
SGT_GEMINI_KEY=
SGT_CLAUDE_KEY=
SGT_OPENROUTER_KEY=
```

---

## OpenRouter Models

On first run with OpenRouter, SGT presents a list of popular models to choose from. You can also type a custom model name manually. If you enter a custom model, SGT will ask if you want to save it to your list for future runs.

Your selected model is saved per provider and reused on the next run.

---

## CLI Flags

| Flag                    | Description                                           |
|-------------------------|-------------------------------------------------------|
| `sgt`                   | Normal run using saved provider, model, and keys      |
| `sgt --change-model`    | Re-prompt model selection for current provider        |
| `sgt --change-key`      | Re-prompt API key for current provider                |
| `sgt --change-provider` | Re-prompt provider selection                          |
| `sgt --add-key`         | Add a fallback key for the current provider           |
| `sgt --reset`           | Clear all saved config and start fresh                |
| `sgt --config`          | Show current saved provider, model, and masked keys   |

---

## Saved Config Structure

SGT stores config at ~/.config/sgt-cli/config.json with the following shape:

```json
{
  "provider": "Gemini",
  "model": {
    "Gemini": "gemini-2.5-flash",
    "OpenRouter": "mistralai/mistral-7b-instruct",
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
  }
}
```

---

## Project Structure

```
commit-suggester/
├── src/
│   ├── index.ts                  # Entry point — parses flags, calls main()
│   ├── main.ts                   # Full flow orchestration
│   ├── constants.ts              # Providers, OpenRouter models, env key map
│   │
│   ├── ui/
│   │   ├── welcome.ts            # Welcome screen
│   │   ├── prompts.ts            # All inquirer prompts
│   │   └── spinner.ts            # Reusable ora spinner wrapper
│   │
│   ├── providers/
│   │   ├── index.ts              # Unified generate() with fallback key retry
│   │   ├── gemini.ts             # Gemini native SDK
│   │   ├── claude.ts             # Claude native SDK
│   │   ├── openrouter.ts         # OpenRouter with model list and custom entry
│   │   └── ollama.ts             # Ollama local
│   │
│   ├── git/
│   │   ├── checkRepo.ts          # Validates current directory is a git repo
│   │   └── getDiff.ts            # Reads staged diff per file
│   │
│   └── config/
│       ├── keys.ts               # Key resolution, validation, fallback logic
│       ├── models.ts             # Model selection and custom model saving
│       └── store.ts              # Single Conf instance
│
├── dist/                         # Compiled output
├── .env                          # Optional local env (gitignored)
├── .env.example                  # Key names reference
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## Scripts

| Command         | Description                  |
|-----------------|------------------------------|
| `npm run build` | Compile TypeScript to dist/  |
| `npm start`     | Run the compiled CLI         |
| `npm link`      | Link sgt command globally    |

---

## Roadmap

- Phase 1 — Core foundation (store, constants, git helpers, entry point)
- Phase 2 — Provider integration (Gemini, Claude, OpenRouter, Ollama)
- Phase 3 — Config and key management (fallback keys, model saving, custom models)
- Phase 4 — CLI flags (--change-model, --change-key, --reset, --config, etc.)
- Phase 5 — UX polish (prompts, spinners, masked key display, error hints)
- Phase 6 — Release (npm publish, versioning, GitHub release)

---

## Author

Omar Ashraf — [Cat-Div7](https://github.com/Cat-Div7)
