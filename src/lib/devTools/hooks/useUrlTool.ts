import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

export function useUrlTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const parse = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput(null)
      return
    }
    try {
      const url = new URL(trimmed.startsWith("http") ? trimmed : "https://" + trimmed)
      const lines: string[] = [
        `protocol: ${url.protocol}`,
        `hostname: ${url.hostname}`,
        `port: ${url.port || "-"}`,
        `pathname: ${url.pathname}`,
        `search: ${url.search || "-"}`,
        `hash: ${url.hash || "-"}`,
        `origin: ${url.origin}`,
        `href: ${url.href}`,
      ]
      if (url.searchParams.toString()) {
        const o: Record<string, string> = {}
        url.searchParams.forEach((v, k) => (o[k] = v))
        lines.push(`query params: ${JSON.stringify(o, null, 2)}`)
      }
      setOutput(lines.join("\n"))
    } catch {
      showToast("URL không hợp lệ", { variant: "destructive" })
    }
  }, [input])

  return { input, setInput, output, parse }
}
