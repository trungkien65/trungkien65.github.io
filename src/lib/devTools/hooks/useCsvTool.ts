import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

function csvToJson(csv: string): unknown[] {
  const lines = csv.split("\n").filter((l) => l.trim())
  if (lines.length === 0) return []
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const result: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const obj: Record<string, string> = {}
    headers.forEach((h, j) => (obj[h] = values[j] ?? ""))
    result.push(obj)
  }
  return result
}

export function useCsvTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const run = useCallback(() => {
    try {
      setOutput(JSON.stringify(csvToJson(input.trim()), null, 2))
    } catch {
      showToast("CSV không hợp lệ", { variant: "destructive" })
    }
  }, [input])

  return { input, setInput, output, run }
}
