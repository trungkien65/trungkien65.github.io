import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

function jsonToTs(obj: unknown): string {
  if (obj === null) return "null"
  if (typeof obj === "boolean") return "boolean"
  if (typeof obj === "number") return "number"
  if (typeof obj === "string") return "string"
  if (Array.isArray(obj)) {
    const item = obj[0]
    const itemType = item != null ? jsonToTs(item) : "unknown"
    return `(${itemType})[]`
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>)
    const fields = entries.map(([k, v]) => `  ${k}: ${jsonToTs(v)};`).join("\n")
    return `{\n${fields}\n}`
  }
  return "unknown"
}

function generateInterface(obj: unknown): string {
  const body = jsonToTs(obj)
  if (body.startsWith("{")) return `interface RootPayload ${body}`
  return `type RootPayload = ${body}`
}

export function useJsonTypeTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const run = useCallback(() => {
    const t = input.trim()
    if (!t) {
      setOutput(null)
      return
    }
    try {
      setOutput(generateInterface(JSON.parse(t)))
    } catch {
      showToast("JSON không hợp lệ", { variant: "destructive" })
    }
  }, [input])

  return { input, setInput, output, run }
}
