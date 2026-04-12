/**
 * GET /learning/radicals — public (OpenAPI: Kangxi radicals, bundled JSON).
 * @see http://localhost:3000/docs — tag Learning
 */
import { httpGetCached } from "@/lib/http/client"

const RADICALS_PATH = "/learning/radicals"

/** TTL cache phía client (ms) — gần mô tả API (cache 1h). */
export const RADICALS_GET_CACHE_TTL_MS = 3_600_000

export type RadicalItem = {
  kangxiNumber: number
  glyph: string
  strokeCount: number
  pinyin: string
  english: string
  nameVi: string
}

/** Nhóm bộ thủ theo số nét (stroke). */
export type RadicalGroup = {
  strokeCount: number
  count: number
  items: RadicalItem[]
}

export type RadicalsListResponse = {
  groups: RadicalGroup[]
  /** Tổng số bộ thủ — tuỳ chọn nếu API vẫn gửi */
  count?: number
}

export async function fetchRadicals(): Promise<RadicalsListResponse> {
  return httpGetCached<RadicalsListResponse>(RADICALS_PATH, {
    cacheTtlMs: RADICALS_GET_CACHE_TTL_MS
  })
}
