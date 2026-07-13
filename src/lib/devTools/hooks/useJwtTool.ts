import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

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
  return new Date(ts * 1000).toLocaleString("vi-VN")
}

const TIME_KEYS = ["iat", "exp", "nbf"] as const

export interface JwtResult {
  header: string
  payload: string
  timeClaims: { key: string; text: string }[]
}

export function useJwtTool() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<JwtResult | null>(null)

  const decode = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      setResult(null)
      return
    }
    const parts = trimmed.split(".")
    if (parts.length !== 3) {
      showToast("JWT phải có 3 phần (header.payload.signature)", { variant: "destructive" })
      return
    }
    try {
      const h = JSON.parse(base64UrlDecode(parts[0]))
      const p = JSON.parse(base64UrlDecode(parts[1]))
      const timeClaims = TIME_KEYS.filter((k) => typeof p[k] === "number").map((k) => ({
        key: k,
        text: `${k}: ${p[k]} → ${formatTimestamp(p[k])}`,
      }))
      setResult({ header: JSON.stringify(h, null, 2), payload: JSON.stringify(p, null, 2), timeClaims })
    } catch {
      showToast("Không thể decode. Kiểm tra JWT hợp lệ.", { variant: "destructive" })
      setResult(null)
    }
  }, [input])

  return { input, setInput, result, decode }
}
