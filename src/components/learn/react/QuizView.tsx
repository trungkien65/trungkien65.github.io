import React, { useState, useEffect, useCallback } from "react"
import type { LearningWord } from "@/lib/api/learning"
import { AudioButton, Badge, Button } from "@/components/ui/react"

export interface QuizChoice {
  id: string
  definition: string
  correct: boolean
}

export interface QuizQuestion {
  term: string
  pinyin?: string | null
  correctWordId: string
  choices: QuizChoice[]
}

export interface QuizViewProps {
  words: LearningWord[]
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateQuestion(words: LearningWord[]): QuizQuestion | null {
  if (words.length < 4) return null
  const targetIdx = Math.floor(Math.random() * words.length)
  const target = words[targetIdx]

  const others = words.filter((_, i) => i !== targetIdx)
  const shuffledOthers = shuffle(others)
  const distractors = shuffledOthers.slice(0, 3).map((w) => ({
    id: w.id,
    definition: w.definition,
    correct: false,
  }))

  const choices = shuffle<QuizChoice>([
    { id: target.id, definition: target.definition, correct: true },
    ...distractors,
  ])

  return {
    term: target.term,
    pinyin: target.pinyin,
    correctWordId: target.id,
    choices,
  }
}

export function QuizView({ words }: QuizViewProps) {
  const [question, setQuestion] = useState<QuizQuestion | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [round, setRound] = useState(0)

  const loadNextQuestion = useCallback(() => {
    const nextQ = generateQuestion(words)
    setQuestion(nextQ)
    setSelectedIndex(null)
    setAnswered(false)
    if (nextQ) {
      setRound((r) => r + 1)
    }
  }, [words])

  useEffect(() => {
    loadNextQuestion()
  }, [loadNextQuestion])

  if (!words || words.length < 4) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
        <span className="text-4xl mb-3">🧩</span>
        <p className="text-base font-semibold text-foreground">Cần ít nhất 4 từ vựng để tạo bài Quiz</p>
        <p className="text-sm mt-1">
          Hiện chỉ có {words?.length || 0} từ. Hãy thêm từ mới hoặc chuyển trang khác.
        </p>
      </div>
    )
  }

  if (!question) return null

  const handleSelect = (choiceIndex: number) => {
    if (answered) return
    setSelectedIndex(choiceIndex)
    setAnswered(true)

    const isCorrect = question.choices[choiceIndex].correct
    if (isCorrect) {
      const nextStreak = streak + 1
      setStreak(nextStreak)
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak)
      }
    } else {
      setStreak(0)
    }
  }

  const selectedChoice = selectedIndex !== null ? question.choices[selectedIndex] : null
  const optionLetters = ["A", "B", "C", "D"]

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-6">
      {/* Quiz Header & Stats */}
      <div className="w-full flex items-center justify-between">
        <Badge variant="primary">Câu hỏi #{round}</Badge>

        <div className="flex items-center gap-3">
          {streak > 1 && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full animate-bounce">
              🔥 Chuỗi {streak}
            </span>
          )}
          <span className="text-xs font-semibold text-muted-foreground">
            Kỷ lục: {bestStreak}
          </span>
        </div>
      </div>

      {/* Target Word Card */}
      <div className="w-full rounded-2xl border-2 border-border/80 bg-card p-8 flex flex-col items-center justify-center shadow-sm relative">
        <AudioButton
          text={question.term}
          className="absolute top-4 right-4"
        />

        <h2 className="text-6xl sm:text-7xl font-bold tracking-tight text-foreground font-serif">
          {question.term}
        </h2>
        {question.pinyin && (
          <p className="mt-2 text-lg font-medium text-primary">{question.pinyin}</p>
        )}
        <p className="mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Chọn nghĩa đúng của từ trên:
        </p>
      </div>

      {/* Options List */}
      <div className="w-full space-y-3">
        {question.choices.map((choice, idx) => {
          let btnStyle =
            "border-border/80 bg-card text-foreground hover:border-primary/60 hover:bg-muted/40"
          let badgeStyle = "bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground"

          if (answered) {
            if (choice.correct) {
              btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
              badgeStyle = "bg-emerald-500 text-white"
            } else if (selectedIndex === idx) {
              btnStyle = "border-destructive bg-destructive/10 text-destructive font-semibold"
              badgeStyle = "bg-destructive text-white"
            } else {
              btnStyle = "border-border/40 opacity-50 bg-card text-muted-foreground"
            }
          }

          return (
            <button
              key={`${choice.id}-${idx}`}
              type="button"
              disabled={answered}
              onClick={() => handleSelect(idx)}
              className={`group flex w-full items-center rounded-xl border-2 p-4 text-left text-sm font-medium transition-all duration-200 active:scale-[0.99] disabled:cursor-default ${btnStyle}`}
            >
              <span
                className={`mr-3.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${badgeStyle}`}
              >
                {optionLetters[idx]}
              </span>
              <span className="grow leading-relaxed">{choice.definition}</span>
              {answered && choice.correct && (
                <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  ✓
                </span>
              )}
              {answered && selectedIndex === idx && !choice.correct && (
                <span className="ml-2 text-destructive font-bold text-sm">✗</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Feedback Message */}
      <div className="min-h-[2.5rem] w-full flex items-center justify-center">
        {answered && selectedChoice && (
          <div
            className={`w-full rounded-xl p-3 text-center text-sm font-semibold transition-all ${
              selectedChoice.correct
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                : "bg-destructive/10 text-destructive border border-destructive/30"
            }`}
          >
            {selectedChoice.correct
              ? "✓ Chính xác tuyệt vời! Tiếp tục phát huy."
              : "✗ Chưa chính xác! Đáp án đúng đã được hiển thị viền xanh."}
          </div>
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="primary"
        size="lg"
        disabled={!answered}
        onClick={loadNextQuestion}
        className="w-full shadow-md"
      >
        Câu tiếp theo →
      </Button>
    </div>
  )
}
