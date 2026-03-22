export const PROVIDERS = ["Gemini", "Claude", "OpenRouter", "Ollama"] as const;

export type Provider = (typeof PROVIDERS)[number];

export const DEFAULT_MODELS: Record<Provider, string> = {
  Gemini: "gemini-2.0-flash",
  Claude: "claude-3-5-sonnet-20240620",
  OpenRouter: "mistralai/mistral-7b-instruct",
  Ollama: "llama3",
};

export const OPENROUTER_MODELS = [
  "mistralai/mistral-7b-instruct",
  "mistralai/mixtral-8x7b-instruct",
  "meta-llama/llama-3-8b-instruct",
  "meta-llama/llama-3-70b-instruct",
  "google/gemma-2-9b-it",
  "nousresearch/hermes-2-pro-llama-3-8b",
  "openchat/openchat-3.5-0106",
  "microsoft/phi-3-mini-128k-instruct",
];

export const ENV_KEY_MAP: Record<Provider, string> = {
  Gemini: "SGT_GEMINI_KEY",
  Claude: "SGT_CLAUDE_KEY",
  OpenRouter: "SGT_OPENROUTER_KEY",
  Ollama: "",
};