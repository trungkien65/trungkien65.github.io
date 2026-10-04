import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Chip } from "../react/Chip"

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const InteractiveGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState<string>("all")
    const options = [
      { id: "all", label: "Tất cả", count: 214 },
      { id: "1", label: "1 nét", count: 6 },
      { id: "2", label: "2 nét", count: 23 },
      { id: "3", label: "3 nét", count: 31 },
      { id: "4", label: "4 nét", count: 34 },
    ]

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {options.map((opt) => (
          <Chip
            key={opt.id}
            active={selected === opt.id}
            badge={opt.count}
            onClick={() => setSelected(opt.id)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
    )
  },
}

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Chip active={false}>Inactive</Chip>
      <Chip active={true}>Active</Chip>
      <Chip active={true} badge="Hot">With Badge</Chip>
      <Chip disabled>Disabled</Chip>
    </div>
  ),
}
