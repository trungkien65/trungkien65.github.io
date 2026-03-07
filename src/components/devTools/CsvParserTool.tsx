/**
 * CSV Parser - CSV to JSON
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function csvToJson(csv: string): unknown[] {
  const lines = csv.split("\n").filter((l) => l.trim())
  if (lines.length === 0) return []
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const result: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const obj: Record<string, string> = {}
    headers.forEach((h, j) => (obj[h] = values[j] ?? ""))
    result.push(obj)
  }
  return result
}

export function CsvParserTool() {
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
      setOutput(JSON.stringify(csvToJson(trimmed), null, 2))
    } catch (e) {
      setError("CSV không hợp lệ")
      setOutput("")
    }
  }, [input])

  return (
    <ToolCard
      title="CSV Parser"
      description="Parse CSV sang JSON."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">CSV</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"name,age,city\nJohn,30,NYC\nJane,25,LA"}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            rows={6}
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
              <span className="text-sm font-medium">JSON</span>
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
