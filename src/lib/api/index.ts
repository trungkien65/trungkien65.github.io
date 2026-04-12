/**
 * API domain (Hono Auth): cấu hình `PUBLIC_API_BASE_URL` hoặc mặc định workers.dev trong `http/client`.
 */
export { apiErrorMessage } from "./errors"
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
} from "./auth"
