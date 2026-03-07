/**
 * Cron Parser - Parse cron expression (đơn giản)
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

export function CronParserTool() {
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
    const parts = trimmed.split(/\s+/)
    if (parts.length < 5) {
      setError("Cron cần 5 phần: phút giờ ngày tháng thứ")
      setOutput("")
      return
    }
    const [min, hour, day, month, dow] = parts
    const desc = [
      `Phút: ${min}`,
      `Giờ: ${hour}`,
      `Ngày: ${day}`,
      `Tháng: ${month}`,
      `Thứ: ${dow}`,
    ].join("\n")
    setOutput(desc)
  }, [input])

  return (
    <ToolCard
      title="Cron Parser"
      description="Parse cron expression (đơn giản)."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Cron expression</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="*/5 * * * *"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
          />
        </div>
        <button
          type="button"
          onClick={parse}
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
        >
          Parse
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {output && (
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium">PARSED</span>
              <button
                type="button"
                onClick={() => copyToClipboard(output)}
                className="text-xs text-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <pre className="rounded bg-muted p-3 font-mono text-xs">{output}</pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
