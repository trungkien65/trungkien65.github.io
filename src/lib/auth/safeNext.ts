/**
 * Query `next` sau đăng nhập: chỉ cho path nội bộ (tránh open redirect).
 */
export function getSafeNextPath(search: string): string {
  let raw: string | null = null
  try {
    raw = new URLSearchParams(search).get("next")
  } catch {
    return "/"
  }
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/"
  // Tránh vòng: sau đăng nhập không đẩy lại trang auth.
  if (raw.startsWith("/auth/login") || raw.startsWith("/auth/register")) return "/"
  return raw
}
