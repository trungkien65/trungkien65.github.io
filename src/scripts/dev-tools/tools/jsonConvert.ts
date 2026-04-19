import { jsonToCsv, jsonToXml, jsonToYaml } from "@/lib/devTools/jsonConverters"
import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

export function initJsonConvert(root: HTMLElement, kind: "xml" | "csv" | "yaml") {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-jc-input]")
  const rootInp = root.querySelector<HTMLInputElement>("[data-dt-jc-root]")
  const pre = root.querySelector<HTMLElement>("[data-dt-jc-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-jc-wrap]")
  if (!ta || !pre || !wrap) return

  const label =
    kind === "xml" ? "XML" : kind === "csv" ? "CSV" : "YAML"
  root.querySelector<HTMLElement>("[data-dt-jc-out-label]")!.textContent = label

  root.querySelector<HTMLButtonElement>("[data-dt-jc-go]")?.addEventListener("click", () => {
    const trimmed = ta.value.trim()
    if (!trimmed) {
      wrap.classList.add("hidden")
      return
    }
    try {
      const parsed = JSON.parse(trimmed) as unknown
      if (kind === "xml")
        pre.textContent = jsonToXml(parsed, rootInp?.value.trim() || "root")
      else if (kind === "csv") pre.textContent = jsonToCsv(parsed)
      else pre.textContent = jsonToYaml(parsed)
      wrap.classList.remove("hidden")
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Lỗi chuyển đổi", { variant: "destructive" })
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-jc-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
