import { useCallback, useState } from "react"

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }

function encodeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c)
}
function decodeHtml(s: string): string {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

export function useHtmlTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const encode = useCallback(() => setOutput(encodeHtml(input)), [input])
  const decode = useCallback(() => setOutput(decodeHtml(input)), [input])

  return { input, setInput, output, encode, decode }
}
