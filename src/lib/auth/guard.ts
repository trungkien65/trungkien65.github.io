/**
 * Client auth guard helpers cho các route cần đăng nhập.
 */
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  authRefresh,
  clearAuthTokenCookies,
  persistAuthTokenPair,
} from "@/lib/api/auth"
import { getCookie } from "@/lib/http/cookies"

const AUTH_REDIRECT_LOCK_KEY = "auth:redirect:lock"
const AUTH_REDIRECT_LOCK_TTL_MS = 3000

/** Prefix route yêu cầu đăng nhập. */
export const AUTHED_PATH_PREFIXES = ["/", "/account", "/learn", "/game", "/theme"] as const

/**
 * Route công khai — không gọi refresh/redirect login khi thiếu token
 * (kể cả trang lỡ dùng layout có `ensureAuthForGuard`, ví dụ /dev-tools).
 */
export const PUBLIC_PATH_PREFIXES = ["/auth", "/dev-tools"] as const

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

/** Chỉ cho phép path nội bộ làm `next` để tránh open redirect. */
export function getSafeAuthNextPath(pathname: string, search = ""): string {
  const raw = `${pathname}${search}`
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/"
  return raw
}

/** True nếu người dùng đang có token đủ để vào route authed. */
export function hasAuthTokenForGuard(): boolean {
  return Boolean(getCookie(ACCESS_TOKEN_COOKIE) || getCookie(REFRESH_TOKEN_COOKIE))
}

/** Điều hướng login khi route cần auth nhưng thiếu token. */
export function redirectToLoginIfUnauthed(pathname: string, search = ""): void {
  // Không redirect lặp khi đã ở trang login.
  if (pathname.startsWith("/auth/login")) return
  // Trang công khai: không đẩy về login.
  if (isPublicPath(pathname)) return
  // Giảm vòng lặp redirect trong thời gian ngắn (race/network lỗi).
  if (typeof sessionStorage !== "undefined") {
    const now = Date.now()
    const lockedAt = Number(sessionStorage.getItem(AUTH_REDIRECT_LOCK_KEY) ?? "0")
    if (lockedAt > 0 && now - lockedAt < AUTH_REDIRECT_LOCK_TTL_MS) return
    sessionStorage.setItem(AUTH_REDIRECT_LOCK_KEY, String(now))
  }
  const next = encodeURIComponent(getSafeAuthNextPath(pathname, search))
  window.location.replace(`/auth/login?next=${next}`)
}

/**
 * Đảm bảo auth cho route protected:
 * - Có access token -> cho vào.
 * - Hết access token nhưng còn refresh token -> refresh ngay.
 * - Refresh fail/không có token -> về login.
 */
export async function ensureAuthForGuard(pathname: string, search = ""): Promise<void> {
  if (typeof sessionStorage !== "undefined") {
    // Dọn lock cũ để redirect lần sau hoạt động lại bình thường.
    sessionStorage.removeItem(AUTH_REDIRECT_LOCK_KEY)
  }
  // Dev tools & auth: không chặn, không refresh token.
  if (isPublicPath(pathname)) return
  if (getCookie(ACCESS_TOKEN_COOKIE)) return

  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE)
  if (!refreshToken) {
    redirectToLoginIfUnauthed(pathname, search)
    return
  }

  try {
    const pair = await authRefresh({ refresh_token: refreshToken })
    persistAuthTokenPair(pair)
  } catch {
    clearAuthTokenCookies()
    redirectToLoginIfUnauthed(pathname, search)
  }
}
