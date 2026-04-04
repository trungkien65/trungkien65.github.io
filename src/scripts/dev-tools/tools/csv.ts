import { copyToClipboard } from "@/lib/devTools/clipboard"

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

export function initCsv(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-csv-input]")
  const err = root.querySelector<HTMLElement>("[data-dt-csv-error]")
  const pre = root.querySelector<HTMLElement>("[data-dt-csv-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-csv-wrap]")
  if (!ta || !err || !pre || !wrap) return

  root.querySelector<HTMLButtonElement>("[data-dt-csv-go]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    try {
      pre.textContent = JSON.stringify(csvToJson(ta.value.trim()), null, 2)
      wrap.classList.remove("hidden")
    } catch {
      err.textContent = "CSV không hợp lệ"
      err.classList.remove("hidden")
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-csv-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
