/**
 * Merge Tailwind classes with tailwind-merge (avoid conflict when overriding).
 */
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(inputs.filter(Boolean).join(" "))
}
