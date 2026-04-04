import { copyToClipboard } from "@/lib/devTools/clipboard"

export function initBase64(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-b64-input]")
  const out = root.querySelector<HTMLElement>("[data-dt-b64-out]")
  const pre = root.querySelector<HTMLElement>("[data-dt-b64-pre]")
  const err = root.querySelector<HTMLElement>("[data-dt-b64-error]")
  if (!ta || !out || !pre || !err) return

  root.querySelector<HTMLButtonElement>("[data-dt-b64-enc]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    try {
      pre.textContent = btoa(unescape(encodeURIComponent(ta.value)))
      out.classList.remove("hidden")
    } catch {
      err.textContent = "Không thể encode"
      err.classList.remove("hidden")
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-b64-dec]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    try {
      pre.textContent = decodeURIComponent(escape(atob(ta.value)))
      out.classList.remove("hidden")
    } catch {
      err.textContent = "Base64 không hợp lệ"
      err.classList.remove("hidden")
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-b64-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
