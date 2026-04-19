import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

export function initUrl(root: HTMLElement) {
  const inp = root.querySelector<HTMLInputElement>("[data-dt-url-input]")
  const pre = root.querySelector<HTMLElement>("[data-dt-url-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-url-wrap]")
  if (!inp || !pre || !wrap) return

  const parse = () => {
    wrap.classList.add("hidden")
    const trimmed = inp.value.trim()
    if (!trimmed) return
    try {
      const url = new URL(trimmed.startsWith("http") ? trimmed : "https://" + trimmed)
      const lines: string[] = [
        `protocol: ${url.protocol}`,
        `hostname: ${url.hostname}`,
        `port: ${url.port || "-"}`,
        `pathname: ${url.pathname}`,
        `search: ${url.search || "-"}`,
        `hash: ${url.hash || "-"}`,
        `origin: ${url.origin}`,
        `href: ${url.href}`,
      ]
      if (url.searchParams.toString()) {
        const o: Record<string, string> = {}
        url.searchParams.forEach((v, k) => (o[k] = v))
        lines.push(`query params: ${JSON.stringify(o, null, 2)}`)
      }
      pre.textContent = lines.join("\n")
      wrap.classList.remove("hidden")
    } catch {
      showToast("URL không hợp lệ", { variant: "destructive" })
    }
  }
  inp.addEventListener("blur", parse)
  root.querySelector<HTMLButtonElement>("[data-dt-url-copy]")?.addEventListener("click", () =>
    copyToClipboard(pre.textContent ?? "")
  )
}
