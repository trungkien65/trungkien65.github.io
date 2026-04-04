/**
 * Ball type + physics step (shared, no React).
 */
import {
  doBallsCollide,
  FLOOR_Y,
  GRAVITY,
  getRadius,
  clampBallInBoard,
} from "@/utils/ballPhysics"

export type BallState = "falling" | "idle" | "merging"

export interface Ball {
  id: string
  value: number
  x: number
  y: number
  radius: number
  vx?: number
  vy?: number
  state?: BallState
}

let idCounter = 0
export function nextBallId(): string {
  return `ball-${++idCounter}`
}

export function createBall(
  id: string,
  value: number,
  x: number,
  y: number,
  state: BallState = "falling",
  vx = 0,
  vy = 0
): Ball {
  return {
    id,
    value,
    x,
    y,
    radius: getRadius(value),
    vx,
    vy,
    state,
  }
}

interface MergeResult {
  id1: string
  id2: string
  value: number
  cx: number
  cy: number
}

export function updatePhysics(balls: Ball[]): { nextBalls: Ball[]; merge: MergeResult | null } {
  let merge: MergeResult | null = null

  const updated = balls.map((b) => {
    if (b.state === "merging") return b
    if (b.state !== "falling") return b
    const vy = (b.vy ?? 0) + GRAVITY
    let y = b.y + vy
    let state = b.state
    let finalVy = vy
    if (y + b.radius >= FLOOR_Y) {
      let restingY = FLOOR_Y - b.radius
      const others = balls.filter((o) => o.id !== b.id && o.state === "idle")
      for (const o of others) {
        const wouldOverlap = doBallsCollide(b.x, restingY, b.radius, o.x, o.y, o.radius)
        if (wouldOverlap) {
          const onTopOfO = o.y - o.radius - b.radius
          restingY = Math.max(restingY, onTopOfO)
        }
      }
      y = restingY
      finalVy = 0
      state = "idle"
    }
    return { ...b, y, vy: finalVy, state }
  })

  for (let i = 0; i < updated.length && !merge; i++) {
    const a = updated[i]
    if (a.state === "merging") continue
    for (let j = i + 1; j < updated.length; j++) {
      const b = updated[j]
      if (b.state === "merging") continue
      if (a.state !== "falling" && b.state !== "falling") continue
      if (a.value !== b.value) continue
      const colliding = doBallsCollide(a.x, a.y, a.radius, b.x, b.y, b.radius)
      if (colliding) {
        merge = {
          id1: a.id,
          id2: b.id,
          value: a.value * 2,
          cx: (a.x + b.x) / 2,
          cy: (a.y + b.y) / 2,
        }
        const next = updated.map((c) => {
          if (c.id === a.id || c.id === b.id) return { ...c, state: "merging" as const }
          return c
        })
        return { nextBalls: next, merge }
      }
    }
  }

  const stacked = [...updated]
  const idleIndices = stacked
    .map((_, i) => i)
    .filter((i) => stacked[i].state === "idle")
    .sort((i, j) => stacked[j].y - stacked[i].y)
  for (let k = 0; k < idleIndices.length; k++) {
    const idx = idleIndices[k]
    const b = stacked[idx]
    let newY = b.y
    for (let j = 0; j < k; j++) {
      const o = stacked[idleIndices[j]]
      if (doBallsCollide(b.x, newY, b.radius, o.x, o.y, o.radius)) {
        newY = Math.max(newY, o.y - o.radius - b.radius)
      }
    }
    if (newY !== b.y) stacked[idx] = { ...b, y: newY }
  }

  for (let i = 0; i < stacked.length; i++) {
    const b = stacked[i]
    const { x, y } = clampBallInBoard(b.x, b.y, b.radius)
    if (x !== b.x || y !== b.y) stacked[i] = { ...b, x, y }
  }

  return { nextBalls: stacked, merge: null }
}
