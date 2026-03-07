/**
 * JSON to TypeScript - Sinh interface từ JSON mẫu
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function jsonToTs(obj: unknown, name = "RootPayload"): string {
  if (obj === null) return "null"
  if (typeof obj === "boolean") return "boolean"
  if (typeof obj === "number") return "number"
  if (typeof obj === "string") return "string"
  if (Array.isArray(obj)) {
    const item = obj[0]
    const itemType = item != null ? jsonToTs(item, "Item") : "unknown"
    return `(${itemType})[]`
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>)
    const fields = entries
      .map(([k, v]) => {
        const t = jsonToTs(v, k.charAt(0).toUpperCase() + k.slice(1))
        return `  ${k}: ${t};`
      })
      .join("\n")
    return `{\n${fields}\n}`
  }
  return "unknown"
}

function generateInterface(obj: unknown): string {
  const body = jsonToTs(obj)
  if (body.startsWith("{")) {
    return `interface RootPayload ${body}`
  }
  return `type RootPayload = ${body}`
}

export function JsonToTs() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(() => {
    setError(null)
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput("")
      return
    }
    try {
      const parsed = JSON.parse(trimmed)
      setOutput(generateInterface(parsed))
    } catch (e) {
      setError("JSON không hợp lệ")
      setOutput("")
    }
  }, [input])

  return (
    <ToolCard
      title="JSON to TypeScript"
      description="Sinh type hoặc interface TypeScript từ JSON mẫu."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">JSON SAMPLE</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={generate}
            placeholder='{"id": 1, "name": "test", "tags": ["a"], "profile": {"active": true}}'
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            rows={6}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {output && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">TYPESCRIPT</span>
              <button
                type="button"
                onClick={() => copyToClipboard(output)}
                className="text-xs text-primary hover:underline"
              >
                Copy Type
              </button>
            </div>
            <pre className="overflow-x-auto rounded bg-muted p-3 font-mono text-xs">{output}</pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
