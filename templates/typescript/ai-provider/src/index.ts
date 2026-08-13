export type AIProviderName = "openai" | "deepseek" | "gemini" | "local" | "custom";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatInput {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
}

export interface ChatOutput {
  text: string;
  model?: string;
}

export interface AIProvider {
  readonly name: AIProviderName;
  chat(input: ChatInput): Promise<ChatOutput>;
  stream?(input: ChatInput): AsyncIterable<string>;
  embed?(input: string[]): Promise<number[][]>;
}

export interface ProviderConfig {
  name: AIProviderName;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
}

export const providerProtocols: Record<AIProviderName, "openai-compatible" | "google-generative" | "custom"> = {
  openai: "openai-compatible",
  deepseek: "openai-compatible",
  gemini: "google-generative",
  local: "openai-compatible",
  custom: "custom",
};
