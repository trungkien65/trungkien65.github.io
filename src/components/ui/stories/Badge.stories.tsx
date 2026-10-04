import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Badge } from "../react/Badge"

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
