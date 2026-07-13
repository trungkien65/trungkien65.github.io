import { useCallback, useEffect, useRef, useState } from "react"
import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

const SAMPLE = `{
  "name": "demo",
  "tags": ["json", "formatter"],
  "active": true,
  "count": 42
}`

type ParseResult = { ok: true; data: unknown } | { ok: false; err: string }

function parseJson(s: string): ParseResult {
  const t = s.trim()
  if (!t) return { ok: false, err: "Chưa có JSON" }
  try {
    return { ok: true, data: JSON.parse(t) as unknown }
  } catch (e) {
    return { ok: false, err: e instanceof Error ? e.message : "Lỗi parse" }
  }
}

export function useJsonFormatterTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [indent, setIndent] = useState(2)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const trimmed = input.trim()
      if (!trimmed) {
        setOutput("")
        return
      }
      try {
        const data = JSON.parse(trimmed) as unknown
        setOutput(JSON.stringify(data, null, indent))
      } catch {
        /* typing */
      }
    }, 320)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [input, indent])

  const loadSample = useCallback(() => setInput(SAMPLE), [])

  const loadFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") setInput(reader.result)
    }
    reader.readAsText(file)
  }, [])

  const validate = useCallback(() => {
    const r = parseJson(input)
    if (!r.ok) {
      showToast(`Không hợp lệ: ${r.err}`, { variant: "destructive" })
      return
    }
    showToast("JSON hợp lệ.", { variant: "success" })
  }, [input])

  const format = useCallback(() => {
    const r = parseJson(input)
    if (!r.ok) {
      showToast(`JSON không hợp lệ: ${r.err}`, { variant: "destructive" })
      setOutput("")
      return
    }
    setOutput(JSON.stringify(r.data, null, indent))
  }, [input, indent])

  const beautify = useCallback(() => {
    const r = parseJson(input)
    if (!r.ok) {
      showToast(`JSON không hợp lệ: ${r.err}`, { variant: "destructive" })
      return
    }
    const pretty = JSON.stringify(r.data, null, indent)
    setInput(pretty)
    setOutput(pretty)
  }, [input, indent])

  const minify = useCallback(() => {
    const r = parseJson(input)
    if (!r.ok) {
      showToast("JSON không hợp lệ", { variant: "destructive" })
      setOutput("")
      return
    }
    setOutput(JSON.stringify(r.data))
  }, [input])

  const download = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: "application/json;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "formatted.json"
    a.click()
    URL.revokeObjectURL(a.href)
  }, [output])

  const copyOutput = useCallback(() => {
    void copyToClipboard(output)
  }, [output])

  return {
    input,
    setInput,
    output,
    indent,
    setIndent,
    loadSample,
    loadFile,
    validate,
    format,
    beautify,
    minify,
    download,
    copyOutput,
  }
}
