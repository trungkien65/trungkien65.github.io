import { copyToClipboard } from "@/lib/devTools/clipboard"

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function initSlug(root: HTMLElement) {
  const inp = root.querySelector<HTMLInputElement>("[data-dt-slug-input]")
  const code = root.querySelector<HTMLElement>("[data-dt-slug-out]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-slug-wrap]")
  if (!inp || !code || !wrap) return

  inp.addEventListener("input", () => {
    const v = inp.value.trim()
    if (!v) {
      wrap.classList.add("hidden")
      return
    }
    code.textContent = toSlug(v)
    wrap.classList.remove("hidden")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-slug-copy]")?.addEventListener("click", () =>
    copyToClipboard(code.textContent ?? "")
  )
}
