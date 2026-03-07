/**
 * URL Parser - Parse URL components
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

export function UrlParser() {
  const [input, setInput] = useState("")
  const [parsed, setParsed] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const parse = useCallback(() => {
    setError(null)
    setParsed(null)
    const trimmed = input.trim()
    if (!trimmed) return
    try {
      const url = new URL(trimmed.startsWith("http") ? trimmed : "https://" + trimmed)
      const result: Record<string, string> = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || "-",
        pathname: url.pathname,
        search: url.search || "-",
        hash: url.hash || "-",
        origin: url.origin,
        href: url.href,
      }
      if (url.searchParams.toString()) {
        const params: Record<string, string> = {}
        url.searchParams.forEach((v, k) => (params[k] = v))
        result["query params"] = JSON.stringify(params, null, 2)
      }
      setParsed(result)
    } catch (e) {
      setError("URL không hợp lệ")
    }
  }, [input])

  return (
    <ToolCard
      title="URL Parser"
      description="Parse URL components."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">URL</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={parse}
            placeholder="https://example.com/path?foo=bar"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {parsed && (
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
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join("\n")}
            </pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
