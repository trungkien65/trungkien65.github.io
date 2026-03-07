/**
 * Timestamp - Unix timestamp converter
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

export function TimestampTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const toDate = useCallback(() => {
    setError(null)
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput("")
      return
    }
    const ts = Number.parseInt(trimmed, 10)
    if (Number.isNaN(ts)) {
      setError("Nhập số Unix timestamp (giây)")
      setOutput("")
      return
    }
    const d = new Date(ts * 1000)
    setOutput(d.toLocaleString("vi-VN"))
  }, [input])

  const toTimestamp = useCallback(() => {
    setError(null)
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput("")
      return
    }
    const d = new Date(trimmed)
    if (Number.isNaN(d.getTime())) {
      setError("Ngày không hợp lệ")
      setOutput("")
      return
    }
    setOutput(String(Math.floor(d.getTime() / 1000)))
  }, [input])

  const now = useCallback(() => {
    setInput(String(Math.floor(Date.now() / 1000)))
    setOutput(new Date().toLocaleString("vi-VN"))
    setError(null)
  }, [])

  return (
    <ToolCard
      title="Timestamp"
      description="Chuyển đổi Unix timestamp và ngày."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Timestamp (giây) hoặc ngày</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="1741304200 hoặc 2025-03-07"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toDate}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Timestamp → Ngày
          </button>
          <button
            type="button"
            onClick={toTimestamp}
            className="rounded border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Ngày → Timestamp
          </button>
          <button
            type="button"
            onClick={now}
            className="rounded border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Now
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
            <p className="rounded bg-muted p-3 font-mono text-sm">{output}</p>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
