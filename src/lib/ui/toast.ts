/**
 * Toast vanilla: stack cố định, tự đóng sau vài giây.
 * Vị trí: `showToast(..., { position })` — mặc định `top-center`.
 * Cần `#toast-root` trong DOM (ToastRegion.astro) hoặc sẽ tạo fallback trên body.
 */
export type ToastVariant = "default" | "success" | "destructive"

/** Vị trí vùng chứa toast trên viewport. */
export type ToastPosition = "top-center" | "top-right" | "bottom-center" | "bottom-right"

/** Mặc định app: giữa phía trên. */
export const DEFAULT_TOAST_POSITION: ToastPosition = "top-center"

const TOAST_ROOT_ID = "toast-root"

const variantClass: Record<ToastVariant, string> = {
  default: "border-border bg-card text-card-foreground",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  destructive: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
}

const ROOT_BASE = "pointer-events-none fixed z-[100] flex w-[min(100vw-2rem,24rem)] flex-col gap-2"

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-center": "top-4 left-1/2 -translate-x-1/2 sm:top-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
  "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6"
}

/** Class đầy đủ cho `#toast-root` theo vị trí. */
export function toastRootClassName(position: ToastPosition): string {
  return `${ROOT_BASE} ${POSITION_CLASSES[position]}`
}

/** Gán lại class vị trí cho root (mỗi lần showToast có thể đổi vị trí stack). */
export function applyToastRootPosition(root: HTMLElement, position: ToastPosition): void {
  root.className = toastRootClassName(position)
}

/** Đảm bảo có container toast (ưu tiên markup từ layout). */
export function ensureToastRoot(): HTMLElement {
  let root = document.getElementById(TOAST_ROOT_ID) as HTMLElement | null
  if (root) return root
  root = document.createElement("div")
  root.id = TOAST_ROOT_ID
  root.setAttribute("aria-live", "polite")
  root.setAttribute("aria-relevant", "additions")
  applyToastRootPosition(root, DEFAULT_TOAST_POSITION)
  document.body.appendChild(root)
  return root
}

export interface ShowToastOptions {
  variant?: ToastVariant
  /** Thời gian hiển thị (ms). Mặc định destructive dài hơn một chút. */
  durationMs?: number
  /** Vị trí vùng toast; mặc định `top-center`. */
  position?: ToastPosition
}

/**
 * Hiển thị một toast; có nút đóng và tự remove sau durationMs.
 */
export function showToast(message: string, options?: ShowToastOptions): void {
  const variant = options?.variant ?? "default"
  const durationMs = options?.durationMs ?? (variant === "destructive" ? 6500 : variant === "success" ? 4000 : 4500)
  const position = options?.position ?? DEFAULT_TOAST_POSITION

  const root = ensureToastRoot()
  applyToastRootPosition(root, position)

  const wrap = document.createElement("div")
  wrap.setAttribute("role", "status")
  wrap.className = `pointer-events-auto flex gap-3 rounded-lg border p-3 text-sm shadow-lg transition-opacity duration-200 ${variantClass[variant]}`

  const text = document.createElement("p")
  text.className = "min-w-0 flex-1 leading-snug"
  text.textContent = message

  const close = document.createElement("button")
  close.type = "button"
  close.setAttribute("aria-label", "Đóng")
  close.className =
    "shrink-0 rounded-md p-0.5 text-current opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
  close.innerHTML =
    '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'

  const remove = () => {
    wrap.classList.add("opacity-0")
    window.setTimeout(() => wrap.remove(), 200)
  }

  close.addEventListener("click", remove)
  wrap.append(text, close)
  root.appendChild(wrap)

  window.setTimeout(remove, durationMs)
}
