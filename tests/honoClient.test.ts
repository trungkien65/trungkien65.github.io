import { describe, it, expect, vi } from "vitest"
import { createHonoClient } from "@/lib/api/honoClient"

describe("Hono RPC Client", () => {
  it("initializes client with custom base URL and attaches Authorization header", async () => {
    let capturedHeaders: Record<string, string> = {}
    let capturedUrl = ""

    const mockFetch = vi.fn().mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = input.toString()
      const headers = init?.headers as any
      if (headers) {
        if (typeof headers.forEach === "function") {
          headers.forEach((val: string, key: string) => {
            capturedHeaders[key] = val
          })
        } else {
          capturedHeaders = { ...headers }
        }
      }
      return Promise.resolve(
        new Response(JSON.stringify({ status: "ok", message: "Hono API" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
    })

    const client = createHonoClient({
      baseUrl: "https://api.test.example.com",
      getAccessToken: () => "mocked_jwt_token_123",
      fetch: mockFetch,
    })

    const res = await client.$get()
    const data = await res.json()

    expect(data.status).toBe("ok")
    expect(capturedUrl).toContain("https://api.test.example.com")
    expect(capturedHeaders.authorization || capturedHeaders.Authorization).toBe(
      "Bearer mocked_jwt_token_123",
    )
  })

  it("sends request without Authorization header when no token is present", async () => {
    let capturedHeaders: Record<string, string> = {}

    const mockFetch = vi.fn().mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const headers = init?.headers as any
      if (headers) {
        capturedHeaders = { ...headers }
      }
      return Promise.resolve(
        new Response(JSON.stringify({ status: "ok" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
    })

    const client = createHonoClient({
      baseUrl: "https://api.test.example.com",
      getAccessToken: () => null,
      fetch: mockFetch,
    })

    await client.$get()
    expect(capturedHeaders.authorization).toBeUndefined()
    expect(capturedHeaders.Authorization).toBeUndefined()
  })
})
