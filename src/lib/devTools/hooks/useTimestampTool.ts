import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

export function useTimestampTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const toDate = useCallback(() => {
    const ts = Number.parseInt(input.trim(), 10)
    if (Number.isNaN(ts)) {
      showToast("Nhập số Unix timestamp (giây)", { variant: "destructive" })
      return
    }
    setOutput(new Date(ts * 1000).toLocaleString("vi-VN"))
  }, [input])

  const toTimestamp = useCallback(() => {
    const d = new Date(input.trim())
    if (Number.isNaN(d.getTime())) {
      showToast("Ngày không hợp lệ", { variant: "destructive" })
      return
    }
    setOutput(String(Math.floor(d.getTime() / 1000)))
  }, [input])

  const now = useCallback(() => {
    const n = Math.floor(Date.now() / 1000)
    setInput(String(n))
    setOutput(new Date().toLocaleString("vi-VN"))
  }, [])

  return { input, setInput, output, toDate, toTimestamp, now }
}
