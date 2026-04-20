import { GoogleGenAI, type Content } from "@google/genai";

import { envConfig } from "@/config/env.config";

import type {
  IAiProvider,
  TAiResponse,
  TChatInput,
  TTextInput,
  TImageGenerateInput,
  TImageUnderstandInput,
} from "../ai.types";

export class GeminiProvider implements IAiProvider {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: envConfig.geminiApiKey,
    });
  }

  async chat(input: TChatInput): Promise<TAiResponse> {
    const model =  input.model ?? envConfig.geminiChatModel ?? "gemini-3-flash-preview";

    const contents: Content[] = input.messages.map((message) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));

    const response = await this.ai.models.generateContent({
      model,
      contents,
      config: {
        ...(input.temperature !== undefined
          ? { temperature: input.temperature }
          : {}),
        ...(input.maxOutputTokens !== undefined
          ? { maxOutputTokens: input.maxOutputTokens }
          : {}),
      },
    });

    return {
      provider: "gemini",
      model,
      text: response.text ?? "",
      raw: response,
    };
  }

  async text(input: TTextInput): Promise<TAiResponse> {
    const model =
      input.model ?? envConfig.geminiTextModel ?? "gemini-3-flash-preview";

    const response = await this.ai.models.generateContent({
      model,
      contents: input.prompt,
      config: {
        ...(input.systemInstruction
          ? { systemInstruction: input.systemInstruction }
          : {}),
        ...(input.temperature !== undefined
          ? { temperature: input.temperature }
          : {}),
        ...(input.maxOutputTokens !== undefined
          ? { maxOutputTokens: input.maxOutputTokens }
          : {}),
      },
    });

    return {
      provider: "gemini",
      model,
      text: response.text ?? "",
      raw: response,
    };
  }

  async understandImage(input: TImageUnderstandInput): Promise<TAiResponse> {
    const model =
      input.model ?? envConfig.geminiVisionModel ?? "gemini-3-flash-preview";

    const parts: Record<string, unknown>[] = [{ text: input.prompt }];

    if (input.imageBase64) {
      parts.push({
        inlineData: {
          data: input.imageBase64,
          mimeType: input.mimeType ?? "image/jpeg",
        },
      });
    }

    if (input.imageUrl) {
      // for remote URL workflow, usually you fetch first or use uploaded file references
      parts.push({
        fileData: {
          fileUri: input.imageUrl,
          mimeType: input.mimeType ?? "image/jpeg",
        },
      });
    }

    const response = await this.ai.models.generateContent({
      model,
      contents: [{ role: "user", parts }],
    });

    return {
      provider: "gemini",
      model,
      text: response.text ?? "",
      raw: response,
    };
  }

  async generateImage(input: TImageGenerateInput): Promise<TAiResponse> {
    const model =
      input.model ?? envConfig.geminiVisionModel ?? "gemini-2.5-flash-image";

    const response = await this.ai.models.generateContent({
      model,
      contents: input.prompt,
    });

    // Gemini image output parsing can vary by model/response shape.
    // Keep raw so you can inspect and normalize later.
    return {
      provider: "gemini",
      model,
      text: response.text ?? "",
      raw: response,
    };
  }
}