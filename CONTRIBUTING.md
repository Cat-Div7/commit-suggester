# Contributing to SGT

Thanks for considering contributing to SGT. Here is everything you need to get started.

---

## Getting Started
```bash
# Clone the repo
git clone https://github.com/Cat-Div7/commit-suggester.git
cd commit-suggester

# Install dependencies
npm install

# Build
npm run build

# Link globally for testing
npm link
```

---

## Project Structure
```
src/
├── index.ts           # Entry point
├── main.ts            # Flow orchestration
├── constants.ts       # Providers, models, env map
├── cli/
│   ├── flags.ts       # Flag parsing
│   └── help.ts        # Help text
├── ui/
│   ├── welcome.ts     # Welcome screen
│   ├── prompts.ts     # Inquirer prompts
│   └── spinner.ts     # Ora spinner wrapper
├── providers/
│   ├── index.ts       # Unified generate() with fallback
│   ├── gemini.ts      # Gemini native SDK
│   ├── claude.ts      # Claude native SDK
│   ├── openrouter.ts  # OpenRouter via fetch
│   ├── ollama.ts      # Ollama local
│   └── autoCommit.ts  # Auto-commit AI picker
├── git/
│   ├── checkRepo.ts   # Git repo validation
│   └── getDiff.ts     # Staged diff reader
├── config/
│   ├── store.ts       # Conf singleton
│   ├── keys.ts        # Key resolution and validation
│   └── models.ts      # Model selection and saving
└── utils/
    └── terminalLink.ts # OSC 8 terminal hyperlinks
```

---

## Guidelines

- Keep each file focused on one responsibility
- Use TypeScript strictly — no `any` unless absolutely necessary
- Follow the existing chalk styling conventions
- Test your changes with `npm link` and a real staged diff before submitting a PR
- Keep commit messages in conventional commits format — SGT will help you with that

---

## Adding a New Provider

1. Create `src/providers/yourprovider.ts` with `generateWithYourProvider()` and `generateRawWithYourProvider()`
2. Add the provider name to `PROVIDERS` in `constants.ts`
3. Add default model to `DEFAULT_MODELS`
4. Add env key name to `ENV_KEY_MAP`
5. Add hint link to `PROVIDER_HINTS`
6. Wire it in `providers/index.ts` and `providers/autoCommit.ts`

---

## Submitting a PR

- Fork the repo
- Create a branch from `main`
- Make your changes
- Open a PR with a clear description of what you changed and why