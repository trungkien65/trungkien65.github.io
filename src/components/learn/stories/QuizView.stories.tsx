import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { QuizView } from "../react/QuizView"
import type { LearningWord } from "@/lib/api/learning"

const meta: Meta<typeof QuizView> = {
  title: "ChineseLearn/QuizView",
  component: QuizView,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof QuizView>

const sampleWords: LearningWord[] = [
  {
    id: "1",
    term: "你好",
    pinyin: "nǐ hǎo",
    definition: "Xin chào",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    term: "谢谢",
    pinyin: "xièxie",
    definition: "Cảm ơn",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    term: "再见",
    pinyin: "zàijiàn",
    definition: "Tạm biệt",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    term: "朋友",
    pinyin: "péngyou",
    definition: "Bạn bè",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    term: "学习",
    pinyin: "xuéxí",
    definition: "Học tập",
    createdAt: new Date().toISOString(),
  },
]

export const Default: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-background">
      <QuizView words={sampleWords} />
    </div>
  ),
}

export const NotEnoughWords: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-background">
      <QuizView words={sampleWords.slice(0, 2)} />
    </div>
  ),
}
