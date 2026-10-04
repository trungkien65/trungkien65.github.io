import React, { useState, useEffect, useCallback } from "react"
import type { LearningWord } from "@/lib/api/learning"
import { AudioButton, Badge, Button, ProgressBar } from "@/components/ui/react"

export interface Flashcard3DProps {
  words: LearningWord[]
  initialIndex?: number
  onIndexChange?: (index: number) => void
}

export function Flashcard3D({ words, initialIndex = 0, onIndexChange }: Flashcard3DProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setIsFlipped(false)
  }, [currentIndex])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const nextIdx = currentIndex - 1
      setCurrentIndex(nextIdx)
      onIndexChange?.(nextIdx)
    }
  }, [currentIndex, onIndexChange])

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      onIndexChange?.(nextIdx)
    }
  }, [currentIndex, words.length, onIndexChange])

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      if (e.code === "Space") {
        e.preventDefault()
        toggleFlip()
      } else if (e.code === "ArrowLeft") {
        e.preventDefault()
        handlePrev()
      } else if (e.code === "ArrowRight") {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleFlip, handlePrev, handleNext])

  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
        <span className="text-4xl mb-3">📇</span>
        <p className="text-base font-medium">Chưa có từ vựng nào trong danh sách</p>
        <p className="text-sm">Hãy thêm từ mới hoặc tải lại danh sách từ vựng.</p>
      </div>
    )
  }

  const currentWord = words[currentIndex] || words[0]

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-6">
      {/* Progress header & bar */}
      <div className="w-full space-y-1.5 px-1">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Tiến độ thẻ</span>
          <span>
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        <ProgressBar value={currentIndex + 1} max={words.length} size="sm" />
      </div>

      {/* 3D Flip Card */}
      <div
        className="relative w-full h-72 sm:h-80 cursor-pointer select-none [perspective:1000px]"
        onClick={toggleFlip}
        role="button"
        tabIndex={0}
        aria-label={`Thẻ từ: ${currentWord.term}. Nhấn để lật thẻ`}
        onKeyDown={(e) => {
          if (e.key === "Enter") toggleFlip()
        }}
      >
        <div
          className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-border/70 bg-gradient-to-br from-card to-card/90 p-6 flex flex-col justify-between items-center shadow-lg [backface-visibility:hidden]">
            <div className="w-full flex justify-between items-center">
              <Badge variant="muted">Mặt trước</Badge>
              <AudioButton text={currentWord.term} />
            </div>

            <div className="text-center my-auto">
              <h2 className="text-6xl sm:text-7xl font-bold tracking-tight text-foreground font-serif">
                {currentWord.term}
              </h2>
              {currentWord.pinyin && (
                <p className="mt-3 text-lg font-medium text-primary tracking-wide">
                  {currentWord.pinyin}
                </p>
              )}
            </div>

            <div className="text-xs font-medium text-muted-foreground opacity-80">
              Nhấn hoặc Space để lật xem nghĩa
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-primary/40 bg-card p-6 flex flex-col justify-between items-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="w-full flex justify-between items-center">
              <Badge variant="primary">Mặt sau (Giải nghĩa)</Badge>
              <AudioButton text={currentWord.term} />
            </div>

            <div className="text-center my-auto px-4 space-y-2">
              <span className="text-2xl font-bold text-foreground font-serif block">
                {currentWord.term}
              </span>
              <p className="text-xl sm:text-2xl font-semibold text-primary">
                {currentWord.definition}
              </p>
              {currentWord.notes && (
                <p className="text-xs sm:text-sm text-muted-foreground italic max-w-sm mx-auto">
                  {currentWord.notes}
                </p>
              )}
            </div>

            <div className="text-xs font-medium text-muted-foreground opacity-80">
              Nhấn để quay lại mặt trước
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between w-full gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex <= 0}
          className="flex-1"
        >
          ← Từ trước
        </Button>

        <Button variant="primary" onClick={toggleFlip} className="flex-1 shadow-md">
          {isFlipped ? "Xem Hán tự" : "Lật thẻ"}
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex >= words.length - 1}
          className="flex-1"
        >
          Từ sau →
        </Button>
      </div>

      {/* Keyboard hints */}
      <div className="hidden sm:flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>
          Phím tắt: <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">Space</kbd> Lật thẻ
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">←</kbd> Trước
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">→</kbd> Sau
        </span>
      </div>
    </div>
  )
}
