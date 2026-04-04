/**
 * Class Tailwind đồng bộ với components/ui (Button, Heading, Text, Input).
 * Dùng cho script dev-tools (vanilla) khi cần cùng “skin” với UI Astro.
 */
import { cn } from "@/lib/utils"

/** Giống Button.astro */
const btnBase =
  "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

const btnVariants = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary focus:ring-offset-background",
  secondary:
    "bg-secondary text-secondary-foreground hover:opacity-90 focus:ring-secondary focus:ring-offset-background",
  outline: "border-2 border-border bg-transparent hover:bg-muted focus:ring-border",
  ghost: "hover:bg-muted focus:ring-muted",
  danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
} as const

const btnSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const

export type DevToolBtnVariant = keyof typeof btnVariants
export type DevToolBtnSize = keyof typeof btnSizes

export function devToolButtonClass(
  variant: DevToolBtnVariant = "primary",
  size: DevToolBtnSize = "md",
  className?: string,
) {
  return cn(btnBase, btnVariants[variant], btnSizes[size], className)
}

/** Alias cho import cũ từ ToolCard */
export const toolBtnPrimaryClass = devToolButtonClass("primary", "md")
export const toolBtnSecondaryClass = devToolButtonClass("outline", "md")

/** Heading.astro size md */
export const toolTitleClass = "text-lg font-semibold text-foreground"

/** Mô tả dưới tiêu đề tool (gần Text muted, cỡ sm cho density) */
export const toolDescriptionClass = "mt-1 text-sm text-muted-foreground leading-relaxed"

/** Nhãn trường */
export const toolFieldLabelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground"

/** Textarea / code — ring theo Input.astro */
export const toolTextareaClass = cn(
  "w-full min-h-[120px] resize-y rounded-lg border border-border bg-card px-3 py-2.5 font-mono text-sm text-foreground",
  "placeholder:text-muted-foreground transition-colors",
  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0",
)

export const toolOutputPreClass =
  "max-h-72 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed break-all text-foreground"

export const toolErrorClass = "text-sm text-red-600 dark:text-red-400"
