import React from "react"
import { cn } from "@/lib/utils"
import { speakChinese } from "@/components/learn/react/speech"

export interface AudioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  size?: "sm" | "md"
}

export function AudioButton({
  text,
  size = "md",
  className,
  title = "Phát âm tiếng Trung",
  ...props
}: AudioButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        speakChinese(text)
      }}
      title={title}
      aria-label={title}
      className={cn(
        "rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary active:scale-95",
        size === "sm" ? "p-1.5" : "p-2",
        className,
      )}
      {...props}
    >
      <svg
        className={size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5"}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
      </svg>
    </button>
  )
}
