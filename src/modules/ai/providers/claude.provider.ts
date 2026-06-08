// import Anthropic from "@anthropic-ai/sdk";

// import type {
//   IAiProvider,
//   TAiResponse,
//   TChatInput,
//   TTextInput,
//   TImageGenerateInput,
//   TImageUnderstandInput,
// } from "../ai.types";

// export class ClaudeProvider implements IAiProvider {
//   private client: Anthropic;

//   constructor() {
//     this.client = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     });
//   }

//   async chat(input: TChatInput): Promise<TAiResponse> {
//     const model =
//       input.model || process.env.CLAUDE_CHAT_MODEL || "claude-sonnet-4-0";

//     const systemMessages = input.messages
//       .filter((m) => m.role === "system")
//       .map((m) => m.content)
//       .join("\n");

//     const messages = input.messages
//       .filter((m) => m.role !== "system")
//       .map((m) => ({
//         role: m.role as "user" | "assistant",
//         content: m.content,
//       }));

//     const response = await this.client.messages.create({
//       model,
//       max_tokens: input.maxOutputTokens || 1024,
//       ...(systemMessages ? { system: systemMessages } : {}),
//       ...(input.temperature !== undefined
//         ? { temperature: input.temperature }
//         : {}),
//       messages,
//     });

//     const text = response.content
//       .filter((block) => block.type === "text")
//       .map((block) => ("text" in block ? block.text : ""))
//       .join("\n");

//     return {
//       provider: "claude",
//       model,
//       text,
//       raw: response,
//     };
//   }

//   async text(input: TTextInput): Promise<TAiResponse> {
//     const model =
//       input.model || process.env.CLAUDE_TEXT_MODEL || "claude-sonnet-4-0";

//     const response = await this.client.messages.create({
//       model,
//       max_tokens: input.maxOutputTokens || 1024,
//       ...(input.systemInstruction ? { system: input.systemInstruction } : {}),
//       ...(input.temperature !== undefined
//         ? { temperature: input.temperature }
//         : {}),
//       messages: [{ role: "user", content: input.prompt }],
//     });

//     const text = response.content
//       .filter((block) => block.type === "text")
//       .map((block) => ("text" in block ? block.text : ""))
//       .join("\n");

//     return {
//       provider: "claude",
//       model,
//       text,
//       raw: response,
//     };
//   }

//   async understandImage(input: TImageUnderstandInput): Promise<TAiResponse> {
//     const model =
//       input.model || process.env.CLAUDE_VISION_MODEL || "claude-sonnet-4-0";

//     if (!input.imageBase64) {
//       throw new Error("ClaudeProvider.understandImage requires imageBase64");
//     }

//     const response = await this.client.messages.create({
//       model,
//       max_tokens: 1024,
//       messages: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "image",
//               source: {
//                 type: "base64",
//                 media_type: input.mimeType || "image/jpeg",
//                 data: input.imageBase64,
//               },
//             },
//             {
//               type: "text",
//               text: input.prompt,
//             },
//           ],
//         },
//       ],
//     });

//     const text = response.content
//       .filter((block) => block.type === "text")
//       .map((block) => ("text" in block ? block.text : ""))
//       .join("\n");

//     return {
//       provider: "claude",
//       model,
//       text,
//       raw: response,
//     };
//   }

//   async generateImage(_: TImageGenerateInput): Promise<TAiResponse> {
//     throw new Error("Claude does not provide native image generation here.");
//   }
// }
