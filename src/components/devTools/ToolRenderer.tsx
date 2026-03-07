/**
 * Render tool component theo tool.id
 */
import { TOOL_COMPONENTS } from "./index"

interface Props {
  toolId: string
}

export function ToolRenderer({ toolId }: Props) {
  const Component = TOOL_COMPONENTS[toolId]
  if (!Component) return <p className="text-sm text-muted-foreground">Tool chưa có.</p>
  return <Component />
}
