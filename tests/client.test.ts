import { describe, it, expect, vi } from "vitest"
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import { attachRefreshOn401, isAuthPublic401Path } from "@/lib/http/client"
import { TokenRefreshQueue } from "@/lib/http/tokenQueue"

describe("HTTP Client 401 Refresh Interceptor", () => {
  it("correctly identifies public auth paths to avoid refresh loops", () => {
    expect(isAuthPublic401Path("/auth/refresh")).toBe(true)
    expect(isAuthPublic401Path("/auth/login")).toBe(true)
    expect(isAuthPublic401Path("/auth/register")).toBe(true)
    expect(isAuthPublic401Path("/auth/logout")).toBe(true)
    expect(isAuthPublic401Path("/auth/me")).toBe(false)
    expect(isAuthPublic401Path("/learning/words")).toBe(false)
  })

  it("retries failed 401 request with new access token", async () => {
    const testAxios = axios.create()
    const queue = new TokenRefreshQueue()
    const onRefreshSuccess = vi.fn()

    attachRefreshOn401(testAxios, {
      queue,
      getRefreshToken: () => "valid_refresh_token",
      onRefreshSuccess,
    })

    // Mock response interceptor behavior
    let callCount = 0
    testAxios.defaults.adapter = async (config) => {
      callCount++
      if (callCount === 1) {
        const err: any = new Error("Request failed with status code 401")
        err.isAxiosError = true
        err.config = config
        err.response = { status: 401, data: { error: "Unauthorized" } }
        throw err
      }
      return {
        data: { message: "Success after refresh" },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      } as AxiosResponse
    }

    // Mock dynamic import of authRefresh
    vi.mock("@/lib/api/auth", () => ({
      authRefresh: vi.fn().mockResolvedValue({
        access_token: "mocked_refreshed_access_token",
        refresh_token: "mocked_new_refresh_token",
      }),
      persistAuthTokenPair: vi.fn(),
      clearAuthTokenCookies: vi.fn(),
    }))

    const res = await testAxios.get("/learning/words")

    expect(callCount).toBe(2)
    expect(res.data).toEqual({ message: "Success after refresh" })
    expect(res.config.headers.Authorization).toBe("Bearer mocked_refreshed_access_token")
  })

  it("handles refresh failure and rejects with error", async () => {
    const testAxios = axios.create()
    const queue = new TokenRefreshQueue()
    const onRefreshFail = vi.fn()

    attachRefreshOn401(testAxios, {
      queue,
      getRefreshToken: () => "bad_refresh_token",
      onRefreshFail,
    })

    testAxios.defaults.adapter = async (config) => {
      const err: any = new Error("Request failed with status code 401")
      err.isAxiosError = true
      err.config = config
      err.response = { status: 401, data: { error: "Unauthorized" } }
      throw err
    }

    const { authRefresh } = await import("@/lib/api/auth")
    vi.mocked(authRefresh).mockRejectedValueOnce(new Error("Refresh token expired"))

    await expect(testAxios.get("/learning/words")).rejects.toThrow("Refresh token expired")
    expect(onRefreshFail).toHaveBeenCalledTimes(1)
  })
})
