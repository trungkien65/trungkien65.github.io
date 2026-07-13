import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

export type NumberBase = "dec" | "hex" | "bin"

export interface NumberBaseResult {
  key: string
  value: string
}

export function useNumberBaseTool() {
  const [input, setInput] = useState("")
  const [base, setBase] = useState<NumberBase>("dec")
  const [results, setResults] = useState<NumberBaseResult[] | null>(null)

  const run = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      setResults(null)
      return
    }
    try {
      let num: number
      if (base === "dec") num = Number.parseInt(trimmed, 10)
      else if (base === "hex") num = Number.parseInt(trimmed.replace(/^0x/, ""), 16)
      else num = Number.parseInt(trimmed.replace(/^0b/, ""), 2)
      if (Number.isNaN(num)) throw new Error("nan")
      setResults([
        { key: "decimal", value: String(num) },
        { key: "hex", value: "0x" + num.toString(16) },
        { key: "binary", value: "0b" + num.toString(2) },
      ])
    } catch {
      showToast("Số không hợp lệ", { variant: "destructive" })
    }
  }, [input, base])

  return { input, setInput, base, setBase, results, run }
}
