import type { AIProviderName, ProviderConfig } from "./index.js";

export function providerConfig(name: AIProviderName, env: NodeJS.ProcessEnv = process.env): ProviderConfig {
  return {
    name,
    baseUrl: env.AI_BASE_URL,
    apiKey: env.AI_API_KEY,
    model: env.AI_MODEL,
  };
}

export const supportedProviders: AIProviderName[] = [
  "openai",
  "deepseek",
  "gemini",
  "local",
  "custom",
];
