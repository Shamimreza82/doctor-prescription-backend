import { TAiTask } from './ai.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AI_TASK_MODELS: Record<TAiTask, { provider: any; model: string }> = {
  prescription_draft: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
  },
  patient_summary: {
    provider: 'gemini',
    model: 'gemini-2.5-pro',
  },
  lab_analysis: {
    provider: 'ollama',
    model: 'qwen2.5:7b',
  },
};

export const AI_FALLBACK_MODELS = [
  { provider: 'gemini', model: 'gemini-2.5-flash' },
  { provider: 'openai', model: 'gpt-4.1-mini' },
  { provider: 'ollama', model: 'qwen2.5:7b' },
];