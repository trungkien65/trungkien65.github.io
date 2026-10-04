import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { ProgressBar } from "../react/ProgressBar"

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Variants: Story = {
  render: () => (
    <div className="w-[360px] space-y-4 p-4 bg-card rounded-xl border border-border">
      <ProgressBar value={40} variant="primary" showLabel label="Primary (40%)" />
      <ProgressBar value={75} variant="success" showLabel label="Success (75%)" />
      <ProgressBar value={90} variant="warning" showLabel label="Warning (90%)" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-[360px] space-y-4 p-4 bg-card rounded-xl border border-border">
      <div>
        <span className="text-xs text-muted-foreground block mb-1">Small (h-1.5)</span>
        <ProgressBar value={60} size="sm" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground block mb-1">Medium (h-2.5)</span>
        <ProgressBar value={60} size="md" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground block mb-1">Large (h-4)</span>
        <ProgressBar value={60} size="lg" />
      </div>
    </div>
  ),
}
