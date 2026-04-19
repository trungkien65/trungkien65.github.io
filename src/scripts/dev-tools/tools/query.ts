import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

export function initQuery(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-q-input]")
  const pre = root.querySelector<HTMLElement>("[data-dt-q-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-q-wrap]")
  if (!ta || !pre || !wrap) return

  root.querySelector<HTMLButtonElement>("[data-dt-q-parse]")?.addEventListener("click", () => {
    const trimmed = ta.value.trim()
    if (!trimmed) return
    try {
      const params = new URLSearchParams(trimmed.startsWith("?") ? trimmed.slice(1) : trimmed)
      const obj: Record<string, string> = {}
      params.forEach((v, k) => (obj[k] = v))
      pre.textContent = JSON.stringify(obj, null, 2)
      wrap.classList.remove("hidden")
    } catch {
      showToast("Query string không hợp lệ", { variant: "destructive" })
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-q-build]")?.addEventListener("click", () => {
    try {
      const obj = JSON.parse(ta.value.trim()) as Record<string, string>
      pre.textContent = new URLSearchParams(obj).toString()
      wrap.classList.remove("hidden")
    } catch {
      showToast('Nhập JSON: {"foo":"bar"}', { variant: "destructive" })
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-q-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
