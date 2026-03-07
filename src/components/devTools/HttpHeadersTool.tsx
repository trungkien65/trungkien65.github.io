/**
 * HTTP Headers - Parse HTTP headers
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function parseHeaders(text: string): Record<string, string> {
  const lines = text.split("\n")
  const result: Record<string, string> = {}
  for (const line of lines) {
    const colon = line.indexOf(":")
    if (colon > 0) {
      const key = line.slice(0, colon).trim()
      const value = line.slice(colon + 1).trim()
      result[key] = value
    }
  }
  return result
}

export function HttpHeadersTool() {
  const [input, setInput] = useState("")
  const [parsed, setParsed] = useState<Record<string, string> | null>(null)

  const parse = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      setParsed(null)
      return
    }
    setParsed(parseHeaders(trimmed))
  }, [input])

  return (
    <ToolCard
      title="HTTP Headers"
      description="Parse HTTP headers."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Headers</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={parse}
            placeholder={"Content-Type: application/json\nAuthorization: Bearer xxx"}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            rows={6}
          />
        </div>
        {parsed && Object.keys(parsed).length > 0 && (
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium">PARSED</span>
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(parsed, null, 2))}
                className="text-xs text-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <pre className="max-h-64 overflow-auto rounded bg-muted p-3 text-xs">
              {Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join("\n")}
            </pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
