/**
 * Text-to-speech cho tiếng Trung (zh-CN) qua Web Speech API
 */
export function speakChinese(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "zh-CN"
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  } catch (err) {
    console.warn("Speech synthesis error:", err)
  }
}
