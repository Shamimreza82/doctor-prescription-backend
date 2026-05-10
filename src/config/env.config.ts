import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { AppError } from '@/shared/errors/AppError';

export type NodeEnvironment = 'development' | 'test' | 'production';
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ENABLED: z.coerce.boolean(),
  HOST: z.string().min(1).default('0.0.0.0'),
  DATABASE_URL: z.string().default(''),
  CORS_ORIGINS: z.string().default('*'),
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((value) => value === '1' || value === 'true'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),
  JWT_ACCESS_SECRET: z.string().min(16).default('dev-access-secret-change-me'),
  JWT_REFRESH_SECRET: z.string().min(16).default('dev-refress-secret-change-me'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('365d'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  HTTP_LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Ai models and api keys
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_CHAT_MODEL: z.string().optional(),
  GEMINI_TEXT_MODEL: z.string().optional(),
  GEMINI_VISION_MODEL: z.string().optional(),
  GEMINI_IMAGE_MODEL: z.string().optional(),
  GEMINI_EMBEDDING_MODEL: z.string().optional(),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_CHAT_MODEL: z.string().optional(),
  OPENAI_TEXT_MODEL: z.string().optional(),
  OPENAI_VISION_MODEL: z.string().optional(),
  OPENAI_IMAGE_MODEL: z.string().optional(),
  OPENAI_EMBEDDING_MODEL: z.string().optional(),

  CLAUDE_API_KEY: z.string().optional(),
  CLAUDE_CHAT_MODEL: z.string().optional(),
  CLAUDE_TEXT_MODEL: z.string().optional(),
  CLAUDE_VISION_MODEL: z.string().optional(),
  CLAUDE_IMAGE_MODEL: z.string().optional(),
  CLAUDE_EMBEDDING_MODEL: z.string().optional(),

  OLLAMA_API_URL: z.string().url().default('http://127.0.0.1:11434'),
  OLLAMA_CHAT_MODEL: z.string().optional(),
  OLLAMA_TEXT_MODEL: z.string().optional(),
  OLLAMA_VISION_MODEL: z.string().optional(),
  OLLAMA_EMBEDDING_MODEL: z.string().optional(),

});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const formattedErrors = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'ENV'}: ${issue.message}`)
    .join('; ');
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `Invalid environment configuration: ${formattedErrors}`,
  );
}

export const envConfig = {
  nodeEnv: parsed.data.NODE_ENV as NodeEnvironment,
  port: parsed.data.PORT,
  host: parsed.data.HOST,
  databaseUrl: parsed.data.DATABASE_URL,
  corsOrigins: parsed.data.CORS_ORIGINS,
  trustProxy: parsed.data.TRUST_PROXY ?? false,
  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: parsed.data.RATE_LIMIT_MAX_REQUESTS,

  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  jwtExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,

  logLevel: parsed.data.LOG_LEVEL as LogLevel,
  httpLogLevel: parsed.data.HTTP_LOG_LEVEL as LogLevel,
  corsEnabled: parsed.data.CORS_ENABLED,

  ///ai api keys and model names
  geminiApiKey: parsed.data.GEMINI_API_KEY,
  geminiChatModel: parsed.data.GEMINI_CHAT_MODEL,
  geminiTextModel: parsed.data.GEMINI_TEXT_MODEL,
  geminiVisionModel: parsed.data.GEMINI_VISION_MODEL,
  geminiImageModel: parsed.data.GEMINI_IMAGE_MODEL,
  geminiEmbeddingModel: parsed.data.GEMINI_EMBEDDING_MODEL,

  openAiApiKey: parsed.data.OPENAI_API_KEY,
  openAiChatModel: parsed.data.OPENAI_CHAT_MODEL,
  openAiTextModel: parsed.data.OPENAI_TEXT_MODEL,
  openAiVisionModel: parsed.data.OPENAI_VISION_MODEL,
  openAiImageModel: parsed.data.OPENAI_IMAGE_MODEL,
  openAiEmbeddingModel: parsed.data.OPENAI_EMBEDDING_MODEL,

  claudeApiKey: parsed.data.CLAUDE_API_KEY,
  claudeChatModel: parsed.data.CLAUDE_CHAT_MODEL,
  claudeTextModel: parsed.data.CLAUDE_TEXT_MODEL,
  claudeVisionModel: parsed.data.CLAUDE_VISION_MODEL,
  claudeImageModel: parsed.data.CLAUDE_IMAGE_MODEL,
  claudeEmbeddingModel: parsed.data.CLAUDE_EMBEDDING_MODEL,

  ollamaApiUrl: parsed.data.OLLAMA_API_URL,
  ollamaChatModel: parsed.data.OLLAMA_CHAT_MODEL,
  ollamaTextModel: parsed.data.OLLAMA_TEXT_MODEL,
  ollamaVisionModel: parsed.data.OLLAMA_VISION_MODEL,
  ollamaEmbeddingModel: parsed.data.OLLAMA_EMBEDDING_MODEL,
} as const;
