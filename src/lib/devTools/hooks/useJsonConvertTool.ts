import { useCallback, useState } from "react"
import { jsonToCsv, jsonToXml, jsonToYaml } from "@/lib/devTools/jsonConverters"
import { showToast } from "@/lib/ui/toast"

export type JsonConvertKind = "xml" | "csv" | "yaml"

const LABELS: Record<JsonConvertKind, string> = { xml: "XML", csv: "CSV", yaml: "YAML" }

export function useJsonConvertTool(kind: JsonConvertKind) {
  const [input, setInput] = useState("")
  const [root, setRoot] = useState("root")
  const [output, setOutput] = useState<string | null>(null)

  const convert = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      setOutput(null)
      return
    }
    try {
      const parsed = JSON.parse(trimmed) as unknown
      if (kind === "xml") setOutput(jsonToXml(parsed, root.trim() || "root"))
      else if (kind === "csv") setOutput(jsonToCsv(parsed))
      else setOutput(jsonToYaml(parsed))
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Lỗi chuyển đổi", { variant: "destructive" })
    }
  }, [input, root, kind])

  return { input, setInput, root, setRoot, output, convert, label: LABELS[kind] }
}
