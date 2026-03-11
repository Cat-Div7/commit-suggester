# commit-suggester
```
 ██████╗ ██╗████████╗    ██╗  ██╗ █████╗ ██████╗ ██████╗ ███████╗███╗   ██╗███████╗
██╔════╝ ██║╚══██╔══╝    ██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝
██║  ███╗██║   ██║       ███████║███████║██████╔╝██████╔╝█████╗  ██╔██╗ ██║███████╗
██║   ██║██║   ██║       ██╔══██║██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██║╚██╗██║╚════██║
╚██████╔╝██║   ██║       ██║  ██║██║  ██║██║     ██║     ███████╗██║ ╚████║███████║
 ╚═════╝ ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝

            _         _              _     _           _
  ___ ___  | |__ _  _| |_   _ _  ___| |_  | |_ ___  __| |__ _ _  _   ___ ___
 |___|___| | '_ \ || |  _| | ' \/ _ \  _| |  _/ _ \/ _` / _` | || | |___|___|
           |_.__/\_,_|\__| |_||_\___/\__|  \__\___/\__,_\__,_|\_, |
                                                               |__/
```

SGT is a CLI tool that analyzes your staged git changes and generates 3 AI-powered commit message suggestions using your preferred LLM provider.

---

## Providers

- OpenAI
- Gemini
- Claude
- Ollama (local)

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
```

---

## Usage

```bash
# Stage your changes first
git add <file>

# Run SGT
npm start
```

SGT will ask you to select a provider, enter your API key (saved for future use), then present 3 commit message suggestions to choose from, edit, or cancel.

---

## Scripts

| Command         | Description                     |
|-----------------|---------------------------------|
| `npm run build` | Compile TypeScript to `dist/`   |
| `npm start`     | Run the compiled CLI             |