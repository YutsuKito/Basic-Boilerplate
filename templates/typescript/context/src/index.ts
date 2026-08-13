export interface ContextItem {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
}

export interface ContextSource {
  search(text: string, limit?: number): Promise<ContextItem[]>;
}

export function combineContext(items: ContextItem[]): string {
  return items.map((item) => item.text).join("\n\n");
}
