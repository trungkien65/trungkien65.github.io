import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

export function useRegexTool() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [text, setText] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const run = useCallback(() => {
    if (!pattern.trim()) {
      setOutput(null)
      return
    }
    try {
      const re = new RegExp(pattern, flags || "g")
      const m = text.match(re)
      setOutput(m ? m.map((x, i) => `[${i}]: ${x}`).join("\n") : "(no match)")
    } catch (e) {
      showToast("Regex không hợp lệ: " + (e instanceof Error ? e.message : ""), { variant: "destructive" })
    }
  }, [pattern, flags, text])

  return { pattern, setPattern, flags, setFlags, text, setText, output, run }
}
