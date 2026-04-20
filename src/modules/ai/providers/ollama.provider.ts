import { envConfig } from "@/config/env.config";

import type {
  IAiProvider,
  TAiResponse,
  TChatInput,
  TTextInput,
  TImageUnderstandInput,
} from "../ai.types";

export class OllamaProvider implements IAiProvider {
  private baseUrl: string;

  constructor() {
    this.baseUrl = envConfig.ollamaApiUrl || "http://127.0.0.1:11434";
  }

  async chat(input: TChatInput): Promise<TAiResponse> {
    const model = input.model ?? envConfig.ollamaChatModel ?? "gemma:2b";

    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: input.messages,
        stream: false,
        options: {
          ...(input.temperature !== undefined
            ? { temperature: input.temperature }
            : {}),
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama chat failed with status ${res.status}`);
    }

    const data = await res.json();

    return {
      provider: "ollama",
      model,
    //   text: data?.message?.content ?? "",
      raw: data,
    };
  }

  async text(input: TTextInput): Promise<TAiResponse> {
    const model = input.model ?? envConfig.ollamaTextModel ?? "gemma:2b";

    const prompt = input.systemInstruction
      ? `${input.systemInstruction}\n\nUser: ${input.prompt}`
      : input.prompt;

    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          ...(input.temperature !== undefined
            ? { temperature: input.temperature }
            : {}),
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama generate failed with status ${res.status}`);
    }

    const data = await res.json();

    return {
      provider: "ollama",
      model,
    //   text: data?.response ?? "",
      raw: data,
    };
  }

  async understandImage(input: TImageUnderstandInput): Promise<TAiResponse> {
    const model =
      input.model ?? envConfig.ollamaVisionModel ?? "gemma:2b";

    if (!input.imageBase64) {
      throw new Error("OllamaProvider.understandImage requires imageBase64");
    }

    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: input.prompt,
        images: [input.imageBase64],
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama vision failed with status ${res.status}`);
    }

    const data = await res.json();

    return {
      provider: "ollama",
      model,
    //   text: data?.response ?? "",
      raw: data,
    };
  }

  generateImage(): Promise<TAiResponse> {
    return Promise.reject(
      new Error("OllamaProvider does not support image generation")
    );
  }

}