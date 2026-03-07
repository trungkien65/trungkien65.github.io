/**
 * Apply theme: set CSS variables on documentElement and save to localStorage.
 * initTheme() used on load: prefer localStorage, fallback prefers-color-scheme.
 */
import { themes, type ThemeMode } from "./theme"

const STORAGE_KEY = "theme"

/**
 * Read saved theme or system preference.
 */
export function getSavedTheme(): ThemeMode {
  if (typeof window === "undefined") return "light"
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (stored === "dark" || stored === "light") return stored
  if (typeof window.matchMedia !== "function") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/**
 * Set CSS variables from themes[mode] and save mode to localStorage.
 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return
  const theme = themes[mode]
  const root = document.documentElement
  root.setAttribute("data-theme", mode)
  root.style.setProperty("--color-background", theme.background)
  root.style.setProperty("--color-foreground", theme.foreground)
  root.style.setProperty("--color-primary", theme.primary)
  root.style.setProperty("--color-primary-foreground", theme.primaryForeground)
  root.style.setProperty("--color-secondary", theme.secondary)
  root.style.setProperty("--color-secondary-foreground", theme.secondaryForeground)
  root.style.setProperty("--color-border", theme.border)
  root.style.setProperty("--color-muted", theme.muted)
  root.style.setProperty("--color-muted-foreground", theme.mutedForeground)
  root.style.setProperty("--color-card", theme.card)
  root.style.setProperty("--color-card-foreground", theme.cardForeground)
  localStorage.setItem(STORAGE_KEY, mode)
}

/**
 * Initialize theme on load: read saved/system then apply.
 * Call early (e.g. in head) to avoid flash.
 */
export function initTheme(): ThemeMode {
  const mode = getSavedTheme()
  applyTheme(mode)
  return mode
}
