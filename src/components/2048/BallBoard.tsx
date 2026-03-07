/**
 * BallBoard: chuột trong board thì ball theo ngang; click để thả.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { useBallGame } from "@/hooks/useBallGame"
import { getRadius } from "@/utils/ballPhysics"
import {
  randomPreviewPosition,
  randomSpawnValue,
  BOARD_WIDTH,
  PREVIEW_Y_CENTER,
  PREVIEW_LINE_Y,
} from "@/utils/ballPhysics"
import { Ball } from "./Ball"

function initPreview() {
  const { x, y } = randomPreviewPosition()
  return { value: randomSpawnValue(), x, y }
}

export function BallBoard() {
  const { balls, score, spawnBall, resetGame } = useBallGame()
  const [preview, setPreview] = useState(initPreview)
  const boardRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef(preview)
  previewRef.current = preview

  const canShowPreview =
    balls.length === 0 || balls.every((b) => b.state === "idle")
  const prevSettledRef = useRef(true)
  useEffect(() => {
    if (canShowPreview && !prevSettledRef.current) {
      setPreview(initPreview())
    }
    prevSettledRef.current = canShowPreview
  }, [canShowPreview])

  const updateXFromClient = useCallback((clientX: number) => {
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return
    const rawX = clientX - rect.left
    setPreview((p) => {
      const r = getRadius(p.value)
      const x = Math.max(r, Math.min(BOARD_WIDTH - r, rawX))
      return { ...p, x, y: PREVIEW_Y_CENTER }
    })
  }, [])

  const handleBoardMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!canShowPreview) return
      updateXFromClient(e.clientX)
    },
    [canShowPreview, updateXFromClient]
  )

  const handleBoardClick = useCallback(() => {
    if (!canShowPreview) return
    const { x: dropX, value, y: startY } = previewRef.current
    const r = getRadius(value)
    const x = Math.max(r, Math.min(BOARD_WIDTH - r, dropX))
    spawnBall(x, value, startY)
  }, [canShowPreview, spawnBall])

  const handleBoardTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!canShowPreview || e.touches.length === 0) return
      updateXFromClient(e.touches[0].clientX)
    },
    [canShowPreview, updateXFromClient]
  )

  const handleBoardTouchEnd = useCallback(() => {
    if (!canShowPreview) return
    const { x: dropX, value, y: startY } = previewRef.current
    const r = getRadius(value)
    const x = Math.max(r, Math.min(BOARD_WIDTH - r, dropX))
    spawnBall(x, value, startY)
  }, [canShowPreview, spawnBall])

  const previewBall = {
    id: "preview",
    value: preview.value,
    x: preview.x,
    y: preview.y,
    radius: getRadius(preview.value),
    state: "idle" as const,
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-foreground">
        <span className="font-semibold">Score: {score}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            resetGame()
          }}
          className="rounded-md bg-muted px-3 py-1.5 text-sm hover:bg-muted/80"
        >
          Reset
        </button>
      </div>
      <div
        ref={boardRef}
        className="ball-game-board cursor-crosshair select-none touch-none"
        onMouseMove={handleBoardMouseMove}
        onClick={handleBoardClick}
        onTouchMove={handleBoardTouchMove}
        onTouchEnd={handleBoardTouchEnd}
        role="application"
        aria-label="Di chuyển chuột để chọn vị trí, click để thả ball"
      >
        <div
          className="ball-game-preview-line"
          style={{ top: PREVIEW_LINE_Y }}
          aria-hidden
        />
        {[...balls]
          .sort((a, b) => b.y - a.y)
          .map((ball) => (
            <Ball key={ball.id} ball={ball} />
          ))}
        {canShowPreview && <Ball ball={previewBall} />}
      </div>
    </div>
  )
}

export default BallBoard
