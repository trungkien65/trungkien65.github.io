/**
 * Client Hono Auth API — khớp OpenAPI `/openapi.json`.
 * @see https://hono.thekien.workers.dev/docs#description/introduction
 */
import { http } from "@/lib/http/client"
import { cacheDelete, cacheGet, cacheSet } from "@/lib/http/cache"
import { removeCookie, setCookie, type SetCookieOptions } from "@/lib/http/cookies"

/** Khớp schema `Credentials`. */
export type AuthCredentials = {
  email: string
  password: string
}

/** `RegisterResponse` */
export type AuthRegisterResponse = {
  message: string
  userId: string
}

/** `TokenPair` */
export type AuthTokenPair = {
  access_token: string
  refresh_token: string
}

/** `RefreshRequest` */
export type AuthRefreshBody = {
  refresh_token: string
}

/** `Message` */
export type AuthMessage = {
  message: string
}

/** `Me` */
export type AuthMe = {
  id: string
  email: string
  createdAt: string
}

/** `Error` */
export type AuthErrorBody = {
  error: string
}

/** Tên cookie JWT (dùng trước `authMe` / persist). */
export const ACCESS_TOKEN_COOKIE = "access_token"
export const REFRESH_TOKEN_COOKIE = "refresh_token"

/** Max-Age cookie refresh_token — khớp TTL refresh token phía API (7 ngày). */
export const REFRESH_TOKEN_COOKIE_MAX_AGE_SEC = 7 * 24 * 60 * 60

/** Cache profile `/auth/me` — RAM + sessionStorage qua `cache.*` + `{ persistSession: true }`. */
const AUTH_ME_CACHE_KEY = "auth:me:profile"
export const AUTH_ME_CACHE_TTL_MS = 15 * 60 * 1000

const AUTH_ME_CACHE_OPTS = { persistSession: true as const }

/** Lưu sau GET /auth/me thành công (TTL 15 phút, sống qua F5). */
function persistAuthMeProfile(data: AuthMe): void {
  cacheSet(AUTH_ME_CACHE_KEY, data, AUTH_ME_CACHE_TTL_MS, AUTH_ME_CACHE_OPTS)
}

/** Xóa cache profile RAM + session (đăng xuất / đổi token / cần tải lại). */
export function invalidateAuthMeCache(): void {
  cacheDelete(AUTH_ME_CACHE_KEY)
}

/** POST `/auth/register` — 201 */
export async function authRegister(body: AuthCredentials): Promise<AuthRegisterResponse> {
  const { data } = await http.post<AuthRegisterResponse>("/auth/register", body)
  return data
}

/** POST `/auth/login` — 200 + token pair */
export async function authLogin(body: AuthCredentials): Promise<AuthTokenPair> {
  const { data } = await http.post<AuthTokenPair>("/auth/login", body)
  return data
}

/** POST `/auth/refresh` — rotation refresh token */
export async function authRefresh(body: AuthRefreshBody): Promise<AuthTokenPair> {
  const { data } = await http.post<AuthTokenPair>("/auth/refresh", body)
  return data
}

/**
 * POST `/auth/logout` — revoke refresh token (body gồm refresh_token).
 * Sau khi gọi thành công nên `clearAuthTokenCookies()` nếu đang lưu token trong cookie JS.
 */
export async function authLogout(body: AuthRefreshBody): Promise<AuthMessage> {
  const { data } = await http.post<AuthMessage>("/auth/logout", body)
  return data
}

export type PersistTokenOptions = {
  /** Max-Age access token (giây), mặc định 15 phút */
  accessMaxAgeSec?: number
  /** Max-Age refresh token (giây), mặc định 7 ngày (khớp API) */
  refreshMaxAgeSec?: number
  /** Tuỳ chọn SameSite / path / secure */
  cookie?: SetCookieOptions
}

/**
 * Lưu cặp JWT vào cookie (không HttpOnly — dễ bị XSS đọc; chỉ tiện cho demo/dev).
 * Interceptor Bearer đọc lại cookie mỗi request — không cần gọi lại attach.
 */
export function persistAuthTokenPair(
  pair: AuthTokenPair,
  opts: PersistTokenOptions = {},
): void {
  invalidateAuthMeCache()
  const accessAge = opts.accessMaxAgeSec ?? 15 * 60
  const refreshAge = opts.refreshMaxAgeSec ?? REFRESH_TOKEN_COOKIE_MAX_AGE_SEC
  const base = opts.cookie ?? { path: "/", sameSite: "Lax" as const }
  setCookie(ACCESS_TOKEN_COOKIE, pair.access_token, { ...base, maxAge: accessAge })
  setCookie(REFRESH_TOKEN_COOKIE, pair.refresh_token, { ...base, maxAge: refreshAge })
}

/** Xóa cookie access + refresh (client). */
export function clearAuthTokenCookies(): void {
  invalidateAuthMeCache()
  removeCookie(ACCESS_TOKEN_COOKIE)
  removeCookie(REFRESH_TOKEN_COOKIE)
}

export type AuthMeOptions = {
  /** Bỏ qua cache — luôn gọi API (ví dụ nút “Tải lại”). */
  bypassCache?: boolean
}

/**
 * GET `/auth/me` — Bearer từ cookie; cache RAM + sessionStorage (`AUTH_ME_CACHE_TTL_MS`).
 * Access hết hạn: `attachRefreshOn401` trên `http` tự refresh + retry (mọi API dùng chung).
 */
export async function authMe(options: AuthMeOptions = {}): Promise<AuthMe> {
  if (!options.bypassCache) {
    const cached = cacheGet<AuthMe>(AUTH_ME_CACHE_KEY, AUTH_ME_CACHE_OPTS)
    if (cached !== undefined) return cached
  }

  const data = (await http.get<AuthMe>("/auth/me")).data
  persistAuthMeProfile(data)
  return data
}
