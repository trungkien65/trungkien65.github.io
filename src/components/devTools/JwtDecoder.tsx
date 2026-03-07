/**
 * JWT Decoder - Decode header và payload của JWT
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function base64UrlDecode(str: string): string {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
  } catch {
    return ""
  }
}

function formatTimestamp(ts: number): string {
  if (!ts || ts < 0) return "-"
  const d = new Date(ts * 1000)
  return d.toLocaleString("vi-VN")
}

export function JwtDecoder() {
  const [input, setInput] = useState("")
  const [header, setHeader] = useState<object | null>(null)
  const [payload, setPayload] = useState<object | null>(null)
  const [timeClaims, setTimeClaims] = useState<{ key: string; ts: number; formatted: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  const decode = useCallback(() => {
    setError(null)
    setHeader(null)
    setPayload(null)
    setTimeClaims([])
    const trimmed = input.trim()
    if (!trimmed) return
    const parts = trimmed.split(".")
    if (parts.length !== 3) {
      setError("JWT phải có 3 phần (header.payload.signature)")
      return
    }
    try {
      const h = JSON.parse(base64UrlDecode(parts[0]))
      const p = JSON.parse(base64UrlDecode(parts[1]))
      setHeader(h)
      setPayload(p)
      const timeKeys = ["iat", "exp", "nbf"]
      const claims = timeKeys
        .filter((k) => typeof p[k] === "number")
        .map((k) => ({ key: k, ts: p[k] as number, formatted: formatTimestamp(p[k] as number) }))
      setTimeClaims(claims)
    } catch (e) {
      setError("Không thể decode. Kiểm tra JWT hợp lệ.")
    }
  }, [input])

  const handleCopy = (text: string) => async () => {
    await copyToClipboard(text)
  }

  return (
    <ToolCard
      title="JWT Decoder"
      description="Decode header và payload của JWT. Signature chưa được verify."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">JWT</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={decode}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            rows={3}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {header && payload && (
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">HEADER</span>
                <button
                  type="button"
                  onClick={handleCopy(JSON.stringify(header, null, 2))}
                  className="text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
              <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">PAYLOAD</span>
                <button
                  type="button"
                  onClick={handleCopy(JSON.stringify(payload, null, 2))}
                  className="text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
              <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
            {timeClaims.length > 0 && (
              <div>
                <span className="text-sm font-medium">TIME CLAIMS</span>
                <ul className="mt-2 space-y-1 text-sm">
                  {timeClaims.map((c) => (
                    <li key={c.key}>
                      {c.key}: {c.ts} → {c.formatted}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
