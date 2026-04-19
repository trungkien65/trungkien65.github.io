import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

function base64UrlDecode(str: string): string {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
  } catch {
    return ""
  }
}

function formatTimestamp(ts: number): string {
  if (!ts || ts < 0) return "-"
  return new Date(ts * 1000).toLocaleString("vi-VN")
}

export function initJwt(root: HTMLElement) {
  const input = root.querySelector<HTMLTextAreaElement>("[data-dt-jwt-input]")
  const block = root.querySelector<HTMLElement>("[data-dt-jwt-block]")
  const preH = root.querySelector<HTMLElement>("[data-dt-jwt-header]")
  const preP = root.querySelector<HTMLElement>("[data-dt-jwt-payload]")
  const timeUl = root.querySelector<HTMLElement>("[data-dt-jwt-times]")
  if (!input || !block || !preH || !preP || !timeUl) return

  const decode = () => {
    block.classList.add("hidden")
    const trimmed = input.value.trim()
    if (!trimmed) return
    const parts = trimmed.split(".")
    if (parts.length !== 3) {
      showToast("JWT phải có 3 phần (header.payload.signature)", { variant: "destructive" })
      return
    }
    try {
      const h = JSON.parse(base64UrlDecode(parts[0]))
      const p = JSON.parse(base64UrlDecode(parts[1]))
      preH.textContent = JSON.stringify(h, null, 2)
      preP.textContent = JSON.stringify(p, null, 2)
      const timeKeys = ["iat", "exp", "nbf"] as const
      timeUl.innerHTML = ""
      for (const k of timeKeys) {
        if (typeof p[k] === "number") {
          const li = document.createElement("li")
          li.textContent = `${k}: ${p[k]} → ${formatTimestamp(p[k])}`
          timeUl.appendChild(li)
        }
      }
      const tw = root.querySelector<HTMLElement>("[data-dt-jwt-times-wrap]")
      if (tw) tw.classList.toggle("hidden", timeUl.children.length === 0)
      block.classList.remove("hidden")
    } catch {
      showToast("Không thể decode. Kiểm tra JWT hợp lệ.", { variant: "destructive" })
    }
  }
  root.querySelector<HTMLButtonElement>("[data-dt-jwt-copy-h]")?.addEventListener("click", () =>
    copyToClipboard(preH.textContent ?? "")
  )
  root.querySelector<HTMLButtonElement>("[data-dt-jwt-copy-p]")?.addEventListener("click", () =>
    copyToClipboard(preP.textContent ?? "")
  )
  input.addEventListener("blur", decode)
}
