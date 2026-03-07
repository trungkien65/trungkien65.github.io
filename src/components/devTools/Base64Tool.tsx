/**
 * Base64 Encode/Decode
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

export function Base64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const encode = useCallback(() => {
    setError(null)
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))))
    } catch (e) {
      setError("Không thể encode")
    }
  }, [input])

  const decode = useCallback(() => {
    setError(null)
    try {
      setOutput(decodeURIComponent(escape(atob(input))))
    } catch (e) {
      setError("Base64 không hợp lệ")
    }
  }, [input])

  return (
    <ToolCard
      title="Base64 Encode/Decode"
      description="Encode và decode Base64."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">INPUT</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Text hoặc Base64"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            rows={4}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={encode}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Encode
          </button>
          <button
            type="button"
            onClick={decode}
            className="rounded border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Decode
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
            <pre className="max-h-48 overflow-auto rounded bg-muted p-3 font-mono text-xs break-all">{output}</pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
