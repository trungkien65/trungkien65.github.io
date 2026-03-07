/**
 * Ball: renders one ball from game state. Animation by state (falling | idle | merging).
 */
import type { CSSProperties } from "react"
import type { Ball as BallType } from "@/atoms/ballGame"

const VALUE_TO_GRADIENT: Record<number, string> = {
  2: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
  4: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)",
  8: "linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)",
  16: "linear-gradient(135deg, #a3e635 0%, #84cc16 50%, #65a30d 100%)",
  32: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
  64: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
  128: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
}

export interface BallProps {
  ball: BallType
}

export function Ball({ ball }: BallProps) {
  const size = ball.radius * 2
  const gradient = VALUE_TO_GRADIENT[ball.value] ?? VALUE_TO_GRADIENT[2]
  const state = ball.state ?? "idle"

  /* (ball.x, ball.y) = ball center; position top-left so ball bottom touches board floor */
  const outerStyle: CSSProperties = {
    transform: `translate(${ball.x - ball.radius}px, ${ball.y - ball.radius}px)`,
  }

  const innerStyle: CSSProperties = {
    width: size,
    height: size,
    background: gradient,
    boxShadow:
      state === "merging"
        ? undefined
        : "0 25px 50px -12px rgba(0,0,0,0.25), inset 0 1px 0 0 rgba(255,255,255,0.4)",
  }

  const stateClass =
    state === "falling" ? "ball-falling" : state === "merging" ? "ball-merging" : "ball-idle"

  return (
    <div
      className="ball-game-ball-outer"
      style={outerStyle}
      role="img"
      aria-label={`Ball value ${ball.value}`}
    >
      <div
        className={`ball-game-ball rounded-full flex items-center justify-center font-bold text-white ring-2 ring-white/40 ${stateClass}`}
        style={innerStyle}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 40%)",
          }}
        />
        <span className="drop-shadow-md relative z-10" style={{ fontSize: size * 0.4 }}>
          {ball.value}
        </span>
      </div>
    </div>
  )
}
