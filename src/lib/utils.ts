/**
 * Merge Tailwind classes với tailwind-merge (tránh conflict khi override).
 */
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(inputs.filter(Boolean).join(" "))
}
