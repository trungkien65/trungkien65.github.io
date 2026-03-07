/**
 * Jotai atoms for ball game. State separated from UI.
 */
import { atom } from "jotai"
import { getRadius } from "@/utils/ballPhysics"

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

export type GameStatus = "idle" | "playing" | "gameover"

export const ballsAtom = atom<Ball[]>([])

export const scoreAtom = atom(0)

export const gameStatusAtom = atom<GameStatus>("idle")

/** Helper: create a new ball with radius from value. */
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
