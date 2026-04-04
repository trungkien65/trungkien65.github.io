import { copyToClipboard } from "@/lib/devTools/clipboard"

export function initCron(root: HTMLElement) {
  const inp = root.querySelector<HTMLInputElement>("[data-dt-cron-input]")
  const err = root.querySelector<HTMLElement>("[data-dt-cron-error]")
  const pre = root.querySelector<HTMLElement>("[data-dt-cron-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-cron-wrap]")
  if (!inp || !err || !pre || !wrap) return

  root.querySelector<HTMLButtonElement>("[data-dt-cron-go]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    wrap.classList.add("hidden")
    const parts = inp.value.trim().split(/\s+/)
    if (parts.length < 5) {
      err.textContent = "Cron cần 5 phần: phút giờ ngày tháng thứ"
      err.classList.remove("hidden")
      return
    }
    const [min, hour, day, month, dow] = parts
    pre.textContent = [`Phút: ${min}`, `Giờ: ${hour}`, `Ngày: ${day}`, `Tháng: ${month}`, `Thứ: ${dow}`].join("\n")
    wrap.classList.remove("hidden")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-cron-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
