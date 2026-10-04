import React from "react"
import { cn } from "@/lib/utils"

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  size?: "sm" | "md"
  badge?: React.ReactNode
}

export function Chip({
  active = false,
  size = "sm",
  badge,
  className,
  children,
  type = "button",
  disabled,
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "rounded-lg px-2.5 py-1 text-xs" : "rounded-xl px-3.5 py-1.5 text-sm",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {badge !== undefined && badge !== null && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.2 text-[10px] font-bold leading-none",
            active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-card text-foreground",
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
