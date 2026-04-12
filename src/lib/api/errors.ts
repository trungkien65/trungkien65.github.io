/**
 * Chuẩn hóa thông báo lỗi từ API Hono (`{ error: string }`) hoặc Axios.
 */
import axios from "axios"

export function apiErrorMessage(e: unknown, fallback = "Đã xảy ra lỗi"): string {
  if (axios.isAxiosError(e)) {
    const d = e.response?.data
    if (d && typeof d === "object" && d !== null && "error" in d) {
      return String((d as { error: unknown }).error)
    }
    if (e.message) return e.message
  }
  if (e instanceof Error) return e.message
  return fallback
}
