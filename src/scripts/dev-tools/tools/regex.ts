import { copyToClipboard } from "@/lib/devTools/clipboard"

export function initRegex(root: HTMLElement) {
  const pat = root.querySelector<HTMLInputElement>("[data-dt-re-pat]")
  const flags = root.querySelector<HTMLInputElement>("[data-dt-re-flags]")
  const text = root.querySelector<HTMLTextAreaElement>("[data-dt-re-text]")
  const err = root.querySelector<HTMLElement>("[data-dt-re-error]")
  const pre = root.querySelector<HTMLElement>("[data-dt-re-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-re-wrap]")
  if (!pat || !flags || !text || !err || !pre || !wrap) return

  root.querySelector<HTMLButtonElement>("[data-dt-re-go]")?.addEventListener("click", () => {
    err.classList.add("hidden")
    wrap.classList.add("hidden")
    if (!pat.value.trim()) return
    try {
      const re = new RegExp(pat.value, flags.value || "g")
      const m = text.value.match(re)
      pre.textContent = m ? m.map((x, i) => `[${i}]: ${x}`).join("\n") : "(no match)"
      wrap.classList.remove("hidden")
    } catch (e) {
      err.textContent = "Regex không hợp lệ: " + (e instanceof Error ? e.message : "")
      err.classList.remove("hidden")
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-re-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
