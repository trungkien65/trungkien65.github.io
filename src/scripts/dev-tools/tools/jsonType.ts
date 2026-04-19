import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

function jsonToTs(obj: unknown, _name = "RootPayload"): string {
  if (obj === null) return "null"
  if (typeof obj === "boolean") return "boolean"
  if (typeof obj === "number") return "number"
  if (typeof obj === "string") return "string"
  if (Array.isArray(obj)) {
    const item = obj[0]
    const itemType = item != null ? jsonToTs(item, "Item") : "unknown"
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

export function initJsonType(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-jts-input]")
  const out = root.querySelector<HTMLElement>("[data-dt-jts-out]")
  const pre = root.querySelector<HTMLElement>("[data-dt-jts-pre]")
  if (!ta || !out || !pre) return

  const run = () => {
    out.classList.add("hidden")
    const t = ta.value.trim()
    if (!t) return
    try {
      pre.textContent = generateInterface(JSON.parse(t))
      out.classList.remove("hidden")
    } catch {
      showToast("JSON không hợp lệ", { variant: "destructive" })
    }
  }
  ta.addEventListener("blur", run)
  root.querySelector<HTMLButtonElement>("[data-dt-jts-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
