import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { ReviewFlowView } from "../react/ReviewFlowView"
import type { ReviewDueItem } from "@/lib/api/learning"

const meta: Meta<typeof ReviewFlowView> = {
  title: "ChineseLearn/ReviewFlowView",
  component: ReviewFlowView,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof ReviewFlowView>

const sampleItems: ReviewDueItem[] = [
  {
    word: {
      id: "w1",
      term: "苹果",
      pinyin: "píngguǒ",
      definition: "Quả táo",
      notes: "Danh từ chỉ hoa quả phổ biến",
    },
    review: {
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 1,
      nextReviewAt: new Date().toISOString(),
    },
  },
  {
    word: {
      id: "w2",
      term: "电脑",
      pinyin: "diànnǎo",
      definition: "Máy vi tính",
      notes: "Điện não - ghép từ điện và não",
    },
    review: {
      intervalDays: 6,
      easeFactor: 2.6,
      repetitions: 2,
      nextReviewAt: new Date().toISOString(),
    },
  },
]

export const Default: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-background">
      <ReviewFlowView
        items={sampleItems}
        onReview={async (id, q) => {
          console.log("Reviewed word", id, "with quality", q)
        }}
      />
    </div>
  ),
}

export const Completed: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-background">
      <ReviewFlowView
        items={[]}
        onReview={async () => {}}
        onRefresh={async () => {
          console.log("Refreshed")
        }}
      />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-background">
      <ReviewFlowView
        items={[]}
        onReview={async () => {}}
        loading={true}
      />
    </div>
  ),
}
