/**
 * Ball game physics + DOM mount (vanilla).
 */
import {
  BOARD_WIDTH,
  PREVIEW_Y_CENTER,
  doBallsCollide,
  FLOOR_Y,
  GRAVITY,
  getRadius,
  randomSpawnValue,
  randomSpawnX,
  clampBallInBoard,
} from "@/utils/ballPhysics"
import {
  createBall,
  nextBallId,
  updatePhysics,
  type Ball,
} from "@/lib/ballGame/state"

const GRADIENT: Record<number, string> = {
  2: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
  4: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)",
  8: "linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)",
  16: "linear-gradient(135deg, #a3e635 0%, #84cc16 50%, #65a30d 100%)",
  32: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
  64: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
  128: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
}

function ballEl(ball: Ball): HTMLElement {
  const outer = document.createElement("div")
  outer.className = "ball-game-ball-outer"
  outer.style.transform = `translate(${ball.x - ball.radius}px, ${ball.y - ball.radius}px)`
  const inner = document.createElement("div")
  const state = ball.state ?? "idle"
  inner.className = `ball-game-ball rounded-full flex items-center justify-center font-bold text-white ring-2 ring-white/40 ${
    state === "falling" ? "ball-falling" : state === "merging" ? "ball-merging" : "ball-idle"
  }`
  const size = ball.radius * 2
  inner.style.width = `${size}px`
  inner.style.height = `${size}px`
  inner.style.background = GRADIENT[ball.value] ?? GRADIENT[2]
  if (state !== "merging") {
    inner.style.boxShadow =
      "0 25px 50px -12px rgba(0,0,0,0.25), inset 0 1px 0 0 rgba(255,255,255,0.4)"
  }
  const gloss = document.createElement("div")
  gloss.className = "pointer-events-none absolute inset-0 rounded-full"
  gloss.style.background =
    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 40%)"
  const span = document.createElement("span")
  span.className = "relative z-10 drop-shadow-md"
  span.style.fontSize = `${size * 0.4}px`
  span.textContent = String(ball.value)
  inner.appendChild(gloss)
  inner.appendChild(span)
  outer.appendChild(inner)
  return outer
}

export function mountBallGame(
  board: HTMLElement,
  layer: HTMLElement,
  scoreEl: HTMLElement,
  resetBtn: HTMLButtonElement | null
) {
  let balls: Ball[] = []
  let score = 0
  let mergeTimeout: ReturnType<typeof setTimeout> | null = null
  let preview = { value: randomSpawnValue(), x: randomSpawnX(), y: PREVIEW_Y_CENTER }
  let prevSettled = true

  const canShowPreview = () =>
    balls.length === 0 || balls.every((b) => b.state === "idle")

  const render = () => {
    layer.innerHTML = ""
    const sorted = [...balls].sort((a, b) => b.y - a.y)
    for (const ball of sorted) layer.appendChild(ballEl(ball))
    if (canShowPreview()) {
      layer.appendChild(
        ballEl({
          id: "preview",
          value: preview.value,
          x: preview.x,
          y: preview.y,
          radius: getRadius(preview.value),
          state: "idle",
        })
      )
    }
    scoreEl.textContent = String(score)
  }

  const updatePreviewX = (clientX: number) => {
    const rect = board.getBoundingClientRect()
    const rawX = clientX - rect.left
    const r = getRadius(preview.value)
    preview.x = Math.max(r, Math.min(BOARD_WIDTH - r, rawX))
    preview.y = PREVIEW_Y_CENTER
    render()
  }

  const drop = () => {
    if (!canShowPreview()) return
    const r = getRadius(preview.value)
    const x = Math.max(r, Math.min(BOARD_WIDTH - r, preview.x))
    balls = [...balls, createBall(nextBallId(), preview.value, x, preview.y, "falling", 0, 0)]
    render()
  }

  const tick = () => {
    const { nextBalls, merge } = updatePhysics(balls)
    balls = nextBalls

    const settled = canShowPreview()
    if (settled && !prevSettled) {
      preview = { value: randomSpawnValue(), x: randomSpawnX(), y: PREVIEW_Y_CENTER }
    }
    prevSettled = settled

    if (merge) {
      if (mergeTimeout) clearTimeout(mergeTimeout)
      mergeTimeout = setTimeout(() => {
        balls = balls.filter((b) => b.id !== merge.id1 && b.id !== merge.id2)
        const nb = createBall(nextBallId(), merge.value, merge.cx, merge.cy, "merging")
        balls = [...balls, nb]
        score += merge.value
        setTimeout(() => {
          balls = balls.map((b) => (b.id === nb.id ? { ...b, state: "idle" as const } : b))
          render()
        }, 450)
        mergeTimeout = null
        render()
      }, 400)
    }
    render()
  }

  const interval = setInterval(tick, 16)

  board.addEventListener("mousemove", (e) => {
    if (!canShowPreview()) return
    updatePreviewX(e.clientX)
  })
  board.addEventListener("click", drop)
  board.addEventListener("touchmove", (e) => {
    if (!canShowPreview() || e.touches.length === 0) return
    updatePreviewX(e.touches[0].clientX)
  })
  board.addEventListener("touchend", drop)

  resetBtn?.addEventListener("click", (e) => {
    e.stopPropagation()
    balls = []
    score = 0
    preview = { value: randomSpawnValue(), x: randomSpawnX(), y: PREVIEW_Y_CENTER }
    render()
  })

  render()

  return () => {
    clearInterval(interval)
    if (mergeTimeout) clearTimeout(mergeTimeout)
  }
}
