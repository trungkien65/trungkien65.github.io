import { copyToClipboard } from "@/lib/devTools/clipboard"

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}
function encodeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c)
}
function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function initHtml(root: HTMLElement) {
  const ta = root.querySelector<HTMLTextAreaElement>("[data-dt-html-input]")
  const pre = root.querySelector<HTMLElement>("[data-dt-html-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-html-wrap]")
  if (!ta || !pre || !wrap) return

  root.querySelector<HTMLButtonElement>("[data-dt-html-enc]")?.addEventListener("click", () => {
    pre.textContent = encodeHtml(ta.value)
    wrap.classList.remove("hidden")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-html-dec]")?.addEventListener("click", () => {
    pre.textContent = decodeHtml(ta.value)
    wrap.classList.remove("hidden")
  })
  root.querySelector<HTMLButtonElement>("[data-dt-html-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
