import { copyToClipboard } from "@/lib/devTools/clipboard"

function formatRelative(date: Date, base = new Date()): string {
  const diff = (base.getTime() - date.getTime()) / 1000
  const abs = Math.abs(diff)
  const sign = diff >= 0 ? "trước" : "sau"
  if (abs < 60) return `${Math.round(abs)} giây ${sign}`
  if (abs < 3600) return `${Math.round(abs / 60)} phút ${sign}`
  if (abs < 86400) return `${Math.round(abs / 3600)} giờ ${sign}`
  if (abs < 2592000) return `${Math.round(abs / 86400)} ngày ${sign}`
  if (abs < 31536000) return `${Math.round(abs / 2592000)} tháng ${sign}`
  return `${Math.round(abs / 31536000)} năm ${sign}`
}

export function initRelative(root: HTMLElement) {
  const inp = root.querySelector<HTMLInputElement>("[data-dt-rel-input]")
  const err = root.querySelector<HTMLElement>("[data-dt-rel-error]")
  const out = root.querySelector<HTMLElement>("[data-dt-rel-out]")
  if (!inp || !err || !out) return

  root.querySelector<HTMLButtonElement>("[data-dt-rel-go]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    const d = new Date(inp.value.trim())
    if (Number.isNaN(d.getTime())) {
      err.textContent = "Ngày không hợp lệ"
      err.classList.remove("hidden")
      return
    }
    out.textContent = formatRelative(d)
  })
  root.querySelector<HTMLButtonElement>("[data-dt-rel-copy]")?.addEventListener("click", () =>
    copyToClipboard(out.textContent ?? "")
  )
}
