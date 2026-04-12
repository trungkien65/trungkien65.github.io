/**
 * Cookie phía trình duyệt (`document.cookie`).
 * Không thay thế HttpOnly cookie từ server — chỉ đọc/ghi cookie JS-visible.
 */

/** Parse một dòng cookie thành map name → value (đã decode). */
function parseDocumentCookie(): Map<string, string> {
  const map = new Map<string, string>()
  if (typeof document === "undefined") return map
  const raw = document.cookie
  if (!raw) return map
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=")
    if (idx === -1) continue
    const name = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    try {
      map.set(name, decodeURIComponent(value))
    } catch {
      map.set(name, value)
    }
  }
  return map
}

/** Đọc giá trị cookie theo tên; không có trả `undefined`. */
export function getCookie(name: string): string | undefined {
  return parseDocumentCookie().get(name)
}

export type SetCookieOptions = {
  /** Thời sống tính bằng giây (Max-Age) */
  maxAge?: number
  path?: string
  domain?: string
  sameSite?: "Lax" | "Strict" | "None"
  /** Bắt buộc với SameSite=None nếu dùng cross-site */
  secure?: boolean
}

/** Ghi cookie (client-side). */
export function setCookie(name: string, value: string, options: SetCookieOptions = {}): void {
  if (typeof document === "undefined") return
  const path = options.path ?? "/"
  const encName = encodeURIComponent(name)
  const encValue = encodeURIComponent(value)
  const parts = [`${encName}=${encValue}`, `Path=${path}`]
  if (options.maxAge != null) parts.push(`Max-Age=${Math.floor(options.maxAge)}`)
  if (options.domain) parts.push(`Domain=${options.domain}`)
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  if (options.secure) parts.push("Secure")
  document.cookie = parts.join("; ")
}

/** Xóa cookie (Max-Age=0). */
export function removeCookie(name: string, path = "/"): void {
  if (typeof document === "undefined") return
  document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Max-Age=0`
}
