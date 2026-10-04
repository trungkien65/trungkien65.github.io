import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { RadicalsApp } from "../react/RadicalsApp"

const meta: Meta<typeof RadicalsApp> = {
  title: "ChineseLearn/RadicalsApp",
  component: RadicalsApp,
  parameters: {
    layout: "padded",
  },
}

export default meta
type Story = StoryObj<typeof RadicalsApp>

export const Default: Story = {
  render: () => (
    <div className="max-w-5xl mx-auto p-4 bg-background">
      <RadicalsApp />
    </div>
  ),
}
