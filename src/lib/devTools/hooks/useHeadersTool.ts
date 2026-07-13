import { useCallback, useState } from "react"

function parseHeaders(text: string): Record<string, string> {
  const lines = text.split("\n")
  const result: Record<string, string> = {}
  for (const line of lines) {
    const colon = line.indexOf(":")
    if (colon > 0) {
      result[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
    }
  }
  return result
}

export function useHeadersTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)
  const [parsed, setParsed] = useState<Record<string, string>>({})

  const run = useCallback(() => {
    const t = input.trim()
    if (!t) {
      setOutput(null)
      return
    }
    const p = parseHeaders(t)
    if (Object.keys(p).length === 0) {
      setOutput(null)
      return
    }
    setParsed(p)
    setOutput(
      Object.entries(p)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    )
  }, [input])

  return { input, setInput, output, parsed, run }
}
