import { copyToClipboard } from "@/lib/devTools/clipboard"

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const

async function hashText(text: string, algo: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function initHash(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-hash-text]")
  const out = root.querySelector<HTMLElement>("[data-dt-hash-out]")
  const outPre = root.querySelector<HTMLElement>("[data-dt-hash-pre]")
  const btnGo = root.querySelector<HTMLButtonElement>("[data-dt-hash-go]")
  if (!ta || !out || !outPre || !btnGo) return

  let algo = "SHA-256"
  root.querySelectorAll<HTMLButtonElement>("[data-dt-hash-algo]").forEach((b) => {
    b.addEventListener("click", () => {
      algo = b.getAttribute("data-dt-hash-algo") ?? "SHA-256"
      root.querySelectorAll("[data-dt-hash-algo]").forEach((x) => {
        x.classList.toggle("bg-primary", x === b)
        x.classList.toggle("text-primary-foreground", x === b)
        x.classList.toggle("bg-muted", x !== b)
      })
    })
  })

  btnGo.addEventListener("click", async () => {
    const text = ta.value.trim()
    if (!text) return
    try {
      outPre.textContent = await hashText(text, algo)
      out.classList.remove("hidden")
    } catch (e) {
      outPre.textContent = "Lỗi: " + (e instanceof Error ? e.message : "Unknown")
      out.classList.remove("hidden")
    }
  })
  root.querySelector<HTMLButtonElement>("[data-dt-hash-copy]")?.addEventListener("click", () =>
    copyToClipboard(outPre.textContent ?? "")
  )
}
