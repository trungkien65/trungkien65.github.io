/**
 * Cache bộ nhớ (Map) + TTL — dùng chung cho axios GET hoặc dữ liệu khác.
 * Tuỳ chọn `persistSession`: đồng bộ sessionStorage để sống qua F5 (chỉ giá trị JSON-serializable).
 */

type Entry<T> = { value: T; expiresAt: number }

const store = new Map<string, Entry<unknown>>()

/** Tiền tố key sessionStorage — tránh trùng key ứng dụng khác. */
const SESSION_KEY_PREFIX = "http-cache:v1:"

type SessionEnvelope = { v: 1; value: unknown; expiresAt: number }

export type CacheOpts = {
  /** true: đọc/ghi thêm sessionStorage (cùng TTL, hydrate Map khi reload trang). */
  persistSession?: boolean
}

function sessionKey(cacheKey: string): string {
  return SESSION_KEY_PREFIX + cacheKey
}

function clearSessionKey(cacheKey: string): void {
  if (typeof sessionStorage === "undefined") return
  try {
    sessionStorage.removeItem(sessionKey(cacheKey))
  } catch {
    /* ignore */
  }
}

function writeSession<T>(cacheKey: string, value: T, ttlMs: number): void {
  if (typeof sessionStorage === "undefined") return
  try {
    const env: SessionEnvelope = { v: 1, value, expiresAt: Date.now() + ttlMs }
    sessionStorage.setItem(sessionKey(cacheKey), JSON.stringify(env))
  } catch {
    /* quota / private mode */
  }
}

/** Trả value + TTL còn lại (ms) nếu còn hạn. */
function readSession<T>(cacheKey: string): { value: T; remainingMs: number } | undefined {
  if (typeof sessionStorage === "undefined") return undefined
  try {
    const raw = sessionStorage.getItem(sessionKey(cacheKey))
    if (!raw) return undefined
    const env = JSON.parse(raw) as SessionEnvelope
    if (env.v !== 1 || typeof env.expiresAt !== "number") return undefined
    const remainingMs = env.expiresAt - Date.now()
    if (remainingMs <= 0) {
      clearSessionKey(cacheKey)
      return undefined
    }
    return { value: env.value as T, remainingMs }
  } catch {
    return undefined
  }
}

function clearSessionKeysByPrefix(cacheKeyPrefix: string): void {
  if (typeof sessionStorage === "undefined") return
  try {
    const fullPrefix = SESSION_KEY_PREFIX + cacheKeyPrefix
    const toRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const sk = sessionStorage.key(i)
      if (sk && sk.startsWith(fullPrefix)) toRemove.push(sk)
    }
    for (const sk of toRemove) sessionStorage.removeItem(sk)
  } catch {
    /* ignore */
  }
}

function clearAllSessionCacheKeys(): void {
  if (typeof sessionStorage === "undefined") return
  try {
    const toRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const sk = sessionStorage.key(i)
      if (sk && sk.startsWith(SESSION_KEY_PREFIX)) toRemove.push(sk)
    }
    for (const sk of toRemove) sessionStorage.removeItem(sk)
  } catch {
    /* ignore */
  }
}

/** Lấy giá trị nếu còn hạn; hết hạn thì xóa entry RAM (+ session nếu có). */
export function cacheGet<T>(key: string, opts?: CacheOpts): T | undefined {
  const e = store.get(key) as Entry<T> | undefined
  if (e) {
    if (Date.now() > e.expiresAt) {
      store.delete(key)
      clearSessionKey(key)
    } else {
      return e.value
    }
  }

  if (opts?.persistSession) {
    const sess = readSession<T>(key)
    if (sess !== undefined) {
      store.set(key, { value: sess.value, expiresAt: Date.now() + sess.remainingMs })
      return sess.value
    }
  }

  return undefined
}

/** Lưu với TTL (ms); `persistSession` ghi thêm sessionStorage. */
export function cacheSet<T>(key: string, value: T, ttlMs: number, opts?: CacheOpts): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs })
  if (opts?.persistSession) {
    writeSession(key, value, ttlMs)
  }
}

/** Xóa một key khỏi RAM và sessionStorage (nếu đã persist). */
export function cacheDelete(key: string): void {
  store.delete(key)
  clearSessionKey(key)
}

/** Xóa mọi key RAM + session có tiền tố cache key. */
export function cacheDeleteByPrefix(prefix: string): void {
  for (const k of store.keys()) {
    if (k.startsWith(prefix)) store.delete(k)
  }
  clearSessionKeysByPrefix(prefix)
}

export function cacheClear(): void {
  store.clear()
  clearAllSessionCacheKeys()
}
