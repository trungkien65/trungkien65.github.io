import React from "react"
import { cn } from "@/lib/utils"

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "success" | "warning"
  showLabel?: boolean
  label?: string
}

const heightStyles: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
}

const barVariants: Record<NonNullable<ProgressBarProps["variant"]>, string> = {
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
}

export function ProgressBar({
  value,
  max = 100,
  size = "sm",
  variant = "primary",
  showLabel = false,
  label,
  className,
  ...props
}: ProgressBarProps) {
  const safeMax = Math.max(1, max)
  const clampedVal = Math.min(Math.max(0, value), safeMax)
  const percentage = Math.round((clampedVal / safeMax) * 100)

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-0.5">
          <span>{label || "Tiến độ"}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden",
          heightStyles[size],
        )}
        role="progressbar"
        aria-valuenow={clampedVal}
        aria-valuemin={0}
        aria-valuemax={safeMax}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out rounded-full",
            barVariants[variant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
