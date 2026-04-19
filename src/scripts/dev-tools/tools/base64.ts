import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

export function initBase64(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-b64-input]")
  const out = root.querySelector<HTMLElement>("[data-dt-b64-out]")
  const pre = root.querySelector<HTMLElement>("[data-dt-b64-pre]")
  if (!ta || !out || !pre) return

  root.querySelector<HTMLButtonElement>("[data-dt-b64-enc]")?.addEventListener("click", () => {
    try {
      pre.textContent = btoa(unescape(encodeURIComponent(ta.value)))
      out.classList.remove("hidden")
    } catch {
      showToast("Không thể encode", { variant: "destructive" })
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-b64-dec]")?.addEventListener("click", () => {
    try {
      pre.textContent = decodeURIComponent(escape(atob(ta.value)))
      out.classList.remove("hidden")
    } catch {
      showToast("Base64 không hợp lệ", { variant: "destructive" })
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-b64-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
