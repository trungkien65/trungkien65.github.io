/**
 * Semantic theme: map palette (lib/colors) to colors by light/dark context.
 * All values reference tailwindColors, no duplicate hex.
 */
import { tailwindColors, white } from "@/lib/colors"

export type ThemeMode = "light" | "dark"

export type ThemeColors = {
  background: string
  foreground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  border: string
  muted: string
  mutedForeground: string
  card: string
  cardForeground: string
}

const c = tailwindColors

export const themes: Record<ThemeMode, ThemeColors> = {
  // Light: white to blue (sky/blue), primary bright tone
  light: {
    background: c.sky["50"],
    foreground: c.slate["900"],
    primary: c.blue["400"],
    primaryForeground: white,
    secondary: c.blue["100"],
    secondaryForeground: c.blue["900"],
    border: c.sky["200"],
    muted: c.sky["100"],
    mutedForeground: c.slate["600"],
    card: white,
    cardForeground: c.slate["900"],
  },
  // Dark: gray tone (zinc/gray)
  dark: {
    background: c.zinc["950"],
    foreground: c.zinc["50"],
    primary: c.zinc["400"],
    primaryForeground: c.zinc["950"],
    secondary: c.zinc["800"],
    secondaryForeground: c.zinc["200"],
    border: c.zinc["800"],
    muted: c.zinc["800"],
    mutedForeground: c.zinc["400"],
    card: c.zinc["900"],
    cardForeground: c.zinc["50"],
  },
}

/** Corresponding CSS variable names (for applyTheme to set on documentElement) */
export const themeVarKeys = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "border",
  "muted",
  "muted-foreground",
  "card",
  "card-foreground",
] as const
