/**
 * Wrapper cho mỗi tool: heading, description, copy button
 */
import type { ReactNode } from "react"

interface Props {
  title: string
  description?: string
  children: ReactNode
}

export function ToolCard({ title, description, children }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
