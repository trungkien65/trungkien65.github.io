import { describe, it, expect } from "vitest"
import { generateQuestion } from "@/components/learn/react/QuizView"
import type { LearningWord } from "@/lib/api/learning"

describe("Chinese Learning Logic", () => {
  const sampleWords: LearningWord[] = [
    { id: "1", term: "你好", definition: "Xin chào", createdAt: "" },
    { id: "2", term: "谢谢", definition: "Cảm ơn", createdAt: "" },
    { id: "3", term: "再见", definition: "Tạm biệt", createdAt: "" },
    { id: "4", term: "朋友", definition: "Bạn bè", createdAt: "" },
    { id: "5", term: "学习", definition: "Học tập", createdAt: "" },
  ]

  it("returns null when words length is less than 4", () => {
    expect(generateQuestion([])).toBeNull()
    expect(generateQuestion(sampleWords.slice(0, 3))).toBeNull()
  })

  it("generates a valid question with 4 choices when words length >= 4", () => {
    const q = generateQuestion(sampleWords)
    expect(q).not.toBeNull()
    if (!q) return

    expect(q.term).toBeDefined()
    expect(q.choices).toHaveLength(4)

    // Exactly 1 correct choice
    const correctChoices = q.choices.filter((c) => c.correct)
    expect(correctChoices).toHaveLength(1)

    // The correct choice must have the matching word definition
    const targetWord = sampleWords.find((w) => w.id === q.correctWordId)
    expect(targetWord).toBeDefined()
    expect(correctChoices[0].definition).toBe(targetWord?.definition)

    // 3 distractors
    const distractors = q.choices.filter((c) => !c.correct)
    expect(distractors).toHaveLength(3)

    // All 4 definitions are distinct
    const definitions = new Set(q.choices.map((c) => c.definition))
    expect(definitions.size).toBe(4)
  })
})
