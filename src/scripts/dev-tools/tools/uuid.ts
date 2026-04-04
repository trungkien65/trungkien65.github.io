import { copyToClipboard } from "@/lib/devTools/clipboard"

function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function initUuid(root: HTMLElement) {
  const count = root.querySelector<HTMLInputElement>("[data-dt-uuid-count]")
  const btn = root.querySelector<HTMLButtonElement>("[data-dt-uuid-go]")
  const list = root.querySelector<HTMLElement>("[data-dt-uuid-list]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-uuid-wrap]")
  if (!count || !btn || !list || !wrap) return

  btn.addEventListener("click", () => {
    const n = Math.min(Math.max(1, Number.parseInt(count.value, 10) || 1), 50)
    list.innerHTML = ""
    for (let i = 0; i < n; i++) {
      const id = uuidv4()
      const li = document.createElement("li")
      li.className = "flex items-center gap-2 font-mono text-sm"
      li.innerHTML = `<code class="flex-1 rounded bg-muted px-2 py-1">${id}</code><button type="button" class="text-xs text-primary hover:underline">Copy</button>`
      li.querySelector("button")!.addEventListener("click", () => copyToClipboard(id))
      list.appendChild(li)
    }
    wrap.classList.remove("hidden")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-uuid-copy-all]")?.addEventListener("click", () => {
    const lines = [...list.querySelectorAll("code")].map((c) => c.textContent ?? "").join("\n")
    copyToClipboard(lines)
  })
}
