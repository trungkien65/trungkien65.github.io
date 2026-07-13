import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

export function useQueryTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const parse = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return
    try {
      const params = new URLSearchParams(trimmed.startsWith("?") ? trimmed.slice(1) : trimmed)
      const obj: Record<string, string> = {}
      params.forEach((v, k) => (obj[k] = v))
      setOutput(JSON.stringify(obj, null, 2))
    } catch {
      showToast("Query string không hợp lệ", { variant: "destructive" })
    }
  }, [input])

  const build = useCallback(() => {
    try {
      const obj = JSON.parse(input.trim()) as Record<string, string>
      setOutput(new URLSearchParams(obj).toString())
    } catch {
      showToast('Nhập JSON: {"foo":"bar"}', { variant: "destructive" })
    }
  }, [input])

  return { input, setInput, output, parse, build }
}
