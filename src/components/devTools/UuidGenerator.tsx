/**
 * UUID Generator - Tạo UUID v4
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function UuidGenerator() {
  const [count, setCount] = useState(3)
  const [uuids, setUuids] = useState<string[]>([])

  const generate = useCallback(() => {
    const n = Math.min(Math.max(1, count), 50)
    setUuids(Array.from({ length: n }, uuidv4))
  }, [count])

  const copyAll = useCallback(() => {
    copyToClipboard(uuids.join("\n"))
  }, [uuids])

  return (
    <ToolCard
      title="UUID Generator"
      description="Tạo UUID v4 ngay trên trình duyệt."
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">SỐ LƯỢNG</label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number.parseInt(e.target.value, 10) || 1)}
              className="w-20 rounded-lg border border-border bg-card px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={generate}
            className="mt-6 rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Tạo UUID
          </button>
        </div>
        {uuids.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">UUID</span>
              <button
                type="button"
                onClick={copyAll}
                className="text-xs text-primary hover:underline"
              >
                Copy All
              </button>
            </div>
            <ul className="space-y-2">
              {uuids.map((id) => (
                <li key={id} className="flex items-center gap-2 font-mono text-sm">
                  <code className="flex-1 rounded bg-muted px-2 py-1">{id}</code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(id)}
                    className="text-xs text-primary hover:underline"
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
