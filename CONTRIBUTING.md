# Contributing to SGT

Thanks for considering contributing to SGT. Every contribution is welcome — whether it's a bug fix, a new provider, a UX improvement, or just fixing a typo.

---

## Before You Start

- Check the [open issues](https://github.com/Cat-Div7/commit-suggester/issues) to see if what you want to work on is already being tracked
- If it's a new feature or a significant change, open an issue first to discuss it before writing code
- For small fixes like typos or minor bugs, feel free to go straight to a PR

---

## Fork and Clone

```bash
# 1. Fork the repo on GitHub using the Fork button at the top right

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/commit-suggester.git
cd commit-suggester

# 3. Add the original repo as upstream so you can stay in sync
git remote add upstream https://github.com/Cat-Div7/commit-suggester.git
```

---

## Setup

```bash
# Install dependencies
npm install

# Build
npm run build

# Link globally for local testing
npm link
```

Create a `.env` file from the example:

```bash
cp .env.example .env
# Then fill in at least one API key to test with
```

---

## Branching

Always branch off `main`. Use a clear branch name that reflects what you are working on:

```bash
git checkout main
git pull upstream main
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-name
```

---

## Making Changes

- Keep each file focused on one responsibility
- Use TypeScript strictly — avoid `any` unless absolutely necessary
- Follow the existing chalk styling conventions for terminal output
- Test your changes with `npm link` and a real staged diff before opening a PR
- Keep commit messages in conventional commits format — SGT will help you with that

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

## Adding a New Provider

1. Create `src/providers/yourprovider.ts` with two exports:
   - `generateWithYourProvider()` — with spinner, used for normal generation
   - `generateRawWithYourProvider()` — no spinner, used internally by `--auto-commit`
2. Add the provider name to `PROVIDERS` in `constants.ts`
3. Add default model to `DEFAULT_MODELS`
4. Add env key name to `ENV_KEY_MAP`
5. Add hint link to `PROVIDER_HINTS`
6. Wire it in `providers/index.ts` generate() and `providers/autoCommit.ts`

---

## Opening a Pull Request

```bash
# Stage and commit your changes
git add .
git commit -m "feat: your change description"

# Push to your fork
git push origin feat/your-feature-name
```

Then on GitHub:

1. Go to your fork and click **Compare & pull request**
2. Set the base branch to `main` on the original repo
3. Write a clear PR title using conventional commits format
4. In the description explain what you changed, why, and how to test it
5. Link any related issues using `Closes #issue-number` if applicable

---

## Staying in Sync

If `main` has moved while you were working on your branch:

```bash
git fetch upstream
git rebase upstream/main
```

Resolve any conflicts, then force push:

```bash
git push origin feat/your-feature-name --force
```
