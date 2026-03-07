/**
 * Slug Generator - Tạo slug từ text
 */
import { useState, useMemo } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function SlugGenerator() {
  const [input, setInput] = useState("")

  const slug = useMemo(() => (input.trim() ? toSlug(input.trim()) : ""), [input])

  return (
    <ToolCard
      title="Slug Generator"
      description="Tạo slug từ text (URL-friendly)."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">SOURCE TEXT</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hello World! Đây là tiêu đề"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        {slug && (
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium">SLUG</span>
              <button
                type="button"
                onClick={() => copyToClipboard(slug)}
                className="text-xs text-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <code className="block rounded bg-muted p-3 font-mono text-sm">{slug}</code>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
