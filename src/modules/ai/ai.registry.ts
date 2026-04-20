

import { GeminiProvider } from "./providers/gemini.provider";
import { OllamaProvider } from "./providers/ollama.provider";

import type { IAiProvider, TAiProvider } from "./ai.types";

const providers: Partial<Record<TAiProvider, IAiProvider>> = {
  gemini: new GeminiProvider(),
  ollama: new OllamaProvider(),
};

export const getAiProvider = (provider: TAiProvider): IAiProvider => {
  const selected = providers[provider];

  if (!selected) {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  return selected;
};
