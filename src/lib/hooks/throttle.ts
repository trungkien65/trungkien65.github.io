/**
 * Throttle: call fn at most once per ms interval.
 * Leading: call immediately first time; trailing: call once more after interval ends (if called while waiting).
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
