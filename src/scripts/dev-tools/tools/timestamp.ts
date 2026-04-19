import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

export function initTimestamp(root: HTMLElement) {
  const inp = root.querySelector<HTMLInputElement>("[data-dt-ts-input]")
  const out = root.querySelector<HTMLElement>("[data-dt-ts-out]")
  if (!inp || !out) return

  root.querySelector<HTMLButtonElement>("[data-dt-ts-to-date]")?.addEventListener("click", () => {
    const ts = Number.parseInt(inp.value.trim(), 10)
    if (Number.isNaN(ts)) {
      showToast("Nhập số Unix timestamp (giây)", { variant: "destructive" })
      return
    }
    out.textContent = new Date(ts * 1000).toLocaleString("vi-VN")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-ts-to-ts]")?.addEventListener("click", () => {
    const d = new Date(inp.value.trim())
    if (Number.isNaN(d.getTime())) {
      showToast("Ngày không hợp lệ", { variant: "destructive" })
      return
    }
    out.textContent = String(Math.floor(d.getTime() / 1000))
  })
  root.querySelector<HTMLButtonElement>("[data-dt-ts-now]")?.addEventListener("click", () => {
    inp.value = String(Math.floor(Date.now() / 1000))
    out.textContent = new Date().toLocaleString("vi-VN")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-ts-copy]")?.addEventListener("click", () =>
    copyToClipboard(out.textContent ?? "")
  )
}
