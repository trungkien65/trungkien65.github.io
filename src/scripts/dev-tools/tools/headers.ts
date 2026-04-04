import { copyToClipboard } from "@/lib/devTools/clipboard"

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

export function initHeaders(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-hdr-input]")
  const pre = root.querySelector<HTMLElement>("[data-dt-hdr-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-hdr-wrap]")
  if (!ta || !pre || !wrap) return

  const run = () => {
    const t = ta.value.trim()
    if (!t) {
      wrap.classList.add("hidden")
      return
    }
    const p = parseHeaders(t)
    if (Object.keys(p).length === 0) {
      wrap.classList.add("hidden")
      return
    }
    pre.textContent = Object.entries(p).map(([k, v]) => `${k}: ${v}`).join("\n")
    wrap.classList.remove("hidden")
  }
  ta.addEventListener("blur", run)
  root.querySelector<HTMLButtonElement>("[data-dt-hdr-copy]")?.addEventListener("click", () =>
    copyToClipboard(JSON.stringify(parseHeaders(ta.value), null, 2))
  )
}
