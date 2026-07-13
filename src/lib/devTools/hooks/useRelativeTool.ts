import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

function formatRelative(date: Date, base = new Date()): string {
  const diff = (base.getTime() - date.getTime()) / 1000
  const abs = Math.abs(diff)
  const sign = diff >= 0 ? "trước" : "sau"
  if (abs < 60) return `${Math.round(abs)} giây ${sign}`
  if (abs < 3600) return `${Math.round(abs / 60)} phút ${sign}`
  if (abs < 86400) return `${Math.round(abs / 3600)} giờ ${sign}`
  if (abs < 2592000) return `${Math.round(abs / 86400)} ngày ${sign}`
  if (abs < 31536000) return `${Math.round(abs / 2592000)} tháng ${sign}`
  return `${Math.round(abs / 31536000)} năm ${sign}`
}

export function useRelativeTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const run = useCallback(() => {
    const d = new Date(input.trim())
    if (Number.isNaN(d.getTime())) {
      showToast("Ngày không hợp lệ", { variant: "destructive" })
      return
    }
    setOutput(formatRelative(d))
  }, [input])

  return { input, setInput, output, run }
}
