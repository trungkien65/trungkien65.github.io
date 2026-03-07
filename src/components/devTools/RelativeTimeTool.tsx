/**
 * Relative Time - Format relative time (e.g. "2 giờ trước")
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function formatRelative(date: Date, base = new Date()): string {
  const diff = (base.getTime() - date.getTime()) / 1000
  const abs = Math.abs(diff)
  const sign = diff >= 0 ? "trước" : "sau"
  if (abs < 60) return `${Math.round(abs)} giây ${sign}`
  if (abs < 3600) return `${Math.round(abs / 60)} phút ${sign}`
  if (abs < 86400) return `${Math.round(abs / 3600)} giờ ${sign}`
  if (abs < 2592000) return `${Math.round(abs / 86400)} ngày ${sign}`
  if (abs < 31536000) return `${Math.round(abs / 2592000)} tháng ${sign}`
  return `${Math.round(abs / 31536000)} năm ${sign}`
}

export function RelativeTimeTool() {
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
    const d = new Date(trimmed)
    if (Number.isNaN(d.getTime())) {
      setError("Ngày không hợp lệ")
      setOutput("")
      return
    }
    setOutput(formatRelative(d))
  }, [input])

  return (
    <ToolCard
      title="Relative Time"
      description="Chuyển ngày thành thời gian tương đối."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Ngày</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="2025-03-07 10:00:00 hoặc timestamp"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={format}
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
        >
          Format
        </button>
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
            <p className="rounded bg-muted p-3 text-sm">{output}</p>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
