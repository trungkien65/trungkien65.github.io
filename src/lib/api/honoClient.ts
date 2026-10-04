/**
 * Hono RPC Client (End-to-End Type Safety)
 * Cung cấp client gọi API an toàn kiểu dữ liệu dựa trên route schema của Hono Backend.
 */
import { hc } from "hono/client"
import { getCookie } from "@/lib/http/cookies"
import { ACCESS_TOKEN_COOKIE } from "@/lib/api/auth"

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.PUBLIC_API_BASE_URL) ||
  "https://hono.thekien.workers.dev"

export interface HonoClientOptions {
  baseUrl?: string
  fetch?: typeof fetch
  getAccessToken?: () => string | null
}

/**
 * Định nghĩa Route Contract kiểu RPC cho Hono Backend
 */
export type BackendRoutes = {
  "/": {
    $get: {
      args: {}
      response: { status: string; message: string }
    }
  }
  "/auth/login": {
    $post: {
      json: { email: string; password: string }
      response: { access_token: string; refresh_token: string }
    }
  }
  "/auth/register": {
    $post: {
      json: { email: string; password: string }
      response: { message: string; userId: string }
    }
  }
  "/auth/refresh": {
    $post: {
      json: { refresh_token: string }
      response: { access_token: string; refresh_token: string }
    }
  }
  "/auth/logout": {
    $post: {
      json: { refresh_token: string }
      response: { message: string }
    }
  }
  "/auth/me": {
    $get: {
      response: { id: string; email: string; createdAt: string }
    }
  }
  "/learning/words": {
    $get: {
      query?: { limit?: number; offset?: number }
      response: {
        items: Array<{
          id: string
          term: string
          definition: string
          pinyin?: string | null
          notes?: string | null
          createdAt: string
        }>
        limit: number
        offset: number
      }
    }
    $post: {
      json: { term: string; definition: string; pinyin?: string; notes?: string }
      response: { id: string; term: string; definition: string }
    }
  }
  "/learning/review": {
    $post: {
      json: { wordId: string; quality: number }
      response: {
        success: boolean
        intervalDays: number
        easeFactor: number
        repetitions: number
        nextReviewAt: string
      }
    }
  }
  "/learning/review/due": {
    $get: {
      query?: { limit?: number }
      response: {
        items: Array<{
          word: {
            id: string
            term: string
            definition: string
            pinyin?: string | null
          }
          review: {
            intervalDays: number
            easeFactor: number
            repetitions: number
            nextReviewAt: string
          } | null
        }>
      }
    }
  }
  "/learning/radicals": {
    $get: {
      response: {
        source: string
        groups: Array<{
          strokeCount: number
          items: Array<{
            kangxiNumber: number
            glyph: string
            strokeCount: number
            pinyin: string
            english: string
            nameVi: string
          }>
        }>
      }
    }
  }
}

/**
 * Tạo một RPC client Hono có kèm tự động gắn Authorization Bearer token từ cookie
 */
export function createHonoClient(options: HonoClientOptions = {}) {
  const baseUrl = options.baseUrl || API_BASE_URL
  const getTok = options.getAccessToken || (() => getCookie(ACCESS_TOKEN_COOKIE))

  const client = hc<any>(baseUrl, {
    fetch: options.fetch,
    headers: () => {
      const token = getTok()
      if (token) {
        return { Authorization: `Bearer ${token}` }
      }
      return {}
    },
  })

  return client
}

/** Instance RPC client mặc định cho toàn bộ Frontend */
export const honoClient = createHonoClient()
