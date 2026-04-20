export type TAiProvider = "gemini" | "openai" | "claude" | "ollama";
export type TAiTask = "prescription_draft" | "patient_summary" | "lab_analysis";

export type TAiMessageRole = "system" | "user" | "assistant";

export interface TAiMessage {
  role: TAiMessageRole;
  content: string;
}

export interface TChatInput {
  messages: TAiMessage[];
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}


export interface TTextInput {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  thinkingLevel?: "LOW" | "MEDIUM" | "HIGH" | " MINIMAL" | "THINKING_LEVEL_UNSPECIFIED";
}

export interface TImageGenerateInput {
  prompt: string;
  model?: string;
  size?: string;
  n?: number;
}

export interface TImageUnderstandInput {
  prompt: string;
  model?: string;
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
}

export interface TAiResponse {
  provider: TAiProvider;
  model: string;
  text?: string;
  images?: string[];
  raw?: unknown;
}

export interface IAiProvider {
  chat(input: TChatInput): Promise<TAiResponse>;
  text(input: TTextInput): Promise<TAiResponse>;
  generateImage(input: TImageGenerateInput): Promise<TAiResponse>;
  understandImage(input: TImageUnderstandInput): Promise<TAiResponse>;
}
