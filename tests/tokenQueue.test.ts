import { describe, it, expect, vi } from "vitest"
import { TokenRefreshQueue } from "@/lib/http/tokenQueue"

describe("TokenRefreshQueue", () => {
  it("should execute single refresh and return new token", async () => {
    const queue = new TokenRefreshQueue()
    const refreshFn = vi.fn().mockResolvedValue("new_access_token_123")

    const result = await queue.execute(refreshFn)

    expect(result).toBe("new_access_token_123")
    expect(refreshFn).toHaveBeenCalledTimes(1)
    expect(queue.active).toBe(false)
    expect(queue.pendingCount).toBe(0)
  })

  it("should queue concurrent requests and invoke refresh function only once", async () => {
    const queue = new TokenRefreshQueue()
    let resolveRefresh: (token: string) => void
    const refreshPromise = new Promise<string>((resolve) => {
      resolveRefresh = resolve
    })
    const refreshFn = vi.fn().mockImplementation(() => refreshPromise)

    // First request triggers refresh
    const req1 = queue.execute(refreshFn)
    expect(queue.active).toBe(true)

    // Second and third requests arrive while refresh is in-flight
    const req2 = queue.execute(refreshFn)
    const req3 = queue.execute(refreshFn)

    expect(queue.pendingCount).toBe(2)
    expect(refreshFn).toHaveBeenCalledTimes(1)

    // Now complete the refresh
    resolveRefresh!("refreshed_jwt_token")

    const [res1, res2, res3] = await Promise.all([req1, req2, req3])

    expect(res1).toBe("refreshed_jwt_token")
    expect(res2).toBe("refreshed_jwt_token")
    expect(res3).toBe("refreshed_jwt_token")
    expect(refreshFn).toHaveBeenCalledTimes(1) // Still called only once!
    expect(queue.active).toBe(false)
    expect(queue.pendingCount).toBe(0)
  })

  it("should reject all queued requests when refresh fails", async () => {
    const queue = new TokenRefreshQueue()
    let rejectRefresh: (err: Error) => void
    const refreshPromise = new Promise<string>((_, reject) => {
      rejectRefresh = reject
    })
    const refreshFn = vi.fn().mockImplementation(() => refreshPromise)

    const req1 = queue.execute(refreshFn)
    const req2 = queue.execute(refreshFn)

    const error = new Error("Invalid or expired refresh token")
    rejectRefresh!(error)

    await expect(req1).rejects.toThrow("Invalid or expired refresh token")
    await expect(req2).rejects.toThrow("Invalid or expired refresh token")
    expect(queue.active).toBe(false)
    expect(queue.pendingCount).toBe(0)
  })

  it("should reset queue state on reset()", () => {
    const queue = new TokenRefreshQueue()
    queue.waitForRefresh().catch(() => {})
    expect(queue.pendingCount).toBe(1)

    queue.reset()
    expect(queue.pendingCount).toBe(0)
    expect(queue.active).toBe(false)
  })
})
