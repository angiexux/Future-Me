export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

function apiUrl(path: string): string {
  const base = (
    import.meta.env.VITE_API_BASE as string | undefined
  )?.replace(/\/$/, '') ?? ''
  return `${base}${path}`
}

export async function createMessage(params: {
  model: string
  max_tokens: number
  system?: string
  messages: ClaudeMessage[]
}): Promise<{ content: Array<{ type: string; text?: string }> }> {
  const res = await fetch(apiUrl('/api/llm'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const raw = await res.text()
  if (!res.ok) {
    let detail = raw
    try {
      const j = JSON.parse(raw) as {
        error?: string | { message?: string; type?: string }
        message?: string
      }
      if (typeof j.error === 'object' && j.error?.message) {
        detail =
          j.error.type === 'authentication_error'
            ? `${j.error.message} (check ANTHROPIC_API_KEY on the server)`
            : j.error.message
      } else if (typeof j.error === 'string') {
        detail = j.error
      } else {
        detail = j.message ?? raw
      }
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
