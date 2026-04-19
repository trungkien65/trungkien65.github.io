import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

export function initRegex(root: HTMLElement) {
  const pat = root.querySelector<HTMLInputElement>("[data-dt-re-pat]")
  const flags = root.querySelector<HTMLInputElement>("[data-dt-re-flags]")
  const text = root.querySelector<HTMLTextAreaElement>("[data-dt-re-text]")
  const pre = root.querySelector<HTMLElement>("[data-dt-re-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-re-wrap]")
  if (!pat || !flags || !text || !pre || !wrap) return

  root.querySelector<HTMLButtonElement>("[data-dt-re-go]")?.addEventListener("click", () => {
    wrap.classList.add("hidden")
    if (!pat.value.trim()) return
    try {
      const re = new RegExp(pat.value, flags.value || "g")
      const m = text.value.match(re)
      pre.textContent = m ? m.map((x, i) => `[${i}]: ${x}`).join("\n") : "(no match)"
      wrap.classList.remove("hidden")
    } catch (e) {
      showToast("Regex không hợp lệ: " + (e instanceof Error ? e.message : ""), { variant: "destructive" })
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-re-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
