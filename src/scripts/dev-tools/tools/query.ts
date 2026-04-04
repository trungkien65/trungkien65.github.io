import { copyToClipboard } from "@/lib/devTools/clipboard"

export function initQuery(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-q-input]")
  const err = root.querySelector<HTMLElement>("[data-dt-q-error]")
  const pre = root.querySelector<HTMLElement>("[data-dt-q-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-q-wrap]")
  if (!ta || !err || !pre || !wrap) return

  root.querySelector<HTMLButtonElement>("[data-dt-q-parse]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    const trimmed = ta.value.trim()
    if (!trimmed) return
    try {
      const params = new URLSearchParams(trimmed.startsWith("?") ? trimmed.slice(1) : trimmed)
      const obj: Record<string, string> = {}
      params.forEach((v, k) => (obj[k] = v))
      pre.textContent = JSON.stringify(obj, null, 2)
      wrap.classList.remove("hidden")
    } catch {
      err.textContent = "Query string không hợp lệ"
      err.classList.remove("hidden")
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-q-build]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    try {
      const obj = JSON.parse(ta.value.trim()) as Record<string, string>
      pre.textContent = new URLSearchParams(obj).toString()
      wrap.classList.remove("hidden")
    } catch {
      err.textContent = 'Nhập JSON: {"foo":"bar"}'
      err.classList.remove("hidden")
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-q-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
