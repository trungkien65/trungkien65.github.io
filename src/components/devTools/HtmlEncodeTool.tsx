/**
 * HTML Encode/Decode
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

function encodeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c)
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function HtmlEncodeTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const encode = useCallback(() => {
    setOutput(encodeHtml(input))
  }, [input])

  const decode = useCallback(() => {
    setOutput(decodeHtml(input))
  }, [input])

  return (
    <ToolCard
      title="HTML Encode/Decode"
      description="Encode và decode HTML entities."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">INPUT</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="<script>alert('xss')</script>"
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
