import { copyToClipboard } from "@/lib/devTools/clipboard"

export function initTimestamp(root: HTMLElement) {
  const inp = root.querySelector<HTMLInputElement>("[data-dt-ts-input]")
  const err = root.querySelector<HTMLElement>("[data-dt-ts-error]")
  const out = root.querySelector<HTMLElement>("[data-dt-ts-out]")
  if (!inp || !err || !out) return

  root.querySelector<HTMLButtonElement>("[data-dt-ts-to-date]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    const ts = Number.parseInt(inp.value.trim(), 10)
    if (Number.isNaN(ts)) {
      err.textContent = "Nhập số Unix timestamp (giây)"
      err.classList.remove("hidden")
      return
    }
    out.textContent = new Date(ts * 1000).toLocaleString("vi-VN")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-ts-to-ts]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    const d = new Date(inp.value.trim())
    if (Number.isNaN(d.getTime())) {
      err.textContent = "Ngày không hợp lệ"
      err.classList.remove("hidden")
      return
    }
    out.textContent = String(Math.floor(d.getTime() / 1000))
  })
  root.querySelector<HTMLButtonElement>("[data-dt-ts-now]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    inp.value = String(Math.floor(Date.now() / 1000))
    out.textContent = new Date().toLocaleString("vi-VN")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-ts-copy]")?.addEventListener("click", () =>
    copyToClipboard(out.textContent ?? "")
  )
}
