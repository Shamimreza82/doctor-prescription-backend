// import { envConfig } from "@/config/env.config";

// import type {
//   IAiProvider,
//   TAiResponse,
//   TChatInput,
//   TTextInput,
//   TImageGenerateInput,
//   TImageUnderstandInput,
// } from "../ai.types";

// export class OpenAIProvider implements IAiProvider {
//   chat(input: TChatInput): Promise<TAiResponse> {
//     const model = input.model ?? envConfig.openaiChatModel ?? "gpt-5";

//     throw new Error(
//       `OpenAIProvider.chat is not implemented yet. Requested model: ${model}`
//     );
//   }

//   text(input: TTextInput): Promise<TAiResponse> {
//     const model = input.model ?? envConfig.openaiTextModel ?? "gpt-5";

//     throw new Error(
//       `OpenAIProvider.text is not implemented yet. Requested model: ${model}`
//     );
//   }

//   generateImage(input: TImageGenerateInput): Promise<TAiResponse> {
//     const model =
//       input.model ?? envConfig.openaiImageModel ?? "gpt-image-1";

//     throw new Error(
//       `OpenAIProvider.generateImage is not implemented yet. Requested model: ${model}`
//     );
//   }

//   understandImage(input: TImageUnderstandInput): Promise<TAiResponse> {
//     const model = input.model ?? envConfig.openaiVisionModel ?? "gpt-5";

//     throw new Error(
//       `OpenAIProvider.understandImage is not implemented yet. Requested model: ${model}`
//     );
//   }
// }