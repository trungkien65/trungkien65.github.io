import { http, httpGetCached, invalidateHttpGetCacheForUrl } from "@/lib/http/client"
/**
 * Kiểu + helper endpoint học từ vựng (JWT Bearer từ cookie do `http` interceptor).
 */
import axios from "axios"

/** Một từ trong danh sách học. */
export type LearningWord = {
  id: string
  term: string
  definition: string
  createdAt: string
}

export type LearningWordsResponse = {
  items: LearningWord[]
  limit: number
  offset: number
}

type LearningWordRaw = {
  id: string
  term?: string
  definition?: string
  hanzi?: string
  pinyin?: string
  meaning?: string
  createdAt: string
}

type LearningWordsResponseRaw = {
  items: LearningWordRaw[]
  limit: number
  offset?: number
}

export type WordReviewState = {
  easeFactor: number
  intervalDays: number
  repetitions: number
  nextReviewAt: string
  lastReviewedAt: string | null
} | null

export type ReviewDueItem = {
  word: LearningWord
  review: WordReviewState
}

export type ReviewDueResponse = {
  items: ReviewDueItem[]
  limit: number
}

export type PostReviewBody = {
  wordId: string
  quality: number
}

export type PostReviewResponse = {
  ok: true
  wordId: string
  quality: number
  nextReviewAt: string
  easeFactor: number
  intervalDays: number
  repetitions: number
}

const WORDS_PATH = "/learning/words"
const REVIEW_DUE_PATH = "/learning/review/due"
const REVIEW_POST_PATH = "/learning/review"

/** GET danh sách từ — có cache (mặc định TTL axios). */
export async function fetchLearningWords(params?: { limit?: number; offset?: number }): Promise<LearningWordsResponse> {
  const data = await httpGetCached<LearningWordsResponseRaw>(WORDS_PATH, {
    params: {
      limit: params?.limit ?? 50,
      offset: params?.offset ?? 0
    }
  })

  return {
    limit: data.limit,
    // API có thể không trả offset, fallback theo input để UI vẫn hiển thị ổn định.
    offset: data.offset ?? (params?.offset ?? 0),
    items: data.items.map((item) => {
      const term = item.term ?? item.hanzi ?? ""
      const defParts = [item.definition, item.meaning].filter(Boolean)
      const definition = defParts.length > 0 ? defParts.join(" | ") : item.pinyin ?? ""
      return {
        id: item.id,
        term,
        definition,
        createdAt: item.createdAt
      }
    })
  }
}

/** GET hàng đợi ôn — có cache. */
export async function fetchReviewDue(params?: { limit?: number }): Promise<ReviewDueResponse> {
  return httpGetCached<ReviewDueResponse>(REVIEW_DUE_PATH, {
    params: { limit: params?.limit ?? 30 }
  })
}

/** POST chấm điểm ôn; xóa cache GET liên quan để lần đọc sau lấy dữ liệu mới. */
export async function postLearningReview(body: PostReviewBody): Promise<PostReviewResponse> {
  const { data } = await http.post<PostReviewResponse>(REVIEW_POST_PATH, body)
  invalidateHttpGetCacheForUrl(REVIEW_DUE_PATH)
  return data
}

/** Đọc message lỗi từ body JSON nếu có. */
export function learningApiErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) return "Đã xảy ra lỗi không xác định."
  const d = err.response?.data as { message?: string; error?: string } | undefined
  if (d?.message) return d.message
  if (d?.error) return d.error
  if (err.response?.status === 401) return "Phiên đăng nhập hết hạn hoặc chưa đăng nhập."
  return err.message || "Yêu cầu thất bại."
}
