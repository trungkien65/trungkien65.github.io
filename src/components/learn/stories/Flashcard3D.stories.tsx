import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Flashcard3D } from "../react/Flashcard3D"
import type { LearningWord } from "@/lib/api/learning"

const meta: Meta<typeof Flashcard3D> = {
  title: "ChineseLearn/Flashcard3D",
  component: Flashcard3D,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof Flashcard3D>

const sampleWords: LearningWord[] = [
  {
    id: "1",
    term: "你好",
    pinyin: "nǐ hǎo",
    definition: "Xin chào",
    notes: "Lời chào thông dụng nhất trong tiếng Trung",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    term: "谢谢",
    pinyin: "xièxie",
    definition: "Cảm ơn",
    notes: "Dùng để bày tỏ sự cảm kích",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    term: "再见",
    pinyin: "zàijiàn",
    definition: "Tạm biệt",
    notes: "Hẹn gặp lại",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    term: "学习",
    pinyin: "xuéxí",
    definition: "Học tập",
    notes: "Nỗ lực trau dồi tri thức",
    createdAt: new Date().toISOString(),
  },
]

export const Default: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-background">
      <Flashcard3D words={sampleWords} />
    </div>
  ),
}

export const SingleWord: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-background">
      <Flashcard3D words={[sampleWords[0]]} />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-background">
      <Flashcard3D words={[]} />
    </div>
  ),
}
