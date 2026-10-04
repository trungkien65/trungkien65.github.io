import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Button } from "../react/Button"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="muted">Muted</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="sm">Small (sm)</Button>
      <Button size="md">Medium (md)</Button>
      <Button size="lg">Large (lg)</Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="primary" loading>
        Đang xử lý
      </Button>
    </div>
  ),
}
