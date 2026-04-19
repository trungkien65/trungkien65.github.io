import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

export function initNumberBase(root: HTMLElement) {
  const inp = root.querySelector<HTMLInputElement>("[data-dt-nb-input]")
  const sel = root.querySelector<HTMLSelectElement>("[data-dt-nb-base]")
  const out = root.querySelector<HTMLElement>("[data-dt-nb-out]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-nb-wrap]")
  if (!inp || !sel || !out || !wrap) return

  root.querySelector<HTMLButtonElement>("[data-dt-nb-go]")?.addEventListener("click", () => {
    wrap.classList.add("hidden")
    const trimmed = inp.value.trim()
    if (!trimmed) return
    const from = sel.value
    let num: number
    try {
      if (from === "dec") num = Number.parseInt(trimmed, 10)
      else if (from === "hex") num = Number.parseInt(trimmed.replace(/^0x/, ""), 16)
      else num = Number.parseInt(trimmed.replace(/^0b/, ""), 2)
      if (Number.isNaN(num)) throw new Error("nan")
      out.innerHTML = ""
      for (const [k, v] of Object.entries({
        decimal: String(num),
        hex: "0x" + num.toString(16),
        binary: "0b" + num.toString(2),
      })) {
        const div = document.createElement("div")
        div.textContent = `${k}: ${v}`
        out.appendChild(div)
      }
      wrap.classList.remove("hidden")
    } catch {
      showToast("Số không hợp lệ", { variant: "destructive" })
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-nb-copy]")?.addEventListener("click", () => {
    const text = [...out.querySelectorAll("div")].map((d) => d.textContent).join("\n")
    copyToClipboard(text)
  })
}
