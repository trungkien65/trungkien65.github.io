import { mountBallGame } from "@/lib/ballGame/engine"
import { PREVIEW_LINE_Y } from "@/utils/ballPhysics"

export function initBallGame(root: HTMLElement) {
  const board = root.querySelector<HTMLElement>(".ball-game-board")
  const layer = root.querySelector<HTMLElement>("[data-ball-layer]")
  const scoreEl = root.querySelector<HTMLElement>("[data-ball-score]")
  const resetBtn = root.querySelector<HTMLButtonElement>("[data-ball-reset]")
  const line = root.querySelector<HTMLElement>(".ball-game-preview-line")
  if (!board || !layer || !scoreEl) return
  if (line) line.style.top = `${PREVIEW_LINE_Y}px`
  return mountBallGame(board, layer, scoreEl, resetBtn)
}
