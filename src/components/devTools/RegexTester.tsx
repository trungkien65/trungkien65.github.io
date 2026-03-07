/**
 * Regex Tester - Test regex patterns
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

export function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [text, setText] = useState("")
  const [flags, setFlags] = useState("g")
  const [matches, setMatches] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const test = useCallback(() => {
    setError(null)
    setMatches([])
    if (!pattern.trim()) return
    try {
      const re = new RegExp(pattern, flags)
      const m = text.match(re)
      setMatches(m ? [...m] : [])
    } catch (e) {
      setError("Regex không hợp lệ: " + (e instanceof Error ? e.message : ""))
    }
  }, [pattern, text, flags])

  return (
    <ToolCard
      title="Regex Tester"
      description="Test regex patterns."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\d+"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Flags (g, i, m)</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g"
            className="w-20 rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Test string..."
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            rows={4}
          />
        </div>
        <button
          type="button"
          onClick={test}
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
        >
          Test
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {matches.length > 0 && (
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium">Matches ({matches.length})</span>
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(matches))}
                className="text-xs text-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <pre className="rounded bg-muted p-3 font-mono text-xs">
              {matches.map((m, i) => `[${i}]: ${m}`).join("\n")}
            </pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
