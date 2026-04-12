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
  return httpGetCached<LearningWordsResponse>(WORDS_PATH, {
    params: {
      limit: params?.limit ?? 50,
      offset: params?.offset ?? 0
    }
  })
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
