import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, useMemo } from "react"
import { devToolButtonClass, type DevToolBtnSize, type DevToolBtnVariant, toolOutputPreClass } from "@/lib/devTools/uiMirror"
import { cn } from "@/lib/utils"
import { type JsonValue, JsonTreeView } from "./JsonTreeView"

/** Shared presentational pieces for dev-tools React islands — mirrors components/ui skin. */

const fieldLabelClass = "mb-1 block text-sm font-medium text-foreground"

const fieldInputClass = cn(
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground",
  "placeholder:text-muted-foreground transition-colors",
  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:opacity-50"
)

interface ToolTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  wrapperClassName?: string
}

export function ToolTextField({ label, className, wrapperClassName, ...props }: ToolTextFieldProps) {
  return (
    <div className={wrapperClassName}>
      {label && <label className={fieldLabelClass}>{label}</label>}
      <input {...props} className={cn(fieldInputClass, className)} />
    </div>
  )
}

interface ToolTextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  wrapperClassName?: string
}

export function ToolTextAreaField({ label, className, wrapperClassName, rows = 4, ...props }: ToolTextAreaFieldProps) {
  return (
    <div className={wrapperClassName}>
      {label && <label className={fieldLabelClass}>{label}</label>}
      <textarea {...props} rows={rows} className={cn(fieldInputClass, "resize-y font-mono", className)} />
    </div>
  )
}

interface ToolButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DevToolBtnVariant
  size?: DevToolBtnSize
}

export function ToolButton({ variant = "primary", size = "md", className, type = "button", ...props }: ToolButtonProps) {
  return <button type={type} {...props} className={devToolButtonClass(variant, size, className)} />
}

const copyGhostClass = "h-auto min-h-0 rounded px-1 py-0.5 text-xs font-normal text-primary hover:bg-transparent hover:underline"

export function CopyLink({ onClick, children = "Copy" }: { onClick: () => void; children?: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={copyGhostClass}>
      {children}
    </button>
  )
}

/** Parses a string as JSON only when it's an object/array — collapsible tree only makes sense for those. */
function useJsonTreeData(text: string): JsonValue | undefined {
  return useMemo(() => {
    try {
      const parsed = JSON.parse(text) as JsonValue
      return parsed !== null && typeof parsed === "object" ? parsed : undefined
    } catch {
      return undefined
    }
  }, [text])
}

export function ToolOutputBlock({
  label,
  onCopy,
  className,
  children,
}: {
  label: string
  onCopy?: () => void
  className?: string
  children: string
}) {
  const treeData = useJsonTreeData(children)

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {onCopy && <CopyLink onClick={onCopy} />}
      </div>
      {treeData !== undefined ? (
        <div className={cn(toolOutputPreClass, className)}>
          <JsonTreeView data={treeData} />
        </div>
      ) : (
        <pre className={cn(toolOutputPreClass, className)}>{children}</pre>
      )}
    </div>
  )
}
