/**
 * Throttle: gọi fn tối đa 1 lần trong mỗi khoảng ms.
 * Leading: gọi ngay lần đầu; trailing: gọi thêm 1 lần sau khi hết khoảng (nếu có gọi trong lúc chờ).
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number,
  options?: { leading?: boolean; trailing?: boolean }
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options ?? {}
  let last = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const invoke = (args: Parameters<T>) => {
    last = Date.now()
    fn(...args)
  }

  return (...args: Parameters<T>) => {
    const now = Date.now()
    lastArgs = args

    if (leading && now - last >= ms) {
      invoke(args)
      lastArgs = null
    }

    if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        timeoutId = null
        if (lastArgs != null) invoke(lastArgs)
        lastArgs = null
      }, ms)
    }
  }
}
