/**
 * Hash Generator - SHA-1, SHA-256, SHA-384, SHA-512
 */
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { ToolCard, copyToClipboard } from "./ToolCard"

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const

async function hashText(text: string, algo: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function HashGenerator() {
  const [text, setText] = useState("")
  const [algo, setAlgo] = useState<(typeof ALGOS)[number]>("SHA-256")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = useCallback(async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const h = await hashText(text, algo)
      setOutput(h)
    } catch (e) {
      setOutput("Lỗi: " + (e instanceof Error ? e.message : "Unknown"))
    } finally {
      setLoading(false)
    }
  }, [text, algo])

  return (
    <ToolCard
      title="Hash Generator"
      description="Sinh hash từ text bằng Web Crypto API."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">TEXT</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập text cần hash..."
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            rows={3}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ALGOS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAlgo(a)}
              className={cn(
                "rounded px-3 py-1.5 text-sm",
                algo === a ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              )}
            >
              {a}
            </button>
          ))}
          <button
            type="button"
            onClick={generate}
            disabled={loading || !text.trim()}
            className="rounded bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Sinh hash"}
          </button>
        </div>
        {output && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">HASH OUTPUT</span>
              <button
                type="button"
                onClick={() => copyToClipboard(output)}
                className="text-xs text-primary hover:underline"
              >
                Copy Hash
              </button>
            </div>
            <pre className="break-all rounded bg-muted p-3 font-mono text-xs">{output}</pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
