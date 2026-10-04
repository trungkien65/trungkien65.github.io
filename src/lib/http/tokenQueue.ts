/**
 * Token Refresh Queue / Mutex Manager
 * Ngăn chặn race-condition khi token rotation: khi nhiều request đồng thời gặp 401,
 * chỉ 1 request gọi refresh, các request còn lại xếp hàng đợi token mới để retry.
 */

export type TokenQueueSubscriber = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

export class TokenRefreshQueue {
  private isRefreshing = false
  private subscribers: TokenQueueSubscriber[] = []

  public get active(): boolean {
    return this.isRefreshing
  }

  public get pendingCount(): number {
    return this.subscribers.length
  }

  /**
   * Đưa request vào hàng đợi chờ access token mới.
   */
  public waitForRefresh(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.subscribers.push({ resolve, reject })
    })
  }

  /**
   * Giải phóng tất cả subscriber đang đợi với token mới hoặc lỗi.
   */
  public processQueue(error: unknown | null, token: string | null = null): void {
    const queue = [...this.subscribers]
    this.subscribers = []
    this.isRefreshing = false

    for (const sub of queue) {
      if (error) {
        sub.reject(error)
      } else if (token) {
        sub.resolve(token)
      } else {
        sub.reject(new Error("Refresh completed without token"))
      }
    }
  }

  /**
   * Thực thi refresh: nếu đã có refresh đang chạy, tự động xếp hàng đợi kết quả.
   */
  public async execute(refreshFn: () => Promise<string>): Promise<string> {
    if (this.isRefreshing) {
      return this.waitForRefresh()
    }

    this.isRefreshing = true

    try {
      const newToken = await refreshFn()
      this.processQueue(null, newToken)
      return newToken
    } catch (err) {
      this.processQueue(err, null)
      throw err
    }
  }

  /**
   * Reset trạng thái hàng đợi (khi logout hoặc dọn dẹp test).
   */
  public reset(): void {
    this.isRefreshing = false
    this.subscribers = []
  }
}

export const defaultTokenQueue = new TokenRefreshQueue()
