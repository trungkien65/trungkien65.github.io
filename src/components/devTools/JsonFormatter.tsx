/**
 * JSON Formatter - Format & validate JSON
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const format = useCallback(() => {
    setError(null)
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput("")
      return
    }
    try {
      const parsed = JSON.parse(trimmed)
      setOutput(JSON.stringify(parsed, null, 2))
    } catch (e) {
      setError("JSON không hợp lệ: " + (e instanceof Error ? e.message : ""))
      setOutput("")
    }
  }, [input])

  const minify = useCallback(() => {
    setError(null)
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput("")
      return
    }
    try {
      const parsed = JSON.parse(trimmed)
      setOutput(JSON.stringify(parsed))
    } catch (e) {
      setError("JSON không hợp lệ")
      setOutput("")
    }
  }, [input])

  return (
    <ToolCard
      title="JSON Formatter"
      description="Format và validate JSON."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key":"value"}'
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            rows={6}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={format}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Format
          </button>
          <button
            type="button"
            onClick={minify}
            className="rounded border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Minify
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {output && (
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium">OUTPUT</span>
              <button
                type="button"
                onClick={() => copyToClipboard(output)}
                className="text-xs text-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <pre className="max-h-64 overflow-auto rounded bg-muted p-3 font-mono text-xs">{output}</pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
