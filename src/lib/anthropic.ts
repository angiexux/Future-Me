export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function createMessage(params: {
  model: string
  max_tokens: number
  system?: string
  messages: ClaudeMessage[]
}): Promise<{ content: Array<{ type: string; text?: string }> }> {
  const res = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const raw = await res.text()
  if (!res.ok) {
    let detail = raw
    try {
      const j = JSON.parse(raw) as { error?: { message?: string }; message?: string }
      detail = j.error?.message ?? j.message ?? raw
    } catch {
      /* ignore */
    }
    throw new Error(detail || `HTTP ${res.status}`)
  }
  return JSON.parse(raw) as { content: Array<{ type: string; text?: string }> }
}

export function messageText(response: {
  content: Array<{ type: string; text?: string }>
}): string {
  return response.content
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text as string)
    .join('\n')
}

export function parseJsonFromModel<T>(text: string): T {
  const trimmed = text.trim()
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const inner = fence ? fence[1].trim() : trimmed
  return JSON.parse(inner) as T
}
