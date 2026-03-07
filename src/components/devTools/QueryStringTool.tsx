/**
 * Query String - Parse & build query string
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

export function QueryStringTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const parse = useCallback(() => {
    setError(null)
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput("")
      return
    }
    try {
      const params = new URLSearchParams(trimmed.startsWith("?") ? trimmed.slice(1) : trimmed)
      const obj: Record<string, string> = {}
      params.forEach((v, k) => (obj[k] = v))
      setOutput(JSON.stringify(obj, null, 2))
    } catch (e) {
      setError("Query string không hợp lệ")
      setOutput("")
    }
  }, [input])

  const build = useCallback(() => {
    setError(null)
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput("")
      return
    }
    try {
      const obj = JSON.parse(trimmed) as Record<string, string>
      setOutput(new URLSearchParams(obj).toString())
    } catch {
      setError('Nhập JSON: {"foo":"bar","baz":"qux"}')
      setOutput("")
    }
  }, [input])

  return (
    <ToolCard
      title="Query String"
      description="Parse và build query string."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Query string hoặc JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='foo=bar&baz=qux hoặc {"foo":"bar"}'
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            rows={4}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={parse}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Parse
          </button>
          <button
            type="button"
            onClick={build}
            className="rounded border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Build (từ JSON)
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
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs break-all">{output}</pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
