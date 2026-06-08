import { getAiProvider } from './ai.registry';

import type {
  TAiProvider,
  TAiResponse,
  TChatInput,
  TTextInput,
  TImageGenerateInput,
  TImageUnderstandInput,
} from './ai.types';

export const generateText = async (
  provider: TAiProvider,
  input: TTextInput,
): Promise<TAiResponse> => {
  return getAiProvider(provider).text(input);
};

export const generateChat = async (
  provider: TAiProvider,
  input: TChatInput,
): Promise<TAiResponse> => {
  return getAiProvider(provider).chat(input);
};

export const generateImage = async (
  provider: TAiProvider,
  input: TImageGenerateInput,
): Promise<TAiResponse> => {
  return getAiProvider(provider).generateImage(input);
};

export const understandImage = async (
  provider: TAiProvider,
  input: TImageUnderstandInput,
): Promise<TAiResponse> => {
  return getAiProvider(provider).understandImage(input);
};
