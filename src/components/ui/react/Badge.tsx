import React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "destructive" | "muted" | "outline"
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-muted text-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted/60 text-muted-foreground",
  outline: "border border-border text-foreground",
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold transition-colors",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
