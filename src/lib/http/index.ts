/**
 * HTTP client: axios + cache bộ nhớ + cookie (browser).
 * Dùng trong `<script>` / module chạy trên client (tránh gọi cookie trong frontmatter SSG).
 */
export {
  attachBearerFromCookie,
  attachRefreshOn401,
  DEFAULT_GET_CACHE_TTL_MS,
  http,
  httpGetCached,
  invalidateAllHttpGetCache,
  invalidateHttpGetCacheForUrl,
  type GetCachedConfig,
} from "./client"
export {
  cacheClear,
  cacheDelete,
  cacheDeleteByPrefix,
  cacheGet,
  cacheSet,
  type CacheOpts,
} from "./cache"
export { getCookie, removeCookie, setCookie, type SetCookieOptions } from "./cookies"

export { apiErrorMessage } from "@/lib/api/errors"

// Re-export API auth (Hono) — có thể import trực tiếp từ `@/lib/api` nếu muốn tách rõ.
export {
  ACCESS_TOKEN_COOKIE,
  AUTH_ME_CACHE_TTL_MS,
  authLogin,
  authLogout,
  authMe,
  authRefresh,
  authRegister,
  clearAuthTokenCookies,
  invalidateAuthMeCache,
  persistAuthTokenPair,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_MAX_AGE_SEC,
  type AuthCredentials,
  type AuthErrorBody,
  type AuthMe,
  type AuthMeOptions,
  type AuthMessage,
  type AuthRefreshBody,
  type AuthRegisterResponse,
  type AuthTokenPair,
  type PersistTokenOptions,
} from "@/lib/api/auth"
