/**
 * Axios + cache GET tùy chọn + helper gắn Bearer từ cookie.
 */
import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios"
import { cacheDeleteByPrefix, cacheGet, cacheSet } from "./cache"
import { getCookie } from "./cookies"

/** TTL mặc định cho GET có cache (ms). */
export const DEFAULT_GET_CACHE_TTL_MS = 60_000

const CACHE_PREFIX = "axios-cache:"

function cacheKey(method: string, url: string, params: unknown): string {
  let paramsPart = ""
  try {
    paramsPart = params == null ? "" : JSON.stringify(params)
  } catch {
    paramsPart = String(params)
  }
  return `${CACHE_PREFIX}${method}:${url}:${paramsPart}`
}

/** Instance axios — `baseURL` có thể set qua env public (xem dưới). */
export const http: AxiosInstance = axios.create({
  timeout: 30_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // Cookie HttpOnly do trình duyệt gửi tự động same-site; cross-origin cần CORS + withCredentials
  withCredentials: false,
})

/**
 * Base URL API: ưu tiên `PUBLIC_API_BASE_URL` (.env), mặc định Hono Auth API.
 * @see https://hono.thekien.workers.dev/docs
 */
const publicBase =
  (import.meta.env.PUBLIC_API_BASE_URL as string | undefined) ??
  "https://hono.thekien.workers.dev"
http.defaults.baseURL = publicBase

export type GetCachedConfig = AxiosRequestConfig & {
  /** TTL cache (ms). `0` hoặc `undefined` và không truyền = dùng DEFAULT; `-1` = không cache */
  cacheTtlMs?: number
}

/**
 * GET có cache theo URL + params.
 * `cacheTtlMs: -1` — bỏ qua cache; `0` — dùng DEFAULT_GET_CACHE_TTL_MS.
 */
export async function httpGetCached<T = unknown>(
  url: string,
  config?: GetCachedConfig,
): Promise<T> {
  const { cacheTtlMs = DEFAULT_GET_CACHE_TTL_MS, ...axiosConfig } = config ?? {}
  const ttl = cacheTtlMs === -1 ? 0 : cacheTtlMs === 0 ? DEFAULT_GET_CACHE_TTL_MS : cacheTtlMs

  if (ttl > 0) {
    const key = cacheKey("GET", url, axiosConfig.params)
    const hit = cacheGet<T>(key)
    if (hit !== undefined) return hit
    const { data } = await http.get<T>(url, axiosConfig)
    cacheSet(key, data, ttl)
    return data
  }

  const { data } = await http.get<T>(url, axiosConfig)
  return data
}

/** Xóa cache GET trùng prefix URL (ví dụ sau mutation). */
export function invalidateHttpGetCacheForUrl(urlPrefix: string): void {
  cacheDeleteByPrefix(`${CACHE_PREFIX}GET:${urlPrefix}`)
}

/** Xóa toàn bộ cache axios (GET đã lưu). */
export function invalidateAllHttpGetCache(): void {
  cacheDeleteByPrefix(CACHE_PREFIX)
}

/** Tránh gắn interceptor Bearer / 401-refresh trùng trên cùng instance. */
const bearerAttached = new WeakSet<AxiosInstance>()
const refresh401Attached = new WeakSet<AxiosInstance>()

/** Khớp `REFRESH_TOKEN_COOKIE` — không static import `@/lib/api/auth` (tránh vòng với `http`). */
const REFRESH_TOKEN_COOKIE = "refresh_token"

/** Endpoint auth công khai: 401 không có nghĩa access hết hạn — không gọi refresh (tránh vòng lặp). */
function isAuthPublic401Path(url: string): boolean {
  return (
    url.includes("/auth/refresh") ||
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/logout")
  )
}

/**
 * Interceptor: đọc cookie `cookieName` và set header Authorization Bearer.
 * Gọi một lần mỗi instance (layout dashboard).
 */
export function attachBearerFromCookie(
  client: AxiosInstance = http,
  /** Mặc định khớp `ACCESS_TOKEN_COOKIE` trong `@/lib/api/auth` */
  cookieName = "access_token",
): void {
  if (bearerAttached.has(client)) return
  bearerAttached.add(client)
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getCookie(cookieName)
    if (token) {
      const headers = AxiosHeaders.from(config.headers ?? {})
      headers.set("Authorization", `Bearer ${token}`)
      config.headers = headers
    }
    return config
  })
}

/**
 * 401 (access hết hạn) → một lần refresh (mutex), `persistAuthTokenPair`, recall request cũ.
 * Bearer request interceptor đọc lại cookie nên token mới được gửi khi retry.
 */
export function attachRefreshOn401(client: AxiosInstance = http): void {
  if (refresh401Attached.has(client)) return
  refresh401Attached.add(client)

  let refreshInFlight: Promise<void> | null = null

  client.interceptors.response.use(
    (r) => r,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.config) return Promise.reject(error)
      if (error.response?.status !== 401) return Promise.reject(error)

      const config = error.config as InternalAxiosRequestConfig & { _refreshRetried?: boolean }
      if (config._refreshRetried) return Promise.reject(error)

      const path = config.url ?? ""
      if (isAuthPublic401Path(path)) return Promise.reject(error)

      if (!getCookie(REFRESH_TOKEN_COOKIE)) return Promise.reject(error)

      config._refreshRetried = true

      try {
        if (!refreshInFlight) {
          refreshInFlight = (async () => {
            const rt = getCookie(REFRESH_TOKEN_COOKIE)
            if (!rt) throw new Error("no refresh token")
            const { authRefresh, persistAuthTokenPair } = await import("@/lib/api/auth")
            const pair = await authRefresh({ refresh_token: rt })
            persistAuthTokenPair(pair)
          })().finally(() => {
            refreshInFlight = null
          })
        }
        await refreshInFlight
        return client.request(config)
      } catch {
        return Promise.reject(error)
      }
    },
  )
}

/**
 * Gắn Bearer + refresh-on-401 ngay khi bundle `http` load trên trình duyệt.
 * Tránh lỗi: module trang chạy trước layout → thiếu header → 401.
 */
if (typeof document !== "undefined") {
  attachBearerFromCookie(http)
  attachRefreshOn401(http)
}
